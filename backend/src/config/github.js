module.exports = {
  clientId: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL,
  scope: ['read:user', 'user:email', 'repo', 'read:org'],
  baseURL: 'https://api.github.com',
  graphqlURL: 'https://api.github.com/graphql'
};
