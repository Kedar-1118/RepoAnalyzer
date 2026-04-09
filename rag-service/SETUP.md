# 🛠️ Setup Guide

Follow these steps to get the **RAG Repository Analyzer** up and running on your local machine.

## 📋 Prerequisites

*   **Python 3.10+**
*   **Git** installed and configured
*   **GitHub Personal Access Token** (Recommended for higher rate limits)
*   **API Key** for either Google Gemini or OpenAI

## ⚙️ Installation

1.  **Clone the current directory** (if you haven't already):
    ```bash
    git clone <your-repo-url>
    cd RAG-model
    ```

2.  **Create a virtual environment**:
    ```bash
    python -m venv venv
    ```

3.  **Activate the virtual environment**:
    *   **Windows**: `venv\Scripts\activate`
    *   **Mac/Linux**: `source venv/bin/activate`

4.  **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

## 🔑 Configuration

1.  **Create a `.env` file** in the root directory:
    ```bash
    cp .env.example .env
    ```

2.  **Edit the `.env` file** and provide your API keys:
    *   `LLM_PROVIDER`: Set to `gemini` or `openai`.
    *   `GOOGLE_API_KEY`: Your Gemini API key.
    *   `OPENAI_API_KEY`: Your OpenAI API key.
    *   `GITHUB_TOKEN`: Your GitHub Personal Access Token.

## 🚀 Running the Application

1.  **Start the FastAPI server**:
    ```bash
    python main.py
    ```
    Alternatively, use uvicorn directly:
    ```bash
    uvicorn main:app --reload
    ```

2.  **Open your browser** and navigate to:
    `http://localhost:8000`

## 🧪 Running Tests

To verify the installation and core logic, run the test suite:
```bash
pytest
```
