const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const logger = require('./config/logger');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const searchRoutes = require('./routes/searchRoutes');
const savedRoutes = require('./routes/savedRoutes');
const issueRoutes = require('./routes/issueRoutes');
const analyzeRoutes = require('./routes/analyzeRoutes');

const app = express();

app.use(helmet());

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);

app.get('/', (req, res) => {
  res.json({
    message: 'Open Source Matchmaker API',
    version: '1.0.0',
    endpoints: {
      auth: '/auth',
      profile: '/profile',
      recommendations: '/recommend',
      search: '/search',
      saved: '/saved',
      issues: '/issues',
      analyze: '/analyze'
    }
  });
});

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/recommend', recommendationRoutes);
app.use('/search', searchRoutes);
app.use('/saved', savedRoutes);
app.use('/issues', issueRoutes);
app.use('/analyze', analyzeRoutes);

app.use((err, req, res, next) => {
  logger.error('Unhandled error:', { error: err.message, stack: err.stack });
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;
