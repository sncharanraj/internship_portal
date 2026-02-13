const SibApiV3Sdk = require('@sendinblue/client');

// Initialize Brevo API
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
apiInstance.setApiKey(
  SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

console.log('✅ Brevo API initialized');

// Send email to student
const sendStudentEmail = async (studentEmail, studentName, applicationId) => {
  console.log('📧 [sendStudentEmail] Starting...');
  console.log('📧 [sendStudentEmail] To:', studentEmail);
  console.log('📧 [sendStudentEmail] Name:', studentName);
  
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  
  sendSmtpEmail.sender = { 
    email: 'charanka21@gmail.com', 
    name: 'Internship Portal' 
  };
  sendSmtpEmail.to = [{ 
    email: studentEmail, 
    name: studentName 
  }];
  sendSmtpEmail.subject = '🎉 Application Received - Internship Portal';
  sendSmtpEmail.htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        .highlight { background: #fff; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎓 Application Received!</h1>
        </div>
        <div class="content">
          <p>Dear <strong>${studentName}</strong>,</p>
          <p>Thank you for applying to our internship program! We've successfully received your application.</p>
          
          <div class="highlight">
            <p><strong>Application ID:</strong> ${applicationId}</p>
            <p><strong>Submission Time:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Status:</strong> Under Review</p>
          </div>
          
          <p>Our team will review your application and get back to you within 5-7 business days.</p>
          
          <p><strong>What's Next?</strong></p>
          <ul>
            <li>Keep an eye on your email for updates</li>
            <li>Ensure your phone is reachable</li>
            <li>Check your spam folder regularly</li>
          </ul>
          
          <p>We appreciate your interest in joining our team!</p>
          
          <p>Best regards,<br><strong>Internship Team</strong></p>
        </div>
        <div class="footer">
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  try {
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ [sendStudentEmail] Success! Message ID:', result.messageId);
    return { messageId: result.messageId };
  } catch (error) {
    console.error('❌ [sendStudentEmail] Failed:', error.message);
    if (error.response) {
      console.error('   Response body:', error.response.body);
      console.error('   Response text:', error.response.text);
    }
    throw error;
  }
};

// Send email to admin
const sendAdminEmail = async (application) => {
  console.log('📧 [sendAdminEmail] Starting...');
  console.log('📧 [sendAdminEmail] To:', process.env.ADMIN_EMAIL);
  
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  
  sendSmtpEmail.sender = { 
    email: 'charanka21@gmail.com', 
    name: 'Internship Portal' 
  };
  sendSmtpEmail.to = [{ 
    email: process.env.ADMIN_EMAIL 
  }];
  sendSmtpEmail.subject = `🆕 New Internship Application - ${application.fullName}`;
  sendSmtpEmail.htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 700px; margin: 0 auto; padding: 20px; }
        .header { background: #1f2937; color: white; padding: 20px; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; background: white; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #667eea; color: white; }
        .skills { display: inline-block; background: #e0e7ff; color: #4338ca; padding: 4px 10px; margin: 2px; border-radius: 12px; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>📋 New Internship Application Received</h2>
        </div>
        <div class="content">
          <h3>Applicant Details</h3>
          <table>
            <tr><th>Field</th><th>Information</th></tr>
            <tr><td><strong>Full Name</strong></td><td>${application.fullName}</td></tr>
            <tr><td><strong>Email</strong></td><td>${application.email}</td></tr>
            <tr><td><strong>Phone</strong></td><td>${application.phone}</td></tr>
            <tr><td><strong>University</strong></td><td>${application.university}</td></tr>
            <tr><td><strong>Degree</strong></td><td>${application.degree}</td></tr>
            <tr><td><strong>Major</strong></td><td>${application.major}</td></tr>
            <tr><td><strong>CGPA</strong></td><td>${application.cgpa}/10</td></tr>
            <tr><td><strong>Graduation Year</strong></td><td>${application.graduationYear}</td></tr>
            <tr><td><strong>Preferred Domain</strong></td><td>${application.preferredDomain}</td></tr>
            <tr><td><strong>Skills</strong></td><td>${application.skills.map(skill => `<span class="skills">${skill}</span>`).join(' ')}</td></tr>
            ${application.resumeLink ? `<tr><td><strong>Resume</strong></td><td><a href="${application.resumeLink}">View Resume</a></td></tr>` : ''}
            ${application.githubProfile ? `<tr><td><strong>GitHub</strong></td><td><a href="${application.githubProfile}">${application.githubProfile}</a></td></tr>` : ''}
            ${application.linkedinProfile ? `<tr><td><strong>LinkedIn</strong></td><td><a href="${application.linkedinProfile}">${application.linkedinProfile}</a></td></tr>` : ''}
          </table>
          
          ${application.coverLetter ? `
            <h3>Cover Letter</h3>
            <div style="background: white; padding: 15px; border-left: 4px solid #667eea; margin: 10px 0;">
              ${application.coverLetter}
            </div>
          ` : ''}
          
          <p style="margin-top: 20px; color: #666; font-size: 14px;">
            <strong>Application ID:</strong> ${application._id}<br>
            <strong>Submitted:</strong> ${new Date(application.submittedAt).toLocaleString()}
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  try {
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ [sendAdminEmail] Success! Message ID:', result.messageId);
    return { messageId: result.messageId };
  } catch (error) {
    console.error('❌ [sendAdminEmail] Failed:', error.message);
    if (error.response) {
      console.error('   Response body:', error.response.body);
      console.error('   Response text:', error.response.text);
    }
    throw error;
  }
};

module.exports = {
  sendStudentEmail,
  sendAdminEmail
};
