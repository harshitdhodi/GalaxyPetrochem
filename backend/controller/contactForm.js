const Contact = require('../model/contactForm');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
    ,
  },
});

exports.submitContact = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      organisation,
      department,
      address,
      country,
      phone,
      email,
      message,
      needCallback,
      verification,
    } = req.body;

    // Verify the captcha
    if (verification.toUpperCase() !== 'EDLED') {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    // Create contact entry
    const contact = await Contact.create({
      firstName,
      lastName,
      organisation,
      department,
      address,
      country,
      phone,
      email,
      message,
      needCallback,
    });

    // Send email notification
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_FROM,
      subject: 'New Contact Form Submission',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            .email-container {
              font-family: Arial, sans-serif;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #e0e0e0;
              border-radius: 5px;
            }
            .header {
              background-color: #f8f9fa;
              padding: 15px;
              border-bottom: 2px solid #dee2e6;
              margin-bottom: 20px;
            }
            .content {
              line-height: 1.6;
              color: #333;
            }
            .field {
              margin-bottom: 15px;
            }
            .label {
              font-weight: bold;
              color: #555;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h2 style="color: #2c3e50; margin: 0;">New Contact Form Submission</h2>
            </div>
            <div class="content">
              <div class="field">
                <span class="label">Full Name:</span> ${firstName} ${lastName}
              </div>
              <div class="field">
                <span class="label">Organisation:</span> ${organisation}
              </div>
              <div class="field">
                <span class="label">Department:</span> ${department || 'Not specified'}
              </div>
              <div class="field">
                <span class="label">Address:</span> ${address}
              </div>
              <div class="field">
                <span class="label">Country:</span> ${country}
              </div>
              <div class="field">
                <span class="label">Phone:</span> ${phone}
              </div>
              <div class="field">
                <span class="label">Email:</span> ${email}
              </div>
              <div class="field">
                <span class="label">Message:</span><br>
                ${message.replace(/\n/g, '<br>')}
              </div>
              <div class="field">
                <span class="label">Callback Required:</span> ${needCallback ? 'Yes' : 'No'}
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    res.status(201).json({ success: true, data: contact });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ error: 'Error submitting contact form' });
  }
};