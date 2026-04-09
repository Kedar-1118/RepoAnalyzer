"""Embedding engine module.

Provides embedding functions using HuggingFace sentence-transformers
for generating vector representations of code chunks.
"""

import logging
from functools import lru_cache
# from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.embeddings import HuggingFaceEmbeddings

from config import settings

logger = logging.getLogger(__name__)


@lru_cache(maxsize=1)
def get_embedding_function() -> HuggingFaceEmbeddings:
    """Get the embedding function (cached singleton).

    Returns:
        HuggingFaceEmbeddings instance configured with the selected model
    """
    logger.info(f"Loading embedding model: {settings.EMBEDDING_MODEL}")

    embeddings = HuggingFaceEmbeddings(
        model_name=settings.EMBEDDING_MODEL,
        model_kwargs={"device": "cpu"},
        encode_kwargs={"normalize_embeddings": True},
    )

    logger.info("Embedding model loaded successfully")
    return embeddings
