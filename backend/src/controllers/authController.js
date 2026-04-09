const axios = require('axios');
const jwt = require('jsonwebtoken');
const supabase = require('../config/database');
const githubConfig = require('../config/github');

class AuthController {
  async initiateGitHubAuth(req, res) {
    try {
      const scope = githubConfig.scope.join(' ');
      const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubConfig.clientId}&scope=${scope}&redirect_uri=${githubConfig.callbackURL}`;

      res.json({ authUrl: githubAuthUrl });
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
      const { data: existingUser, error: existingError } = await supabase
        .from('users')
        .select('*')
        .eq('github_id', githubUser.id.toString())
        .maybeSingle();

      if (existingError) {
        console.error('Error checking existing user:', existingError);
        throw existingError;
      }

      let user;

      if (existingUser) {
        // 4a. Update existing user
        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update({
            github_access_token: githubAccessToken,
            github_username: githubUser.login,
            github_email: githubUser.email,
            avatar_url: githubUser.avatar_url,
            updated_at: new Date().toISOString(),
          })
          .eq('github_id', githubUser.id.toString())
          .select()
          .single();

        if (updateError) {
          console.error('Error updating user:', updateError);
          throw updateError;
        }

        user = updatedUser;
      } else {
        // 4b. Insert new user
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert({
            github_id: githubUser.id.toString(),
            github_username: githubUser.login,
            github_email: githubUser.email,
            github_access_token: githubAccessToken,
            avatar_url: githubUser.avatar_url,
            profile_data: {},
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error inserting user:', insertError);
          throw insertError;
        }

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
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Prepare user data for frontend
      const userData = {
        id: user.id,
        github_id: user.github_id,
        github_username: user.github_username,
        github_email: user.github_email,
        avatar_url: user.avatar_url,
        created_at: user.created_at
      };

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const encodedUserData = encodeURIComponent(JSON.stringify(userData));
      res.redirect(`${frontendUrl}/auth/callback?token=${jwtToken}&user=${encodedUserData}`);
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
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Logout failed' });
    }
  }

  async verifyToken(req, res) {
    try {
      const user = req.user;

      const { data: userData } = await supabase
        .from('users')
        .select('id, github_id, github_username, github_email, avatar_url, created_at')
        .eq('id', user.userId)
        .single();

      res.json({ user: userData });
    } catch (error) {
      res.status(401).json({ error: 'Token verification failed' });
    }
  }
}

module.exports = new AuthController();
