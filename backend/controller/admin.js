const jwt = require('jsonwebtoken');
const Admin = require('../model/admin');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const path=require('path')
const fs=require('fs')


const createToken = (id) => {
  return jwt.sign({ id }, 'secret');
};

// Admin registration
const registerAdmin = async (req, res) => {
  try {
    const { email, notpassword, firstname, lastname } = req.body;

    let photo = null;
    if (req.file) {
      photo = req.file.filename;
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    if (!email || !notpassword || !firstname || !lastname) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const password = await bcrypt.hash(notpassword, 10);
    const newAdmin = new Admin({ email, password, firstname, lastname, photo });

    await newAdmin.save();

    // ✅ Clear Cache Logic Here (For Redis)
    if (redisClient) {
      redisClient.flushdb((err, success) => {
        if (err) {
          console.error("Error clearing cache:", err);
        } else {
          console.log("Cache cleared successfully!");
        }
      });
    }

    // ✅ Clear Cache for Mongoose (Optional)
    await mongoose.connection.db.adminCommand({ flushRouterConfig: 1 });

    return res.status(200).json({ success: true, message: 'Registration successful' });
  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({ success: false, message: 'Registration failed' });
  }
};

// Admin login
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Incorrect email ' });
    }

    const isPasswordMatch = await bcrypt.compare(password, admin.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect  password' });
    }

    const token = createToken(admin._id);
    res.cookie('jwt', token);

    return res.status(200).json({ success: true, admin: admin._id, token: token });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getAdminProfile = async (req, res) => {
  try {
    const adminId = req.newAdmin;
    console.log("Fetching Admin Profile for ID:", adminId);

    // Force fetching the latest data
    await Admin.collection.findOneAndUpdate(
      { _id: adminId },
      { $set: {} } // Dummy update to refresh cache
    );

    const admin = await Admin.findById(adminId).lean().exec();
    console.log("Admin Profile Data Sent:", admin);

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    return res.status(200).json({
      success: true,
      admin: {
        _id: admin._id,
        email: admin.email,
        firstname: admin.firstname,
        lastname: admin.lastname,
        photo: admin.photo,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};



const updateAdminProfile = async (req, res) => {
  try {
    const adminId = req.newAdmin; // Access admin ID from req object set by middleware
    const { email, firstname, lastname } = req.body;
    
    console.log(req.files); // Debugging: Check uploaded files

    let photo;

    // Check if the "photo" field exists in req.files
    if (req.files && req.files['photo'] && req.files['photo'].length > 0) {
      photo = req.files['photo'][0].filename; // Get the uploaded file's filename

      // Optionally, delete the old photo
      const admin = await Admin.findById(adminId);
      if (admin && admin.photo) {
        const oldPhotoPath = path.join(__dirname, '../uploads/images', admin.photo);
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);
        }
      }
    }

    const updatedData = { email, firstname, lastname };
    if (photo) {
      updatedData.photo = photo;
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(adminId, updatedData, { new: true });

    if (!updatedAdmin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    return res.status(200).json({ success: true, message: 'Profile updated successfully', admin: updatedAdmin });
  } catch (error) {
    console.error(error); // Log error for debugging
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};



const logoutUser = async (req, res) => {
    try {
      // Clear the token cookie
      res.clearCookie('jwt',{ 
        httpOnly: true,
        sameSite:"None",
        secure:true 
  
      });
      return res.status(200).json({ success: true, message: "User logged out successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  };
module.exports = { registerAdmin, loginAdmin ,getAdminProfile,updateAdminProfile,logoutUser}
