 
const express = require('express');
const fs = require('fs');
const path = require('path');
const admin = require("./route/admin");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const sharp = require('sharp');
const compression = require('compression');
const app = express();
require('dotenv').config();  
const cookieParser = require('cookie-parser');
const { generateAllSitemaps } = require('./route/sitemap');
const handleDynamicRoutes = require('./route/serverMeta');
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json({ limit: '1000mb' }));
app.use(bodyParser.urlencoded({ limit: '1000mb', extended: true }));
app.use(compression({ threshold: 1024 }));
app.use(handleDynamicRoutes);  
// Custom image optimization route (Cache removed)
app.get('/images/:filename', async (req, res) => {
  const { filename } = req.params;
  const { w = 1200, q = 80, device = 'desktop' } = req.query;
  const imagePath = path.join(__dirname, 'public', 'download', filename);

  try {
    if (!fs.existsSync(imagePath)) return res.status(404).send('Image not found');

    const ua = req.headers['user-agent'] || '';
    let targetWidth = parseInt(w, 10);
    if (ua.includes('Mobile') || device === 'mobile') {
      targetWidth = Math.min(targetWidth, 600);
    }

    const optimizedImage = await sharp(imagePath)
      .resize({ width: targetWidth, withoutEnlargement: true })
      .webp({ quality: parseInt(q, 10) })
      .toBuffer();

    res.type('image/webp').send(optimizedImage);
  } catch (err) {
    console.error('Image processing error:', err);
    res.status(500).send('Image processing failed');
  }
});

// Static file serving with no caching
app.use(express.static(path.join(__dirname, 'public'), {
  etag: false,
  lastModified: false,
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'public, max-age=3600'); // cache for 1 hour
  }
}));

 
// API Routes
const apiRoutes = [
  ['/api/admin', admin],
  ['/api/supplier', require('./route/supplier')],
  ['/api/allHome', require('./route/allHomePage')],
  ['/api/brand', require('./route/brand')],
  ['/api/chemicalCategory', require('./route/chemicalCategory')],
  ['/api/chemical', require('./route/chemical')],
  ['/api/customer', require('./route/customer')], 
  ['/api/chemicalType', require('./route/chemicalType')],
  ['/api/unit', require('./route/unit')],
  ['/api/smtp', require('./route/smtp_setting')], 
  ['/api/inquiry', require('./route/inquiry')],
  ['/api/followUp', require('./route/followUp')],
  ['/api/status', require('./route/statusMaster')],
  ['/api/source', require('./route/sourceMaster')],
  ['/api/logo', require('./route/logo')],
  ['/api/count', require('./route/dashboard')],
  ['/api/image', require('./route/image')],
  ['/api/blogCategory', require('./route/blogCategory')],
  ['/api/blog', require('./route/blog')],
  ['/api/email', require('./route/email')], 
  ['/api/template', require('./route/emailTemplate')],
  ['/api/productInquiry', require('./route/productInquiry')],
  ['/api/sitemap', require('./route/sitemapRoute')],
  ['/api/banner', require('./route/banner')],
  ['/api/aboutus', require('./route/aboutUs')],
  ['/api/contactForm', require('./route/contactForm')],
  ['/api/chemicalMail', require('./route/chemicalMail')],
  ['/api/career', require('./route/carrer')],
  ['/api/contactinfo', require('./route/contactinfo')],
  ['/api/emailCategory', require('./route/emailCategory')],
  ['/api/companyLogo', require('./route/companyLogo')],
  ['/api/meta', require('./route/staticMeta')],
  ['/api/menulist', require('./route/menuListing')],
  ['/api/slideshow', require('./route/slideShow')],
  ['/api/whatsup', require('./route/whatsUpInfo')],
  ['/api/events', require('./route/events')],
  ['/api/blogCard', require('./route/blogCard')],
  ['/api/navigationLink', require('./route/NavigationLink')],
  ['/api/catalogue', require('./route/catalogue')],
  ['/api/privacy', require('./route/privacy')],
  ['/api/terms', require('./route/termscondition')],
  ['/api/careerInfo', require('./route/careerInfo')],
  ['/api/product', require('./route/product')],
  ['/api/companyInfo', require('./route/companyInfo')],
  ['/api/testimonial', require('./route/testimonial')],
  ['/api/industry', require('./route/industryExperty')],
  ['/api/missionVision', require('./route/missionVision')],
  ['/api/petrochemProduct', require('./route/petroChemProduct')],
];
 
// Apply routes
apiRoutes.forEach(([route, handler]) => {
  app.use(route, handler);
});

app.use(express.static(path.join(__dirname, 'dist'), {
  etag: false, 
  lastModified: false, 
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'dist, max-age=3600'); // cache for 1 hour
  }
}));

// Catch-all route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// MongoDB Connection 
mongoose.connect(process.env.DATABASE_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});
// Server startup 
const PORT = process.env.PORT || 3036;
app.listen(PORT, () => {
  console.log(`Environment Variables:`, {
    EMAIL_USER: process.env.EMAIL_USER ? 'Set' : 'Not Set',
    EMAIL_PASS: process.env.EMAIL_PASS ? 'Set' : 'Not Set',
  });
  console.log(`Server running on port ${PORT}`);
  // generateAllSitemaps(); // Generate sitemaps on startup
}); 
// SMTP Connection Test
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
}); 

transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP connection failed:', error);
  } else {
    console.log('SMTP connection successful');
  }
});