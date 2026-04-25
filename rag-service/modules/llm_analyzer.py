"""LLM analyzer module.

Sends the constructed prompt to the LLM (Gemini or OpenAI),
parses the JSON response, and validates the output structure.
"""

import json
import re
import logging
from typing import Optional

from config import settings

logger = logging.getLogger(__name__)

# Expected keys in the JSON response
REQUIRED_KEYS = {
    "repository_summary",
    "technology_stack",
    "architecture_pattern",
    "code_quality_score",
    "complexity_level",
    "required_skills",
    "contribution_opportunities",
    "skill_match_score",
    "developer_technical_score",
    "repository_score",
    "analysis_explanation",
}


def get_llm():
    """Get the configured LLM instance.

    Returns:
        LangChain chat model (Gemini or OpenAI)
    """
    if settings.LLM_PROVIDER == "gemini":
        from langchain_google_genai import ChatGoogleGenerativeAI
        return ChatGoogleGenerativeAI(
            model=settings.GEMINI_MODEL,
            google_api_key=settings.GOOGLE_API_KEY,
            temperature=0.3,
            max_output_tokens=8192,
        )
    elif settings.LLM_PROVIDER == "openai":
        from langchain_openai import ChatOpenAI
        return ChatOpenAI(
            model=settings.OPENAI_MODEL,
            api_key=settings.OPENAI_API_KEY,
            temperature=0.3,
            max_tokens=8192,
        )
    elif settings.LLM_PROVIDER == "ollama":
        from langchain_ollama import ChatOllama
        return ChatOllama(
            model=settings.OLLAMA_MODEL,
            base_url=settings.OLLAMA_BASE_URL,
            temperature=0.3,
        )
    else:
        raise ValueError(f"Unsupported LLM provider: {settings.LLM_PROVIDER}")


def analyze_repository(
    metadata: dict,
    retrieved_context: str,
    developer_skills: str = "",
    max_retries: int = 2,
) -> dict:
    """Run LLM analysis on the repository.

    Args:
        metadata: Repository metadata dict
        retrieved_context: Retrieved code context string
        developer_skills: Optional comma-separated developer skills
        max_retries: Number of retries on malformed output

    Returns:
        Parsed JSON analysis result
    """
    from modules.prompts.analysis_prompt import build_analysis_prompt

    prompt = build_analysis_prompt(metadata, retrieved_context, developer_skills)
    llm = get_llm()

    for attempt in range(max_retries + 1):
        try:
            logger.info(f"Sending analysis prompt to LLM (attempt {attempt + 1})")
            response = llm.invoke(prompt)

            # Extract text content (handle string or list of parts)
            content = response.content if hasattr(response, "content") else response
            if isinstance(content, list):
                response_text = "".join([
                    part if isinstance(part, str) else part.get("text", "")
                    for part in content
                ])
            else:
                response_text = str(content)

            # Log raw response for debugging
            logger.info(f"Raw LLM response ({len(response_text)} chars): {response_text[:500]}")

            # Parse JSON from response
            result = _parse_json_response(response_text)

            # Normalize alternative key names to expected schema
            _normalize_response(result)

            # Validate structure
            _validate_response(result)

            logger.info("LLM analysis completed successfully")
            return result

        except (json.JSONDecodeError, ValueError) as e:
            logger.warning(f"Attempt {attempt + 1} failed: {e}")
            logger.warning(f"Raw response was: {response_text[:1000]}")
            if attempt == max_retries:
                logger.error("All LLM attempts failed, returning fallback response")
                return _create_fallback_response(metadata, str(e))

    return _create_fallback_response(metadata, "Max retries exceeded")


def _parse_json_response(text: str) -> dict:
    """Extract and parse JSON from the LLM response text.

    Handles cases where the LLM wraps JSON in markdown code fences.
    """
    # Try direct JSON parsing first
    text = text.strip()

    # Remove markdown code fences if present
    if text.startswith("```"):
        # Remove opening fence (with optional language tag)
        text = re.sub(r"^```(?:json)?\s*\n?", "", text)
        # Remove closing fence
        text = re.sub(r"\n?```\s*$", "", text)

    # Find JSON object boundaries
    start = text.find("{")
    end = text.rfind("}") + 1

    if start == -1 or end <= start:
        raise json.JSONDecodeError("No JSON object found in response", text, 0)

    json_str = text[start:end]
    return json.loads(json_str)


def _normalize_response(result: dict) -> None:
    """Normalize alternative key names to the expected schema.

    Some LLMs (especially local models like gemma4) return correct data but
    under slightly different key names.  This maps them to the canonical keys
    so the validator doesn't overwrite real data with empty defaults.
    """

    # ── Simple key aliases ──────────────────────────────────────────────
    KEY_ALIASES = {
        "repository_summary": [
            "summary", "repo_summary", "overview", "project_summary",
        ],
        "technology_stack": [
            "tech_stack", "technologies", "stack", "technologies_used",
            "technology_stack_list",
        ],
        "architecture_pattern": [
            "architecture", "architectural_pattern", "arch_pattern", "pattern",
        ],
        "architecture_explanation": [
            "arch_explanation", "architecture_description",
            "architecture_pattern_description",
        ],
        "code_quality_score": [
            "quality_score", "code_quality", "quality", "complexity_score",
        ],
        "code_quality_explanation": [
            "quality_explanation", "quality_justification",
            "complexity_level_description",
        ],
        "complexity_level": [
            "complexity", "difficulty", "difficulty_level",
        ],
        "required_skills": [
            "skills", "skills_required", "needed_skills",
            "developer_skills_required", "developer_skills_required_list",
        ],
        "contribution_opportunities": [
            "contributions", "opportunities", "contribution_areas",
            "potential_improvements",
        ],
        "skill_match_score": ["match_score", "skill_match"],
        "skill_match_explanation": ["match_explanation"],
        "developer_technical_score": [
            "dev_score", "developer_score", "technical_score",
        ],
        "repository_score": [
            "repo_score", "overall_score", "score",
        ],
        "analysis_explanation": [
            "explanation", "detailed_analysis", "narrative",
        ],
    }

    for canonical, aliases in KEY_ALIASES.items():
        if canonical not in result or result[canonical] in (None, "", [], {}, 0, "Unknown", "Analysis incomplete"):
            for alias in aliases:
                if alias in result and result[alias] not in (None, "", [], {}, 0):
                    logger.info(f"Normalizing key: '{alias}' -> '{canonical}'")
                    result[canonical] = result[alias]
                    break

    # ── Extract from nested "repository_analysis" object ────────────────
    repo_analysis = result.get("repository_analysis", {})
    if isinstance(repo_analysis, dict):
        # summary
        if (not result.get("repository_summary") or result["repository_summary"] == "Analysis incomplete"):
            s = repo_analysis.get("summary", "")
            if s:
                result["repository_summary"] = s
                logger.info("Extracted repository_summary from repository_analysis.summary")

        # architecture
        if not result.get("architecture_explanation"):
            a = repo_analysis.get("architecture", "")
            if a:
                result["architecture_explanation"] = a

        # analysis_explanation from strengths + weaknesses
        if not result.get("analysis_explanation") or result["analysis_explanation"] == "Partial analysis — some fields could not be determined.":
            parts = []
            strengths = repo_analysis.get("strengths", [])
            weaknesses = repo_analysis.get("weaknesses", [])
            if strengths:
                parts.append("Strengths: " + "; ".join(strengths))
            if weaknesses:
                parts.append("Weaknesses: " + "; ".join(weaknesses))
            if parts:
                result["analysis_explanation"] = ". ".join(parts) + "."
                logger.info("Built analysis_explanation from repository_analysis strengths/weaknesses")

        # contribution_opportunities from weaknesses
        if not result.get("contribution_opportunities"):
            weaknesses = repo_analysis.get("weaknesses", [])
            if weaknesses:
                result["contribution_opportunities"] = weaknesses
                logger.info("Mapped repository_analysis.weaknesses -> contribution_opportunities")

    # ── Extract from nested "repository_metadata" object ────────────────
    repo_meta = result.get("repository_metadata", {})
    if isinstance(repo_meta, dict):
        if not result.get("code_quality_score") or result["code_quality_score"] == 0:
            score = repo_meta.get("complexity_score", 0)
            if score:
                result["code_quality_score"] = score
                logger.info(f"Extracted code_quality_score from repository_metadata.complexity_score: {score}")

    # ── Extract from nested "repository_analysis_details" object ────────
    details = result.get("repository_analysis_details", {})
    if isinstance(details, dict):
        if not result.get("architecture_explanation"):
            desc = details.get("architecture_pattern_description", "")
            if desc:
                result["architecture_explanation"] = desc

    # ── Extract technology_stack from nested "components" structure ──────
    if (not result.get("technology_stack") or result["technology_stack"] == []) and "components" in result:
        techs = set()
        for comp in result["components"]:
            if isinstance(comp, dict):
                for tech in comp.get("key_technologies", []):
                    techs.add(tech)
                name = comp.get("name", "")
                if name:
                    techs.add(name)
        if techs:
            result["technology_stack"] = sorted(techs)
            logger.info(f"Extracted technology_stack from 'components': {result['technology_stack']}")

    # ── Extract architecture_pattern from "architectural_patterns" list ──
    if (not result.get("architecture_pattern") or result["architecture_pattern"] == "Unknown") \
            and "architectural_patterns" in result:
        patterns = result["architectural_patterns"]
        if isinstance(patterns, list) and patterns:
            result["architecture_pattern"] = ", ".join(patterns)
            logger.info(f"Extracted architecture_pattern from list: {result['architecture_pattern']}")

    # ── Extract required_skills from components if still empty ───────────
    if not result.get("required_skills") and "components" in result:
        skills = set()
        for comp in result["components"]:
            if isinstance(comp, dict):
                for tech in comp.get("key_technologies", []):
                    skills.add(tech)
        if skills:
            result["required_skills"] = sorted(skills)

    # ── Ensure repository_score has a value from code_quality_score ──────
    if (not result.get("repository_score") or result["repository_score"] == 0) \
            and result.get("code_quality_score", 0) > 0:
        result["repository_score"] = result["code_quality_score"]
        logger.info(f"Set repository_score = code_quality_score = {result['repository_score']}")


def _validate_response(result: dict) -> None:
    """Validate that the response contains required keys."""
    missing = REQUIRED_KEYS - set(result.keys())
    if missing:
        logger.warning(f"Response missing keys: {missing}")
        # Fill in missing keys with defaults rather than failing
        defaults = {
            "repository_summary": "Analysis incomplete",
            "technology_stack": [],
            "architecture_pattern": "Unknown",
            "code_quality_score": 0,
            "complexity_level": "Unknown",
            "required_skills": [],
            "contribution_opportunities": [],
            "skill_match_score": 0,
            "developer_technical_score": 0,
            "repository_score": 0,
            "analysis_explanation": "Partial analysis — some fields could not be determined.",
        }
        for key in missing:
            result[key] = defaults.get(key, "")


def _create_fallback_response(metadata: dict, error: str) -> dict:
    """Create a fallback response when LLM analysis fails."""
    return {
        "repository_summary": f"Analysis of {metadata.get('repo_name', 'unknown repository')} could not be completed.",
        "technology_stack": metadata.get("languages", []),
        "architecture_pattern": "Could not determine",
        "code_quality_score": 0,
        "complexity_level": "Unknown",
        "required_skills": metadata.get("languages", []),
        "contribution_opportunities": ["Unable to determine — analysis failed"],
        "skill_match_score": 0,
        "developer_technical_score": 0,
        "repository_score": 0,
        "analysis_explanation": f"LLM analysis failed: {error}. Basic metadata was extracted but code analysis could not be performed.",
    }
