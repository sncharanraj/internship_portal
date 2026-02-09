require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
  console.log('='.repeat(50));
  console.log('BREVO EMAIL TEST');
  console.log('='.repeat(50));
  
  console.log('\n📋 Configuration:');
  console.log('SMTP Server: smtp-relay.brevo.com:587');
  console.log('Login:', process.env.EMAIL_USER);
  console.log('Key starts with:', process.env.EMAIL_PASS?.substring(0, 10) + '...');
  console.log('Sending to:', process.env.ADMIN_EMAIL);
  
  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    debug: true,  // Enable debug
    logger: true  // Enable logging
  });

  console.log('\n🔍 Verifying SMTP connection...');
  
  try {
    await transporter.verify();
    console.log('✅ SMTP connection verified!\n');
  } catch (error) {
    console.error('❌ SMTP verification failed:', error.message);
    return;
  }

  console.log('📧 Sending test email...\n');

  try {
    const info = await transporter.sendMail({
      from: `"Test Portal" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: 'Brevo Test Email',
      text: 'If you receive this, Brevo is working!',
      html: '<h1>Success! 🎉</h1><p>Brevo email is working correctly!</p>'
    });

    console.log('✅ EMAIL SENT SUCCESSFULLY!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
    console.log('\n📬 Check inbox:', process.env.ADMIN_EMAIL);
    console.log('📬 Also check SPAM/PROMOTIONS folder!');
    console.log('='.repeat(50));
    
  } catch (error) {
    console.error('❌ SEND FAILED:', error.message);
    console.error('\nFull error:', error);
  }
}

testEmail();
