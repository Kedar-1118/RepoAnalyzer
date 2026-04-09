"""Tests for the scoring module."""

import pytest
from modules.scoring import compute_skill_match, compute_developer_score, compute_repository_score


class TestSkillMatch:
    """Tests for skill matching."""

    def test_full_match(self):
        result = compute_skill_match("Python, Docker", ["Python", "Docker"])
        assert result["match_score"] == 100.0
        assert len(result["missing_skills"]) == 0

    def test_partial_match(self):
        result = compute_skill_match("Python", ["Python", "Docker", "React"])
        assert result["match_score"] == pytest.approx(33.33, abs=0.1)

    def test_no_match(self):
        result = compute_skill_match("Java", ["Python", "Docker"])
        assert result["match_score"] == 0.0

    def test_empty_developer_skills(self):
        result = compute_skill_match("", ["Python"])
        assert result["match_score"] == 0

    def test_case_insensitive(self):
        result = compute_skill_match("python, DOCKER", ["Python", "Docker"])
        assert result["match_score"] == 100.0


class TestDeveloperScore:
    """Tests for developer score computation."""

    def test_perfect_scores(self):
        scores = {
            "code_quality": 100,
            "architecture_understanding": 100,
            "skill_diversity": 100,
            "documentation_quality": 100,
            "project_complexity": 100,
        }
        assert compute_developer_score(scores) == 100.0

    def test_zero_scores(self):
        scores = {
            "code_quality": 0,
            "architecture_understanding": 0,
            "skill_diversity": 0,
            "documentation_quality": 0,
            "project_complexity": 0,
        }
        assert compute_developer_score(scores) == 0.0

    def test_weighted_calculation(self):
        scores = {
            "code_quality": 80,
            "architecture_understanding": 70,
            "skill_diversity": 60,
            "documentation_quality": 50,
            "project_complexity": 40,
        }
        expected = 0.30 * 80 + 0.25 * 70 + 0.20 * 60 + 0.15 * 50 + 0.10 * 40
        assert compute_developer_score(scores) == round(expected, 2)


class TestRepositoryScore:
    """Tests for repository score computation."""

    def test_perfect_scores(self):
        scores = {
            "code_quality": 100,
            "architecture": 100,
            "documentation": 100,
            "activity": 100,
            "popularity": 100,
        }
        assert compute_repository_score(scores) == 100.0

    def test_weighted_calculation(self):
        scores = {
            "code_quality": 90,
            "architecture": 80,
            "documentation": 70,
            "activity": 60,
            "popularity": 50,
        }
        expected = 0.30 * 90 + 0.25 * 80 + 0.20 * 70 + 0.15 * 60 + 0.10 * 50
        assert compute_repository_score(scores) == round(expected, 2)
