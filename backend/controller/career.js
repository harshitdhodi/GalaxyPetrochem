const fs = require('fs');
const Career = require('../model/career');
const { default: axios } = require('axios');
const nodemailer = require('nodemailer');

const submitApplication = async (req, res) => {
  try {
    const { name, address, email, contactNo, postAppliedFor } = req.body;

    // Validate inputs
    if (!name || !address || !email || !contactNo || !postAppliedFor) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Basic phone validation (at least 10 digits)
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(contactNo)) {
      return res.status(400).json({ message: 'Invalid phone number format' });
    }

    // Check if resume file exists in the request
    if (!req.files || !req.files.resumeFile || !req.files.resumeFile[0]) {
      return res.status(400).json({ message: 'Resume file is required' });
    }

    // Get just the filename instead of the full path
    const resumePath = req.files.resumeFile[0].filename;

    // Create new application
    const application = new Career({
      name,
      address,
      email,
      contactNo,
      postAppliedFor,
      resumeFile: resumePath
    });

    await application.save();

    // Fetch SMTP Configuration
    const { data: smtpResponse } = await axios.get("http://localhost:3028/api/smtp/get");
    const smtpConfig = smtpResponse.data?.[0];

    if (!smtpConfig || !smtpConfig.host) {
      throw new Error("SMTP configuration is missing.");
    }

    // Fetch Email Templates
    const { data: emailTemplateResponse } = await axios.get("http://localhost:3028/api/template/get");
    const emailTemplates = emailTemplateResponse.data;

    if (!emailTemplates || emailTemplates.length === 0) {
      throw new Error("Email templates are missing.");
    }

    // Get Applicant Email Template
    const applicantTemplate = emailTemplates.find(template => template.name === "Careers Inquiry");
    if (!applicantTemplate) {
      throw new Error("Applicant email template not found.");
    }

    // **Set Default Owner Email if Not Provided**
    const ownerEmail = smtpConfig.name; // Fallback to SMTP user email

    // **Create Email Transporter**
    const transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port || 587,
      secure: smtpConfig.isSSL,
      auth: {
        user: smtpConfig.name,
        pass: smtpConfig.password,
      },
    });

    // **Owner Email Template**
    const ownerEmailBody = `
    <html>
    <head>
        <title>New Application Notification</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
                <td align="center">
                    <table width="600px" style="background: #ffffff; padding: 25px; border-radius: 10px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);">
                        <tr>
                            <td align="center" style="border-bottom: 2px solid #007bff; padding-bottom: 15px;">
                                <h1 style="color: #333; margin: 0;">New Application Received</h1>
                            </td>
                        </tr>
                        <tr>
                            <td style="font-size: 16px; color: #555; line-height: 1.8; padding-top: 20px;">
                                <p>Hello,</p>
                                <p>A new application has been submitted. Below are the details:</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse: collapse; background: #f9f9f9; border-radius: 8px; padding: 15px;">
                                    <tr><td style="font-weight: bold; color: #333;">Name:</td><td style="color: #555;">${name}</td></tr>
                                    <tr><td style="font-weight: bold; color: #333;">Address:</td><td style="color: #555;">${address}</td></tr>
                                    <tr><td style="font-weight: bold; color: #333;">Email:</td><td style="color: #555;">${email}</td></tr>
                                    <tr><td style="font-weight: bold; color: #333;">Contact No:</td><td style="color: #555;">${contactNo}</td></tr>
                                    <tr><td style="font-weight: bold; color: #333;">Post Applied For:</td><td style="color: #555;">${postAppliedFor}</td></tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding-top: 20px;">
                                <p>Please review the application details in your dashboard.</p>
                                <p>Best Regards,<br><strong>Your Business Team</strong></p>
                            </td>
                        </tr>
                        <tr>
                          <td align="center" style="font-size: 14px; color: #888; padding-top: 15px; border-top: 1px solid #ddd;">
    <p>&copy; <span id="year"></span>  Vihaani Enterprise. All rights reserved.</p>
</td>

<script>
    document.getElementById("year").textContent = new Date().getFullYear();
</script>

                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

    // **Send Email to Owner**
    if (ownerEmail) {
      const ownerMailOptions = {
        from: `"Vihaani Enterprise" <${smtpConfig.name}>`,
        to: ownerEmail,
        subject: "New Application Received",
        html: ownerEmailBody,
        replyTo: email || smtpConfig.name, // Allow owner to reply
      };

      await transporter.sendMail(ownerMailOptions);
      console.log("Owner Email Sent Successfully to:", ownerEmail);
    } else {
      console.warn("Owner email is missing, skipping owner email notification.");
    }

    // **Send Email to Applicant**
    if (email) {
      const applicantMailOptions = {
        from: `"Your Business Name" <${smtpConfig.name}>`,
        to: email,
        subject: applicantTemplate.subject,
        html: applicantTemplate.body.replace("[Applicant's Name]", name)
          .replace("[Job/Position Name]", postAppliedFor)
          .replace("[Company Name]", "Vihaani Enterprise")
          .replace("[Contact Email]", "vh@gmail.com"),
      };

      await transporter.sendMail(applicantMailOptions);
      console.log("Applicant Email Sent Successfully to:", email);
    } else {
      console.warn("Applicant email is missing, skipping applicant email notification.");
    }

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully and emails sent',
      data: application
    });

  } catch (error) {
    console.error('Error in submitApplication:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

const getAllApplications = async (req, res) => {
  try {
    const applications = await Career.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching applications',
      error: error.message
    });
  }
};

const getApplicationById = async (req, res) => {
  try {
    const application = await Career.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching application',
      error: error.message
    });
  }
};

const updateApplication = async (req, res) => {
  try {
    const { name, address, email, contactNo, postAppliedFor } = req.body;

    // Find existing application
    const application = await Career.findById(req.query.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Update fields if provided
    if (name) application.name = name;
    if (address) application.address = address;
    if (email) {
      // Validate email if provided
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }
      application.email = email;
    }
    if (contactNo) {
      // Validate phone if provided
      const phoneRegex = /^\+?[\d\s-]{10,}$/;
      if (!phoneRegex.test(contactNo)) {
        return res.status(400).json({ message: 'Invalid phone number format' });
      }
      application.contactNo = contactNo;
    }
    if (postAppliedFor) application.postAppliedFor = postAppliedFor;

    // Handle resume file update if provided
    if (req.files && req.files.resumeFile && req.files.resumeFile[0]) {
      // Delete old resume file
      if (application.resumeFile) {
        try {
          fs.unlinkSync(application.resumeFile);
        } catch (err) {
          console.error('Error deleting old resume:', err);
        }
      }
      // Update with new resume file
      application.resumeFile = req.files.resumeFile[0].path;
    }

    await application.save();

    res.status(200).json({
      success: true,
      message: 'Application updated successfully',
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating application',
      error: error.message
    });
  }
};

const deleteApplication = async (req, res) => {
  try {
    const application = await Career.findById(req.query.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Delete resume file from storage
    if (application.resumeFile) {
      try {
        fs.unlinkSync(application.resumeFile);
      } catch (err) {
        console.error('Error deleting resume file:', err);
      }
    }

    await Career.findByIdAndDelete(req.query.id);

    res.status(200).json({
      success: true,
      message: 'Application deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting application',
      error: error.message
    });
  }
};

module.exports = {
  submitApplication,
  getAllApplications,
  getApplicationById,
  updateApplication,
  deleteApplication
};
