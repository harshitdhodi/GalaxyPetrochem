const express = require('express');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const axios = require('axios'); // For HTTP requests
const Meta = require('../model/staticMeta'); // Adjust path as needed

const router = express.Router();

router.get('*', async (req, res, next) => {
  if (
    req.url.startsWith('/api/') ||
    /\.(js|css|ico|png|jpg|webmanifest)$/.test(req.url)
  ) {
    return next();
  }

  try {
    const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
    if (!fs.existsSync(indexPath)) {
      console.error('index.html not found at:', indexPath);
      return res.status(404).send('index.html not found');
    }

    const indexHtml = fs.readFileSync(indexPath, 'utf8');
    const $ = cheerio.load(indexHtml);
    let metaInfo = {
      title: 'Default Title',
      description: 'Default Description',
      keywords: '',
      ogImage: ''
    };

    const currentPath = req.path.replace(/^\/|\/$/g, '') || 'home';
    let isStaticPage = false;

    const pageData = await Meta.findOne({
      $or: [{ pageSlug: currentPath }, { pageSlug: `/${currentPath}` }, { pageSlug: '' }],
    }).lean();

    if (pageData) {
      isStaticPage = true;
      metaInfo = {
        ...metaInfo,
        title: pageData.metaTitle || metaInfo.title,
        description: pageData.metaDescription || metaInfo.description,
        keywords: pageData.metaKeyword || metaInfo.keywords,
      };
    }

    if (!isStaticPage && currentPath !== 'home') {
      // Split path to check for category, subcategory, or product
      const pathSegments = currentPath.split('/');
      const isCategoryPath = pathSegments.length === 1;
      const isSubCategoryPath = pathSegments.length === 2 && pathSegments[0] === 'industrial-oils';
      const isProductPath = pathSegments.length === 2 && pathSegments[0] !== 'industrial-oils';
      let category = null;
      let subCategory = null;
      let product = null;

      // Handle product paths (e.g., /hydraulic-oils/enklo)
      if (isProductPath) {
        const subCategorySlug = pathSegments[0];
        const productSlug = pathSegments[1];

        // First, try to fetch the product
        try {
          const productResponse = await axios.get(`http://localhost:3036/api/petrochemProduct/getbySlug?slug=${productSlug}`);
          product = productResponse.data;
          console.log('product from API:', product);

          if (product && product.success && product.data) {
            metaInfo = {
              ...metaInfo,
              title: product.data.metatitle || product.data.name || metaInfo.title,
              description: product.data.metadescription || product.data.description || metaInfo.description,
              keywords: product.data.metakeywords || product.data.name || metaInfo.keywords,
              ogImage: product.data.photo?.[0] ? `/Uploads/${product.data.photo[0]}` : metaInfo.ogImage,
            };
          }
        } catch (apiError) {
          console.error('Error fetching product from API:', apiError.message);
        }

        // If no valid product data, fetch subcategory metadata
        if (!product || !product.success || !product.data) {
          try {
            const categoryResponse = await axios.get(`http://localhost:3036/api/chemicalCategory/getAllCategories`);
            const categories = categoryResponse.data.categories || [];
            console.log('categories from API:', categories);

            for (const cat of categories) {
              const foundSubCategory = cat.subCategories.find(subCat => subCat.slug === subCategorySlug);
              if (foundSubCategory) {
                category = cat;
                subCategory = foundSubCategory;
                break;
              }
            }
            console.log('category found:', category);
            console.log('subCategory found:', subCategory);

            if (subCategory) {
              const detailsText = subCategory.details ? subCategory.details.replace(/<[^>]*>/g, '').trim() : '';
              metaInfo = {
                ...metaInfo,
                title: subCategory.metatitle || subCategory.category || metaInfo.title,
                description: subCategory.metadescription || detailsText || metaInfo.description,
                keywords: subCategory.metakeywords || subCategory.category || metaInfo.keywords,
                ogImage: subCategory.photo ? `/Uploads/${subCategory.photo}` : metaInfo.ogImage,
              };
            }
          } catch (apiError) {
            console.error('Error fetching categories from API:', apiError.message);
          }
        }
      }

      // Handle subcategory paths (e.g., /industrial-oils/hydraulic-oils)
      if (isSubCategoryPath) {
        const categorySlug = pathSegments[0];
        const subCategorySlug = pathSegments[1];

        try {
          const categoryResponse = await axios.get(`http://localhost:3036/api/chemicalCategory/getSpecificCategory?slug=${categorySlug}`);
          category = categoryResponse.data.category;
          console.log('category from API:', category);

          if (category) {
            subCategory = category.subCategories.find(subCat => subCat.slug === subCategorySlug);
            console.log('subCategory found:', subCategory);

            if (subCategory) {
              const detailsText = subCategory.details ? subCategory.details.replace(/<[^>]*>/g, '').trim() : '';
              metaInfo = {
                ...metaInfo,
                title: subCategory.metatitle || subCategory.category || metaInfo.title,
                description: subCategory.metadescription || detailsText || metaInfo.description,
                keywords: subCategory.metakeywords || subCategory.category || metaInfo.keywords,
                ogImage: subCategory.photo ? `/Uploads/${subCategory.photo}` : metaInfo.ogImage,
              };
JET4            }
          }
        } catch (apiError) {
          console.error('Error fetching category from API:', apiError.message);
        }
      }

      // Handle category paths (e.g., /industrial-oils)
      if (isCategoryPath) {
        try {
          const categoryResponse = await axios.get(`http://localhost:3036/api/chemicalCategory/getSpecificCategory?slug=${currentPath}`);
          category = categoryResponse.data.category;
          console.log('category from API:', category);

          if (category) {
            const subCategoryNames = category.subCategories.map(subCat => subCat.category).join(', ');
            const detailsText = category.details ? category.details.replace(/<[^>]*>/g, '').trim() : '';
            metaInfo = {
              ...metaInfo,
              title: category.metatitle || category.category || metaInfo.title,
              description: category.metadescription || detailsText || metaInfo.description,
              keywords: category.metakeywords || subCategoryNames || metaInfo.keywords,
              ogImage: category.photo ? `/Uploads/${category.photo}` : metaInfo.ogImage,
            };
          }
        } catch (apiError) {
          console.error('Error fetching category from API:', apiError.message);
        }
      }

      // Handle single-segment product paths (e.g., /enklo)
      if (!category && !subCategory && isCategoryPath) {
        try {
          const productResponse = await axios.get(`http://localhost:3036/api/petrochemProduct/getbySlug?slug=${currentPath}`);
          product = productResponse.data;
          console.log('product from API:', product);

          if (product && product.success && product.data) {
            metaInfo = {
              ...metaInfo,
              title: product.data.metatitle || product.data.name || metaInfo.title,
              description: product.data.metadescription || product.data.description || metaInfo.description,
              keywords: product.data.metakeywords || product.data.name || metaInfo.keywords,
              ogImage: product.data.photo?.[0] ? `/Uploads/${product.data.photo[0]}` : metaInfo.ogImage,
            };
          }
        } catch (apiError) {
          console.error('Error fetching product from API:', apiError.message);
        }
      }
    }

    const escapeHtml = (str) =>
      str ? String(str).replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>').replace(/"/g, '"') : '';

    $('title').text(escapeHtml(metaInfo.title));

    const setOrCreateMeta = (selector, attrName, value, type = 'name') => {
      let metaTag = $(`meta[${type}="${selector}"]`);
      if (!metaTag.length) {
        $('head').append(`<meta ${type}="${selector}" ${attrName}="${escapeHtml(value)}">`);
      } else {
        metaTag.attr(attrName, escapeHtml(value));
      }
    };

    setOrCreateMeta('description', 'content', metaInfo.description);
    setOrCreateMeta('keywords', 'content', metaInfo.keywords);
    setOrCreateMeta('og:title', 'content', metaInfo.title, 'property');
    setOrCreateMeta('og:description', 'content', metaInfo.description, 'property');
    setOrCreateMeta('og:image', 'content', metaInfo.ogImage, 'property');
    setOrCreateMeta('twitter:card', 'content', 'summary_large_image');
    setOrCreateMeta('twitter:title', 'content', metaInfo.title);
    setOrCreateMeta('twitter:description', 'content', metaInfo.description);

    const canonicalUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    let canonicalLink = $('link[rel="canonical"]');
    if (!canonicalLink.length) {
      $('head').append(`<link rel="canonical" href="${canonicalUrl}">`);
    } else {
      canonicalLink.attr('href', canonicalUrl);
    }

    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store',
      'Vary': '*',
    });

    res.send($.html());
  } catch (error) {
    console.error('Error with dynamic meta tags:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;