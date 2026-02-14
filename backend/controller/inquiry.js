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
  
      // --- Send Admin Notification Email ---
      const adminEmailHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Inquiry</title>
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
            <h2>Galaxy Petrochemicals - New Inquiry</h2>
            <p><span class="field">Name:</span> ${newInquiry.firstName} ${newInquiry.lastName}</p>
            <p><span class="field">Email:</span> ${newInquiry.email}</p>
            <p><span class="field">Phone:</span> ${newInquiry.phone || 'N/A'}</p>
            <p><span class="field">Message:</span> ${newInquiry.message}</p>
            <div class="footer">
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `;
  
      const adminMailOptions = {
        from: `"${newInquiry.firstName} ${newInquiry.lastName}" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_FROM,
        subject: 'New General Inquiry Received',
        html: adminEmailHTML,
        replyTo: newInquiry.email,
      };
  
      try {
        await transporter.sendMail(adminMailOptions);
        console.log('Admin notification email sent successfully to:', process.env.EMAIL_FROM);
      } catch (emailError) {
        console.warn('Failed to send admin notification email:', emailError.message);
      }

      // --- Send "Thank You" Email to User ---
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
              <p>Dear ${newInquiry.firstName},</p>
              <p>Thank you for your inquiry. We have successfully received your message and appreciate your interest in Galaxy Petrochem.</p>
              <p>Our team will review your request and will get back to you as soon as possible.</p>
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

      try {
        await transporter.sendMail(userMailOptions);
        console.log('Thank you email sent successfully to:', newInquiry.email);
      } catch (emailError) {
        console.warn('Failed to send thank you email:', emailError.message);
      }
  
      // Respond to the client
      res.status(201).json({ success: true, data: newInquiry });
    } catch (error) {
      console.error('Error creating inquiry:', error.message);
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

