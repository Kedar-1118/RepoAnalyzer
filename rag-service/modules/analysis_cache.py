"""SQLite-backed analysis cache module.

Stores completed analysis JSON results keyed by (repo_key, developer_skills).
Before re-running the expensive RAG pipeline, the API checks this cache:
  - If a fresh entry exists (within TTL and no newer commits), it is returned.
  - Otherwise the pipeline runs and the result is stored/updated here.
"""

import json
import sqlite3
import logging
from datetime import datetime, timedelta, timezone
from typing import Optional

from config import settings

logger = logging.getLogger(__name__)

# ── Schema ──────────────────────────────────────────────────────────────────

_CREATE_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS analysis_cache (
    repo_key          TEXT    NOT NULL,
    developer_skills  TEXT    NOT NULL DEFAULT '',
    analysis_json     TEXT    NOT NULL,
    pushed_at         TEXT    NOT NULL,
    cached_at         TEXT    NOT NULL,
    PRIMARY KEY (repo_key, developer_skills)
);
"""


def _connect() -> sqlite3.Connection:
    """Open a connection to the cache database."""
    conn = sqlite3.connect(settings.CACHE_DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


# ── Public API ──────────────────────────────────────────────────────────────

def init_cache_db() -> None:
    """Create the cache table if it doesn't already exist."""
    with _connect() as conn:
        conn.execute(_CREATE_TABLE_SQL)
        conn.commit()
    logger.info("Analysis cache DB initialised at %s", settings.CACHE_DB_PATH)


def get_cached_analysis(
    repo_key: str,
    developer_skills: str,
    current_pushed_at: str,
) -> Optional[dict]:
    """Look up a cached analysis result.

    Returns the stored analysis dict if ALL of the following are true:
      1. An entry exists for (repo_key, developer_skills).
      2. The repo has NOT been pushed to since the entry was cached
         (current_pushed_at <= stored pushed_at).
      3. The entry is still within the configured TTL.

    Returns None on cache miss.
    """
    with _connect() as conn:
        row = conn.execute(
            "SELECT analysis_json, pushed_at, cached_at "
            "FROM analysis_cache "
            "WHERE repo_key = ? AND developer_skills = ?",
            (repo_key, developer_skills),
        ).fetchone()

    if row is None:
        logger.info("Cache MISS (no entry) for %s", repo_key)
        return None

    # Check TTL expiry
    cached_at = datetime.fromisoformat(row["cached_at"])
    ttl_deadline = cached_at + timedelta(days=settings.CACHE_TTL_DAYS)
    now = datetime.now(timezone.utc)

    if now > ttl_deadline:
        logger.info("Cache MISS (TTL expired) for %s", repo_key)
        return None

    # Check staleness: if the repo has newer commits, invalidate
    if current_pushed_at and current_pushed_at != row["pushed_at"]:
        # Parse both timestamps; if current is newer, cache is stale
        try:
            cached_push = datetime.fromisoformat(row["pushed_at"])
            current_push = datetime.fromisoformat(current_pushed_at)
            if current_push > cached_push:
                logger.info("Cache MISS (repo updated since cache) for %s", repo_key)
                return None
        except (ValueError, TypeError):
            # If parsing fails, treat as stale to be safe
            logger.warning("Could not parse pushed_at timestamps, treating as stale")
            return None

    logger.info("Cache HIT for %s", repo_key)
    return json.loads(row["analysis_json"])


def store_analysis(
    repo_key: str,
    developer_skills: str,
    analysis: dict,
    pushed_at: str,
) -> None:
    """Insert or update a cache entry."""
    now = datetime.now(timezone.utc).isoformat()

    with _connect() as conn:
        conn.execute(
            "INSERT INTO analysis_cache "
            "  (repo_key, developer_skills, analysis_json, pushed_at, cached_at) "
            "VALUES (?, ?, ?, ?, ?) "
            "ON CONFLICT(repo_key, developer_skills) DO UPDATE SET "
            "  analysis_json = excluded.analysis_json, "
            "  pushed_at     = excluded.pushed_at, "
            "  cached_at     = excluded.cached_at",
            (repo_key, developer_skills, json.dumps(analysis), pushed_at, now),
        )
        conn.commit()

    logger.info("Cached analysis for %s", repo_key)


def get_cache_stats() -> dict:
    """Return basic cache statistics."""
    with _connect() as conn:
        total = conn.execute("SELECT COUNT(*) FROM analysis_cache").fetchone()[0]

        ttl_cutoff = (
            datetime.now(timezone.utc) - timedelta(days=settings.CACHE_TTL_DAYS)
        ).isoformat()

        active = conn.execute(
            "SELECT COUNT(*) FROM analysis_cache WHERE cached_at > ?",
            (ttl_cutoff,),
        ).fetchone()[0]

        expired = total - active

    return {"total_entries": total, "active_entries": active, "expired_entries": expired}


def clear_expired() -> int:
    """Delete cache entries older than the TTL. Returns count of removed rows."""
    ttl_cutoff = (
        datetime.now(timezone.utc) - timedelta(days=settings.CACHE_TTL_DAYS)
    ).isoformat()

    with _connect() as conn:
        cursor = conn.execute(
            "DELETE FROM analysis_cache WHERE cached_at <= ?",
            (ttl_cutoff,),
        )
        conn.commit()
        removed = cursor.rowcount

    logger.info("Cleared %d expired cache entries", removed)
    return removed
