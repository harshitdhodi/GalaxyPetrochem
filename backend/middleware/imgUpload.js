const fs = require('fs');
const path = require('path');
const multer = require('multer');
const sharp = require('sharp');

// Ensure directories exist
const ensureDirectory = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

// Define directories
const imageDir = path.join(__dirname, '../uploads2/images');
const catalogueDir = path.join(__dirname, '../uploads2/catalogs');
const photoDir = path.join(__dirname, '../uploads2/photos');
const videoDir = path.join(__dirname, '../uploads2/videos');

// Ensure all directories exist
ensureDirectory(imageDir);
ensureDirectory(catalogueDir);
ensureDirectory(photoDir);
ensureDirectory(videoDir);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let dir = 'uploads2/images'; // Default directory for images
        
        // Choose directory based on file type
        if (file.mimetype === 'application/pdf') {
            dir = 'uploads2/catalogs';
        } else if (file.mimetype.startsWith('image')) {
            dir = 'uploads2/images';
        } else if (file.mimetype.startsWith('video')) {
            dir = 'uploads2/videos';
        } else if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/svg+xml') {
            dir = 'uploads2/photos';
        }

        // Ensure the chosen directory exists
        const fullDir = path.join(__dirname, `../${dir}`);
        ensureDirectory(fullDir);

        cb(null, fullDir);
    },
    filename: (req, file, cb) => {
        let fileName;

        // Set file name based on the file field name
        if (file.fieldname === 'catalogue') {
            fileName = file.originalname;
            req.fileName = fileName;
        } else {
            fileName = `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`;
        }
        cb(null, fileName);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
    fileFilter: function (req, file, cb) {
        const allowedMimeTypes = {
            catalogue: ['application/pdf'],
            photo: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/svg+xml'],
            video: ['video/mp4', 'video/mkv', 'video/avi', 'video/mov'],
            image: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/svg+xml']
        };
        const allowedTypes = allowedMimeTypes[file.fieldname];
        if (allowedTypes && allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Invalid file type for ${file.fieldname}`));
        }
    }
});

// Function to process images (only resize if needed, maintain original format)
const processImage = (inputPath, outputPath, originalFormat) => {
    // Skip processing for SVG files
    if (originalFormat === 'svg') {
        fs.copyFileSync(inputPath, outputPath);
        console.log('SVG file copied without processing');
        return;
    }

    sharp(inputPath)
        .resize({ width: 1024, withoutEnlargement: true }) // Resize only if larger than 1024px, don't upscale
        .toFormat(originalFormat, { quality: 100 }) // Keep original format and maximum quality
        .toFile(outputPath, (err, info) => {
            if (err) {
                console.error('Error processing image:', err);
            } else {
                console.log('Image processed successfully:', info);
            }
        });
};

const image = (req, res, next) => {
    upload.fields([
        { name: 'catalogue', maxCount: 1 },
        { name: 'photo', maxCount: 5 },
        { name: 'video', maxCount: 1 },
        { name: 'image', maxCount: 10 }
    ])(req, res, function (err) {
        if (err) {
            return res.status(400).send({ error: err.message });
        }

        // Process image files (after upload)
        if (req.files && req.files.photo) {
            req.files.photo.forEach(file => {
                const inputPath = path.join(__dirname, `../uploads2/photos/${file.filename}`);
                const outputPath = inputPath; // Keep same path to overwrite
                const originalFormat = file.mimetype === 'image/svg+xml' ? 'svg' : path.extname(file.originalname).slice(1).toLowerCase();
                processImage(inputPath, outputPath, originalFormat);
            });
        }

        // Process regular image files
        if (req.files && req.files.image) {
            req.files.image.forEach(file => {
                const inputPath = path.join(__dirname, `../uploads2/images/${file.filename}`);
                const outputPath = inputPath;
                const originalFormat = file.mimetype === 'image/svg+xml' ? 'svg' : path.extname(file.originalname).slice(1).toLowerCase();
                processImage(inputPath, outputPath, originalFormat);
            });
        }

        // Continue with the next middleware
        next();
    });
};

module.exports = image;