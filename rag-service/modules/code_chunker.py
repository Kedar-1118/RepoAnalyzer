"""Code chunking module.

Splits code files into semantically meaningful chunks for embedding
using LangChain's RecursiveCharacterTextSplitter with language-aware separators.
"""

import logging
from typing import Optional

from langchain_text_splitters import (
    RecursiveCharacterTextSplitter,
    Language,
)

from config import settings

logger = logging.getLogger(__name__)

# Map our language strings to LangChain Language enum
LANGUAGE_MAP = {
    "Python": Language.PYTHON,
    "JavaScript": Language.JS,
    "TypeScript": Language.TS,
    "JavaScript (React)": Language.JS,
    "TypeScript (React)": Language.TS,
    "Java": Language.JAVA,
    "Go": Language.GO,
    "Rust": Language.RUST,
    "C++": Language.CPP,
    "C": Language.C,
    "C/C++ Header": Language.C,
    "C++ Header": Language.CPP,
    "C#": Language.CSHARP,
    "Ruby": Language.RUBY,
    "PHP": Language.PHP,
    "Swift": Language.SWIFT,
    "Scala": Language.SCALA,
    "HTML": Language.HTML,
    "Markdown": Language.MARKDOWN,
}


def chunk_code_files(files: list[dict], repo_name: str = "") -> list[dict]:
    """Split code files into chunks with metadata.

    Args:
        files: List of file dicts with keys: path, content, language, size
        repo_name: Name of the repository for metadata

    Returns:
        List of chunk dicts with keys: content, metadata
    """
    chunks = []

    for file_info in files:
        file_chunks = _chunk_single_file(file_info, repo_name)
        chunks.extend(file_chunks)

    logger.info(f"Created {len(chunks)} chunks from {len(files)} files")
    return chunks


def _chunk_single_file(file_info: dict, repo_name: str) -> list[dict]:
    """Chunk a single file with appropriate splitter.

    Args:
        file_info: Dict with path, content, language, size
        repo_name: Repository name for metadata

    Returns:
        List of chunk dicts
    """
    language = file_info.get("language", "Unknown")
    content = file_info.get("content", "")
    file_path = file_info.get("path", "")

    if not content.strip():
        return []

    # Get language-specific splitter or fall back to generic
    splitter = _get_splitter(language)

    # Split the content
    text_chunks = splitter.split_text(content)

    # Build chunk dicts with metadata
    result = []
    for idx, chunk_text in enumerate(text_chunks):
        chunk = {
            "content": chunk_text,
            "metadata": {
                "file_path": file_path,
                "language": language,
                "chunk_index": idx,
                "total_chunks": len(text_chunks),
                "repo_name": repo_name,
                "file_size": file_info.get("size", 0),
            },
        }
        result.append(chunk)

    return result


def _get_splitter(language: str) -> RecursiveCharacterTextSplitter:
    """Get the appropriate text splitter for a language.

    Args:
        language: Language name string

    Returns:
        Configured RecursiveCharacterTextSplitter
    """
    lang_enum = LANGUAGE_MAP.get(language)

    if lang_enum:
        try:
            return RecursiveCharacterTextSplitter.from_language(
                language=lang_enum,
                chunk_size=settings.CHUNK_SIZE,
                chunk_overlap=settings.CHUNK_OVERLAP,
            )
        except Exception:
            pass  # Fall back to generic splitter

    # Generic splitter for unsupported languages
    return RecursiveCharacterTextSplitter(
        chunk_size=settings.CHUNK_SIZE,
        chunk_overlap=settings.CHUNK_OVERLAP,
        separators=["\n\n", "\n", " ", ""],
    )


def prepare_documents_for_store(chunks: list[dict]) -> tuple[list[str], list[dict], list[str]]:
    """Prepare chunks for insertion into vector store.

    Args:
        chunks: List of chunk dicts with content and metadata

    Returns:
        Tuple of (texts, metadatas, ids)
    """
    texts = []
    metadatas = []
    ids = []

    for idx, chunk in enumerate(chunks):
        # Create a rich text representation including file path context
        file_path = chunk["metadata"].get("file_path", "unknown")
        language = chunk["metadata"].get("language", "Unknown")
        enriched_text = f"File: {file_path} ({language})\n\n{chunk['content']}"

        texts.append(enriched_text)
        metadatas.append(chunk["metadata"])
        ids.append(f"chunk_{idx}")

    return texts, metadatas, ids
