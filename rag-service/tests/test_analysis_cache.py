"""Tests for the analysis cache module."""

import os
import tempfile
import json
import sqlite3
import pytest
from datetime import datetime, timedelta, timezone
from unittest.mock import patch

from modules.analysis_cache import (
    init_cache_db,
    get_cached_analysis,
    store_analysis,
    get_cache_stats,
    clear_expired,
    _connect
)

@pytest.fixture(autouse=True)
def test_db(tmp_path):
    # Use a temporary file in the pytest-provided tmp_path
    db_file = tmp_path / "test_cache.db"
    db_path = str(db_file)
    
    with patch("config.settings.CACHE_DB_PATH", db_path):
        init_cache_db()
        yield


def test_init_db():
    """Test that the table is created."""
    with _connect() as conn:
        cursor = conn.execute(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='analysis_cache'"
        )
        assert cursor.fetchone() is not None


def test_store_and_get_cache():
    """Test basic store and retrieve."""
    repo = "owner/repo"
    skills = "Python, Docker"
    analysis = {"summary": "Great repo"}
    pushed_at = "2024-01-01T12:00:00Z"

    store_analysis(repo, skills, analysis, pushed_at)
    
    # Hit
    cached = get_cached_analysis(repo, skills, pushed_at)
    assert cached == analysis

    # Miss - different repo
    assert get_cached_analysis("other/repo", skills, pushed_at) is None

    # Miss - different skills
    assert get_cached_analysis(repo, "Java", pushed_at) is None


def test_cache_staleness():
    """Test that newer pushed_at invalidates cache."""
    repo = "owner/repo"
    skills = ""
    analysis = {"summary": "v1"}
    old_push = "2024-01-01T12:00:00Z"
    new_push = "2024-01-02T12:00:00Z"

    store_analysis(repo, skills, analysis, old_push)
    
    # Same push = Hit
    assert get_cached_analysis(repo, skills, old_push) == analysis
    
    # Newer push = Miss
    assert get_cached_analysis(repo, skills, new_push) is None


def test_cache_ttl():
    """Test that expired cache returns None."""
    repo = "owner/repo"
    skills = ""
    analysis = {"summary": "old"}
    pushed_at = "2024-01-01T12:00:00Z"

    # Set TTL to 1 day for test
    with patch("config.settings.CACHE_TTL_DAYS", 1):
        # Mock datetime to be in the past when storing
        past_time = datetime.now(timezone.utc) - timedelta(days=2)
        with patch("modules.analysis_cache.datetime") as mock_datetime:
            # First call for now() in store_analysis (used for cached_at)
            # Actually store_analysis uses datetime.now(timezone.utc).isoformat()
            mock_datetime.now.return_value = past_time
            mock_datetime.fromisoformat.side_effect = datetime.fromisoformat
            
            store_analysis(repo, skills, analysis, pushed_at)

        # Now check (with real Time) - should be expired
        assert get_cached_analysis(repo, skills, pushed_at) is None


def test_cache_stats():
    """Test stats reporting."""
    store_analysis("r1", "s1", {"a": 1}, "p1")
    store_analysis("r2", "s2", {"a": 2}, "p2")
    
    stats = get_cache_stats()
    assert stats["total_entries"] == 2
    assert stats["active_entries"] == 2
    assert stats["expired_entries"] == 0


def test_clear_expired():
    """Test clearing stale entries."""
    repo = "owner/repo"
    pushed_at = "2024-01-01"
    
    # Store one "current" entry
    store_analysis("current", "", {"v": 1}, pushed_at)
    
    # Store one "expired" entry by mocking time
    past_time = datetime.now(timezone.utc) - timedelta(days=10)
    with patch("modules.analysis_cache.datetime") as mock_datetime:
        mock_datetime.now.return_value = past_time
        store_analysis("old", "", {"v": 2}, pushed_at)
        
    # Total should be 2
    assert get_cache_stats()["total_entries"] == 2
    
    # Clear (assuming 7 day TTL)
    removed = clear_expired()
    assert removed == 1
    assert get_cache_stats()["total_entries"] == 1
