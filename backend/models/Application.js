const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
applicationId: {
    type: String,
    unique: true
  },
  // Personal Information
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
  },
  
  // Educational Information
  university: {
    type: String,
    required: [true, 'University name is required'],
    trim: true
  },
  degree: {
    type: String,
    required: [true, 'Degree is required'],
    trim: true
  },
  major: {
    type: String,
    required: [true, 'Major/Specialization is required'],
    trim: true
  },
  graduationYear: {
    type: Number,
    required: [true, 'Expected graduation year is required'],
    min: [2024, 'Graduation year must be 2024 or later'],
    max: [2030, 'Graduation year must be before 2030']
  },
  cgpa: {
    type: Number,
    required: [true, 'CGPA is required'],
    min: [0, 'CGPA must be between 0 and 10'],
    max: [10, 'CGPA must be between 0 and 10']
  },
  
  // Internship Details
  preferredDomain: {
    type: String,
    required: [true, 'Preferred domain is required'],
    enum: ['Web Development', 'Mobile Development', 'Data Science', 'Machine Learning', 'DevOps', 'Cloud Computing', 'Cybersecurity', 'UI/UX Design', 'Other']
  },
  skills: {
    type: [String],
    required: [true, 'At least one skill is required'],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'Please provide at least one skill'
    }
  },
  resumeLink: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+/, 'Please provide a valid URL for resume']
  },
  githubProfile: {
    type: String,
    trim: true
  },
  linkedinProfile: {
    type: String,
    trim: true
  },
  coverLetter: {
    type: String,
    maxlength: [1000, 'Cover letter cannot exceed 1000 characters']
  },
  
  // Application Status
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'accepted', 'rejected'],
    default: 'pending'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
applicationSchema.index({ email: 1 });
applicationSchema.index({ submittedAt: -1 });

// Auto-increment counter schema
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', counterSchema);

// Pre-save hook to generate custom application ID
applicationSchema.pre('save', async function(next) {
  if (this.isNew) {
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
