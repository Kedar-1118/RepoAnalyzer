"""FastAPI microservice for RAG-based GitHub repository analysis.

Internal API — called by the Node.js backend.
Endpoints:
- POST /api/analyze — full repository analysis pipeline
- GET  /api/health  — health check
- GET  /api/cache/stats — cache statistics
"""

import logging
import time
import traceback

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

from config import settings
from modules.github_fetcher import fetch_repo_metadata, fetch_repo_files
from modules.code_chunker import chunk_code_files, prepare_documents_for_store
from modules.vector_store import create_vector_store
from modules.rag_retriever import retrieve_context
from modules.llm_analyzer import analyze_repository
from modules.scoring import compute_skill_match, compute_developer_score, compute_repository_score
from modules.analysis_cache import init_cache_db, get_cached_analysis, store_analysis, get_cache_stats

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

# FastAPI app
app = FastAPI(
    title="RAG Repository Analyzer",
    description="AI-powered GitHub repository analysis using Retrieval-Augmented Generation",
    version="1.0.0",
)

# CORS — allow the Node.js backend to call us
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# === Request / Response models ===

class AnalyzeRequest(BaseModel):
    repo_url: str = Field(..., description="GitHub repository URL")
    developer_skills: str = Field(
        default="",
        description="Comma-separated list of developer skills (optional)",
    )


class AnalyzeResponse(BaseModel):
    repository_summary: str = ""
    technology_stack: list = []
    architecture_pattern: str = ""
    architecture_explanation: str = ""
    code_quality_score: float = 0
    code_quality_explanation: str = ""
    complexity_level: str = ""
    required_skills: list = []
    contribution_opportunities: list = []
    skill_match_score: float = 0
    skill_match_explanation: str = ""
    developer_technical_score: float = 0
    developer_evaluation: dict = {}
    repository_score: float = 0
    repository_scoring_breakdown: dict = {}
    analysis_explanation: str = ""
    metadata: dict = {}
    processing_time_seconds: float = 0
    from_cache: bool = False


# === Endpoints ===



@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "llm_provider": settings.LLM_PROVIDER,
        "embedding_model": settings.EMBEDDING_MODEL,
    }


@app.get("/api/cache/stats")
async def cache_stats():
    """Get analysis cache statistics."""
    return get_cache_stats()


@app.on_event("startup")
async def startup_event():
    """Initialize resources on startup."""
    init_cache_db()


@app.post("/api/analyze", response_model=AnalyzeResponse)
async def analyze_repo(request: AnalyzeRequest):
    """Run the full RAG analysis pipeline on a GitHub repository.

    Pipeline steps:
    1. Fetch repository metadata from GitHub API
    2. Clone and extract code files
    3. Chunk code files into semantic pieces
    4. Embed and store in ChromaDB
    5. Retrieve relevant context via RAG
    6. Send to LLM for structured analysis
    7. Post-process scores and return
    """
    start_time = time.time()

    try:
        # Validate settings
        settings.validate()
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))

    try:
        # Step 1: Fetch metadata
        logger.info(f"Step 1/6: Fetching metadata for {request.repo_url}")
        metadata = fetch_repo_metadata(request.repo_url)

        # Cache Check
        repo_key = f"{metadata.get('repo_owner')}/{metadata.get('repo_name')}"
        cached_result = get_cached_analysis(
            repo_key,
            request.developer_skills,
            metadata.get("pushed_at", "")
        )

        if cached_result:
            processing_time = round(time.time() - start_time, 2)
            return AnalyzeResponse(
                **cached_result,
                from_cache=True,
                processing_time_seconds=processing_time
            )

        # Step 2: Fetch files
        logger.info("Step 2/6: Cloning and extracting files")
        files = fetch_repo_files(request.repo_url)

        if not files:
            raise HTTPException(
                status_code=400,
                detail="No code files found in the repository",
            )

        # Step 3: Chunk files
        logger.info(f"Step 3/6: Chunking {len(files)} files")
        chunks = chunk_code_files(files, repo_name=metadata.get("repo_name", ""))
        texts, metadatas, ids = prepare_documents_for_store(chunks)

        if not texts:
            raise HTTPException(
                status_code=400,
                detail="No code chunks could be generated from repository files",
            )

        # Step 4: Embed and store
        logger.info(f"Step 4/6: Embedding {len(texts)} chunks into vector store")
        collection_name = metadata.get("repo_name", "repo")
        collection = create_vector_store(texts, metadatas, ids, collection_name)

        # Step 5: Retrieve context via RAG
        logger.info("Step 5/6: Retrieving relevant context")
        retrieved_context = retrieve_context(collection, top_k=settings.TOP_K)

        # Step 6: LLM analysis
        logger.info("Step 6/6: Running LLM analysis")
        analysis = analyze_repository(
            metadata=metadata,
            retrieved_context=retrieved_context,
            developer_skills=request.developer_skills,
        )

        # ── DEBUG: Log the raw LLM analysis result ──
        import json as _json
        logger.info("=" * 60)
        logger.info("RAW LLM ANALYSIS RESULT:")
        logger.info(_json.dumps(analysis, indent=2, default=str)[:3000])
        logger.info("=" * 60)

        # Post-process: recalculate scores if developer skills provided
        if request.developer_skills and analysis.get("required_skills"):
            skill_match = compute_skill_match(
                request.developer_skills,
                analysis["required_skills"],
            )
            analysis["skill_match_score"] = skill_match["match_score"]

        # Add developer score if evaluation data is present
        if analysis.get("developer_evaluation"):
            dev_score = compute_developer_score(analysis["developer_evaluation"])
            analysis["developer_technical_score"] = dev_score

        # Recalculate repository score
        if analysis.get("repository_scoring_breakdown"):
            repo_score = compute_repository_score(analysis["repository_scoring_breakdown"])
            analysis["repository_score"] = repo_score

        processing_time = round(time.time() - start_time, 2)

        # Store in cache
        response_data = {
            "repository_summary": analysis.get("repository_summary", ""),
            "technology_stack": analysis.get("technology_stack", []),
            "architecture_pattern": analysis.get("architecture_pattern", ""),
            "architecture_explanation": analysis.get("architecture_explanation", ""),
            "code_quality_score": analysis.get("code_quality_score", 0),
            "code_quality_explanation": analysis.get("code_quality_explanation", ""),
            "complexity_level": analysis.get("complexity_level", ""),
            "required_skills": analysis.get("required_skills", []),
            "contribution_opportunities": analysis.get("contribution_opportunities", []),
            "skill_match_score": analysis.get("skill_match_score", 0),
            "skill_match_explanation": analysis.get("skill_match_explanation", ""),
            "developer_technical_score": analysis.get("developer_technical_score", 0),
            "developer_evaluation": analysis.get("developer_evaluation", {}),
            "repository_score": analysis.get("repository_score", 0),
            "repository_scoring_breakdown": analysis.get("repository_scoring_breakdown", {}),
            "analysis_explanation": analysis.get("analysis_explanation", ""),
            "metadata": metadata,
        }

        # ── DEBUG: Log the final response being sent ──
        logger.info("FINAL RESPONSE DATA (first 2000 chars):")
        logger.info(_json.dumps(response_data, indent=2, default=str)[:2000])

        # Only cache if the analysis looks like a real result (not a fallback)
        is_real_result = (
            analysis.get("code_quality_score", 0) > 0
            or len(analysis.get("technology_stack", [])) > 0
        )
        if is_real_result:
            store_analysis(
                repo_key,
                request.developer_skills,
                response_data,
                metadata.get("pushed_at", "")
            )
        else:
            logger.warning("Skipping cache — analysis appears to be a fallback response")

        return AnalyzeResponse(
            **response_data,
            from_cache=False,
            processing_time_seconds=processing_time,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Analysis failed: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
