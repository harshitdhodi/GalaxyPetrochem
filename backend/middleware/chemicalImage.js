const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the necessary folders exist
const createFoldersIfNotExist = () => {
  const folders = ['uploads/images', 'uploads/documents', 'uploads/msds', 'uploads/specs'];
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
      case 'catalog':
        folder = 'uploads/documents';
        break;
      case 'msds':
        folder = 'uploads/msds';
        break;
      case 'specs':
        folder = 'uploads/specs';
        break;
      case 'resumeFile':
        folder = 'uploads/documents';
        break;
      default:
        folder = 'uploads';
    }
    
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
    
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}${ext}`;
    file.path = filename;
    cb(null, filename);
  }
});

// Configure the Multer upload object with limits and file filter
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // Limit each file size to 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'images') {
      // For images, check image formats
      const allowedTypes = /jpeg|jpg|png|gif|webp/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);

      if (extname && mimetype) {
        return cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'), false);
      }
    } else if (file.fieldname === 'catalog') {
      // For catalogs, check PDF format
      const isPDF = file.mimetype === 'application/pdf';
      if (isPDF) {
        return cb(null, true);
      } else {
        cb(new Error('Only PDF files are allowed for catalogs'), false);
      }
    } else if (file.fieldname === 'msds' || file.fieldname === 'specs') {
      // For MSDS and specs files, check allowed formats (PDF, DOC, DOCX)
      const isValidFormat = [
        'application/pdf',
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ].includes(file.mimetype);

      if (isValidFormat) {
        return cb(null, true);
      } else {
        cb(new Error(`Only PDF, DOC, and DOCX files are allowed for ${file.fieldname}`), false);
      }
    } else if (file.fieldname === 'resumeFile') {
      // For resumes, check allowed formats
      const isValidFormat = [
        'application/pdf',
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ].includes(file.mimetype);

      if (isValidFormat) {
        return cb(null, true);
      } else {
        cb(new Error('Only PDF, DOC, and DOCX files are allowed for resumes'), false);
      }
    } else {
      // Default case for other file types
      cb(null, true);
    }
  }
});

// Handle multiple files for "images" and single file for other fields
module.exports = upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'catalog', maxCount: 1 },
  { name: 'msds', maxCount: 1 },
  { name: 'specs', maxCount: 1 },
  { name: 'resumeFile', maxCount: 1 }
]);