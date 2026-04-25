"""GitHub repository data fetcher module.

Handles cloning repositories and extracting file contents and metadata
via the GitHub API and git operations.
"""

import os
import re
import shutil
import tempfile
import logging
from typing import Optional
from pathlib import Path

from github import Github, GithubException
import git

from config import settings

logger = logging.getLogger(__name__)


def parse_repo_url(repo_url: str) -> tuple[str, str]:
    """Extract owner and repo name from a GitHub URL.

    Args:
        repo_url: GitHub repository URL (e.g., https://github.com/owner/repo)

    Returns:
        Tuple of (owner, repo_name)
    """
    # Handle various GitHub URL formats
    patterns = [
        r"github\.com/([^/]+)/([^/\s]+?)(?:\.git)?$",
        r"github\.com/([^/]+)/([^/\s]+?)/?$",
    ]
    for pattern in patterns:
        match = re.search(pattern, repo_url.strip())
        if match:
            return match.group(1), match.group(2)
    raise ValueError(f"Invalid GitHub URL: {repo_url}")


def fetch_repo_metadata(repo_url: str) -> dict:
    """Fetch repository metadata from GitHub API.

    Args:
        repo_url: GitHub repository URL

    Returns:
        Dictionary with repository metadata
    """
    owner, repo_name = parse_repo_url(repo_url)

    gh = Github(settings.GITHUB_TOKEN) if settings.GITHUB_TOKEN else Github()

    try:
        repo = gh.get_repo(f"{owner}/{repo_name}")

        # Get languages
        languages = list(repo.get_languages().keys())

        # Get basic metadata
        metadata = {
            "repo_name": repo.name,
            "repo_url": repo_url,
            "repo_owner": owner,
            "description": repo.description or "",
            "languages": languages,
            "primary_language": repo.language or (languages[0] if languages else "Unknown"),
            "stars": repo.stargazers_count,
            "forks": repo.forks_count,
            "open_issues": repo.open_issues_count,
            "watchers": repo.watchers_count,
            "created_at": str(repo.created_at),
            "updated_at": str(repo.updated_at),
            "pushed_at": str(repo.pushed_at),
            "default_branch": repo.default_branch,
            "topics": repo.get_topics(),
            "license": repo.license.name if repo.license else "None",
            "has_wiki": repo.has_wiki,
            "has_issues": repo.has_issues,
            "size_kb": repo.size,
            "contributors_count": _get_contributors_count(repo),
        }

        return metadata

    except GithubException as e:
        if e.status == 401:
            logger.error("GitHub Authentication failed: Bad Credentials.")
            raise RuntimeError(
                "GitHub Authentication failed. Please check your GITHUB_TOKEN in the .env file. "
                "Ensure it is valid or remove it to use unauthenticated requests (limited rate)."
            )
        logger.error(f"GitHub API error: {e}")
        raise RuntimeError(f"Failed to fetch repository metadata: {e}")
    finally:
        gh.close()


def _get_contributors_count(repo) -> int:
    """Get approximate contributor count (capped to avoid excessive API calls)."""
    try:
        contributors = repo.get_contributors()
        # GitHub paginates; get total count from first page
        return contributors.totalCount
    except Exception:
        return 0


def fetch_repo_files(repo_url: str) -> list[dict]:
    """Clone a repository and extract code file contents.

    Args:
        repo_url: GitHub repository URL

    Returns:
        List of dicts with keys: path, content, language, size
    """
    owner, repo_name = parse_repo_url(repo_url)
    clone_dir = Path(tempfile.mkdtemp(dir=settings.TEMP_DIR))

    try:
        # Build clone URL (with token if available)
        if settings.GITHUB_TOKEN:
            clone_url = f"https://{settings.GITHUB_TOKEN}@github.com/{owner}/{repo_name}.git"
        else:
            clone_url = f"https://github.com/{owner}/{repo_name}.git"

        logger.info(f"Cloning {owner}/{repo_name} into {clone_dir}")
        git.Repo.clone_from(
            clone_url,
            str(clone_dir),
            depth=1,  # Shallow clone for speed
            single_branch=True,
        )

        files = []
        file_count = 0

        for root, dirs, filenames in os.walk(clone_dir):
            # Skip unwanted directories (modify in-place to prune os.walk)
            dirs[:] = [
                d for d in dirs
                if d not in settings.SKIP_DIRS and not d.startswith(".")
            ]

            for filename in filenames:
                if file_count >= settings.MAX_FILES:
                    break

                filepath = Path(root) / filename
                ext = filepath.suffix.lower()

                # Skip unsupported file types
                if ext not in settings.SUPPORTED_EXTENSIONS:
                    continue

                # Skip files that are too large
                try:
                    file_size = filepath.stat().st_size
                    if file_size > settings.MAX_FILE_SIZE_KB * 1024:
                        continue
                    if file_size == 0:
                        continue
                except OSError:
                    continue

                # Read file content
                try:
                    content = filepath.read_text(encoding="utf-8", errors="ignore")
                except Exception:
                    continue

                relative_path = str(filepath.relative_to(clone_dir)).replace("\\", "/")

                files.append({
                    "path": relative_path,
                    "content": content,
                    "language": _ext_to_language(ext),
                    "size": file_size,
                })
                file_count += 1

            if file_count >= settings.MAX_FILES:
                break

        logger.info(f"Fetched {len(files)} files from {owner}/{repo_name}")
        return files

    except git.GitCommandError as e:
        logger.error(f"Git clone error: {e}")
        raise RuntimeError(f"Failed to clone repository: {e}")
    finally:
        # Clean up cloned directory
        shutil.rmtree(clone_dir, ignore_errors=True)


def _ext_to_language(ext: str) -> str:
    """Map file extension to language name."""
    mapping = {
        ".py": "Python",
        ".js": "JavaScript",
        ".ts": "TypeScript",
        ".jsx": "JavaScript (React)",
        ".tsx": "TypeScript (React)",
        ".java": "Java",
        ".go": "Go",
        ".rs": "Rust",
        ".cpp": "C++",
        ".c": "C",
        ".h": "C/C++ Header",
        ".hpp": "C++ Header",
        ".cs": "C#",
        ".rb": "Ruby",
        ".php": "PHP",
        ".swift": "Swift",
        ".kt": "Kotlin",
        ".scala": "Scala",
        ".r": "R",
        ".sql": "SQL",
        ".html": "HTML",
        ".css": "CSS",
        ".scss": "SCSS",
        ".yaml": "YAML",
        ".yml": "YAML",
        ".json": "JSON",
        ".toml": "TOML",
        ".xml": "XML",
        ".md": "Markdown",
        ".dockerfile": "Dockerfile",
        ".tf": "Terraform",
        ".sh": "Shell",
        ".bat": "Batch",
        ".ps1": "PowerShell",
    }
    return mapping.get(ext, "Unknown")
