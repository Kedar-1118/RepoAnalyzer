# Open Source Matchmaker + Deep Analysis (MP)

A unified platform that helps developers find and contribute to open-source projects. Combines GitHub profile analysis, intelligent repository matching, and **AI-powered deep code analysis** using a RAG (Retrieval-Augmented Generation) pipeline.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   React Frontend                     │
│            (Vite, port 5173)                         │
│                                                      │
│  Landing → Login → Dashboard → Profile               │
│  Recommendations → Search → Saved → Issues           │
│  History → Deep Analysis                             │
└──────────────────────┬───────────────────────────────┘
                       │ HTTP (axios)
                       ▼
┌─────────────────────────────────────────────────────┐
│              Node.js Express Backend                 │
│              (port 3000)                             │
│                                                      │
│  /auth/*          → GitHub OAuth + JWT               │
│  /profile/*       → User profile + tech stack        │
│  /recommend/*     → Repo recommendations             │
│  /search/*        → GitHub repo search               │
│  /saved/*         → Save/unsave repos                │
│  /issues/*        → Issue recommendations            │
│  /analyze/*       → Proxy to RAG microservice        │
│                                                      │
│  Data: Supabase (users, saved_repos, recommendations)│
└──────────────────────┬───────────────────────────────┘
                       │ HTTP (internal, localhost)
                       ▼
┌─────────────────────────────────────────────────────┐
│           Python RAG Microservice                    │
│           (FastAPI, port 8001)                        │
│                                                      │
│  POST /api/analyze → Full RAG pipeline               │
│  GET  /api/health  → Health check                    │
│  GET  /api/cache/stats → Cache stats                 │
│                                                      │
│  Data: ChromaDB (vectors), SQLite (analysis cache)   │
└─────────────────────────────────────────────────────┘
```

## Features

### Matchmaker (Node.js + React)
- **GitHub OAuth Login** — Authenticate with your GitHub account
- **Profile Analysis** — Auto-detect your tech stack, activity level, and domains
- **Repo Recommendations** — Match-scored repositories based on your profile
- **Issue Recommendations** — Find good-first-issue / help-wanted issues
- **Save Repositories** — Bookmark repos for later
- **GitHub Search** — Search and filter repositories
- **Contribution History** — View your contribution calendar
- **Custom Tech Stack** — Manually add/remove skills

### Deep Analysis (Python RAG Pipeline)
- **AI-Powered Code Analysis** — Reads actual source code via RAG
- **Architecture Detection** — Identifies design patterns and architecture
- **Code Quality Scoring** — Evaluates code quality from the source
- **Skill Matching** — Compares your skills against required technologies
- **Contribution Opportunities** — Suggests where you can contribute
- **Caching** — SQLite-based analysis cache with configurable TTL

## Prerequisites

- **Node.js** 18+
- **Python** 3.10+
- **GitHub OAuth App** (for login)
- **Supabase** project (for database)
- **Google API Key** (for Gemini LLM in RAG analysis)

## Setup

### 1. Backend (Node.js)

```bash
cd backend
cp .env.example .env
# Edit .env with your credentials
npm install
npm run dev
```

### 2. RAG Service (Python)

```bash
cd rag-service
cp .env.example .env
# Edit .env with your API keys
pip install -r requirements.txt
python main.py
```

### 3. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

#### Backend (`backend/.env`)
| Variable | Description |
|---|---|
| `GITHUB_CLIENT_ID` | GitHub OAuth App client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App client secret |
| `GITHUB_CALLBACK_URL` | OAuth callback URL (default: `http://localhost:3000/auth/callback`) |
| `JWT_SECRET` | Secret key for JWT token signing |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `RAG_SERVICE_URL` | URL of the Python RAG service (default: `http://localhost:8001`) |
| `GOOGLE_API_KEY` | Google API key (passed through for reference) |

#### RAG Service (`rag-service/.env`)
| Variable | Description |
|---|---|
| `LLM_PROVIDER` | `gemini` or `openai` |
| `GOOGLE_API_KEY` | Google Gemini API key |
| `OPENAI_API_KEY` | OpenAI API key (if using OpenAI) |
| `GITHUB_TOKEN` | GitHub PAT for cloning (optional, increases rate limits) |
| `EMBEDDING_MODEL` | HuggingFace model name (default: `all-MiniLM-L6-v2`) |

## Usage

1. Start all three services (backend, rag-service, frontend)
2. Open `http://localhost:5173` in your browser
3. Log in with GitHub
4. Browse Recommendations or use Search to find repos
5. Click **"Run Deep Analysis"** on any repo card to get AI-powered insights
6. Visit the **Deep Analysis** page directly to analyze any GitHub repo URL

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, TailwindCSS, Zustand, React Query, Recharts |
| Backend | Express.js 5, Supabase, JWT, Axios |
| RAG Service | FastAPI, ChromaDB, Sentence-Transformers, LangChain |
| LLM | Google Gemini 2.0 Flash / OpenAI GPT-4o-mini |
| Database | Supabase (PostgreSQL), ChromaDB (vectors), SQLite (cache) |

## License

MIT
