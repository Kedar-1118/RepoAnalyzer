"""Application configuration loaded from environment variables."""

import os
import tempfile
from pathlib import Path
from dotenv import load_dotenv

# Load .env file
load_dotenv()


class Settings:
    """Application settings loaded from environment variables."""

    def __init__(self):
        self.LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "gemini")
        self.GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY", "")
        self.OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
        self.GITHUB_TOKEN: str = os.getenv("GITHUB_TOKEN", "")
        self.EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")
        self.CHROMA_PERSIST_DIR: str = os.getenv("CHROMA_PERSIST_DIR", "./chroma_db")
        self.CACHE_DB_PATH: str = os.getenv("CACHE_DB_PATH", "./analysis_cache.db")
        self.CACHE_TTL_DAYS: int = int(os.getenv("CACHE_TTL_DAYS", "7"))
        self.GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
        self.OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
        self.OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "gemma4")
        self.OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")

        # Derived settings
        self.BASE_DIR = Path(__file__).parent
        self.TEMP_DIR = Path(tempfile.gettempdir()) / "rag_analyzer_repos"
        self.TEMP_DIR.mkdir(exist_ok=True)

        # Code fetching limits
        self.MAX_FILE_SIZE_KB: int = 100
        self.MAX_FILES: int = 500
        self.SUPPORTED_EXTENSIONS: set = {
            ".py", ".js", ".ts", ".jsx", ".tsx", ".java", ".go", ".rs",
            ".cpp", ".c", ".h", ".hpp", ".cs", ".rb", ".php", ".swift",
            ".kt", ".scala", ".r", ".sql", ".html", ".css", ".scss",
            ".yaml", ".yml", ".json", ".toml", ".xml", ".md",
            ".dockerfile", ".tf", ".sh", ".bat", ".ps1",
        }
        self.SKIP_DIRS: set = {
            ".git", "node_modules", "vendor", "venv", ".venv", "env",
            "__pycache__", ".tox", "dist", "build", ".next", ".nuxt",
            "target", "bin", "obj", ".idea", ".vscode",
            "coverage", ".pytest_cache", ".mypy_cache",
        }

        # Chunking settings
        self.CHUNK_SIZE: int = 1500
        self.CHUNK_OVERLAP: int = 200

        # Retrieval settings
        self.TOP_K: int = 5

    def validate(self):
        """Validate that required configuration is present."""
        if self.LLM_PROVIDER == "gemini" and not self.GOOGLE_API_KEY:
            raise ValueError("GOOGLE_API_KEY is required when LLM_PROVIDER is 'gemini'")
        if self.LLM_PROVIDER == "openai" and not self.OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY is required when LLM_PROVIDER is 'openai'")
        if self.LLM_PROVIDER == "ollama" and not self.OLLAMA_BASE_URL:
            raise ValueError("OLLAMA_BASE_URL is required when LLM_PROVIDER is 'ollama'")





settings = Settings()
