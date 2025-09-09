const fs = require('fs').promises; // Use promises for async file operations
const path = require('path');
const multer = require('multer');

// Ensure directories exist
const ensureDirectory = async (dir) => {
    try {
        await fs.access(dir);
    } catch {
        await fs.mkdir(dir, { recursive: true });
    }
};

// Define directories
const imageDir = path.join(__dirname, '../uploads2/images');
const catalogueDir = path.join(__dirname, '../uploads2/catalogs');
const photoDir = path.join(__dirname, '../uploads2/photos');
const videoDir = path.join(__dirname, '../uploads2/videos');

// Ensure all directories exist
(async () => {
    await Promise.all([
        ensureDirectory(imageDir),
        ensureDirectory(catalogueDir),
        ensureDirectory(photoDir),
        ensureDirectory(videoDir),
    ]);
})();

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
        ensureDirectory(fullDir).then(() => cb(null, fullDir));
    },
    filename: (req, file, cb) => {
        // Generate filename with timestamp and original extension
        const timestamp = Date.now();
        const extension = path.extname(file.originalname).toLowerCase();
        const filename = `image_${timestamp}${extension}`;
        cb(null, filename);
    },
});

const upload = multer({
    storage: storage,
    preservePath: true, // Preserve the full path
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
    fileFilter: function (req, file, cb) {
        const allowedMimeTypes = {
            catalogue: ['application/pdf'],
            photo: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/svg+xml'],
            video: ['video/mp4', 'video/mkv', 'video/avi', 'video/mov'],
            image: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/svg+xml'],
        };
        const allowedTypes = allowedMimeTypes[file.fieldname];
        if (allowedTypes && allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Invalid file type for ${file.fieldname}`));
        }
    },
});

const image = (req, res, next) => {
    upload.fields([
        { name: 'catalogue', maxCount: 1 },
        { name: 'photo', maxCount: 5 },
        { name: 'video', maxCount: 1 },
        { name: 'image', maxCount: 10 },
    ])(req, res, function (err) {
        if (err) {
            return res.status(400).send({ error: err.message });
        }

        // Just log the uploaded files without any processing
        if (req.files) {
            Object.entries(req.files).forEach(([field, files]) => {
                files.forEach(file => {
                    console.log(`File uploaded: ${file.originalname} to ${field} directory`);
                });
            });
        }

        next();
    });
};

module.exports = image;