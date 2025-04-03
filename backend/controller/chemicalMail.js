const Email = require('../model/chemicalMail');
const nodemailer = require('nodemailer');

const sendEmail = async (req, res) => {
  try {
    const { subject, message, recipients, chemicalNames } = req.body;

    // Validate required fields
    if (!subject || !message || !recipients || !chemicalNames) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipients.join(','),
      subject: subject,
      html: message,
    };

    const info = await transporter.sendMail(mailOptions);

    // Save email record to database
    const emailRecord = new Email({
      subject,
      body: message,
      recipients,
      chemicalNames,
      status: 'sent',
    });

    await emailRecord.save();

    res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      data: emailRecord,
    });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email',
      error: error.message,
    });
  }
};

const getEmailHistory = async (req, res) => {
  try {
    const emails = await Email.find().sort({ sentAt: -1 });
    res.status(200).json({
      success: true,
      data: emails,
    });
  } catch (error) {
    console.error('Error fetching email history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch email history',
      error: error.message,
    });
  }
};

module.exports = { sendEmail, getEmailHistory };
