const express = require('express');
const router = express.Router();
const { login, changePassword } = require('../Controllers/authController');
const { authenticate } = require('../Middleware/auth');

router.post('/login', login);
router.post('/change-password', authenticate, changePassword);

//to get the logged user's role
router.get('/current-user', authenticate, (req, res) => {
  res.json({ 
    success: true, 
    user: req.user 
  });
});


// Add this temporary test route to your routes file
const { sendShortlistEmail } = require('../services/emailService');

router.get('/test-email', async (req, res) => {
  try {
    await sendShortlistEmail({
      to: 'chathuninimesha12@gmail.com', // Send to yourself for testing
      bidderName: 'Test User',
      auctionId: 'TEST-001',
      auctionTitle: 'Test Auction',
      bidAmount: 50000
    });
    
    res.json({ message: 'Test email sent! Check your inbox.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Add this to your routes file
router.get('/test-email-debug', async (req, res) => {
  console.log('=== EMAIL DEBUG TEST ===');
  console.log('Environment variables:');
  console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
  console.log('EMAIL_PORT:', process.env.EMAIL_PORT);
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '****' + process.env.EMAIL_PASSWORD.slice(-4) : 'NOT SET');
  
  try {
    const nodemailer = require('nodemailer');
    
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      },
      debug: true,
      logger: true
    });
    
    console.log('Testing connection...');
    await transporter.verify();
    console.log('Connection verified!');
    
    console.log('Sending email...');
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'chathuninimesha1031@gmail.com',
      subject: 'Debug Test Email - ' + new Date().toISOString(),
      html: '<h1>Test Email</h1><p>If you see this, emails are working!</p>'
    });
    
    console.log('Email sent! Message ID:', info.messageId);
    
    res.json({ 
      success: true, 
      messageId: info.messageId,
      recipient: 'admin@procubid.anunine.com'
    });
    
  } catch (error) {
    console.error('ERROR:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      stack: error.stack
    });
  }
});


module.exports = router;