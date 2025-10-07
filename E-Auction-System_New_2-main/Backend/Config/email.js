const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,    // procubid.anunine.com
  port: process.env.EMAIL_PORT,    // 465
  secure: true,                    // true for SSL/TLS
  auth: {
    user: process.env.EMAIL_USER,  // admin@procubid.anunine.com
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    });
    return { success: true };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error };
  }
};

module.exports = { sendEmail };
