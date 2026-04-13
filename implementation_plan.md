# UI Overhaul: Integrate Stitch Dashboard Design into MP

## Overview

Replace the current MP frontend entirely with the premium "Fluid Architect" design system from `stitch_open_source_dev_dashboard`. **Dark-only** design. Every field and feature shown in the stitch UI screens will be fully implemented with backend support. The stitch designs feature glassmorphism, gradient accents, Material Symbols icons, Manrope/Inter typography, and a sidebar navigation layout.

## Design Decisions (Confirmed)

- ✅ **Dark-only** — No light mode. Fully commit to the "Fluid Architect" dark design.
- ✅ **Full backend support** — Every field shown in stitch UI will have corresponding backend endpoints and database storage.
- ✅ **PostgreSQL** — Bulk analysis batches and candidate data stored in PostgreSQL (new migrations).
- ✅ **RAG service** — Candidate AI analysis will use the existing RAG service for deep AI-powered analysis.

---

## Stitch UI Screens → MP Page Mapping

| Stitch Screen | Maps To | Status |
|---|---|---|
| `landing_page_v2` | Landing.jsx (public) | Redesign |
| `dashboard_overview_v2` | Dashboard.jsx | Redesign |
| `matched_repositories_v2` | Recommendations.jsx | Redesign |
| `repository_analysis` | DeepAnalysis.jsx | Redesign |
| `user_profile` | Profile.jsx | Redesign |
| `candidate_analyzer_v2` | *NEW: CandidateDetail.jsx* | **New Feature** |
| `bulk_profile_input` | *NEW: BulkAnalysis.jsx* | **New Feature** |
| `analyzed_candidates_list` | *NEW: Candidates.jsx* | **New Feature** |

---

## Proposed Changes — 5 Phases

### Phase 1: Design System Foundation
Update the Tailwind config, global CSS, fonts, and icons to match the stitch "Fluid Architect" design system.

#### [MODIFY] [tailwind.config.js](file:///k:/MP2/MP/frontend/tailwind.config.js)
- Replace old `light`/`dark` color system with stitch M3 color tokens:
  - `surface` (#060e20), `on-surface` (#dee5ff), `primary` (#9fa7ff), `secondary` (#62fae3), `tertiary` (#c180ff)
  - Full set: `surface-container-*`, `primary-*`, `secondary-*`, `tertiary-*`, `outline-*`, `error-*`
- Add `fontFamily`: `headline` (Manrope), `body` (Manrope), `label` (Inter)
- Add `borderRadius`: DEFAULT 1rem, lg 2rem, xl 3rem, full 9999px
- Keep existing animations, add new ones for glassmorphism

#### [MODIFY] [index.css](file:///k:/MP2/MP/frontend/src/index.css)
- Remove all old light/dark theme classes (`.btn-primary`, `.card`, `.input`, etc.)
- Add new utilities: `.glass-card`, `.glass-panel`, `.glow-border`, `.architect-gradient`, `.signature-glow`
- Add Material Symbols icon font settings
- Update scrollbar, loader styles for new palette
- Body defaults: bg `#060e20`, color `#dee5ff`

#### [MODIFY] [index.html](file:///k:/MP2/MP/frontend/index.html)
- Add Google Fonts: Manrope (400–800), Inter (400–600), Material Symbols Outlined
- Add `class="dark"` to `<html>` tag permanently

#### [DELETE] [ThemeToggle.jsx](file:///k:/MP2/MP/frontend/src/components/ThemeToggle.jsx)
- No longer needed (dark-only)

#### [DELETE] [themeStore.js](file:///k:/MP2/MP/frontend/src/store/themeStore.js)
- No longer needed (dark-only)

---

### Phase 2: Layout Components
Replace top navbar with sidebar + top app bar layout.

#### [NEW] [Sidebar.jsx](file:///k:/MP2/MP/frontend/src/components/Sidebar.jsx)
- Fixed left sidebar (w-64), full height, `bg-[#060e20]` with subtle right border
- Sections:
  - **Logo**: "OS Matchmaker" or "Architect" brand text (indigo-400, font-black, tracking-tighter)
  - **User Card**: Avatar + username + "Premium Plan" label
  - **Nav Links** (Material Symbols icons + uppercase labels):
    - Dashboard (`dashboard`), Repo Analyzer (`analytics`), Matches (`handshake`), Candidates (`group`), Profile (`person`), Settings (`settings`)
  - **Active state**: `bg-indigo-500/10 text-[#9fa7ff] border-l-4 border-[#c180ff] rounded-full`
  - **CTA Button**: "New Analysis" — gradient from primary to primary-container
  - **Footer links**: Support (`help`), Documentation (`description`)
- Responsive: Overlay drawer on mobile with backdrop

#### [NEW] [TopBar.jsx](file:///k:/MP2/MP/frontend/src/components/TopBar.jsx)
- Sticky top, `bg-[#060e20]/80 backdrop-blur-md`, border-bottom
- Search input with Material icon prefix (`search`)
- Notification bell (`notifications`) with purple dot indicator
- History button (`history`)
- User avatar (small, rounded-full, ring border)

#### [NEW] [AppLayout.jsx](file:///k:/MP2/MP/frontend/src/components/AppLayout.jsx)
- Composition: `<Sidebar>` + `<main className="ml-64 min-h-screen">` containing `<TopBar>` + `{children}`
- Mobile: sidebar hidden, hamburger in TopBar opens overlay sidebar

#### [NEW] [Footer.jsx](file:///k:/MP2/MP/frontend/src/components/Footer.jsx)
- Dark footer (`bg-black`), centered layout
- Brand name, links (Privacy, Terms, API Status), copyright
- Text: slate-600, hover: indigo-300, Inter font, uppercase tracking-widest

#### [MODIFY] [Navbar.jsx](file:///k:/MP2/MP/frontend/src/components/Navbar.jsx)
- **Only used on Landing page** — transparent/glassmorphic top nav
- Logo "OS Matchmaker", nav links (Explore, Repositories, Mentors, About)
- Sign In button + "Get Started" gradient pill button
- Mobile: glass bottom navigation bar

#### [MODIFY] [App.jsx](file:///k:/MP2/MP/frontend/src/App.jsx)
- Import `AppLayout`, wrap all protected routes inside it
- Add new routes: `/bulk-analysis`, `/candidates`, `/candidates/:id`
- Remove ThemeToggle imports
- Keep `<Navbar>` only for `/`, `/login`, `/auth/callback`
- Remove `dark:` prefixed class on root div, set permanent dark bg

---

### Phase 3: Core Page Redesigns
Rebuild every existing page to exactly match stitch UI designs, connected to existing backend APIs.

#### [MODIFY] [Landing.jsx](file:///k:/MP2/MP/frontend/src/pages/Landing.jsx)
*Matches: `landing_page_v2/screen.png`*
- **Hero**: "Discover, Analyze, and Contribute." — 8xl font, italic gradient "Analyze"
- Floating 3D glass objects with architect gradient sphere + Material icon
- Precision Score badge (98.4%) + "Matches Found" avatar card
- "Launch Analyzer" gradient button + "Watch Methodology" play button
- **Bento Feature Grid**: 
  - Deep Repository Analysis (8-col, image bg with overlay)
  - Mentor Ecosystem (4-col, avatar stack +12k)
  - CLI Tooling (4-col, glassmorphic)
  - Compatibility Meter (8-col, SVG circular progress 82%)
- **CTA Section**: "Ready to Build the Future?" with gradient text + dual buttons
- **Footer**: Luminescent Architect branding
- **Mobile bottom nav**: Glass pill with icon tabs

#### [MODIFY] [Login.jsx](file:///k:/MP2/MP/frontend/src/pages/Login.jsx)
- Dark surface background, centered glassmorphic card
- "Sign in with GitHub" gradient button
- Decorative ambient glows

#### [MODIFY] [Dashboard.jsx](file:///k:/MP2/MP/frontend/src/pages/Dashboard.jsx)
*Matches: `dashboard_overview_v2/screen.png`*
- **Hero**: "System Synthesis" (5xl extrabold) + "Architectural Overview & Global Connectivity" subtitle
- **Stats Grid** (4 glassmorphic cards):
  - Health Score (94.2) — from profile stats / match quality computation
  - Active Matches (1,208) — from recommendations count
  - Code Coverage (88%) — computed from user repos
  - Network Nodes (42) — repos analyzed count
- **Recent Synchronizations** (2-col): List of recent matched repos with compatibility %, topic tags, gradient icons
- **Architect Profile** sidebar (1-col glass card):
  - Verified badge, Skillset Dominance (84% Core Mastery)
  - Skill chips (Rust, WASM, PostgreSQL, Docker, etc.) — from user tech stack
  - System Intelligence bars (Algorithm Efficiency 92%, Concurrency 78%, Security 85%)
  - "Download Analysis" button
- **Floating FAB**: "New Analysis" gradient button (bottom-right)

#### [MODIFY] [Recommendations.jsx](file:///k:/MP2/MP/frontend/src/pages/Recommendations.jsx)
*Matches: `matched_repositories_v2/screen.png`*
- **Hero**: "Architectural Precision Matches." — 6xl, italic gradient "Precision"
- **Status badge**: "14 New Matches Found" with pulsing green dot
- **Filter Bar**: Pill buttons (All Affinity, language filters) + Sort by dropdown
- **Repo Grid** (3-col bento):
  - Each card: icon, repo name, last modified, description, tech tags, difficulty badge, arrow CTA
  - SVG circular match score meter (gradient stroke) per card
  - Featured "Editor's Choice" card (row-span-2, background image, community affinity bar, contributor avatars, "View Mission Details" CTA)
- **Floating Command Bar**: Glass pill with Refine Stack / Regenerate / Export actions

#### [MODIFY] [DeepAnalysis.jsx](file:///k:/MP2/MP/frontend/src/pages/DeepAnalysis.jsx)
*Matches: `repository_analysis/screen.png`*
- **Repository Header Bento** (2/3 + 1/3):
  - Left: "Open Source" badge, `owner/repo`, repo name (5xl gradient text), description, "View on GitHub" gradient button, stars + forks
  - Right: Code Quality Score donut (SVG circle, score e.g. 85 "EXCEPTIONAL", percentile text)
- **AI Health Analysis**: Lightning icon, italic insight quote, Documentation % + Test Coverage % cards
- **Tech Stack**: Grid of items (icon, name, percentage), binary footprint info
- **Commit Activity**: Bar chart (CSS animated bars), 1M/3M/1Y toggle, COMMITS/DAY label
- **Contribution Opportunities**: Issue cards with colored left border (indigo=Good First Issue, purple=Performance), title, issue #, age, assignee avatars, "Claim Task →" button

#### [MODIFY] [Profile.jsx](file:///k:/MP2/MP/frontend/src/pages/Profile.jsx)
*Matches: `user_profile/screen.png`*
- **Profile Header** (2/3 glass card):
  - Avatar (xl rounded, ring, PRO badge), name (4xl), title (indigo), bio, location/website/join date icons
- **Matchmaker Stats** (1/3 gradient card):
  - 94% Contribution Match Score + 12 Active Repositories + analytics/rocket icons
  - "View Public Profile" button
- **My Skills** (5-col): Removable skill tags (colored borders per language), "+ Add Skill" dashed button, "Manage Skills" edit link
- **Contribution History** (5-col): Timeline with gradient line, dot indicators, PR/review/issue items with repo links
- **Saved Repositories** (7-col): 2x2 grid of repo cards (icon, name, description, language dot, stars, forks, bookmark icon)
- **CTA Banner**: "Looking for more matches?" gradient border card, "Explore Matches" button

#### [MODIFY] [Search.jsx](file:///k:/MP2/MP/frontend/src/pages/Search.jsx)
- Redesign with glassmorphic search bar, filter pills, result cards matching the repo card style

#### [MODIFY] [Saved.jsx](file:///k:/MP2/MP/frontend/src/pages/Saved.jsx)
- Grid of saved repo cards matching user_profile saved repos section style

#### [MODIFY] [Issues.jsx](file:///k:/MP2/MP/frontend/src/pages/Issues.jsx)
- Contribution opportunity cards with colored left borders, difficulty labels, "Claim Task →" actions

#### [MODIFY] [History.jsx](file:///k:/MP2/MP/frontend/src/pages/History.jsx)
- Timeline layout matching user_profile contribution history section

---

### Phase 4: New Feature Pages
3 entirely new pages + full backend support.

#### [NEW] [BulkAnalysis.jsx](file:///k:/MP2/MP/frontend/src/pages/BulkAnalysis.jsx)
*Matches: `bulk_profile_input/screen.png`*
- **Top tabs**: Overview / Recent Batch (active) / Archived
- **Hero**: "Deep Scan Your Talent Pool." — 6xl, gradient "Talent Pool."
- **Textarea**: Glassmorphic container with glow border on focus, monospace font, placeholder with sample usernames
- **Footer bar**: "Supports line breaks or comma-separated" info + "Start Batch Analysis" gradient rocket button
- **Active Queue** widget: Batch name, progress bar (gradient fill with shadow glow), percentage
- **Real-time Logs**: Animated dots (fetching/parsing/queuing) with timestamps
- **Recent Batch History** (4-col bento):
  - Batch cards with icon, name, date, profile count, status tags (High Affinity/Finished/Processing)
  - Processing card with progress bar
  - Total Profiles Scanned stat card (2,840 + trending up)
  - Featured batch card with image + description
  - Export Insights card with "Download All" button
- **Toast notification**: "Analysis Complete" glassmorphic bottom-right

#### [NEW] [Candidates.jsx](file:///k:/MP2/MP/frontend/src/pages/Candidates.jsx)
*Matches: `analyzed_candidates_list/screen.png`*
- **Header**: "Candidate Analysis" (4xl) + "Batch #842 • Q3 Engineering Talent Pipeline"
- **View toggle**: List View (active) / Grid View pill buttons
- **Filters Bento** (4-col):
  - Minimum Match % dropdown (85%+, 70%+, All)
  - Primary Role dropdown (Full Stack, DevOps, Data Scientist)
  - Skill Cluster chips (React, Node)
  - "Advanced Filters" button
- **Column headers**: Candidate Profile / Match Score / Primary Stack / Action
- **Candidate rows** (list view):
  - Avatar (grayscale → color on hover) with status badge (verified/check)
  - Name + @username + location
  - SVG donut match score (94% EXCEPTIONAL / 82% STRONG MATCH / 50% POTENTIAL)
  - Skill tag chips
  - "View Details →" gradient-on-hover button
- **Pagination**: "Showing 1-3 of 128 matched developers" + page buttons
- **Decorative glows**: Absolute positioned blur circles

#### [NEW] [CandidateDetail.jsx](file:///k:/MP2/MP/frontend/src/pages/CandidateDetail.jsx)
*Matches: `candidate_analyzer_v2/screen.png`*
- **Profile Card** (1/3, glassmorphic):
  - Avatar with gradient ring border + "Verified" badge
  - Name (3xl), title (uppercase tracking), Match Quality bar (98% Perfect with glow), "Hire Now" gradient button + bookmark button
- **Technical Depth** (1/3): "Architectural Grade" heading, score donut (82), skill badges (Rust-Expert, WASM-Master, K8s-Native)
- **AI Sentiment Analysis** (1/3, glassmorphic):
  - Psychology icon watermark, italic AI quote, "Growth Vector: Optimized" badge
- **Contribution Matrix** (full width): 4-col grid — Code Velocity (Top 1%), Review Impact (94.2), Mentorship (Gold), Stability (99.8%)
- **Repo Masterpieces** section: "Curated from 84 Repositories" subtitle, 3-col repo cards with icon + name + language + description + stars/forks
- **Floating Command Bar**: Compare / Export / Connect glass pill

---

### Phase 5: Backend & RAG Service Updates
Full backend support for every field in the stitch UI.

#### [NEW] [bulkAnalysisRoutes.js](file:///k:/MP2/MP/backend/src/routes/bulkAnalysisRoutes.js)
- `POST /bulk-analysis/start` — Accept array of GitHub usernames + batch name, start analysis
- `GET /bulk-analysis/batches` — List all batches with status/progress
- `GET /bulk-analysis/batch/:id` — Get batch detail with all candidates
- `GET /bulk-analysis/batch/:id/export` — Export batch results as JSON

#### [NEW] [bulkAnalysisController.js](file:///k:/MP2/MP/backend/src/controllers/bulkAnalysisController.js)
- `startBatch`: Create batch record, iterate usernames → fetch GitHub profiles → compute match scores → store candidates
- `getBatches`: Return all batches with status, profile count, timestamps
- `getBatchDetail`: Return batch + all candidate results
- Fields per candidate: `username, avatar_url, name, location, bio, match_score, match_tier (EXCEPTIONAL/STRONG/POTENTIAL), primary_stack[], code_velocity, review_impact, mentorship_level, stability_score, ai_sentiment, repos[]`

#### [NEW] [candidateRoutes.js](file:///k:/MP2/MP/backend/src/routes/candidateRoutes.js)
- `GET /candidates/:username` — Full candidate profile analysis
- `POST /candidates/:username/analyze` — Trigger deep AI analysis for a candidate

#### [NEW] [candidateController.js](file:///k:/MP2/MP/backend/src/controllers/candidateController.js)
- Fetch GitHub user profile, repos, contribution stats
- Compute: technical depth score, skill badges, contribution matrix metrics
- Call RAG service for AI sentiment analysis
- Return full candidate data matching `candidate_analyzer_v2` UI

#### [NEW] Database migration for batches & candidates
```sql
-- batches table
CREATE TABLE batches (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'processing', -- processing, completed, failed
  total_profiles INT DEFAULT 0,
  processed_profiles INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- batch_candidates table  
CREATE TABLE batch_candidates (
  id SERIAL PRIMARY KEY,
  batch_id INT REFERENCES batches(id),
  username TEXT NOT NULL,
  avatar_url TEXT,
  name TEXT,
  location TEXT,
  bio TEXT,
  match_score FLOAT DEFAULT 0,
  match_tier TEXT, -- EXCEPTIONAL, STRONG_MATCH, POTENTIAL
  primary_stack TEXT[], -- array of tech skills
  code_velocity TEXT,
  review_impact FLOAT,
  mentorship_level TEXT,
  stability_score FLOAT,
  ai_sentiment TEXT,
  top_repos JSONB DEFAULT '[]',
  analyzed_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### [MODIFY] [app.js](file:///k:/MP2/MP/backend/src/app.js)
- Register `/bulk-analysis` and `/candidates` routes
- Update API info endpoint

#### [MODIFY] [profileController.js](file:///k:/MP2/MP/backend/src/controllers/profileController.js)
- Add new endpoint for dashboard stats (health score, active matches, code coverage, network nodes)
- Add contribution history endpoint

#### [MODIFY] [api.js](file:///k:/MP2/MP/frontend/src/services/api.js)
- Add `bulkAnalysisService`: `startBatch()`, `getBatches()`, `getBatch(id)`, `exportBatch(id)`
- Add `candidateService`: `getCandidate(username)`, `analyzeCandidate(username)`
- Add `dashboardService`: `getStats()`, `getRecentSyncs()`

---

## Shared Components

#### [NEW] [MatchScoreDonut.jsx](file:///k:/MP2/MP/frontend/src/components/MatchScoreDonut.jsx)
- Reusable SVG circular progress — props: `score`, `size`, `gradientId`, `tier`

#### [NEW] [StatsCard.jsx](file:///k:/MP2/MP/frontend/src/components/StatsCard.jsx)
- Glass card with colored label, large value, icon circle — props: `label`, `value`, `icon`, `colorClass`

#### [NEW] [GlassCard.jsx](file:///k:/MP2/MP/frontend/src/components/GlassCard.jsx)
- Reusable glassmorphic card wrapper

#### [MODIFY] [RepoCard.jsx](file:///k:/MP2/MP/frontend/src/components/RepoCard.jsx)
- Glassmorphic style, gradient icon, topic tags, match score donut, difficulty badge, arrow CTA

#### [MODIFY] [Loading.jsx](file:///k:/MP2/MP/frontend/src/components/Loading.jsx)
- Gradient spinner matching new palette

#### [MODIFY] [Toast.jsx](file:///k:/MP2/MP/frontend/src/components/Toast.jsx)
- Glassmorphic panel with backdrop blur, icon + text

#### [MODIFY] [Pagination.jsx](file:///k:/MP2/MP/frontend/src/components/Pagination.jsx)
- Dark rounded buttons, active state with primary-container bg

#### [MODIFY] [ErrorMessage.jsx](file:///k:/MP2/MP/frontend/src/components/ErrorMessage.jsx)
- Dark styling with error accent colors

---

## Verification Plan

### Automated Tests
- `npm run build` in frontend — no compilation errors
- `node src/server.js` in backend — all routes register
- Run database migration successfully

### Manual Verification
- Visual comparison of each page against stitch screenshots
- Navigation flow: Landing → Login → Dashboard → all pages
- All existing API integrations work with redesigned pages
- New bulk analysis flow: input usernames → see progress → view candidates
- Responsive behavior: sidebar collapse on mobile
- Floating command bars and FABs work correctly
