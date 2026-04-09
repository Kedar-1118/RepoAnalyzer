"""Tests for the GitHub fetcher module."""

import pytest
from modules.github_fetcher import parse_repo_url, _ext_to_language


class TestParseRepoUrl:
    """Tests for URL parsing."""

    def test_standard_url(self):
        owner, name = parse_repo_url("https://github.com/tiangolo/fastapi")
        assert owner == "tiangolo"
        assert name == "fastapi"

    def test_url_with_git_suffix(self):
        owner, name = parse_repo_url("https://github.com/owner/repo.git")
        assert owner == "owner"
        assert name == "repo"

    def test_url_with_trailing_slash(self):
        owner, name = parse_repo_url("https://github.com/owner/repo/")
        assert owner == "owner"
        assert name == "repo"

    def test_url_with_whitespace(self):
        owner, name = parse_repo_url("  https://github.com/owner/repo  ")
        assert owner == "owner"
        assert name == "repo"

    def test_invalid_url_raises(self):
        with pytest.raises(ValueError):
            parse_repo_url("https://gitlab.com/owner/repo")

    def test_empty_url_raises(self):
        with pytest.raises(ValueError):
            parse_repo_url("")


class TestExtToLanguage:
    """Tests for file extension mapping."""

    def test_python(self):
        assert _ext_to_language(".py") == "Python"

    def test_javascript(self):
        assert _ext_to_language(".js") == "JavaScript"

    def test_typescript(self):
        assert _ext_to_language(".ts") == "TypeScript"

    def test_unknown_extension(self):
        assert _ext_to_language(".xyz") == "Unknown"

    def test_docker(self):
        assert _ext_to_language(".dockerfile") == "Dockerfile"
