require('dotenv').config();
const Sentry = require("@sentry/node");

// Initialize Sentry FIRST
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  tracesSampleRate: 1.0,
});

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const Application = require('./models/Application');
const { sendStudentEmail, sendAdminEmail } = require('./services/emailService');

const app = express();

// Security Middleware
app.use(helmet());

// Sentry handlers - MUST be early in middleware chain
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// CORS Configuration - Allow all Vercel deployments
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (origin.includes('localhost')) return callback(null, true);
    if (origin.includes('vercel.app')) return callback(null, true);
    console.log('❌ CORS blocked origin:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});

const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 5 : 100,
  message: 'Too many applications submitted. Please try again later.'
});

app.use('/api/', limiter);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

// Enhanced Health Check Route
app.get('/api/health', async (req, res) => {
  const healthcheck = {
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    database: 'checking...'
  };

  try {
    await mongoose.connection.db.admin().ping();
    healthcheck.database = 'connected';
  } catch (error) {
    healthcheck.status = 'error';
    healthcheck.database = 'disconnected';
  }

  const statusCode = healthcheck.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(healthcheck);
});

// Validation Rules
const applicationValidation = [
  body('fullName').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2-100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
  body('phone').matches(/^[0-9]{10}$/).withMessage('Phone must be 10 digits'),
  body('university').trim().notEmpty().withMessage('University is required'),
  body('degree').trim().notEmpty().withMessage('Degree is required'),
  body('major').trim().notEmpty().withMessage('Major is required'),
  body('graduationYear').isInt({ min: 2024, max: 2030 }).withMessage('Invalid graduation year'),
  body('cgpa').isFloat({ min: 0, max: 10 }).withMessage('CGPA must be between 0-10'),
  body('preferredDomain').isIn(['Web Development', 'Mobile Development', 'Data Science', 'Machine Learning', 'DevOps', 'Cloud Computing', 'Cybersecurity', 'UI/UX Design', 'Other']).withMessage('Invalid domain'),
  body('skills').isArray({ min: 1 }).withMessage('At least one skill is required'),
  body('resumeLink').optional({ checkFalsy: true }).trim().isURL().withMessage('Invalid resume URL'),
  body('githubProfile').optional({ checkFalsy: true }).trim().isURL().withMessage('Invalid GitHub URL'),
  body('linkedinProfile').optional({ checkFalsy: true }).trim().isURL().withMessage('Invalid LinkedIn URL'),
  body('coverLetter').optional({ checkFalsy: true }).trim().isLength({ max: 1000 }).withMessage('Cover letter too long')
];

// Submit Application Route
app.post('/api/applications', submitLimiter, applicationValidation, async (req, res) => {
  try {
    console.log('📥 Received application submission');
    console.log('📋 Data:', JSON.stringify(req.body, null, 2));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const existingApplication = await Application.findOne({ email: req.body.email });
    if (existingApplication) {
      console.log('❌ Duplicate email:', req.body.email);
      return res.status(409).json({
        success: false,
        message: 'An application with this email already exists'
      });
    }

    const application = new Application(req.body);
    await application.save();
    console.log('✅ Application saved to database');
    console.log('📧 Application ID:', application._id);

    console.log('📧 Starting email sending process...');
    console.log('📧 Student email:', application.email);
    console.log('📧 Admin email:', process.env.ADMIN_EMAIL);

    Promise.all([
      sendStudentEmail(application.email, application.fullName, application._id)
        .then((result) => {
          console.log('✅ Student email sent successfully!');
          console.log('   To:', application.email);
          console.log('   Message ID:', result.messageId);
          return result;
        })
        .catch((err) => {
          console.error('❌ Student email FAILED:', err.message);
          console.error('   Full error:', err);
          return null;
        }),

      sendAdminEmail(application)
        .then((result) => {
          console.log('✅ Admin email sent successfully!');
          console.log('   To:', process.env.ADMIN_EMAIL);
          console.log('   Message ID:', result.messageId);
          return result;
        })
        .catch((err) => {
          console.error('❌ Admin email FAILED:', err.message);
          console.error('   Full error:', err);
          return null;
        })
    ]).then((results) => {
      console.log('✅ Email process completed');
      const successCount = results.filter(r => r !== null).length;
      console.log(`   ${successCount}/2 emails sent successfully`);
    }).catch(err => {
      console.error('❌ Email sending error:', err.message);
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully! Check your email for confirmation.',
      applicationId: application._id
    });

  } catch (error) {
    console.error('❌ Application submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get Application Statistics
app.get('/api/applications/stats', async (req, res) => {
  try {
    const total = await Application.countDocuments();
    const pending = await Application.countDocuments({ status: 'pending' });
    const accepted = await Application.countDocuments({ status: 'accepted' });
    const rejected = await Application.countDocuments({ status: 'rejected' });

    res.json({
      success: true,
      stats: { total, pending, accepted, rejected }
    });
  } catch (error) {
    console.error('❌ Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
});

// Get All Applications
app.get('/api/applications', async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = status ? { status } : {};

    const applications = await Application.find(query)
      .sort({ submittedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');

    const total = await Application.countDocuments(query);

    res.json({
      success: true,
      applications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('❌ Fetch applications error:', error);
    res.status(false).json({
      success: false,
      message: 'Failed to fetch applications'
    });
  }
});

// Test error endpoint for Sentry
app.get('/api/test-error', (req, res) => {
  console.log('🧪 Test error endpoint triggered');
  throw new Error('🧪 Sentry Test Error - If you see this in Sentry, it works!');
});

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Sentry error handler - MUST be before other error handlers
app.use(Sentry.Handlers.errorHandler());

// Your error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS enabled for Vercel deployments and localhost`);
});

module.exports = app;
