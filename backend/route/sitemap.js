const fs = require("fs");
const path = require("path");
const axios = require("axios");
const Sitemap = require("../model/sitemap");

// API endpoints
const BLOG_API_URL = "http://localhost:3028/api/blog/get";
const CHEMICAL_API_URL = "http://localhost:3028/api/chemical/get";
const BASE_URL = "http://localhost:3028";
const SITEMAP_API_URL = "http://localhost:3028/api/sitemap/get";

// Update the file paths
const PUBLIC_DIR = path.join(__dirname, "..", "public"); // Go up one level to reach the main backend directory

// Generate blog sitemap
const generateBlogSitemap = async () => {
  try {
    const response = await axios.get(BLOG_API_URL);
    const blogs = response.data;

    let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xmlContent += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    blogs.forEach((blog) => {
      xmlContent += `  <url>\n`;
      xmlContent += `    <loc>${BASE_URL}/blog/${blog.slug}</loc>\n`;
      xmlContent += `    <lastmod>${new Date(blog.updatedAt).toISOString()}</lastmod>\n`;
      xmlContent += `    <changefreq>weekly</changefreq>\n`;
      xmlContent += `    <priority>0.8</priority>\n`;
      xmlContent += `  </url>\n`;
    });

    xmlContent += `</urlset>`;

    // Use the updated PUBLIC_DIR
    if (!fs.existsSync(PUBLIC_DIR)) {
      fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    }

    const sitemapPath = path.join(PUBLIC_DIR, "blog-sitemap.xml");
    fs.writeFileSync(sitemapPath, xmlContent);

    console.log("Blog sitemap generated successfully as blog-sitemap.xml");

    // Update database record for blog sitemap
    await Sitemap.findOneAndUpdate(
      { name: "blog-sitemap.xml" },
      { timestamp: Date.now() },
      { upsert: true, new: true }
    );

    console.log("Blog sitemap record updated in the database");
  } catch (error) {
    console.error("Error generating blog sitemap:", error);
  }
};

// Generate chemical sitemap
const generateChemicalSitemap = async () => {
  try {
    const response = await axios.get(CHEMICAL_API_URL);
    const chemicals = response.data;

    let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xmlContent += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    chemicals.forEach((chemical) => {
      xmlContent += `  <url>\n`;
      xmlContent += `    <loc>${BASE_URL}/${chemical.slug}</loc>\n`;
      xmlContent += `    <lastmod>${new Date(chemical.updatedAt).toISOString()}</lastmod>\n`;
      xmlContent += `    <changefreq>weekly</changefreq>\n`;
      xmlContent += `    <priority>0.8</priority>\n`;
      xmlContent += `  </url>\n`;
    });

    xmlContent += `</urlset>`;

    // Use the updated PUBLIC_DIR   
    if (!fs.existsSync(PUBLIC_DIR)) {
      fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    }

    const sitemapPath = path.join(PUBLIC_DIR, "chemical-sitemap.xml");
    fs.writeFileSync(sitemapPath, xmlContent);

    console.log("Chemical sitemap generated successfully as chemical-sitemap.xml");

    // Update database record for chemical sitemap
    await Sitemap.findOneAndUpdate(
      { name: "chemical-sitemap.xml" },
      { timestamp: Date.now() },
      { upsert: true, new: true }
    );

    console.log("Chemical sitemap record updated in the database");
  } catch (error) {
    console.error("Error generating chemical sitemap:", error);
  }
};

// Generate main sitemap
const generateMainSitemap = async () => {
  try {
    const response = await axios.get(SITEMAP_API_URL);
    const items = response.data.data;

    let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xmlContent += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    items.forEach((item) => {
      xmlContent += `  <url>\n`;
      xmlContent += `    <loc>${BASE_URL}/${item.name}</loc>\n`;
      xmlContent += `    <lastmod>${new Date(item.timestamp).toISOString()}</lastmod>\n`;
      xmlContent += `    <changefreq>daily</changefreq>\n`;
      xmlContent += `    <priority>1.0</priority>\n`;
      xmlContent += `  </url>\n`;
    });

    xmlContent += `</urlset>`;

    // Use the updated PUBLIC_DIR
    if (!fs.existsSync(PUBLIC_DIR)) {
      fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    }

    const sitemapPath = path.join(PUBLIC_DIR, "sitemap.xml");
    fs.writeFileSync(sitemapPath, xmlContent);

    console.log("Main sitemap generated successfully as sitemap.xml");

    // Update database record for main sitemap
    await Sitemap.findOneAndUpdate(
      { name: "sitemap.xml" },
      { timestamp: Date.now() },
      { upsert: true, new: true }
    );

    console.log("Main sitemap record updated in the database");
  } catch (error) {
    console.error("Error generating main sitemap:", error);
    if (error.response) {
      console.error("API Response Data:", error.response.data);
      console.error("API Response Status:", error.response.status);
    }
  }
};

// Generate all sitemaps
const generateAllSitemaps = async () => {
  await generateMainSitemap();
  await generateBlogSitemap();
  await generateChemicalSitemap();
};

module.exports = { 
  generateBlogSitemap, 
  generateChemicalSitemap, 
  generateMainSitemap, 
  generateAllSitemaps 
};