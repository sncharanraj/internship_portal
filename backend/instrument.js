// instrument.js - Sentry Initialization
// This must be imported before anything else!

require('dotenv').config();
const Sentry = require("@sentry/node");

// Initialize Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  
  // Set environment (production, development, staging)
  environment: process.env.NODE_ENV || 'development',
  
  // Performance monitoring
  tracesSampleRate: 1.0, // Capture 100% of transactions
  
  // Optional: Add release tracking
  release: process.env.RENDER_GIT_COMMIT,
  
  // Optional: Filter which errors to send
  beforeSend(event, hint) {
    // Don't send errors in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Sentry error (not sent in dev):', hint.originalException);
      return null;
    }
    return event;
  },
});

console.log('✅ Sentry initialized');
console.log('   Environment:', process.env.NODE_ENV);
console.log('   DSN configured:', process.env.SENTRY_DSN ? 'Yes' : 'No');

module.exports = Sentry;
