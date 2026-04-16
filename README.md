<div align="center">
  <img src="openpulse-logo.svg" alt="OpenPulse Logo" width="150" height="150"/>
  <h1>⚡ OpenPulse</h1>
  <p><strong>Intelligent Developer Matching & Deep Code Analysis Engine</strong></p>
  <p>
    <img src="https://img.shields.io/badge/React-19-blue.svg?logo=react" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-Express-green.svg?logo=node.js" alt="Node.js" />
    <img src="https://img.shields.io/badge/Python-FastAPI-blue.svg?logo=python" alt="Python" />
    <img src="https://img.shields.io/badge/AI-LangChain%20%7C%20RAG-orange.svg" alt="RAG" />
  </p>
</div>

---

A unified dual-sided platform that helps **Developers** seamlessly find and contribute to open-source projects, and empowers **Recruiters** to discover hidden engineering talent using **AI-powered deep codebase analysis** (RAG).

## ✨ Key Features

### 👨‍💻 Developer Experience
* **Automated Profile Analysis** — Accurately detects your tech stack, domains, and open-source frequency.
* **Intelligent Recommendations** — Connects you with high-compatibility open-source repositories.
* **Contribution Tracking** — Clean visualizations of your commit histories and platform activities.
* **Bookmarks & Saved Searches** — Track `good-first-issue` tickets effortlessly.

### 🏢 Recruiter Ecosystem
* **Advanced Candidate Sourcing** — Query developers by specific languages and exact commit volumes.
* **AI Executive Summaries** — Our automated RAG pipeline evaluates a candidate's repositories to determine their code velocity, review impact, mentorship quality, and software stability.
* **Exportable Candidate Evaluations** — One-click clean PDF data exports for seamless integration into your existing ATS software.
* **Deduplicated Analytics** — Analyzed repositories use algorithmic SHA-tracking to prevent duplicate AI invocations and drastically reduce operating overhead.

---

## 🏗️ Architecture

OpenPulse is distributed across three distinct microservices to natively isolate interface routing from heavy ML/AI embedding pipelines.

<details>
<summary><b>Click to expand Architecture Diagram</b></summary>

```text
┌─────────────────────────────────────────────────────┐
│                 React Frontend (Vite)                │
│                                                      │
│  Landing → Login → Candidate Search → Dashboards     │
│  Reports → Bookmarks → Deep Analysis                 │
└──────────────────────┬───────────────────────────────┘
                       │ HTTP (axios)
                       ▼
┌─────────────────────────────────────────────────────┐
│               Node.js Express Backend                │
│                                                      │
│  /auth/*          → GitHub OAuth + JWT               │
│  /profile/*       → User tech stack mapping          │
│  /recruiter/*     → Recruiter RBAC & Data pipelines  │
│                                                      │
│  Data: Supabase (Auth, Cache, Resourcing)            │
└──────────────────────┬───────────────────────────────┘
                       │ HTTP
                       ▼
┌─────────────────────────────────────────────────────┐
│             Python RAG AI Microservice               │
│                                                      │
│  POST /api/analyze → Full Code Embeddings            │
│  Data: ChromaDB (vectors), SQLite (local cache)      │
└─────────────────────────────────────────────────────┘
```
</details>

---

## 🚀 Setup & Installation

### Prerequisites
* **Node.js** 18+ & **Python** 3.10+
* **GitHub OAuth App**
* **Supabase** Project
* **Gemini** or **OpenAI API Key**

### 1. Node.js Backend Engine
```bash
cd backend
cp .env.example .env
# Map your database and GitHub URLs in the .env
npm install
npm start
```

### 2. Python RAG Pipeline
```bash
cd rag-service
py -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

### 3. Frontend Interface
```bash
cd frontend
npm install
npm run dev
```

---

## 🔌 Core Technologies

| Module | Core Mechanics |
|---|---|
| **Frontend UI** | React 19, TailwindCSS 3.4, Zustand (State), React-Query |
| **Backend API** | Node.js, Express.js 5, JSON Web Tokens, Axios |
| **Data Layers** | Supabase (PostgreSQL), ChromaDB (Vector Search), SQLite |
| **AI RAG Pipeline** | FastAPI, Sentence-Transformers, LangChain, Gemini 2.0 Flash |

---

<div align="center">
  <p><i>System engineered under the OpenPulse project frameworks. MIT Licensed.</i></p>
</div>
