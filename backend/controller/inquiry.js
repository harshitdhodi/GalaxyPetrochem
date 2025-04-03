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
        const inquiryData = {
            ...req.body,
            needCallback: req.body.needCallback || false,
            status: req.body.status || "New Inquiry",
            source: req.body.source || "",
        };

        // Save Inquiry to Database
        const inquiry = new Inquiry(inquiryData);
        await inquiry.save();

        console.log("Owner Email:", inquiryData.ownerEmail || "Not provided");

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

        // Get Customer Email Template
        const customerTemplate = emailTemplates.find(template => template.name === "Auto Thank You");
        if (!customerTemplate) {
            throw new Error("Customer email template not found.");
        }

        // **Set Default Owner Email if Not Provided**
        const ownerEmail = inquiryData.ownerEmail || smtpConfig.name; // Fallback to SMTP user email

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
            <title>New Inquiry Notification</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td align="center">
                        <table width="600px" style="background: #ffffff; padding: 25px; border-radius: 10px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);">
                            <tr>
                                <td align="center" style="border-bottom: 2px solid #007bff; padding-bottom: 15px;">
                                    <h1 style="color: #333; margin: 0;">New Inquiry Received</h1>
                                </td>
                            </tr>
                            <tr>
                                <td style="font-size: 16px; color: #555; line-height: 1.8; padding-top: 20px;">
                                    <p>Hello,</p>
                                    <p>A new inquiry has been submitted. Below are the details:</p>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse: collapse; background: #f9f9f9; border-radius: 8px; padding: 15px;">
                                        <tr><td style="font-weight: bold; color: #333;">Full Name:</td><td style="color: #555;">${inquiryData.firstName || "N/A"} ${inquiryData.lastName || ""}</td></tr>
                                        <tr><td style="font-weight: bold; color: #333;">Organisation:</td></tr>
                                        <tr><td style="font-weight: bold; color: #333;">Department:</td></tr>
                                        <tr><td style="font-weight: bold; color: #333;">Address:</td><td style="color: #555;">${inquiryData.address || "N/A"}</td></tr>
                                        <tr><td style="font-weight: bold; color: #333;">Country:</td><td style="color: #555;">${inquiryData.country || "N/A"}</td></tr>
                                        <tr><td style="font-weight: bold; color: #333;">Phone:</td><td style="color: #555;">${inquiryData.phone || "N/A"}</td></tr>
                                        <tr><td style="font-weight: bold; color: #333;">Email:</td><td style="color: #555;">${inquiryData.email || "N/A"}</td></tr>
                                        <tr><td style="font-weight: bold; color: #333;">Message:</td><td style="color: #555;">${inquiryData.message || "N/A"}</td></tr>
                                        <tr><td style="font-weight: bold; color: #333;">Callback Required:</td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding-top: 20px;">
                                    <p>Please review the inquiry details in your dashboard.</p>
                                    <p>Best Regards,<br><strong>Your Business Team</strong></p>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" style="font-size: 14px; color: #888; padding-top: 15px; border-top: 1px solid #ddd;">
    <p>&copy; <span id="year"></span> Vihaani Enterprise. All rights reserved.</p>
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
                from: `"Your Business Name" <${smtpConfig.name}>`,
                to: ownerEmail,
                subject: "New Inquiry Received",
                html: ownerEmailBody,
                replyTo: inquiryData.email || smtpConfig.name, // Allow owner to reply
            };

            await transporter.sendMail(ownerMailOptions);
            console.log("Owner Email Sent Successfully to:", ownerEmail);
        } else {
            console.warn("Owner email is missing, skipping owner email notification.");
        }

        // **Send Email to Customer**
        if (inquiryData.email) {
            const customerMailOptions = {
                from: `"Vihaani Enterprise" <${smtpConfig.name}>`,
                to: inquiryData.email,
                subject: customerTemplate.subject,
                html: customerTemplate.body.replace("[Recipient's Name]", inquiryData.firstName || "Customer"),
            };

            await transporter.sendMail(customerMailOptions);
            console.log("Customer Email Sent Successfully to:", inquiryData.email);
        } else {
            console.warn("Customer email is missing, skipping customer email notification.");
        }

        res.status(201).json({ message: "Inquiry created and emails sent successfully", inquiry });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(400).json({ message: error.message });
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
        console.log(startOfDay , endOfDay)
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

