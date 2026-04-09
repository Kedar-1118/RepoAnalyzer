# Frontend - Open Source Matchmaker

React-based frontend for the Open Source Matchmaker platform.

## 🛠️ Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Zustand** - State management
- **React Query** - Data fetching & caching
- **React Router** - Routing
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **Axios** - HTTP client

## 📦 Installation

Navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
```

## ⚙️ Configuration

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000
VITE_GITHUB_CLIENT_ID=your_github_oauth_client_id
```

## 🚀 Running the App

### Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

App runs on `http://localhost:5173`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── RepoCard.jsx
│   │   ├── ThemeToggle.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── ...
│   ├── hooks/           # Custom React hooks
│   │   └── useApi.js    # API integration hooks
│   ├── pages/           # Page components
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Profile.jsx
│   │   ├── Recommendations.jsx
│   │   ├── Search.jsx
│   │   ├── Saved.jsx
│   │   └── History.jsx
│   ├── services/        # API services
│   │   └── api.js       # API client & services
│   ├── store/           # Zustand stores
│   │   ├── authStore.js
│   │   └── themeStore.js
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main app component
│   ├── App.css          # App styles
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── .env                 # Environment variables (gitignored)
├── .env.example         # Environment variables template
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.js    # PostCSS configuration
├── eslint.config.js     # ESLint configuration
└── package.json         # Project dependencies
```

## 🎨 Features

### Landing Page
- Hero section with platform overview
- Feature highlights
- How it works section
- Responsive design

### Authentication
- GitHub OAuth integration
- JWT token management
- Protected routes

### Dashboard
- Profile summary
- Tech stack visualization
- Contribution graphs
- Recent repositories

### Profile
- User information
- Repository management
- Custom tech stack
- Contribution insights

### Recommendations
- AI-powered suggestions
- Match scoring
- Save/unsave functionality

### Search
- Advanced filters
- Real-time results
- Multi-criteria search

### Saved Repositories
- Bookmarked projects
- Quick management
- Delete functionality

### History
- Contribution heatmap
- Activity statistics
- GitHub sync

## 🎨 Theming

### Dark/Light Mode
The app supports both dark and light themes:
- Persisted to localStorage
- Smooth transitions
- Consistent across pages

### Tailwind Configuration
Custom theme colors defined in `tailwind.config.js`:
- Light theme colors
- Dark theme colors
- Custom utilities

## 🔗 API Integration

### React Query
All API calls use React Query for:
- Automatic caching
- Background refetching
- Optimistic updates
- Error handling

### API Services
Organized in `src/services/api.js`:
- `authService` - Authentication
- `profileService` - User profile
- `recommendationsService` - Recommendations
- `searchService` - Repository search
- `savedService` - Saved repositories

### Custom Hooks
Hooks in `src/hooks/useApi.js`:
- `useProfileSummary()`
- `useProfileRepos()`
- `useProfileStats()`
- `useProfileContributions()`
- `useRecommendations()`
- `useSearchRepos()`
- `useSavedRepos()`
- `useAddSavedRepo()`
- `useRemoveSavedRepo()`

## 🛡️ State Management

### Zustand Stores

**authStore.js** - Authentication state
```javascript
- user
- isAuthenticated
- setAuth()
- logout()
```

**themeStore.js** - Theme preferences
```javascript
- theme
- toggleTheme()
- setTheme()
```

## 🛣️ Routing

Protected routes require authentication:
- `/dashboard`
- `/profile`
- `/recommendations`
- `/search`
- `/saved`
- `/history`

Public routes:
- `/` - Landing page
- `/login` - Login page
- `/auth/callback` - OAuth callback

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints:
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px
  - `2xl`: 1536px

## 🧩 Component Library

### Core Components
- `Navbar` - Navigation bar
- `RepoCard` - Repository card
- `ThemeToggle` - Dark/light mode toggle
- `ProtectedRoute` - Auth guard

### Page Components
Each page is a standalone component with its own logic and styling.

## 🚀 Deployment

See the main [README.md](../README.md) and [DEPLOYMENT.md](../DEPLOYMENT.md) for deployment instructions.

**Recommended Platforms:**
- Vercel
- Netlify
- Cloudflare Pages

### Vercel Deploy
```bash
vercel --prod
```

### Netlify Deploy
```bash
netlify deploy --prod
```

## 🔧 Build Configuration

### Vite Config
- Fast HMR (Hot Module Replacement)
- Optimized builds
- Asset optimization
- Code splitting

### Environment Variables
Access via `import.meta.env`:
```javascript
const API_URL = import.meta.env.VITE_API_URL;
const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
```

## 📝 Code Style

- ESLint for linting
- Prettier for formatting
- Consistent naming conventions
- Component organization

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test
```

## 🎯 Best Practices

1. **Component Organization**
   - One component per file
   - PropTypes or TypeScript
   - Descriptive naming

2. **State Management**
   - Use React Query for server state
   - Use Zustand for global UI state
   - Local state for component-only data

3. **Performance**
   - Code splitting with React.lazy
   - Memoization where needed
   - Optimized images

4. **Accessibility**
   - Semantic HTML
   - ARIA labels
   - Keyboard navigation

## 🤝 Contributing

1. Follow existing code style
2. Add proper prop validation
3. Update documentation
4. Test responsive design

## 📧 Support

For issues, open a GitHub issue or contact the maintainer.

---

[← Back to Main README](../README.md) | [Backend Documentation →](../Backend/README.md)
