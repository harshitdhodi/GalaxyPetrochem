const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Add size constants for clarity
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_FILES = 5;
const MAX_PDF_SIZE = 100 * 1024 * 1024; // 100MB for PDFs

// Set storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let dir = 'uploads/images';
        
        // Choose directory based on file type
        if (file.mimetype === 'application/pdf') {
            dir = 'uploads/catalogs';
        }

        // Ensure directory exists
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        // Preserve the original file extension and name
        const ext = path.extname(file.originalname).toLowerCase();
        const fileName = `${file.fieldname}_${Date.now()}${ext}`;
        cb(null, fileName);
    }
});

// Strengthen file filter with additional mime type checking
const fileFilter = (req, file, cb) => {
    const allowedImageMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const allowedPdfMimeType = 'application/pdf';
    
    if (file.mimetype === allowedPdfMimeType || allowedImageMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, WebP images and PDF files are allowed.'));
    }
};

// Update upload configuration to handle both images and catalogs
const upload = multer({
    storage: storage,
    limits: { 
        fileSize: MAX_FILE_SIZE  // Use the appropriate size limit for images
    },
    fileFilter: fileFilter
}).fields([
    { name: 'image', maxCount: MAX_FILES },
    { name: 'catalog', maxCount: 1 },
    { name: 'photo', maxCount: MAX_FILES },
]);

// Wrap multer in a more robust error handler
const image = (req, res, next) => {
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ error: `File size too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB` });
            }
            if (err.code === 'LIMIT_FILE_COUNT') {
                return res.status(400).json({ error: `Too many files. Maximum is ${MAX_FILES} files` });
            }
            return res.status(400).json({ error: err.message });
        } else if (err) {
            return res.status(400).json({ error: err.message });
        }
        next();
    });
}; 

module.exports = image;