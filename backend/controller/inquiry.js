const Inquiry = require('../model/inquiry');
const axios = require('axios');
const nodemailer = require('nodemailer');

// Get all inquiries
exports.getAllInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find();
        res.status(200).json(inquiries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get inquiry by ID
exports.getInquiryById = async (req, res) => {
    try {
        const inquiry = await Inquiry.findById(req.query.id);
        if (!inquiry) {
            return res.status(404).json({ message: "Inquiry not found" });
        }
        res.status(200).json(inquiry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new inquiry
exports.createInquiry = async (req, res) => {
    try {
      console.log(req.body)
    
       // Save inquiry to database
      const newInquiry = new Inquiry(req.body);
      await newInquiry.save();
  
      // Create Nodemailer transporter
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com', // Default to Gmail SMTP or your provider
        port: process.env.EMAIL_PORT || 587,
        secure: process.env.EMAIL_PORT == 465, // True for port 465, false for 587
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
  
      // HTML Email Template
      const emailHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Inquiry</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              width: 100%;
              padding: 20px;
              background-color: #ffffff;
              border-radius: 10px;
              max-width: 600px;
              margin: 20px auto;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            h2 {
              color: #333;
              font-size: 24px;
              margin-bottom: 20px;
              text-align: center;
            }
            p {
              font-size: 16px;
              color: #555;
              line-height: 1.6;
            }
            .field {
              font-weight: bold;
              color: #333;
            }
            .footer {
              margin-top: 20px;
              font-size: 12px;
              color: #aaa;
              text-align: center;
            }
            .centered-text {
              text-align: center;
              margin: 20px 0;
              font-size: 20px;
              color: #333;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Galaxy Petrochemicals</h2>
            <p class="centered-text">New Inquiry!!</p>
            <p><span class="field">Name:</span> ${newInquiry.firstName} ${newInquiry.lastName}</p>
            <p><span class="field">Email:</span> ${newInquiry.email}</p>
            <p><span class="field">Phone:</span> ${newInquiry.phone || 'N/A'}</p>
            <p><span class="field">Message:</span> ${newInquiry.message}</p>
            <div class="footer">
              <p>This is an automated
  
   email. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `;
  
      // Email options
      const mailOptions = {
        from: `"${newInquiry.firstName} ${newInquiry.lastName}" <${process.env.EMAIL_FROM}>`, // Valid format: "Name" <email>
        to: process.env.EMAIL_FROM,
        subject: 'New Inquiry',
        html: emailHTML,
        replyTo: newInquiry.email, // Reply goes to the user's email
      };
  
      // Send email
      try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully to:', process.env.EMAIL_FROM);
      } catch (emailError) {
        console.warn('Failed to send email:', emailError.message);
        // Note: Not throwing an error here to ensure the response is still sent
      }
  
      // Respond to the client
      res.status(201).json({ success: true, data: newInquiry });
    } catch (error) {
      console.error('Error:', error.message);
      res.status(400).json({ success: false, error: error.message });
    }
  };

// Update inquiry by ID
exports.updateInquiry = async (req, res) => {
    try {
        const inquiry = await Inquiry.findByIdAndUpdate(req.query.id, req.body, { new: true });
        if (!inquiry) {
            return res.status(404).json({ message: "Inquiry not found" });
        }
        res.status(200).json(inquiry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete inquiry by ID
exports.deleteInquiry = async (req, res) => {
    try {
        const inquiry = await Inquiry.findByIdAndDelete(req.query.id);
        if (!inquiry) {
            return res.status(404).json({ message: "Inquiry not found" });
        }
        res.status(200).json({ message: "Inquiry deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTodayInquiries = async (req, res) => {
    try {
        // Get the start and end of the current day
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0); // Set to 12:00:00 AM
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999); // Set to 11:59:59 PM
        console.log(startOfDay, endOfDay)
        // Fetch inquiries created today
        const todayInquiries = await Inquiry.find({
            createdAt: {
                $gte: startOfDay,
                $lt: endOfDay,
            },
        });

        res.status(200).json(todayInquiries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

