const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  applicationId: {
    type: String,
    unique: true,
    sparse: true
  },
  // Personal Information
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  },
  
  // Educational Information
  university: {
    type: String,
    required: true,
    trim: true
  },
  degree: {
    type: String,
    required: true,
    trim: true
  },
  major: {
    type: String,
    required: true,
    trim: true
  },
  graduationYear: {
    type: Number,
    required: true
  },
  cgpa: {
    type: Number,
    required: true
  },
  
  // Internship Preferences
  preferredDomain: {
    type: String,
    required: true,
    enum: ['Web Development', 'Mobile Development', 'Data Science', 'Machine Learning', 'DevOps', 'Cloud Computing', 'Cybersecurity', 'UI/UX Design', 'Other']
  },
  skills: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one skill is required'
    }
  },
  
  // Optional Links
  resumeLink: {
    type: String,
    trim: true,
    default: ''
  },
  githubProfile: {
    type: String,
    trim: true,
    default: ''
  },
  linkedinProfile: {
    type: String,
    trim: true,
    default: ''
  },
  
  // Cover Letter
  coverLetter: {
    type: String,
    trim: true,
    maxlength: 1000,
    default: ''
  },
  
  // Application Status
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  
  // Timestamps
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
applicationSchema.index({ email: 1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ submittedAt: -1 });
applicationSchema.index({ applicationId: 1 });

// Counter schema for auto-incrementing application IDs
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', counterSchema);

// Pre-save hook to generate custom application ID
applicationSchema.pre('save', async function(next) {
  if (this.isNew && !this.applicationId) {
    try {
      const year = new Date().getFullYear();
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'applicationId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      
      // Format: INT-2026-0001
      this.applicationId = `INT-${year}-${String(counter.seq).padStart(4, '0')}`;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

module.exports = mongoose.model('Application', applicationSchema);
