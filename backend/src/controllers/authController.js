const axios = require('axios');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const githubConfig = require('../config/github');

// Cookie options — shared between set & clear
const COOKIE_OPTIONS = {
  httpOnly: true,                                       // JS cannot read it
  secure: process.env.NODE_ENV === 'production',        // HTTPS only in prod
  sameSite: 'lax',                                      // CSRF protection
  path: '/',                                            // available on all routes
  maxAge: 7 * 24 * 60 * 60 * 1000,                     // 7 days (matches JWT expiry)
};

class AuthController {
  async initiateGitHubAuth(req, res) {
    try {
      const scope = githubConfig.scope.join(' ');
      const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubConfig.clientId}&scope=${scope}&redirect_uri=${githubConfig.callbackURL}`;

      res.redirect(githubAuthUrl);
    } catch (error) {
      console.error('Error initiating GitHub auth:', error);
      res.status(500).json({ error: 'Failed to initiate GitHub authentication' });
    }
  }

  async handleGitHubCallback(req, res) {
    try {
      const { code } = req.query;

      if (!code) {
        return res.status(400).json({ error: 'Authorization code is required' });
      }

      // 1. Exchange code for token
      const tokenResponse = await axios.post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: githubConfig.clientId,
          client_secret: githubConfig.clientSecret,
          code,
          redirect_uri: githubConfig.callbackURL,
        },
        {
          headers: { Accept: 'application/json' },
        }
      );

      const githubAccessToken = tokenResponse.data.access_token;

      if (!githubAccessToken) {
        console.error('GitHub token response:', tokenResponse.data);
        return res
          .status(400)
          .json({ error: 'Failed to obtain access token from GitHub' });
      }

      // 2. Get GitHub user
      const userResponse = await axios.get('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${githubAccessToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      const githubUser = userResponse.data;
      console.log('GitHub user:', githubUser);

      // 3. Check existing user
      const { rows: existingUsers } = await pool.query(
        'SELECT * FROM users WHERE github_id = $1',
        [githubUser.id.toString()]
      );

      const existingUser = existingUsers[0];

      let user;

      if (existingUser) {
        // 4a. Update existing user
        const updateQuery = `
          UPDATE users 
          SET github_access_token = $1, 
              github_username = $2, 
              github_email = $3, 
              avatar_url = $4, 
              updated_at = $5 
          WHERE github_id = $6 
          RETURNING *
        `;
        const { rows: updatedUsers } = await pool.query(updateQuery, [
          githubAccessToken,
          githubUser.login,
          githubUser.email,
          githubUser.avatar_url,
          new Date().toISOString(),
          githubUser.id.toString()
        ]);

        const updatedUser = updatedUsers[0];

        user = updatedUser;
      } else {
        // 4b. Insert new user
        const insertQuery = `
          INSERT INTO users 
          (github_id, github_username, github_email, github_access_token, avatar_url, profile_data) 
          VALUES ($1, $2, $3, $4, $5, $6) 
          RETURNING *
        `;
        const { rows: newUsers } = await pool.query(insertQuery, [
          githubUser.id.toString(),
          githubUser.login,
          githubUser.email,
          githubAccessToken,
          githubUser.avatar_url,
          '{}'
        ]);

        const newUser = newUsers[0];

        user = newUser;
      }

      // 5. Final guard
      if (!user) {
        console.error('User is null after upsert!');
        throw new Error('Failed to create or fetch user');
      }

      // 6. Create JWT
      const jwtToken = jwt.sign(
        {
          userId: user.id,
          githubId: user.github_id,
          username: user.github_username,
          role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // 7. Set httpOnly cookie with the JWT
      res.cookie('session_token', jwtToken, COOKIE_OPTIONS);

      // Prepare user data for frontend (sent via URL so the SPA can hydrate state)
      const userData = {
        id: user.id,
        github_id: user.github_id,
        github_username: user.github_username,
        github_email: user.github_email,
        avatar_url: user.avatar_url,
        created_at: user.created_at,
        role: user.role
      };

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const encodedUserData = encodeURIComponent(JSON.stringify(userData));
      res.redirect(`${frontendUrl}/auth/callback?user=${encodedUserData}`);
    } catch (error) {
      console.error('GitHub callback error:', error);
      if (error.response) {
        console.error('GitHub API error response:', error.response.data);
      }
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(
        `${frontendUrl}/auth/callback?error=${encodeURIComponent(error.message)}`
      );
    }
  }


  async logout(req, res) {
    try {
      // Clear the session cookie — this is the actual logout
      res.clearCookie('session_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Logout failed' });
    }
  }

  async verifyToken(req, res) {
    try {
      const user = req.user;

      const { rows } = await pool.query(
        'SELECT id, github_id, github_username, github_email, avatar_url, created_at, role FROM users WHERE id = $1',
        [user.userId]
      );
      const userData = rows[0];

      res.json({ user: userData });
    } catch (error) {
      res.status(401).json({ error: 'Token verification failed' });
    }
  }
}

module.exports = new AuthController();
