const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { generateBlogSitemap, generateChemicalSitemap } = require('./sitemap');
const {getAllSitemaps} = require("../controller/sitemap")
// Route to generate blog sitemap
router.get('/generate-blog-sitemap', async (req, res) => {
  try {
    await generateBlogSitemap();
    
    // Read the generated sitemap file
    const publicDir = path.resolve(__dirname, "public");
    const sitemapPath = path.join(publicDir, "blog-sitemap.xml");
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');

    res.status(200).json({ 
      success: true, 
      message: 'Blog sitemap generated successfully',
      data: {
        filename: 'blog-sitemap.xml',
        content: sitemapContent,
        path: sitemapPath
      }
    });
  } catch (error) {
    console.error('Error in blog sitemap generation route:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate blog sitemap',
      error: error.message 
    });
  }
});

// Route to generate chemical sitemap
router.get('/generate-chemical-sitemap', async (req, res) => {
  try {
    await generateChemicalSitemap();
    
    // Read the generated sitemap file
    const publicDir = path.resolve(__dirname, "public");
    const sitemapPath = path.join(publicDir, "chemical-sitemap.xml");
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');

    res.status(200).json({ 
      success: true, 
      message: 'Chemical sitemap generated successfully',
      data: {
        filename: 'chemical-sitemap.xml',
        content: sitemapContent,
        path: sitemapPath
      }
    });
  } catch (error) {
    console.error('Error in chemical sitemap generation route:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate chemical sitemap',
      error: error.message 
    });
  }
});

// Route to view existing blog sitemap
router.get('/view-blog-sitemap', (req, res) => {
  try {
    const publicDir = path.resolve(__dirname, "public");
    const sitemapPath = path.join(publicDir, "blog-sitemap.xml");
    
    if (!fs.existsSync(sitemapPath)) {
      return res.status(404).json({
        success: false,
        message: 'Blog sitemap file not found. Generate it first.'
      });
    }

    const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
    res.status(200).json({
      success: true,
      data: {
        filename: 'blog-sitemap.xml',
        content: sitemapContent,
        path: sitemapPath
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to read blog sitemap',
      error: error.message
    });
  }
});

// Route to view existing chemical sitemap
router.get('/view-chemical-sitemap', (req, res) => {
  try {
    const publicDir = path.resolve(__dirname, "public");
    const sitemapPath = path.join(publicDir, "chemical-sitemap.xml");
    
    if (!fs.existsSync(sitemapPath)) {
      return res.status(404).json({
        success: false,
        message: 'Chemical sitemap file not found. Generate it first.'
      });
    }

    const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
    res.status(200).json({
      success: true,
      data: {
        filename: 'chemical-sitemap.xml',
        content: sitemapContent,
        path: sitemapPath
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to read chemical sitemap',
      error: error.message
    });
  }
});

router.get('/get', getAllSitemaps);
module.exports = router;