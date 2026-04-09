const app = require('./app');
const logger = require('./config/logger');

const PORT = process.env.PORT || 3000;

// Check for required environment variables
const requiredEnvVars = [
  'GITHUB_CLIENT_ID',
  'GITHUB_CLIENT_SECRET',
  'GITHUB_CALLBACK_URL',
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  logger.warn('Missing required environment variables:', { missing: missingEnvVars });
  logger.warn('GitHub authentication and other features may not work correctly.');
}

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
