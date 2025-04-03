const User = require('../model/contactinfo');

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { address, mobiles, emails,imgTitle,altName } = req.body;
console.log(req.file)
   
    // Collect file names
    const photo = req.files.map(file => file.filename);


    const newUser = new User({
      photo,
      address,
      mobiles,
      emails
      ,imgTitle,altName
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully', data: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().exec(); // Forces fresh query, prevents caching
    console.log("Fetched Users:", users);
    res.status(200).json(users);
  } catch (error) {
    console.error("Error Fetching Users:", error.message);
    res.status(500).json({ error: error.message });
  }
};


// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.query;
    const user = await User.findById(id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const path = require('path');
const fs = require('fs');

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.query;
    const { address, mobiles, emails, imgTitle, altName } = req.body;

    console.log("Received Update Request for ID:", id);
    console.log("Request Body:", req.body);
    console.log("Uploaded Files:", req.files);

    // Fetch the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let newPhotos = [];

    // Check if new files are uploaded (Fix for req.files structure)
    if (req.files && req.files.photo && req.files.photo.length > 0) {
      newPhotos = req.files.photo.map(file => file.filename);
      console.log("New Uploaded Photos:", newPhotos);

      // Delete old images if they exist
      if (user.photo && user.photo.length > 0) {
        user.photo.forEach(image => {
          const oldImagePath = path.join(__dirname, '../uploads/images', image);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
            console.log('Deleted Old Image:', image);
          } else {
            console.log('Old Image Not Found:', image);
          }
        });
      }
    } else {
      console.log("No New Images Uploaded.");
    }

    // Prepare updated data
    const updatedData = {
      address,
      mobiles,
      emails,
      imgTitle,
      altName,
      ...(newPhotos.length > 0 ? { photo: newPhotos } : {}), // Update only if new photos exist
    };

    // Update the user in the database
    const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });

    if (!updatedUser) {
      return res.status(500).json({ message: 'Failed to update user' });
    }

    console.log("User Updated Successfully:", updatedUser);
    res.status(200).json({ message: 'User updated successfully', data: updatedUser });

  } catch (error) {
    console.error('Error updating user:', error.message);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};


 
// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.query;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
