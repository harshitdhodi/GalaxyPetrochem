const nodemailer = require('nodemailer');
const Email = require('../model/email');
const path = require('path');

const sendEmail = async (req, res) => {
  try {
    const { email, cc_email, subject, body, attachment } = req.body;

    // Save email data to the database
    const newEmail = new Email({ email, cc_email, subject, body, attachment });
    await newEmail.save();

    // SMTP configuration
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // Replace with your SMTP host
      port: 587, // Replace with your SMTP port
      secure: false, // Use true for 465, false for other ports
      auth: {
        user: 'harshit.dhodi2108@gmail.com', // Replace with your SMTP username
        pass: 'jnkb ytek ilqm ryfm', // Replace with your SMTP password
      },
    });

    // Email options
    const mailOptions = {
      from: 'mansihande09@gmail.com', // Sender address
      to: email, // Primary recipient
      cc: cc_email, // CC recipients
      subject: subject,
      text: body, // Plain text body
      html: `<p>${body}</p>`, // HTML body
      attachments: attachment ? [
        {
          filename: path.basename(attachment),  
          path: attachment, // File path
        },
      ] : [],
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Email sent successfully!', data: newEmail });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending email', error: error.message });
  }
};

module.exports = { sendEmail };
