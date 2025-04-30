const fs = require("fs");
const path = require("path");
const axios = require("axios");
const Sitemap = require("../model/sitemap");

// API endpoints
const BLOG_API_URL = "http://localhost:3036/api/blog/get";
const CHEMICAL_API_URL = "http://localhost:3036/api/petrochemProduct";
const BASE_URL = "http://localhost:3036";
const SITEMAP_API_URL = "http://localhost:3036/api/sitemap/get";
const PRODUCT_CATEGORY_API_URL = "http://localhost:3036/api/chemicalCategory/getAllCategories";
const PRODUCT_SUBCATEGORY_API_URL = "http://localhost:3036/api/chemicalCategory/getAllSubcategories";
const PRODUCT_IMAGES_API_URL = "http://localhost:3036/api/petrochemProduct/getAllProductImages"; // Adjusted to match the new endpoint
const PUBLIC_DIR = path.join(__dirname, "..", "public");

// Generate blog sitemap (unchanged)
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
    const response = await axios.get(CHEMICAL_API_URL);
    const chemicals = response.data;
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
const generateCategorySitemap = async () => {
  try {
    const response = await axios.get(PRODUCT_CATEGORY_API_URL);
    const categories = response.data.categories || []; // Adjusted to handle the response structure

    let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xmlContent += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    categories.forEach((category) => {
      xmlContent += `  <url>\n`;
      xmlContent += `    <loc>${BASE_URL}/${category.slug}</loc>\n`;
      xmlContent += `    <lastmod>${new Date(category.updatedAt || Date.now()).toISOString()}</lastmod>\n`;
      xmlContent += `    <changefreq>weekly</changefreq>\n`;
      xmlContent += `    <priority>0.9</priority>\n`;
      xmlContent += `  </url>\n`;
    });

    xmlContent += `</urlset>`;

    if (!fs.existsSync(PUBLIC_DIR)) {
      fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    }

    const sitemapPath = path.join(PUBLIC_DIR, "category-sitemap.xml");
    fs.writeFileSync(sitemapPath, xmlContent);

    console.log("Category sitemap generated successfully as category-sitemap.xml");

    await Sitemap.findOneAndUpdate(
      { name: "category-sitemap.xml" },
      { timestamp: Date.now() },
      { upsert: true, new: true }
    );

    console.log("Category sitemap record updated in the database");
  } catch (error) {
    console.error("Error generating category sitemap:", error);
  }
};

// Generate product subcategory sitemap
const generateSubcategorySitemap = async () => {
  try {
    const response = await axios.get(PRODUCT_SUBCATEGORY_API_URL);
    const categoriesWithSubs = response.data.data || [];

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


// Generate main sitemap (updated to include category and subcategory sitemaps)
const generateMainSitemap = async () => {
  try {
    const response = await axios.get(SITEMAP_API_URL);
    const items = response.data.data;

    let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xmlContent += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    items.forEach((item) => {
      xmlContent += `  <sitemap>\n`;
      xmlContent += `    <loc>${BASE_URL}/${item.name}</loc>\n`;
      xmlContent += `    <lastmod>${new Date(item.timestamp).toISOString()}</lastmod>\n`;
      xmlContent += `  </sitemap>\n`;
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
          { slug: 'about-us', priority: 0.8 },
          {slug: 'products', priority: 0.8 },
          {slug: 'Brands', priority: 0.8 },
          {slug: 'Blogs', priority: 0.8 },
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
    console.log("Fetching from:", PRODUCT_IMAGES_API_URL);
    const response = await axios.get(PRODUCT_IMAGES_API_URL);
    console.log("Response data:", response.data);
    const products = response.data.images || [];
    console.log("Products data:", products);

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
  await generateMainSitemap();
  await generateBlogSitemap();
  await generateChemicalSitemap();
  await generateCategorySitemap();
  await generateSubcategorySitemap();
  await generateStaticPagesSitemap(); // Call the new function
  await generateProductImageSitemap(); // Call the new function
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