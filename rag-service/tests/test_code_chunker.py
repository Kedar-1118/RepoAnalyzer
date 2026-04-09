"""Tests for the code chunker module."""

import pytest
from modules.code_chunker import chunk_code_files, prepare_documents_for_store


class TestChunkCodeFiles:
    """Tests for code chunking logic."""

    def test_chunk_python_file(self):
        files = [{
            "path": "main.py",
            "content": "def hello():\n    print('Hello, World!')\n\ndef goodbye():\n    print('Goodbye!')\n",
            "language": "Python",
            "size": 80,
        }]
        chunks = chunk_code_files(files, repo_name="test-repo")
        assert len(chunks) >= 1
        assert chunks[0]["metadata"]["file_path"] == "main.py"
        assert chunks[0]["metadata"]["language"] == "Python"
        assert chunks[0]["metadata"]["repo_name"] == "test-repo"

    def test_empty_file_skipped(self):
        files = [{
            "path": "empty.py",
            "content": "   \n  \n",
            "language": "Python",
            "size": 5,
        }]
        chunks = chunk_code_files(files)
        assert len(chunks) == 0

    def test_multiple_files(self):
        files = [
            {
                "path": "a.py",
                "content": "x = 1\ny = 2\n",
                "language": "Python",
                "size": 14,
            },
            {
                "path": "b.js",
                "content": "const x = 1;\n",
                "language": "JavaScript",
                "size": 14,
            },
        ]
        chunks = chunk_code_files(files)
        assert len(chunks) >= 2

    def test_chunk_metadata_has_index(self):
        files = [{
            "path": "test.py",
            "content": "a = 1\n" * 500,  # Long file to produce multiple chunks
            "language": "Python",
            "size": 3000,
        }]
        chunks = chunk_code_files(files)
        for chunk in chunks:
            assert "chunk_index" in chunk["metadata"]
            assert "total_chunks" in chunk["metadata"]


class TestPrepareDocuments:
    """Tests for document preparation."""

    def test_prepare_returns_correct_format(self):
        chunks = [
            {
                "content": "def foo(): pass",
                "metadata": {"file_path": "a.py", "language": "Python", "chunk_index": 0},
            },
        ]
        texts, metadatas, ids = prepare_documents_for_store(chunks)
        assert len(texts) == 1
        assert len(metadatas) == 1
        assert len(ids) == 1
        assert "a.py" in texts[0]
        assert ids[0] == "chunk_0"
