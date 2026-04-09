class AnalysisService {
  analyzeUserProfile(repos, events) {
    const techStack = this.analyzeTechStack(repos);
    const activityScore = this.calculateActivityScore(repos, events);
    const domains = this.identifyDomains(repos);
    const skillStrength = this.calculateSkillStrength(repos, techStack);

    return {
      techStack,
      activityScore,
      domains,
      skillStrength,
      totalRepos: repos.length,
      totalStars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
      totalForks: repos.reduce((sum, repo) => sum + repo.forks_count, 0)
    };
  }

  analyzeTechStack(repos) {
    const languageStats = {};
    let totalBytes = 0;

    repos.forEach(repo => {
      if (repo.language) {
        languageStats[repo.language] = (languageStats[repo.language] || 0) + 1;
        totalBytes += repo.size || 0;
      }
    });

    const sortedLanguages = Object.entries(languageStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    return sortedLanguages.map(([language, count]) => ({
      language,
      repoCount: count,
      percentage: ((count / repos.length) * 100).toFixed(2)
    }));
  }

  calculateActivityScore(repos, events) {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const recentRepos = repos.filter(repo => {
      const updatedAt = new Date(repo.updated_at);
      return updatedAt > thirtyDaysAgo;
    });

    const recentEvents = events.filter(event => {
      const createdAt = new Date(event.created_at);
      return createdAt > thirtyDaysAgo;
    });

    const score = Math.min(
      100,
      (recentRepos.length * 5) + (recentEvents.length * 2)
    );

    return {
      score: Math.round(score),
      recentRepos: recentRepos.length,
      recentEvents: recentEvents.length,
      contributionDays: this.countUniqueDays(events)
    };
  }

  countUniqueDays(events) {
    const days = new Set();
    events.forEach(event => {
      const date = new Date(event.created_at).toDateString();
      days.add(date);
    });
    return days.size;
  }

  identifyDomains(repos) {
    const domainKeywords = {
      web: ['web', 'frontend', 'backend', 'fullstack', 'react', 'vue', 'angular', 'node', 'express'],
      mobile: ['mobile', 'android', 'ios', 'react-native', 'flutter', 'swift', 'kotlin'],
      ai: ['ai', 'machine-learning', 'deep-learning', 'neural', 'tensorflow', 'pytorch'],
      blockchain: ['blockchain', 'crypto', 'web3', 'ethereum', 'solidity', 'smart-contract'],
      gamedev: ['game', 'unity', 'unreal', 'godot', 'gaming'],
      devops: ['devops', 'docker', 'kubernetes', 'ci-cd', 'terraform', 'ansible'],
      datascience: ['data-science', 'data-analysis', 'pandas', 'numpy', 'jupyter'],
      security: ['security', 'cybersecurity', 'penetration', 'encryption']
    };

    const domainCounts = {};

    repos.forEach(repo => {
      const searchText = `${repo.name} ${repo.description || ''} ${(repo.topics || []).join(' ')}`.toLowerCase();

      Object.entries(domainKeywords).forEach(([domain, keywords]) => {
        const matches = keywords.some(keyword => searchText.includes(keyword));
        if (matches) {
          domainCounts[domain] = (domainCounts[domain] || 0) + 1;
        }
      });
    });

    return Object.entries(domainCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([domain, count]) => ({
        domain,
        repoCount: count
      }));
  }

  calculateSkillStrength(repos, techStack) {
    const skills = {};

    techStack.forEach(({ language, repoCount, percentage }) => {
      const totalStars = repos
        .filter(repo => repo.language === language)
        .reduce((sum, repo) => sum + repo.stargazers_count, 0);

      const avgStars = repoCount > 0 ? totalStars / repoCount : 0;

      const score = Math.min(
        100,
        (parseInt(percentage) * 0.5) + (avgStars * 2) + (repoCount * 3)
      );

      skills[language] = Math.round(score);
    });

    return skills;
  }

  analyzeRepository(repo) {
    const recencyScore = this.calculateRecencyScore(repo.updated_at);
    const popularityScore = this.calculatePopularityScore(
      repo.stargazers_count,
      repo.forks_count,
      repo.watchers_count
    );
    const contributorFriendliness = this.assessContributorFriendliness(repo);

    return {
      recencyScore,
      popularityScore,
      contributorFriendliness,
      overallScore: (recencyScore * 0.3 + popularityScore * 0.3 + contributorFriendliness * 0.4)
    };
  }

  calculateRecencyScore(updatedAt) {
    const now = new Date();
    const updated = new Date(updatedAt);
    const daysSinceUpdate = (now - updated) / (1000 * 60 * 60 * 24);

    if (daysSinceUpdate < 7) return 100;
    if (daysSinceUpdate < 30) return 80;
    if (daysSinceUpdate < 90) return 60;
    if (daysSinceUpdate < 180) return 40;
    if (daysSinceUpdate < 365) return 20;
    return 10;
  }

  calculatePopularityScore(stars, forks, watchers) {
    const starScore = Math.min(50, Math.log10(stars + 1) * 10);
    const forkScore = Math.min(30, Math.log10(forks + 1) * 10);
    const watcherScore = Math.min(20, Math.log10(watchers + 1) * 10);

    return Math.round(starScore + forkScore + watcherScore);
  }

  assessContributorFriendliness(repo) {
    let score = 0;

    if (repo.has_issues) score += 20;
    if (repo.open_issues_count > 0) score += 20;
    if (repo.has_wiki) score += 10;

    const description = (repo.description || '').toLowerCase();
    if (description.includes('beginner') || description.includes('first-time')) score += 15;
    if (description.includes('contribution') || description.includes('contributor')) score += 15;

    const topics = (repo.topics || []).map(t => t.toLowerCase());
    if (topics.includes('good-first-issue')) score += 20;
    if (topics.includes('help-wanted')) score += 15;
    if (topics.includes('hacktoberfest')) score += 10;

    return Math.min(100, score);
  }
}

module.exports = AnalysisService;
