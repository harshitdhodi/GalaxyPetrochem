const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the necessary folders exist
const createFoldersIfNotExist = () => {
  const folders = ['uploads/images', 'uploads/msds', 'uploads/pdf'];
  folders.forEach(folder => {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  });
};

// Call the function to create folders
createFoldersIfNotExist();

// Set up storage for files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create separate folders for different file types
    let folder;
    
    switch (file.fieldname) {
      case 'images':
        folder = 'uploads/images';
        break;
      case 'msds':
        folder = 'uploads/msds';
        break;
      case 'pdf':
        folder = 'uploads/pdf';
        break;
      default:
        folder = 'uploads';
    }
    
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}${ext}`;
    cb(null, filename);
  }
});

// Configure the Multer upload object with limits and file filter
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // Limit each file size to 10MB
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
      // For images, check image formats - add more accepted types
      const allowedTypes = /jpeg|jpg|png|gif|webp|svg|bmp|tiff/i;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      
      // Expand the accepted mimetypes
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

      if (extname || mimetype) {  // Changed from AND to OR for more leniency
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
      // For PDF files, check PDF format
      const isPDF = file.mimetype === 'application/pdf' || path.extname(file.originalname).toLowerCase() === '.pdf';
      if (isPDF) {
        return cb(null, true);
      } else {
        cb(new Error(`Only PDF files are allowed for this field. Received: ${file.mimetype}`), false);
      }
    } else if (file.fieldname === 'msds') {
      // For MSDS files, check allowed formats (PDF, DOC, DOCX)
      const validExtensions = ['.pdf', '.doc', '.docx'];
      const validMimetypes = [
        'application/pdf',
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      const extname = validExtensions.includes(path.extname(file.originalname).toLowerCase());
      const mimetype = validMimetypes.includes(file.mimetype);

      if (extname || mimetype) {  // Changed from AND to OR for more leniency
        return cb(null, true);
      } else {
        cb(new Error(`Only PDF, DOC, and DOCX files are allowed for MSDS. Received: ${file.mimetype}`), false);
      }
    } else {
      // Default case for other file types
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