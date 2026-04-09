"""Scoring module.

Computes developer skill match scores, developer technical scores,
and repository quality scores using weighted formulas.
"""


def compute_skill_match(developer_skills: str, repo_skills: list[str]) -> dict:
    """Compute skill match between developer and repository.

    Args:
        developer_skills: Comma-separated string of developer skills
        repo_skills: List of skills required for the repository

    Returns:
        Dict with match_score, matched_skills, missing_skills
    """
    if not developer_skills or not repo_skills:
        return {
            "match_score": 0,
            "matched_skills": [],
            "missing_skills": repo_skills or [],
        }

    # Normalize skills to lowercase for comparison
    dev_skills = {s.strip().lower() for s in developer_skills.split(",") if s.strip()}
    repo_skills_normalized = {s.strip().lower() for s in repo_skills}

    matched = dev_skills & repo_skills_normalized
    missing = repo_skills_normalized - dev_skills

    score = (len(matched) / len(repo_skills_normalized) * 100) if repo_skills_normalized else 0

    return {
        "match_score": round(score, 2),
        "matched_skills": sorted(matched),
        "missing_skills": sorted(missing),
    }


def compute_developer_score(scores: dict) -> float:
    """Compute weighted developer technical score.

    Formula:
    0.30 × code_quality + 0.25 × architecture + 0.20 × skill_diversity
    + 0.15 × documentation + 0.10 × project_complexity

    Args:
        scores: Dict with keys: code_quality, architecture_understanding,
                skill_diversity, documentation_quality, project_complexity

    Returns:
        Weighted score out of 100
    """
    weights = {
        "code_quality": 0.30,
        "architecture_understanding": 0.25,
        "skill_diversity": 0.20,
        "documentation_quality": 0.15,
        "project_complexity": 0.10,
    }

    total = sum(
        scores.get(key, 0) * weight
        for key, weight in weights.items()
    )

    return round(total, 2)


def compute_repository_score(scores: dict) -> float:
    """Compute weighted repository quality score.

    Formula:
    0.30 × code_quality + 0.25 × architecture + 0.20 × documentation
    + 0.15 × activity + 0.10 × popularity

    Args:
        scores: Dict with keys: code_quality, architecture,
                documentation, activity, popularity

    Returns:
        Weighted score out of 100
    """
    weights = {
        "code_quality": 0.30,
        "architecture": 0.25,
        "documentation": 0.20,
        "activity": 0.15,
        "popularity": 0.10,
    }

    total = sum(
        scores.get(key, 0) * weight
        for key, weight in weights.items()
    )

    return round(total, 2)
