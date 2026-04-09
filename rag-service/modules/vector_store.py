"""Vector store module.

Handles ChromaDB operations: creating collections, adding documents,
and querying for similar chunks.
"""

import logging
import re

import chromadb

from config import settings
from modules.embedding_engine import get_embedding_function

logger = logging.getLogger(__name__)


def _sanitize_collection_name(name: str) -> str:
    """Sanitize a string to be a valid ChromaDB collection name.

    ChromaDB requires collection names to:
    - Be 3-63 characters long
    - Start and end with an alphanumeric character
    - Contain only alphanumerics, underscores, or hyphens
    - Not contain consecutive dots (..)
    """
    # Replace invalid characters with underscores
    sanitized = re.sub(r"[^a-zA-Z0-9_-]", "_", name)
    # Remove leading/trailing non-alphanumeric characters
    sanitized = sanitized.strip("_-")
    # Ensure minimum length
    if len(sanitized) < 3:
        sanitized = sanitized + "_repo"
    # Truncate to max length
    if len(sanitized) > 63:
        sanitized = sanitized[:63].rstrip("_-")
    # Ensure starts with alphanumeric
    if sanitized and not sanitized[0].isalnum():
        sanitized = "r" + sanitized
    return sanitized


def get_chroma_client() -> chromadb.PersistentClient:
    """Get ChromaDB persistent client."""
    return chromadb.PersistentClient(path=settings.CHROMA_PERSIST_DIR)


def create_vector_store(
    texts: list[str],
    metadatas: list[dict],
    ids: list[str],
    collection_name: str,
) -> chromadb.Collection:
    """Create or replace a ChromaDB collection with embedded documents.

    Args:
        texts: List of text strings to embed and store
        metadatas: List of metadata dicts for each text
        ids: List of unique IDs for each text
        collection_name: Name for the ChromaDB collection

    Returns:
        The created ChromaDB collection
    """
    client = get_chroma_client()
    safe_name = _sanitize_collection_name(collection_name)
    embedding_fn = get_embedding_function()

    # Delete existing collection if it exists
    try:
        client.delete_collection(safe_name)
        logger.info(f"Deleted existing collection: {safe_name}")
    except Exception:
        pass

    # Create new collection
    collection = client.get_or_create_collection(
        name=safe_name,
        metadata={"hnsw:space": "cosine"},
    )

    # Add documents in batches to avoid memory issues
    batch_size = 100
    total = len(texts)

    logger.info(f"Adding {total} documents to collection '{safe_name}'")

    for i in range(0, total, batch_size):
        batch_texts = texts[i : i + batch_size]
        batch_metadatas = metadatas[i : i + batch_size]
        batch_ids = ids[i : i + batch_size]

        # Generate embeddings
        batch_embeddings = embedding_fn.embed_documents(batch_texts)

        collection.add(
            documents=batch_texts,
            metadatas=batch_metadatas,
            ids=batch_ids,
            embeddings=batch_embeddings,
        )

        logger.info(f"Added batch {i // batch_size + 1}/{(total + batch_size - 1) // batch_size}")

    logger.info(f"Vector store created with {total} documents")
    return collection


def query_vector_store(
    collection: chromadb.Collection,
    query: str,
    n_results: int = 5,
) -> list[dict]:
    """Query the vector store for similar documents.

    Args:
        collection: ChromaDB collection to query
        query: Query string
        n_results: Number of results to return

    Returns:
        List of result dicts with document, metadata, and distance
    """
    embedding_fn = get_embedding_function()
    query_embedding = embedding_fn.embed_query(query)

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=min(n_results, collection.count()),
    )

    # Flatten results into a list of dicts
    output = []
    if results and results["documents"]:
        for i, doc in enumerate(results["documents"][0]):
            output.append({
                "document": doc,
                "metadata": results["metadatas"][0][i] if results["metadatas"] else {},
                "distance": results["distances"][0][i] if results["distances"] else 0.0,
            })

    return output
