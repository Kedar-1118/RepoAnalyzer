# Backend - Open Source Matchmaker

Node.js/Express backend server for the Open Source Matchmaker platform.

## 🛠️ Tech Stack

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **Supabase** - PostgreSQL database
- **GitHub OAuth** - Authentication
- **GitHub GraphQL API** - Contribution data
- **JWT** - Token authentication
- **Axios** - HTTP client
- **Winston** - Logging
- **Helmet** - Security headers

## 📦 Installation

Navigate to the Backend directory and install dependencies:

```bash
cd Backend
npm install
```

## ⚙️ Configuration

Create a `.env` file in the `Backend` directory:

```env
PORT=5000
NODE_ENV=development

# Supabase
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
GITHUB_CALLBACK_URL=http://localhost:5000/auth/github/callback

# JWT
JWT_SECRET=your_random_secret_key

# Frontend URL
CLIENT_URL=http://localhost:5173
```

## 🚀 Running the Server

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

Server runs on `http://localhost:5000`

## 📁 Project Structure

```
Backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── database.js   # Supabase client
│   │   └── github.js     # GitHub API config
│   ├── controllers/      # Route controllers
│   │   ├── authController.js
│   │   ├── profileController.js
│   │   ├── recommendationsController.js
│   │   ├── savedController.js
│   │   └── searchController.js
│   ├── middleware/       # Express middleware
│   │   ├── auth.js       # JWT authentication
│   │   └── errorHandler.js
│   ├── routes/           # API routes
│   │   ├── authRoutes.js
│   │   ├── profileRoutes.js
│   │   ├── recommendationsRoutes.js
│   │   ├── savedRoutes.js
│   │   └── searchRoutes.js
│   ├── services/         # Business logic
│   │   ├── githubService.js      # GitHub API integration
│   │   ├── analysisService.js    # Profile analysis
│   │   └── matchService.js       # Repository matching
│   ├── app.js            # Express app setup
│   └── server.js         # Server entry point
├── supabase/
│   └── migrations/       # Database migration files
├── logs/                 # Application logs
├── .env                  # Environment variables (gitignored)
├── .env.example          # Environment variables template
└── package.json          # Project dependencies
```

## 🗄️ Database

The application uses Supabase (PostgreSQL). Apply migrations in this order:

1. **Base Tables**
   ```bash
   # Run: Backend/supabase/migrations/20251202173826_create_users_and_repos_tables.sql
   # in your Supabase SQL editor
   ```

2. **Tech Stack Column**
   ```bash
   # Run: Backend/supabase/migrations/20251205_add_user_techstack.sql
   # in your Supabase SQL editor
   ```

## 📡 API Endpoints

### Authentication
- `POST /auth/github` - Initiate GitHub OAuth flow
- `GET /auth/github/callback` - Handle OAuth callback
- `POST /auth/logout` - Logout user

### Profile
- `GET /profile/summary` - Get user profile with analysis
- `GET /profile/repos` - Get user repositories
- `GET /profile/stats` - Get user statistics
- `GET /profile/contributions` - Get contribution calendar (GraphQL)
- `GET /profile/techstack` - Get user tech stack
- `PUT /profile/techstack` - Update custom tech stack

### Recommendations
- `GET /recommendations` - Get AI-matched repository recommendations

### Search
- `GET /search` - Search repositories with filters

### Saved Repositories
- `GET /saved/list` - List saved repositories
- `POST /saved/add` - Save a repository
- `POST /saved/remove` - Remove saved repository
- `PUT /saved/update` - Update saved repository notes

## 🔐 Authentication Flow

1. Frontend initiates OAuth via `/auth/github`
2. User authorizes on GitHub
3. GitHub redirects to `/auth/github/callback`
4. Backend exchanges code for access token
5. User record created/updated in Supabase
6. JWT token issued to frontend
7. Frontend stores JWT for API requests

## 🔑 GitHub API Integration

### REST API
- User profile data
- Repository information
- Search functionality

### GraphQL API
- Accurate contribution calendar
- Year-long contribution history
- Matches GitHub's native data

## 🛡️ Security

- JWT-based authentication
- CORS protection
- Rate limiting
- Environment variable security
- Helmet.js security headers
- Row Level Security (RLS) in Supabase

## 🐛 Error Handling

All routes include comprehensive error handling:
- Validation errors (400)
- Authentication errors (401)
- Not found errors (404)
- Server errors (500)

## 📊 Logging

Uses `winston` for structured logging:
- Console output in development
- File logging in production (`Backend/logs/`)
- Error tracking
- Request logging

## 🚀 Deployment

See the main [README.md](../README.md) and [DEPLOYMENT.md](../DEPLOYMENT.md) for deployment instructions.

**Recommended Platforms:**
- Render
- Railway
- Heroku

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test
```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 5000) |
| `NODE_ENV` | Environment | No (default: development) |
| `SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service key | Yes |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID | Yes |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth secret | Yes |
| `GITHUB_CALLBACK_URL` | OAuth callback URL | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `CLIENT_URL` | Frontend URL for CORS | Yes |

## 🤝 Contributing

1. Follow existing code style
2. Add proper error handling
3. Update documentation
4. Test your changes

## 📧 Support

For issues, open a GitHub issue or contact the maintainer.

---

[← Back to Main README](../README.md) | [Frontend Documentation →](../frontend/README.md)
