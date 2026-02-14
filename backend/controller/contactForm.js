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
console.log('Contact form submitted:', email);
    // Send email notification to admin
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

    // Send "thank you" email to the user
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank You for Contacting Galaxy Petrochem',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              color: #333;
              line-height: 1.6;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              padding: 30px;
              border: 1px solid #ddd;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0,0,0,0.05);
            }
            .header {
              background-color: #0056b3;
              color: #ffffff;
              padding: 20px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .content {
              padding: 30px 0;
            }
            .content p {
              margin: 0 0 15px;
            }
            .footer {
              text-align: center;
              font-size: 12px;
              color: #777;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eee;
            }
            .summary {
              background-color: #f8f9fa;
              border: 1px solid #eee;
              padding: 20px;
              border-radius: 5px;
              margin-top: 20px;
            }
            .summary h3 {
              margin-top: 0;
              color: #0056b3;
            }
            .summary p {
              margin: 5px 0;
            }
            .summary .label {
              font-weight: 600;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Galaxy Petrochem</h1>
            </div>
            <div class="content">
              <p>Dear ${firstName},</p>
              <p>Thank you for reaching out to us. We have successfully received your message and appreciate your interest in Galaxy Petrochem.</p>
              <p>One of our team members will review your inquiry and get back to you as soon as possible. If your request is urgent, please feel free to call us directly.</p>
              
              <div class="summary">
                <h3>Your Submission Summary</h3>
                <p><span class="label">Name:</span> ${firstName} ${lastName}</p>
                <p><span class="label">Email:</span> ${email}</p>
                <p><span class="label">Message:</span></p>
                <blockquote style="margin: 0; padding-left: 15px; border-left: 3px solid #ccc;">${message.replace(/\n/g, '<br>')}</blockquote>
              </div>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Galaxy Petrochem. All Rights Reserved.</p>
              <p>This is an automated message. Please do not reply directly to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    res.status(201).json({ success: true, data: contact });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ error: 'Error submitting contact form' });
  }
};