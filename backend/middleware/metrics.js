const promClient = require('prom-client');

// Create a Registry
const register = new promClient.Registry();

// Add default metrics
promClient.collectDefaultMetrics({ register });

// ========== HTTP Metrics ==========
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

const httpRequestTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

// ========== Application Business Metrics ==========

// Total applications submitted
const applicationsTotal = new promClient.Counter({
  name: 'applications_submitted_total',
  help: 'Total number of applications submitted',
  labelNames: ['domain', 'university', 'degree']
});

// Applications by status
const applicationsByStatus = new promClient.Gauge({
  name: 'applications_by_status',
  help: 'Number of applications by status',
  labelNames: ['status']
});

// Applications by domain
const applicationsByDomain = new promClient.Gauge({
  name: 'applications_by_domain',
  help: 'Number of applications by preferred domain',
  labelNames: ['domain']
});

// CGPA distribution
const cgpaDistribution = new promClient.Histogram({
  name: 'application_cgpa',
  help: 'CGPA distribution of applicants',
  buckets: [5, 6, 7, 7.5, 8, 8.5, 9, 9.5, 10]
});

// Graduation year distribution
const graduationYearGauge = new promClient.Gauge({
  name: 'applications_by_graduation_year',
  help: 'Number of applications by graduation year',
  labelNames: ['year']
});

// Email success/failure
const emailsStatus = new promClient.Counter({
  name: 'emails_sent_total',
  help: 'Total emails sent (student and admin)',
  labelNames: ['type', 'status'] // type: student/admin, status: success/failure
});

// Form errors
const formErrors = new promClient.Counter({
  name: 'form_validation_errors_total',
  help: 'Total form validation errors',
  labelNames: ['field']
});

// Register all metrics
register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);
register.registerMetric(applicationsTotal);
register.registerMetric(applicationsByStatus);
register.registerMetric(applicationsByDomain);
register.registerMetric(cgpaDistribution);
register.registerMetric(graduationYearGauge);
register.registerMetric(emailsStatus);
register.registerMetric(formErrors);

// ========== Middleware ==========
const metricsMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path;
    
    httpRequestDuration.labels(req.method, route, res.statusCode).observe(duration);
    httpRequestTotal.labels(req.method, route, res.statusCode).inc();
  });
  
  next();
};

// ========== Helper Functions ==========

// Track application submission
const trackApplicationSubmission = (application) => {
  // Increment total applications
  applicationsTotal.labels(
    application.preferredDomain,
    application.university,
    application.degree
  ).inc();
  
  // Track CGPA
  cgpaDistribution.observe(parseFloat(application.cgpa));
};

// Track email status
const trackEmailStatus = (type, status) => {
  emailsStatus.labels(type, status).inc();
};

// Track form validation error
const trackFormError = (field) => {
  formErrors.labels(field).inc();
};

// Update aggregate metrics (call this periodically or on-demand)
const updateAggregateMetrics = async (Application) => {
  try {
    // Count by status
    const statusCounts = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    statusCounts.forEach(({ _id, count }) => {
      applicationsByStatus.labels(_id).set(count);
    });
    
    // Count by domain
    const domainCounts = await Application.aggregate([
      { $group: { _id: '$preferredDomain', count: { $sum: 1 } } }
    ]);
    
    domainCounts.forEach(({ _id, count }) => {
      applicationsByDomain.labels(_id).set(count);
    });
    
    // Count by graduation year
    const yearCounts = await Application.aggregate([
      { $group: { _id: '$graduationYear', count: { $sum: 1 } } }
    ]);
    
    yearCounts.forEach(({ _id, count }) => {
      graduationYearGauge.labels(_id.toString()).set(count);
    });
    
  } catch (error) {
    console.error('Error updating aggregate metrics:', error);
  }
};

module.exports = {
  register,
  metricsMiddleware,
  trackApplicationSubmission,
  trackEmailStatus,
  trackFormError,
  updateAggregateMetrics
};
