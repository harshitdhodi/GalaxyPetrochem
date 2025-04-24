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
    const ext = path.extname(file.originalname).toLowerCase();
    const fileName = `${file.fieldname}_${Date.now()}${ext === '.svg' ? '.svg' : '.webp'}`; // Use .svg extension for SVG files, otherwise .webp
    cb(null, fileName);
  }
});

// Initialize multer with defined storage options and file size limits
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: function (req, file, cb) {
    // Check if file is an image or SVG
    if (!file.mimetype.startsWith('image/') && file.mimetype !== 'image/svg+xml') {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Process both headerLogo and favIcon
const processLogoImage = async (tempPath, finalPath, isIcon = false) => {
  try {
    await fs.promises.access(tempPath, fs.constants.R_OK);
    const stats = await fs.promises.stat(tempPath);
    console.log('File size:', stats.size);

    // Different processing for favicon (smaller size) and header logo
    if (path.extname(tempPath).toLowerCase() === '.svg') {
      // If the file is an SVG, just move it to the final destination
      await fs.promises.rename(tempPath, finalPath);
    } else {
      if (isIcon) {
        await sharp(tempPath)
          .webp({ quality: 90 })
          .resize({ width: 32, height: 32 })
          .toFile(finalPath);
      } else {
        await sharp(tempPath)
          .webp({ quality: 90 })
          .resize({ width: 1024, withoutEnlargement: true })
          .toFile(finalPath);
      }
    }
  } catch (err) {
    console.error('Detailed Processing Error:', err);
    throw new Error(`Failed to process image: ${err.message}`);
  }
};

// Updated middleware to handle both files
const uploadLogo = async (req, res, next) => {
  try {
    const uploadFields = upload.fields([
      { name: 'headerLogo', maxCount: 1 },
      { name: 'favIcon', maxCount: 1 },
      { name: 'icon', maxCount: 1 }
    ]);

    uploadFields(req, res, async (err) => {
      if (err) {
        console.error('Multer Error:', err);
        return res.status(400).json({ error: 'Error uploading files', details: err.message });
      }

      try {
        if (req.files?.headerLogo) {
          const headerLogoTemp = req.files.headerLogo[0].path;
          const headerLogoFinal = path.join(uploadDir, req.files.headerLogo[0].filename);
          await processLogoImage(headerLogoTemp, headerLogoFinal, false);
          req.body.headerLogo = req.files.headerLogo[0].filename;
          fs.unlink(headerLogoTemp, (err) => err && console.error('Error deleting temp headerLogo:', err));
        }

        if (req.files?.favIcon) {
          const favIconTemp = req.files.favIcon[0].path;
          const favIconFinal = path.join(uploadDir, req.files.favIcon[0].filename);
          await processLogoImage(favIconTemp, favIconFinal, true);
          req.body.favIcon = req.files.favIcon[0].filename;
          fs.unlink(favIconTemp, (err) => err && console.error('Error deleting temp favIcon:', err));
        }

        next();
      } catch (processError) {
        console.error('Processing Error Details:', processError);
        return res.status(500).json({ error: 'Error processing the images', details: processError.message });
      }
    });
  } catch (err) {
    console.error('Server Error:', err);
    return res.status(500).json({ error: 'Server error during upload', details: err.message });
  }
};

module.exports = { uploadLogo };