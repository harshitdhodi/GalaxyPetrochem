require('dotenv').config();
const Inquiry = require('../model/productInquiry');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Add this to debug environment variables
console.log('Environment Variables:', {
  EMAIL_USER: process.env.EMAIL_USER ? 'Set' : 'Not Set',
  EMAIL_PASS: process.env.EMAIL_PASS ? 'Set' : 'Not Set'
});

// Add this verification before your routes
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP connection error:', error);
  } else {
    console.log('SMTP connection successful');
  }
});


exports.createInquiry = async (req, res) => {
 
  try {
    // Verify email configuration first
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.EMAIL_FROM) {
      throw new Error('Email configuration is missing');
    }

    const newInquiry = new Inquiry(req.body); 
    await newInquiry.save();

    // --- Send notification email to admin ---
    const adminEmailHTML = `
       <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Product Inquiry</title>
            <style>
                body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 20px auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
                h2 { color: #333; text-align: center; }
                p { font-size: 16px; color: #555; line-height: 1.6; }
                .field { font-weight: bold; color: #333; }
                .footer { margin-top: 20px; font-size: 12px; color: #aaa; text-align: center; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Galaxy Petrochemicals - New Product Inquiry</h2>
                <p><span class="field">Name:</span> ${newInquiry.name}</p>
                <p><span class="field">Email:</span> ${newInquiry.email}</p>
                <p><span class="field">Phone:</span> ${newInquiry.phone}</p>
                <p><span class="field">Message:</span> ${newInquiry.message}</p>
                <div class="footer">
                    <p>This is an automated email. Please do not reply.</p>
                </div>
            </div>
        </body> 
        </html>
        `;

    const adminMailOptions = {
      from: `"${newInquiry.name}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_FROM,
      subject: 'New Product Inquiry Received',
      html: adminEmailHTML,
      replyTo: newInquiry.email
    };
        
    await transporter.sendMail(adminMailOptions);

    // --- Send "Thank You" email to the user ---
    const userEmailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; line-height: 1.6; }
          .container { max-width: 600px; margin: 20px auto; padding: 30px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.05); }
          .header { background-color: #0056b3; color: #ffffff; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { padding: 30px 0; }
          .content p { margin: 0 0 15px; }
          .footer { text-align: center; font-size: 12px; color: #777; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Galaxy Petrochem</h1>
          </div>
          <div class="content">
            <p>Dear ${newInquiry.name},</p>
            <p>Thank you for your inquiry about our products. We have successfully received your message and appreciate your interest in Galaxy Petrochem.</p>
            <p>Our team will review your request and will be in touch with you shortly.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Galaxy Petrochem. All Rights Reserved.</p>
            <p>This is an automated message. Please do not reply directly to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const userMailOptions = {
        from: `"Galaxy Petrochem" <${process.env.EMAIL_USER}>`,
        to: newInquiry.email,
        subject: 'Thank You for Your Inquiry',
        html: userEmailHTML,
    };
    
    await transporter.sendMail(userMailOptions);

    // Respond to the client
    res.status(201).json({ success: true, data: newInquiry });
  } catch (error) {
    console.log(error)
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get counts and data based on field presence
exports.getCountsAndData = async (req, res) => {
  try {
    const totalCount = await Inquiry.countDocuments();

    const countWithFields = await Inquiry.countDocuments({
      $or: [
        { utm_source: { $exists: true, $ne: '' } },
        { utm_medium: { $exists: true, $ne: '' } },
        { utm_campaign: { $exists: true, $ne: '' } },
        { utm_id: { $exists: true, $ne: '' } },
        { gclid: { $exists: true, $ne: '' } },
        { gcid_source: { $exists: true, $ne: '' } }
      ]
    });

    const countWithoutFields = await Inquiry.countDocuments({
      $nor: [
        { utm_source: { $exists: true, $ne: '' } },
        { utm_medium: { $exists: true, $ne: '' } },
        { utm_campaign: { $exists: true, $ne: '' } },
        { utm_id: { $exists: true, $ne: '' } },
        { gclid: { $exists: true, $ne: '' } },
        { gcid_source: { $exists: true, $ne: '' } }
      ]
    });

    const dataWithFields = await Inquiry.find({
      $or: [
        { utm_source: { $exists: true, $ne: '' } },
        { utm_medium: { $exists: true, $ne: '' } },
        { utm_campaign: { $exists: true, $ne: '' } },
        { utm_id: { $exists: true, $ne: '' } },
        { gclid: { $exists: true, $ne: '' } },
        { gcid_source: { $exists: true, $ne: '' } }
      ]
    });
  
    const dataWithoutFields = await Inquiry.find({
      $nor: [
        { utm_source: { $exists: true, $ne: '' } },
        { utm_medium: { $exists: true, $ne: '' } },
        { utm_campaign: { $exists: true, $ne: '' } },
        { utm_id: { $exists: true, $ne: '' } },
        { gclid: { $exists: true, $ne: '' } },
        { gcid_source: { $exists: true, $ne: '' } }
      ]
    });

    const inquiries = await Inquiry.find();

    res.status(200).json({  
      totalCount,
      countWithFields,
      countWithoutFields,
      dataWithFields,
      dataWithoutFields,
      inquiries
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteInquiry = async (req, res) => {
  const { id } = req.query;
  try {
    const deletedInquiry = await Inquiry.findByIdAndDelete(id);
    if (!deletedInquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    res.status(200).json({ message: 'Inquiry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
