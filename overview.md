# Project Overview

This document summarizes the user-facing features of the project and the technical entities, services, and files that implement them.

## High-level architecture
- Backend: Node.js (Express) service in the `backend/` folder. Entrypoints: `src/app.js` and `src/server.js`.
- Frontend: React app (Vite) in the `frontend/` folder. Entrypoints: `src/main.jsx`, `src/App.jsx`.
- RAG Service: Python-based retrieval-augmented generation (RAG) service in `rag-service/` using Chroma DB for vector storage and local LLM integration.
- Supabase/migrations: Database migration artifacts under `supabase/` and `backend/migrations`.

## Features and technical entities

### 1) Authentication & Authorization
- What: User login, session/auth checks and role-based access (e.g., recruiter vs user).
- Backend entities: `backend/src/middleware/` (auth middleware), `backend/src/controllers/` (auth controller), `backend/src/services/` (token/session services), and any `config/` settings in `backend/src/config/`.
- Supporting scripts: `backend/make-user.js`, `backend/make-recruiter.js` for creating seeded accounts.
- Persistence: Users table managed via migrations in `backend/migrations` (and/or `supabase/migrations`).

### 2) User & Recruiter Management
- What: CRUD for user and recruiter profiles, account setup, and role-specific views.
- Backend entities: controllers in `backend/src/controllers/`, route definitions in `backend/src/routes/`, and data access in `backend/src/services/` or repositories.
- API endpoints: defined in `backend/src/routes/` and wired in `src/app.js`.

### 3) Job Postings, Applications & Matching
- What: Posting jobs, applying, and matching candidates to roles.
- Backend entities: job-related controllers and services under `backend/src/controllers/` and `backend/src/services/`.
- DB: Job, Application, and related tables managed by migrations.
- Frontend: pages/components under `frontend/src/pages/` and `frontend/src/components/` that render job lists, forms and application flows.

### 4) Search, Filters & Recommendations
- What: Search across jobs, candidates, and skill filters; recommendations to improve matches.
- Backend entities: search endpoints in `backend/src/controllers/` and any dedicated search services in `backend/src/services/`.
- Tech: Could use SQL full-text, Postgres indexes, or external vector search (RAG service) for semantic matches.
- Frontend: search UI in `frontend/src/components/` and state in `frontend/src/store/`.

### 5) RAG / Semantic Retrieval & Embeddings
- What: Use embeddings and vector search to provide semantic search, document retrieval, and LLM augmentation.
- Service: `rag-service/` — Python service that handles embedding generation, vector storage (Chroma DB at `rag-service/chroma_db/chroma.sqlite3`), retrieval logic, and optionally local LLM calls.
- Modules: `rag-service/modules/` (embedding_engine.py, retriever components, vector_store.py, llm_analyzer.py, etc.).
- Integration: Backend or frontend may call the RAG service via HTTP or an internal API; check `backend/src/services/` and `frontend/src/services/` for connectors.

### 6) Caching, Scoring & Analysis
- What: Cache retrieval results and score candidate fits.
- Entities: `rag-service/modules/analysis_cache.py`, `scoring.py`, and `scoring` utilities in backend services if present.

### 7) Database & Migrations
- What: Schema management, seeds, and migration scripts.
- Files: `backend/run-migrations.js`, `backend/migrations/`, `supabase/migrations/`, and `backend/test-db.js` for DB checks.
- Config: `backend/src/config/database.js` contains DB connection settings.

### 8) Dev Scripts, Logging & Utilities
- Scripts: `backend/make-user.js`, `backend/make-recruiter.js`, `backend/run-migrations.js`, and `rag-service/stop-rag.bat`.
- Logs: `backend/logs/` for server logs and diagnostic output.
- Tests: `rag-service/tests/` and backend/frontend test suites (search for `tests` folders).

### 9) Frontend UI & State Management
- Structure: `frontend/src/pages/` for routes/screens, `frontend/src/components/` for reusable UI, `frontend/src/store/` for global state, and `frontend/src/services/` for API wrappers.
- Tooling: Vite config (`vite.config.js`), Tailwind (`tailwind.config.js`), PostCSS and ESLint configuration.

### 10) Deployment & Hosting
- Files: `frontend/vercel.json` suggests Vercel deployment for the frontend. Check CI/CD or hosting docs in `README.md` or `walkthrough.md` for environment variables and steps.

## How to find the implementation for a feature
- Backend route handlers: open `backend/src/routes/` and trace to controller in `backend/src/controllers/` and service in `backend/src/services/`.
- Frontend UI: inspect `frontend/src/pages/` and component tree in `frontend/src/components/`.
- RAG internals: review `rag-service/modules/` for embedding, retrieval, and analyzer logic.

## Next steps / suggestions
- Add cross-references (links) from feature docs to the specific files/lines implementing them.
- Add a table mapping public API endpoints to frontend pages for quicker onboarding.

---

Created: overview for the repo. If you want, I can add file-level links or expand any feature with diagrams or API mappings.
