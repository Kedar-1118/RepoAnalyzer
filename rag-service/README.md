# 🔍 RAG Repository Analyzer

An AI-powered GitHub repository analysis system using **Retrieval-Augmented Generation (RAG)**. This tool clones a repository, chunks the code, stores it in a vector database, and uses an LLM to provide deep insights into the codebase, architecture, and developer skill alignment.

## 🚀 Key Features

*   **RAG-Powered Insights:** Uses local vector storage (ChromaDB) to provide relevant code context to the LLM.
*   **Comprehensive Analysis:** Generates reports on tech stack, architecture patterns, code quality, and complexity.
*   **Developer Skill Matching:** Evaluates how well a developer's skills align with the repository's requirements.
*   **Multi-LLM Support:** Compatible with **Google Gemini** (via `gemini-2.0-flash`) and **OpenAI** (via `gpt-4o-mini`).
*   **Web Interface:** Easy-to-use FastAPI-based web UI for quick analysis.

## 🛠️ Tech Stack

*   **Backend:** FastAPI, Python 3.10+
*   **LLM Orchestration:** LangChain
*   **Vector Database:** ChromaDB
*   **Embeddings:** Sentence Transformers (`all-MiniLM-L6-v2`)
*   **Data Sourcing:** GitHub API (PyGithub), GitPython

## 📋 How It Works (The Pipeline)

1.  **Metadata Fetching:** Retrieves repository info from the GitHub API.
2.  **File Extraction:** Clones the repository and extracts supported code files.
3.  **Semantic Chunking:** Breaks code into manageable pieces while preserving context.
4.  **Vector Storage:** Embeds and stores chunks in ChromaDB for fast retrieval.
5.  **Contextual Retrieval:** Finds the most relevant code snippets based on the analysis prompt.
6.  **LLM Analysis:** Generates a structured JSON report using the retrieved context.

## 📖 Getting Started

Please see [SETUP.md](SETUP.md) for detailed installation and configuration instructions.

---

*Built with ❤️ for repository exploration and developer evaluation.*
