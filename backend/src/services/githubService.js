// services/githubService.js
const axios = require('axios');
const githubConfig = require('../config/github');

/**
 * GitHubService
 * - Wraps GitHub REST API calls
 * - Uses a personal access token / OAuth token for auth
 */
class GitHubService {
  /**
   * @param {string} accessToken - GitHub OAuth access token
   * @param {string} [username] - GitHub username (optional, but useful for events)
   */
  constructor(accessToken, username = null) {
    this.accessToken = accessToken;
    this.username = username;
    this.headers = {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github.v3+json'
    };
    this.graphqlURL = 'https://api.github.com/graphql'; // Add GraphQL endpoint
  }

  /**
   * Fetch the authenticated user's profile.
   */
  async getUserProfile() {
    try {
      const response = await axios.get(`${githubConfig.baseURL}/user`, {
        headers: this.headers
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch user profile: ${error.message}`);
    }
  }

  /**
   * Fetch all repositories owned by the authenticated user (paginated).
   */
  async getUserRepositories() {
    try {
      const repos = [];
      let page = 1;
      let hasMore = true;

      console.log('[GitHubService] Fetching user repositories...');

      while (hasMore && page <= 10) {
        const response = await axios.get(`${githubConfig.baseURL}/user/repos`, {
          headers: this.headers,
          params: {
            per_page: 100,
            page,
            sort: 'updated',
            affiliation: 'owner'
          }
        });

        console.log(`[GitHubService] Page ${page}: Fetched ${response.data.length} repos`);
        repos.push(...response.data);
        hasMore = response.data.length === 100;
        page += 1;
      }

      console.log(`[GitHubService] Total repositories fetched: ${repos.length}`);
      return repos;
    } catch (error) {
      console.error('[GitHubService] Error fetching repositories:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      throw new Error(`Failed to fetch repositories: ${error.message}`);
    }
  }

  /**
   * Fetch recent public contribution events for the user.
   * - Uses /users/:username/events/public
   * - Returns [] on 404 or if no events instead of throwing.
   */
  async getUserContributionActivity() {
    try {
      let username = this.username;

      // If username not passed into constructor, fetch it from /user
      if (!username) {
        console.log('[GitHubService] Fetching username from /user...');
        const meRes = await axios.get(`${githubConfig.baseURL}/user`, {
          headers: this.headers
        });
        username = meRes.data.login;
        console.log(`[GitHubService] Username: ${username}`);
      }

      console.log(`[GitHubService] Fetching events for user: ${username}`);
      const response = await axios.get(
        `${githubConfig.baseURL}/users/${username}/events/public`,
        {
          headers: this.headers,
          params: { per_page: 100 }
        }
      );

      console.log(`[GitHubService] Fetched ${response.data.length} events`);
      return response.data;
    } catch (error) {
      // If user has no events or endpoint returns 404, treat as "no events"
      if (error.response && error.response.status === 404) {
        console.warn('[GitHubService] No public events found (404), returning empty array');
        return [];
      }

      console.error('[GitHubService] Error fetching user events:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      // Fallback to empty array so analysis still works
      return [];
    }
  }

  /**
   * Fetch contribution calendar using GraphQL API
   * This provides accurate contribution counts for the past year
   */
  async getContributionCalendar(username = null) {
    try {
      // Get username if not provided
      let targetUsername = username || this.username;
      if (!targetUsername) {
        console.log('[GitHubService] Fetching username from /user...');
        const meRes = await axios.get(`${githubConfig.baseURL}/user`, {
          headers: this.headers
        });
        targetUsername = meRes.data.login;
      }

      console.log(`[GitHubService/GraphQL] Fetching contribution calendar for: ${targetUsername}`);

      // Calculate date range for last year
      const to = new Date();
      const from = new Date();
      from.setFullYear(from.getFullYear() - 1);

      const query = `
        query($username: String!, $from: DateTime!, $to: DateTime!) {
          user(login: $username) {
            contributionsCollection(from: $from, to: $to) {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    contributionCount
                    date
                  }
                }
              }
            }
          }
        }
      `;

      const response = await axios.post(
        this.graphqlURL,
        {
          query,
          variables: {
            username: targetUsername,
            from: from.toISOString(),
            to: to.toISOString()
          }
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.errors) {
        throw new Error(`GraphQL Error: ${JSON.stringify(response.data.errors)}`);
      }

      const calendar = response.data.data?.user?.contributionsCollection?.contributionCalendar;

      if (!calendar) {
        console.warn('[GitHubService/GraphQL] No contribution calendar data found');
        return { totalContributions: 0, contributionsByDate: {} };
      }

      // Transform GraphQL response into date-keyed object
      const contributionsByDate = {};
      calendar.weeks.forEach(week => {
        week.contributionDays.forEach(day => {
          contributionsByDate[day.date] = day.contributionCount;
        });
      });

      console.log(`[GitHubService/GraphQL] Fetched ${calendar.totalContributions} total contributions across ${Object.keys(contributionsByDate).length} days`);

      return {
        totalContributions: calendar.totalContributions,
        contributionsByDate
      };
    } catch (error) {
      console.error('[GitHubService/GraphQL] Error fetching contribution calendar:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(`Failed to fetch contribution calendar: ${error.message}`);
    }
  }

  /**
   * Search repositories with optional filters.
   */
  async searchRepositories(query, filters = {}) {
    try {
      const searchParams = [];

      if (filters.language) {
        searchParams.push(`language:${filters.language}`);
      }
      if (filters.topics && filters.topics.length > 0) {
        filters.topics.forEach(topic => searchParams.push(`topic:${topic}`));
      }
      if (filters.minStars) {
        searchParams.push(`stars:>=${filters.minStars}`);
      }
      if (filters.goodFirstIssue) {
        searchParams.push('good-first-issues:>0');
      }
      if (filters.helpWanted) {
        searchParams.push('help-wanted-issues:>0');
      }

      const q = query
        ? `${query} ${searchParams.join(' ')}`
        : searchParams.join(' ');

      const response = await axios.get(
        `${githubConfig.baseURL}/search/repositories`,
        {
          headers: this.headers,
          params: {
            q: q || 'stars:>100',
            sort: filters.sort || 'stars',
            order: 'desc',
            per_page: filters.limit || 30
          }
        }
      );

      return response.data.items;
    } catch (error) {
      throw new Error(`Failed to search repositories: ${error.message}`);
    }
  }

  /**
   * Fetch full details, languages, and beginner issues for a repo.
   */
  async getRepositoryDetails(owner, repo) {
    try {
      const [repoData, languages, issues] = await Promise.all([
        axios.get(`${githubConfig.baseURL}/repos/${owner}/${repo}`, {
          headers: this.headers
        }),
        axios.get(`${githubConfig.baseURL}/repos/${owner}/${repo}/languages`, {
          headers: this.headers
        }),
        axios.get(`${githubConfig.baseURL}/repos/${owner}/${repo}/issues`, {
          headers: this.headers,
          params: {
            state: 'open',
            labels: 'good first issue,help wanted',
            per_page: 10
          }
        })
      ]);

      return {
        ...repoData.data,
        languages: languages.data,
        beginner_issues: issues.data
      };
    } catch (error) {
      throw new Error(`Failed to fetch repository details: ${error.message}`);
    }
  }

  /**
   * Fetch open issues for a repo, optionally filtered by labels.
   */
  async getRepositoryIssues(owner, repo, labels = null) {
    try {
      const url = `${githubConfig.baseURL}/repos/${owner}/${repo}/issues?state=open&per_page=100`;

      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Accept': 'application/vnd.github+json'
        }
      });

      if (response.status !== 200) {
        console.error(`[GitHubService] Error fetching issues: ${response.status}`, response.statusText);
        return [];
      }

      const issues = response.data;

      // Filter out PRs
      const filteredIssues = issues.filter(issue => !issue.pull_request);

      console.log(`[GitHubService] Fetched ${filteredIssues.length} issues from ${owner}/${repo}`);

      return filteredIssues;
    } catch (error) {
      console.error(`[GitHubService] Error fetching issues from ${owner}/${repo}:`, error.message);
      return []; // Return empty array instead of throwing to prevent cascading failures
    }
  }
}

module.exports = GitHubService;
