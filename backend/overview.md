# Open Source Matchmaker Backend Overview

## Project Purpose

The Open Source Matchmaker backend powers a platform for GitHub users, recruiters, and contributors to discover open-source repository matches, analyze user and repository profiles, save favorites, search projects, and manage candidate workflows.

## Core Features

### 1. Authentication
- GitHub OAuth flow to sign in users.
- JWT-based session management.
- Cookie and Authorization header token support.
- Token verification endpoint.
- Role-based access control for recruiter-only features.

### 2. User Profile & Analysis
- Fetch authenticated user profile data from GitHub.
- Load user repositories and contribution history.
- Analyze user tech stack, activity score, domain expertise, and skill strength.
- Support storing and updating a custom tech stack in Supabase.
- Return profile summary, repo list, stats, contribution calendar, and tech stack details.

### 3. Repository Recommendations
- Generate personalized repository recommendations using GitHub repository metadata.
- Score repositories by tech stack match, recency, popularity, contributor friendliness, and domain fit.
- Filter and rank repos for users seeking open-source contributions.
- Expose a path for repository analysis by owner/repo.

### 4. Repository Search
- Search GitHub repositories with query and filter support.
- Filter by language, topics, stars, good-first-issue, and help-wanted labels.
- Provide search endpoint for frontend-driven discovery flows.

### 5. Saved Repositories
- Save a repository for a user.
- Remove saved repositories.
- Retrieve saved repository list.
- Update notes or metadata for saved repositories.

### 6. Issue Recommendations
- Provide recommended GitHub issues to contribute to.
- Use GitHub issue metadata and repository metadata to suggest beginner-friendly opportunities.

### 7. Deep Analysis & RAG Pipeline
- Analyze a repository or user candidate using a deep analysis service.
- Expose health and cache status endpoints for the analysis subsystem.
- Support a RAG-like analysis pipeline for richer insight.

### 8. Candidate & Recruiter Workflows
- Fetch full candidate profiles for authenticated users.
- Trigger deep candidate analysis.
- Recruiter search for candidate discovery.
- Recruiter candidate profile viewing and report retrieval.
- Recruiter shortlist management.
- Batch candidate enrichment for recruiter workflows.

### 9. Bulk Analysis
- Start bulk batch analyses for multiple candidates.
- List user batch analysis jobs.
- Query batch details.
- Export batch results.

## Technical Architecture

### Request Layer
- `src/app.js` sets up Express middleware and routes.
- Global rate limiting, CORS, security headers, JSON parsing, and cookie parsing are configured.
- The API base path organization includes:
  - `/auth`
  - `/profile`
  - `/recommend`
  - `/search`
  - `/saved`
  - `/issues`
  - `/analyze`
  - `/bulk-analysis`
  - `/candidates`
  - `/recruiter`

### Route Modules
- `src/routes/authRoutes.js`
- `src/routes/profileRoutes.js`
- `src/routes/recommendationRoutes.js`
- `src/routes/searchRoutes.js`
- `src/routes/savedRoutes.js`
- `src/routes/issueRoutes.js`
- `src/routes/analyzeRoutes.js`
- `src/routes/bulkAnalysisRoutes.js`
- `src/routes/candidateRoutes.js`
- `src/routes/recruiterRoutes.js`

### Controllers
Each route layer forwards requests to controllers that manage validation and service orchestration:
- `src/controllers/authController.js`
- `src/controllers/profileController.js`
- `src/controllers/recommendationController.js`
- `src/controllers/repositoryController.js`
- `src/controllers/savedController.js`
- `src/controllers/issueController.js`
- `src/controllers/analyzeController.js`
- `src/controllers/bulkAnalysisController.js`
- `src/controllers/candidateController.js`
- `src/controllers/recruiterController.js`

### Services
Business logic and external integrations are implemented in services:
- `src/services/githubService.js` — GitHub REST and GraphQL integration.
- `src/services/analysisService.js` — user and repository analytics.
- `src/services/matchService.js` — personalized recommendation scoring and filtering.

### Data Storage
- `src/config/database.js` configures a PostgreSQL connection via Supabase.
- Supabase stores user metadata, saved repositories, tech stack details, batches, and recruiter/candidate state.
- Migrations in `supabase/migrations/` define the database schema and schema upgrades.

### Security & Middleware
- `src/middleware/auth.js` handles JWT verification and role authorization.
- `helmet` secures HTTP responses.
- `express-rate-limit` limits request volume.
- CORS is restricted to the frontend origin.

### Configuration
- `src/config/github.js` loads GitHub OAuth and API settings from environment variables.
- `.env` variables include GitHub credentials, Supabase URL, JWT secret, and frontend callback/origin configuration.

### Logging & Error Handling
- Structured logging is enabled through Winston.
- Error handling middleware catches unhandled errors and returns standardized JSON responses.
- Request-level exceptions are converted into HTTP status codes and messages.

## Data Flow Summary

1. User initiates GitHub authentication via `/auth/github`.
2. GitHub redirects to `/auth/github/callback`.
3. Backend exchanges the OAuth code for an access token.
4. GitHub data is fetched and user records are created or updated in Supabase.
5. A JWT is issued and returned to the client.
6. Authenticated calls use JWT to access profile, recommendations, search, saved repos, issues, and analysis features.
7. GitHubService fetches live GitHub data; AnalysisService and MatchService transform raw GitHub data into profile scores and repository recommendations.
8. Recruiter and candidate workflows use additional Supabase-backed state and batch analysis flows.

## Key Technical Entities

- Express application (`src/app.js`, `src/server.js`)
- GitHub API client (`src/services/githubService.js`)
- Profile analytics engine (`src/services/analysisService.js`)
- Recommendation matcher (`src/services/matchService.js`)
- JWT auth middleware (`src/middleware/auth.js`)
- Supabase/PostgreSQL DB connection (`src/config/database.js`)
- Route/controller organization for modular API behavior
- Security and reliability middleware (Helmet, CORS, rate limiting)

## Supported User Journeys

- Contributor: sign in, inspect profile analytics, search projects, get repo recommendations, save repos, find issues, and view contribution metrics.
- Recruiter: authenticate with recruiter privileges, discover candidates, view candidate profiles and reports, shortlist talent, and run batch enrichment.
- Admin/developer: verify API health, monitor analysis cache stats, and extend repo/candidate analysis.

## Deployment Notes

- The server runs on Node.js and listens via `src/server.js`.
- Environment configuration is required for GitHub OAuth, JWT secret, Supabase database URL, and frontend origin.
- Use `npm run dev` for development and `npm start` for production.

---

This overview documents the project capabilities and the technical entities implementing them across routes, controllers, services, middleware, and configuration.