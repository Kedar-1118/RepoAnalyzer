"""RAG retriever module.

Runs multiple analysis-oriented queries against the vector store
to retrieve the most relevant code context for each analysis dimension.
"""

import logging
from typing import Optional

from modules.vector_store import query_vector_store

logger = logging.getLogger(__name__)

# Analysis queries — each targets a specific dimension of the analysis
ANALYSIS_QUERIES = [
    "What is the main purpose and functionality of this repository? Main entry point and application logic.",
    "What technology stack, frameworks, and libraries are used? Import statements, dependencies, and package configuration.",
    "What is the architecture pattern? Project structure, routing, controllers, models, services, and middleware.",
    "Code quality: naming conventions, error handling, modularity, design patterns, and best practices.",
    "Testing and documentation: unit tests, integration tests, README, docstrings, and code comments.",
    "Configuration and deployment: Docker, CI/CD, environment variables, infrastructure as code.",
    "Database and data models: schema definitions, ORM models, migrations, and data access patterns.",
    "API design: endpoints, request/response handling, authentication, and authorization.",
]


def retrieve_context(
    collection,
    top_k: int = 5,
    additional_queries: Optional[list[str]] = None,
) -> str:
    """Retrieve relevant code context for all analysis dimensions.

    Runs multiple queries against the vector store — one per analysis
    dimension — and returns a deduplicated, concatenated context string.

    Args:
        collection: ChromaDB collection to query
        top_k: Number of results per query
        additional_queries: Optional extra queries to run

    Returns:
        Concatenated string of all relevant code chunks
    """
    queries = ANALYSIS_QUERIES.copy()
    if additional_queries:
        queries.extend(additional_queries)

    # Collect all results, deduplicating by document content
    seen_docs = set()
    all_results = []

    for query in queries:
        try:
            results = query_vector_store(collection, query, n_results=top_k)
            for result in results:
                doc_hash = hash(result["document"])
                if doc_hash not in seen_docs:
                    seen_docs.add(doc_hash)
                    all_results.append(result)
        except Exception as e:
            logger.warning(f"Query failed: '{query[:50]}...' — {e}")
            continue

    logger.info(f"Retrieved {len(all_results)} unique chunks from {len(queries)} queries")

    # Format into a single context string
    context_parts = []
    for i, result in enumerate(all_results, 1):
        metadata = result.get("metadata", {})
        file_path = metadata.get("file_path", "unknown")
        language = metadata.get("language", "Unknown")
        context_parts.append(
            f"--- Chunk {i} | File: {file_path} | Language: {language} ---\n"
            f"{result['document']}\n"
        )

    return "\n".join(context_parts)
