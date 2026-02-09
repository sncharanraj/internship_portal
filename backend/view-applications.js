require('dotenv').config();
const mongoose = require('mongoose');
const Application = require('./models/Application');

async function viewApplications() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    const applications = await Application.find().sort({ submittedAt: -1 });
    
    console.log(`📊 Total Applications: ${applications.length}\n`);
    console.log('='.repeat(80));
    
    applications.forEach((app, index) => {
      console.log(`\n${index + 1}. APPLICATION`);
      console.log('─'.repeat(80));
      console.log(`ID:         ${app._id}`);
      console.log(`Name:       ${app.fullName}`);
      console.log(`Email:      ${app.email}`);
      console.log(`Phone:      ${app.phone}`);
      console.log(`University: ${app.university}`);
      console.log(`Degree:     ${app.degree} in ${app.major}`);
      console.log(`CGPA:       ${app.cgpa}/10`);
      console.log(`Grad Year:  ${app.graduationYear}`);
      console.log(`Domain:     ${app.preferredDomain}`);
      console.log(`Skills:     ${app.skills.join(', ')}`);
      console.log(`Status:     ${app.status}`);
      console.log(`Submitted:  ${app.submittedAt}`);
      if (app.resumeLink) console.log(`Resume:     ${app.resumeLink}`);
      if (app.githubProfile) console.log(`GitHub:     ${app.githubProfile}`);
      if (app.linkedinProfile) console.log(`LinkedIn:   ${app.linkedinProfile}`);
      if (app.coverLetter) console.log(`Cover:      ${app.coverLetter.substring(0, 100)}...`);
      console.log('='.repeat(80));
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

viewApplications();
