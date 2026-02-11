const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Use absolute path to avoid issues
const UPLOAD_BASE_DIR = path.join(__dirname, '../uploads2'); // Adjust based on your structure
// OR if this file IS in the backend root:
// const UPLOAD_BASE_DIR = path.join(__dirname, 'uploads2');

// Ensure the necessary folders exist
const createFoldersIfNotExist = () => {
  const folders = ['images', 'msds', 'pdf'];
  
  folders.forEach(folder => {
    const folderPath = path.join(UPLOAD_BASE_DIR, folder);
    if (!fs.existsSync(folderPath)) {
      try {
        fs.mkdirSync(folderPath, { recursive: true, mode: 0o755 });
        console.log(`✓ Created folder: ${folderPath}`);
      } catch (error) {
        console.error(`✗ Error creating folder ${folderPath}:`, error);
      }
    }
  });
};

// Call the function to create folders
createFoldersIfNotExist();

// Helper function to ensure directory exists
const ensureDirectoryExists = (dirPath) => {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true, mode: 0o755 });
      console.log(`Created directory: ${dirPath}`);
    }
    return true;
  } catch (error) {
    console.error(`Failed to create directory ${dirPath}:`, error);
    return false;
  }
};

// Set up storage for files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder;
    
    try {
      switch (file.fieldname) {
        case 'images':
          // Organize by year/month to avoid directory limits
          const now = new Date();
          const year = now.getFullYear();
          const month = String(now.getMonth() + 1).padStart(2, '0');
          folder = path.join(UPLOAD_BASE_DIR, 'images', String(year), month);
          break;
        case 'msds':
          folder = path.join(UPLOAD_BASE_DIR, 'msds');
          break;
        case 'pdf':
          folder = path.join(UPLOAD_BASE_DIR, 'pdf');
          break;
        default:
          folder = UPLOAD_BASE_DIR;
      }
      
      // Ensure folder exists before multer tries to write
      if (ensureDirectoryExists(folder)) {
        cb(null, folder);
      } else {
        cb(new Error(`Failed to create upload directory: ${folder}`));
      }
    } catch (error) {
      console.error('Error in destination function:', error);
      cb(error);
    }
  },
  filename: function (req, file, cb) {
    try {
      if (file.fieldname === 'pdf' || file.fieldname === 'msds') {
        const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
        cb(null, sanitizedFilename);
      } else {
        const ext = path.extname(file.originalname);
        const filename = `${Date.now()}${ext}`;
        cb(null, filename);
      }
    } catch (error) {
      console.error('Error in filename function:', error);
      cb(error);
    }
  }
});

// Configure the Multer upload object with limits and file filter
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // Limit each file size to 50MB
  },
  fileFilter: (req, file, cb) => {
    // Log the file information for debugging
    console.log("File being processed:", {
      fieldname: file.fieldname,
      originalname: file.originalname,
      mimetype: file.mimetype,
      extension: path.extname(file.originalname).toLowerCase()
    });

    if (file.fieldname === 'images') {
      const allowedTypes = /jpeg|jpg|png|gif|webp|svg|bmp|tiff/i;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const allowedMimetypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
        'image/bmp',
        'image/tiff'
      ];
      const mimetype = allowedMimetypes.includes(file.mimetype);

      if (extname || mimetype) {
        return cb(null, true);
      } else {
        console.log("Image validation failed:", {
          extname_valid: extname,
          mimetype_valid: mimetype,
          extension: path.extname(file.originalname).toLowerCase(),
          mimetype: file.mimetype
        });
        cb(new Error(`Only image files are allowed. Received: ${file.mimetype} with extension ${path.extname(file.originalname)}`), false);
      }
    } else if (file.fieldname === 'pdf') {
      const isPDF = file.mimetype === 'application/pdf' || 
                    path.extname(file.originalname).toLowerCase() === '.pdf';
      if (isPDF) {
        return cb(null, true);
      } else {
        cb(new Error(`Only PDF files are allowed for this field. Received: ${file.mimetype}`), false);
      }
    } else if (file.fieldname === 'msds') {
      const validExtensions = ['.pdf', '.doc', '.docx'];
      const validMimetypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      const extname = validExtensions.includes(path.extname(file.originalname).toLowerCase());
      const mimetype = validMimetypes.includes(file.mimetype);

      if (extname || mimetype) {
        return cb(null, true);
      } else {
        cb(new Error(`Only PDF, DOC, and DOCX files are allowed for MSDS. Received: ${file.mimetype}`), false);
      }
    } else {
      cb(null, true);
    }
  }
});

// Handle multiple files for "images" and single file for other fields
const uploadMiddleware = upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'msds', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]);

module.exports = uploadMiddleware;