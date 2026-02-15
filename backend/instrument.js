// instrument.js - Sentry initialization
require('dotenv').config();
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  tracesSampleRate: 1.0,
  // Optional: Add release tracking
  release: process.env.RENDER_GIT_COMMIT || 'development',
});

module.exports = Sentry;
