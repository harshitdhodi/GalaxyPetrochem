const fs = require("fs");
const path = require("path");
const axios = require("axios");
const Sitemap = require("../model/sitemap");

// API endpoints with increased timeout
const axiosConfig = {
  timeout: 60000, // 60 seconds timeout
  headers: {
    'Content-Type': 'application/json'
  }
};

const BLOG_API_URL = "http://localhost:3036/api/blog/get";
const CHEMICAL_API_URL = "http://localhost:3036/api/petrochemProduct";
const BASE_URL = "https://www.galaxypetro.in";
const SITEMAP_API_URL = "http://localhost:3036/api/sitemap/get";
const PRODUCT_CATEGORY_API_URL = "http://localhost:3036/api/chemicalCategory/getAllCategories";
const PRODUCT_SUBCATEGORY_API_URL = "http://localhost:3036/api/chemicalCategory/getAllSubcategories";
const PRODUCT_IMAGES_API_URL = "http://localhost:3036/api/petrochemProduct/getAllProductImages";
const PUBLIC_DIR = path.join(__dirname, "..", "public");

// Helper function to fetch with retry logic
const fetchWithRetry = async (url, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.get(url, axiosConfig);
      return response.data;
    } catch (error) {
      if (i === retries - 1) throw error;
      console.log(`Retry ${i + 1} for ${url}`);
      await new Promise(res => setTimeout(res, delay * (i + 1)));
    }
  }
};

// Generate blog sitemap (unchanged)
const generateBlogSitemap = async () => {
  try {
    console.log('Fetching blogs...');
    const response = await fetchWithRetry(BLOG_API_URL);
    const blogs = Array.isArray(response) ? response : [];
    console.log(`Fetched ${blogs.length} blogs`);

    let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xmlContent += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    blogs.forEach((blog) => {
      xmlContent += `  <url>\n`;
      xmlContent += `    <loc>${BASE_URL}/${blog.slug}</loc>\n`;
      xmlContent += `    <lastmod>${new Date(blog.updatedAt).toISOString()}</lastmod>\n`;
      xmlContent += `    <changefreq>weekly</changefreq>\n`;
      xmlContent += `    <priority>0.8</priority>\n`;
      xmlContent += `  </url>\n`;
    });

    xmlContent += `</urlset>`;

    if (!fs.existsSync(PUBLIC_DIR)) {
      fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    }

    const sitemapPath = path.join(PUBLIC_DIR, "blog-sitemap.xml");
    fs.writeFileSync(sitemapPath, xmlContent);

    console.log("Blog sitemap generated successfully as blog-sitemap.xml");

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

// Generate chemical sitemap (unchanged)
const generateChemicalSitemap = async () => {
  try {
    console.log('Fetching chemicals...');
    const response = await fetchWithRetry(CHEMICAL_API_URL);
    const chemicals = Array.isArray(response) ? response : [];
    console.log(`Fetched ${chemicals.length} chemicals`);
    let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xmlContent += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    chemicals.forEach((chemical) => {
      xmlContent += `  <url>\n`;
      xmlContent += `    <loc>${BASE_URL}/${chemical.subCategorySlug}/${chemical.slug}</loc>\n`;
      xmlContent += `    <lastmod>${new Date(chemical.updatedAt).toISOString()}</lastmod>\n`;
      xmlContent += `    <changefreq>weekly</changefreq>\n`;
      xmlContent += `    <priority>0.8</priority>\n`;
      xmlContent += `  </url>\n`;
    });

    xmlContent += `</urlset>`;

    if (!fs.existsSync(PUBLIC_DIR)) {
      fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    }

    const sitemapPath = path.join(PUBLIC_DIR, "chemical-sitemap.xml");
    fs.writeFileSync(sitemapPath, xmlContent);

    console.log("Chemical sitemap generated successfully as chemical-sitemap.xml");

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

// Generate product category sitemap
// Generate XML sitemap content for categories
const generateSitemapXML = (categories) => {
  let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xmlContent += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  categories.forEach((category) => {
    // Validate required fields
    if (!category.slug) {
      console.warn(`Category missing slug:`, category._id || 'unknown');
      return;
    }

    // Construct URL
    const categoryUrl = `${BASE_URL}/${category.slug}`;
    
    // Get last modified date
    const lastmod = category.updatedAt || category.lastmod || new Date().toISOString();
    const formattedDate = new Date(lastmod).toISOString();
    
    // Get priority (use category priority or default)
    const priority = category.priority || 0.8;
    
    // Get change frequency
    const changefreq = category.changeFreq || 'weekly';

    xmlContent += `  <url>\n`;
    xmlContent += `    <loc>${escapeXml(categoryUrl)}</loc>\n`;
    xmlContent += `    <lastmod>${formattedDate}</lastmod>\n`;
    xmlContent += `    <changefreq>${changefreq}</changefreq>\n`;
    xmlContent += `    <priority>${priority}</priority>\n`;
    xmlContent += `  </url>\n`;

    // Include subcategories if they exist
    if (category.subCategories && Array.isArray(category.subCategories) && category.subCategories.length > 0) {
      category.subCategories.forEach((subCategory) => {
        if (subCategory.slug) {
          const subCategoryUrl = `${BASE_URL}/${category.slug}/${subCategory.slug}`;
          const subLastmod = subCategory.updatedAt || subCategory.lastmod || formattedDate;
          const subPriority = subCategory.priority || (priority * 0.8); // Slightly lower priority for subcategories
          
          xmlContent += `  <url>\n`;
          xmlContent += `    <loc>${escapeXml(subCategoryUrl)}</loc>\n`;
          xmlContent += `    <lastmod>${new Date(subLastmod).toISOString()}</lastmod>\n`;
          xmlContent += `    <changefreq>${subCategory.changeFreq || changefreq}</changefreq>\n`;
          xmlContent += `    <priority>${subPriority}</priority>\n`;
          xmlContent += `  </url>\n`;
        }
      });
    }
  });

  xmlContent += `</urlset>`;
  return xmlContent;
};

// Utility function to escape XML special characters
const escapeXml = (unsafe) => {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
};

// Update database record function
const updateSitemapRecord = async () => {
  try {
    await Sitemap.findOneAndUpdate(
      { name: "category-sitemap.xml" },
      { 
        timestamp: Date.now()
      },
      { upsert: true, new: true }
    );
    console.log("Category sitemap record updated in the database");
  } catch (error) {
    console.error("Failed to update database record:", error);
    throw error;
  }
};

// Updated Generate product category sitemap function
const generateCategorySitemap = async () => {
  try {
    console.log('Fetching categories...');
    const response = await fetchWithRetry(PRODUCT_CATEGORY_API_URL);
    
    // Handle different response structures
    let categories = [];
    if (response && response.categories && Array.isArray(response.categories)) {
      categories = response.categories;
    } else if (Array.isArray(response)) {
      categories = response;
    } else if (response && Array.isArray(response.data)) {
      categories = response.data;
    }
    
    console.log(`Fetched ${categories.length} categories`);

    if (categories.length === 0) {
      console.warn('No categories found to generate sitemap');
      return;
    }

    // Generate XML sitemap using the helper function
    let xmlContent = generateSitemapXML(categories);

    // Ensure public directory exists
    if (!fs.existsSync(PUBLIC_DIR)) {
      fs.mkdirSync(PUBLIC_DIR, { recursive: true });
      console.log(`Created directory: ${PUBLIC_DIR}`);
    }

    // Write sitemap file
    const sitemapPath = path.join(PUBLIC_DIR, "category-sitemap.xml");
    fs.writeFileSync(sitemapPath, xmlContent, 'utf8');
    console.log(`Category sitemap generated successfully at: ${sitemapPath}`);

    // Update database record
    await updateSitemapRecord();

    return {
      success: true,
      path: sitemapPath,
      categoriesCount: categories.length
    };

  } catch (error) {
    console.error("Error generating category sitemap:", error);
    if (error.response) {
      console.error("API Response Data:", error.response.data);
      console.error("API Response Status:", error.response.status);
    }
    throw error;
  }
};

// Generate product subcategory sitemap
const generateSubcategorySitemap = async () => {
  try {
    console.log('Fetching subcategories...');
    const response = await fetchWithRetry(PRODUCT_SUBCATEGORY_API_URL);
    const categoriesWithSubs = response.data || [];

    let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xmlContent += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    categoriesWithSubs.forEach((category) => {
      const { categorySlug, subCategories } = category;

      subCategories.forEach((subcategory) => {
        xmlContent += `  <url>\n`;
        xmlContent += `    <loc>${BASE_URL}/${categorySlug}/${subcategory.slug}</loc>\n`;
        xmlContent += `    <lastmod>${new Date(subcategory.updatedAt || Date.now()).toISOString()}</lastmod>\n`;
        xmlContent += `    <changefreq>weekly</changefreq>\n`;
        xmlContent += `    <priority>0.8</priority>\n`;
        xmlContent += `  </url>\n`;
      });
    });

    xmlContent += `</urlset>`;

    if (!fs.existsSync(PUBLIC_DIR)) {
      fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    }

    const sitemapPath = path.join(PUBLIC_DIR, "subcategory-sitemap.xml");
    fs.writeFileSync(sitemapPath, xmlContent);

    console.log("✅ Subcategory sitemap generated as subcategory-sitemap.xml");

    await Sitemap.findOneAndUpdate(
      { name: "subcategory-sitemap.xml" },
      { timestamp: Date.now() },
      { upsert: true, new: true }
    );

    console.log("✅ Subcategory sitemap record updated in DB");
  } catch (error) {
    console.error("❌ Error generating subcategory sitemap:", error);
  }
};


// Generate main sitemap with specific sitemap order
const generateMainSitemap = async () => {
  try {
    // Get all sitemaps from the database
    const allSitemaps = await Sitemap.find({}).lean();
    
    // Define the desired order of sitemaps
    const sitemapOrder = [
      'sitemap1.xml',
      'chemical-sitemap.xml',
      'category-sitemap.xml',
      'subcategory-sitemap.xml',
      'blog-sitemap.xml',
      'product-image-sitemap.xml'
    ];
    
    // Create a map of sitemaps for quick lookup
    const sitemapMap = new Map();
    allSitemaps.forEach(sitemap => {
      sitemapMap.set(sitemap.name, sitemap);
    });

    let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xmlContent += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Generate sitemap entries in the specified order
    sitemapOrder.forEach(sitemapName => {
      const sitemap = sitemapMap.get(sitemapName);
      if (sitemap) {
        xmlContent += `  <sitemap>\n`;
        xmlContent += `    <loc>${BASE_URL}/${sitemap.name}</loc>\n`;
        xmlContent += `    <lastmod>${new Date(sitemap.timestamp).toISOString()}</lastmod>\n`;
        xmlContent += `  </sitemap>\n`;
      }
    });

    xmlContent += `</sitemapindex>`;

    if (!fs.existsSync(PUBLIC_DIR)) {
      fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    }

    const sitemapPath = path.join(PUBLIC_DIR, "sitemap.xml");
    fs.writeFileSync(sitemapPath, xmlContent);

    console.log("Main sitemap generated successfully as sitemap.xml");

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


const generateStaticPagesSitemap = async () => {
  try {
      console.log('Generating static pages sitemap');

      const staticPages = [
        { slug: '', priority: 1 },
          { slug: 'about-us', priority: 0.8 },
          {slug: 'products', priority: 0.8 },
          {slug: 'brands', priority: 0.8 },
          {slug: 'blogs', priority: 0.8 },
          { slug: 'contact-us', priority: 0.8 },
      ];

      let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      xmlContent += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

      staticPages.forEach((page) => {
          xmlContent += `  <url>\n`;
          xmlContent += `    <loc>${BASE_URL}/${page.slug}</loc>\n`;
          xmlContent += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
          xmlContent += `    <changefreq>monthly</changefreq>\n`;
          xmlContent += `    <priority>${page.priority}</priority>\n`;
          xmlContent += `  </url>\n`;
      });

      xmlContent += `</urlset>`;

      if (!fs.existsSync(PUBLIC_DIR)) {
          console.log('Creating public directory:', PUBLIC_DIR);
          fs.mkdirSync(PUBLIC_DIR, { recursive: true });
      }

      const sitemapPath = path.join(PUBLIC_DIR, 'sitemap1.xml');
      console.log('Writing static pages sitemap to:', sitemapPath);
      fs.writeFileSync(sitemapPath, xmlContent, { encoding: 'utf8' });

      console.log('Static pages sitemap generated successfully as sitemap1.xml');

      await Sitemap.findOneAndUpdate(
          { name: 'sitemap1.xml' },
          { timestamp: Date.now(), priority: 0.8 }, // Store priority
          { upsert: true, new: true }
      );

      console.log('Static pages sitemap record updated in the database');
  } catch (error) {
      console.error('Error generating static pages sitemap:', error.message);
      throw error;
  }
};


const generateProductImageSitemap = async () => {
  try {
    console.log('Fetching product images...');
    const response = await fetchWithRetry(PRODUCT_IMAGES_API_URL);
    const products = (response && response.images) || [];
    console.log(`Fetched ${products.length} product images`);

    let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xmlContent += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
    xmlContent += `xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

    // Iterate through products and their images
    products.forEach((product) => {
      product.images.forEach((image) => {
        if (image.url) {
          const imageUrl = `${BASE_URL}/api/image/download/${image.url}`;
          xmlContent += `  <url>\n`;
          xmlContent += `    <loc>${imageUrl}</loc>\n`; // Use image URL as the primary URL
          xmlContent += `    <lastmod>${new Date(Date.now()).toISOString()}</lastmod>\n`;
          xmlContent += `    <image:image>\n`;
          xmlContent += `      <image:loc>${imageUrl}</image:loc>\n`;
          if (image.title) {
            xmlContent += `      <image:title>${image.title}</image:title>\n`;
          }
          if (image.altText) {
            xmlContent += `      <image:caption>${image.altText}</image:caption>\n`;
          }
          xmlContent += `    </image:image>\n`;
          xmlContent += `  </url>\n`;
        }
      });
    });

    xmlContent += `</urlset>`;

    if (!fs.existsSync(PUBLIC_DIR)) {
      fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    }

    const sitemapPath = path.join(PUBLIC_DIR, "product-image-sitemap.xml");
    fs.writeFileSync(sitemapPath, xmlContent);

    console.log("✅ Product image sitemap generated as product-image-sitemap.xml");

    await Sitemap.findOneAndUpdate(
      { name: "product-image-sitemap.xml" },
      { timestamp: Date.now() },
      { upsert: true, new: true }
    );

    console.log("✅ Image sitemap record updated in DB");
  } catch (error) {
    console.error("❌ Error generating product image sitemap:", error.message);
    if (error.isAxiosError) {
      console.error("Axios Error Details:", error.config.url, error.response?.status);
    }
  }
};

// Generate all sitemaps (updated to include new sitemaps)
const generateAllSitemaps = async () => {
  try {
    // Generate individual sitemaps first
    await generateBlogSitemap();
    await generateChemicalSitemap();
    await generateCategorySitemap();
    await generateSubcategorySitemap();
    await generateStaticPagesSitemap();
    await generateProductImageSitemap();
    
    // Generate main sitemap last to include all others
    await generateMainSitemap();
    
    console.log('✅ All sitemaps generated successfully');
  } catch (error) {
    console.error('❌ Error generating sitemaps:', error);
    throw error;
  }
};

module.exports = { 
  generateBlogSitemap, 
  generateChemicalSitemap,
  generateCategorySitemap,
  generateSubcategorySitemap,
  generateMainSitemap,
  generateAllSitemaps ,
  generateStaticPagesSitemap, // Export the new function
  generateProductImageSitemap // Export the new function
};