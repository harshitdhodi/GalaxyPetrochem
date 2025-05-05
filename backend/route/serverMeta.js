const express = require('express');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const axios = require('axios');
const Meta = require('../model/staticMeta');

const router = express.Router();

// Helper function to fetch product metadata
async function fetchProductMeta(slug, metaInfo, res) {
  try {
    const productResponse = await axios.get(`http://localhost:3036/api/petrochemProduct/getbySlug?slug=${slug}`);
    console.log('Product API response:', productResponse.data);
    const product = productResponse.data;

    if (product && Array.isArray(product) && product.length > 0) {
      const productData = product[0];
      return {
        ...metaInfo,
        title: productData.metaTitle || productData.name || metaInfo.title,
        description: productData.metaDescription || productData.name || metaInfo.description,
        keywords: productData.metaKeyword || productData.name || metaInfo.keywords,
        ogImage: productData.images?.[0]?.url ? `/Uploads/${productData.images[0].url}` : metaInfo.ogImage,
      };
    } else {
      console.log('Invalid product data:', product);
      res.status(404).send('Product not found');
      return null;
    }
  } catch (apiError) {
    console.error('Product API error:', apiError.message, apiError.response?.data);
    res.status(404).send('Product not found');
    return null;
  }
}

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
      const pathSegments = currentPath.split('/');
      const isCategoryPath = pathSegments.length === 1;
      const isSubCategoryPath = pathSegments.length === 2 && pathSegments[0] === 'industrial-oils';

      // Validate if the first segment is a valid subcategory for product paths
      let isValidSubCategory = false;
      let subCategorySlug = pathSegments[0];
      if (pathSegments.length === 2 && pathSegments[0] !== 'industrial-oils') {
        try {
          const categoryResponse = await axios.get(`http://localhost:3036/api/chemicalCategory/getAllCategories`);
          const categories = categoryResponse.data.categories || [];
          isValidSubCategory = categories.some(cat =>
            cat.subCategories.some(subCat => subCat.slug === subCategorySlug)
          );
        } catch (apiError) {
          console.error('Error validating subcategory:', apiError.message);
        }
      }

      const isProductPath = pathSegments.length === 2 && pathSegments[0] !== 'industrial-oils' && isValidSubCategory;
      let category = null;
      let subCategory = null;

      // Handle product paths (e.g., /hydraulic-oils/Enklo-68)
      if (isProductPath) {
        const productSlug = pathSegments[1];
        const updatedMetaInfo = await fetchProductMeta(productSlug, metaInfo, res);
        console.log('Updated metaInfo from product:', updatedMetaInfo);
        if (updatedMetaInfo) {
          metaInfo = updatedMetaInfo;
        } else {
          return; // Response already sent by fetchProductMeta
        }
      }

      // Handle subcategory paths (e.g., /industrial-oils/hydraulic-oils)
      if (isSubCategoryPath) {
        const categorySlug = pathSegments[0];
        const subCategorySlug = pathSegments[1];

        try {
          const categoryResponse = await axios.get(`http://localhost:3036/api/chemicalCategory/getSpecificCategory?slug=${categorySlug}`);
          category = categoryResponse.data.category;

          if (category) {
            subCategory = category.subCategories.find(subCat => subCat.slug === subCategorySlug);

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
    }

    console.log('Final metaInfo:', metaInfo);

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