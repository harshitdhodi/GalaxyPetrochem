const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const multer = require('multer');

// Specify the directories for logos and temporary files
const uploadDir = path.join(__dirname, '../logos');
const tempDir = path.join(__dirname, '../temp');

// Create directories if they don't exist
[uploadDir, tempDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Define storage for uploaded photos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Store initially in temp directory
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    const fileName = `${file.fieldname}_${Date.now()}.webp`; // Always use .webp extension
    cb(null, fileName);
  }
});

// Initialize multer with defined storage options and file size limits
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: function (req, file, cb) {
    // Check if file is an image
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Function to process the uploaded logo image
const processLogoImage = async (tempPath, finalPath) => {
  try {
    // Verify file exists and is readable
    await fs.promises.access(tempPath, fs.constants.R_OK);

    // Get file stats
    const stats = await fs.promises.stat(tempPath);
    console.log('File size:', stats.size);

    // Initial processing with high quality
    await sharp(tempPath)
      .webp({ quality: 100 })
      .resize({ width: 1024, withoutEnlargement: true })
      .toFile(finalPath);

    // Rest of the existing code...
  } catch (err) {
    console.error('Detailed Processing Error:', err);
    throw new Error(`Failed to process image: ${err.message}`);
  }
};

// Middleware to handle the logo file upload and process the image
const singleImage = async (req, res, next) => {
  try {
    await upload.single('image')(req, res, async (err) => {
      // Log detailed error information
      if (err) {
        console.error('Multer Error:', err);
        return res.status(400).json({
          error: 'Error uploading file',
          details: err.message
        });
      }

      // If no file is uploaded, log this
      if (!req.file) {
        console.error('No file uploaded');
        return res.status(400).json({
          error: 'No file uploaded'
        });
      }

      try {
        const tempPath = req.file.path;
        const finalPath = path.join(uploadDir, req.file.filename);

        console.log('Temp Path:', tempPath);
        console.log('Final Path:', finalPath);

        // Process the image if file is present
        await processLogoImage(tempPath, finalPath);

        // Update req.file with the new path
        req.file.path = finalPath;
        next();
      } catch (processError) {
        console.error('Processing Error Details:', processError);
        return res.status(500).json({
          error: 'Error processing the image',
          details: processError.message
        });
      }
    });
  } catch (err) {
    console.error('Server Error:', err);
    return res.status(500).json({
      error: 'Server error during upload',
      details: err.message
    });
  }
};

module.exports = { singleImage ,uploadDir };
