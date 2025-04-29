// controllers/apiController.js
const ProductCategory = require('../model/chemicalCategory');
const Product = require('../model/petrochemProduct');
const Catalogue = require('../model/catalogue');
const AboutUs = require('../model/aboutUs');

// Individual controller functions - can still be used independently if needed
const getCategoriesData = async () => {
  try {
    return await ProductCategory.find();
  } catch (error) {
    throw new Error(`Error fetching categories: ${error.message}`);
  }
};

const getRecentProductsData = async () => {
  try {
    return await Product.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .populate("brandId categoryId subCategoryId");
  } catch (error) {
    console.log(error);
    throw new Error(`Error fetching recent products: ${error.message}`);
  }
};

const getCataloguesData = async () => {
  try {
    return await Catalogue.find();
  } catch (error) {
    throw new Error(`Error fetching catalogues: ${error.message}`);
  }
};

const getAboutUsData = async () => {
  try {
    const aboutUs = await AboutUs.find();
    return aboutUs;
  } catch (error) {
    throw new Error(`Error fetching about us: ${error.message}`);
  }
};

// Combined endpoint controller
exports.getAllHomePage = async (req, res) => {
  try {
    // Use Promise.all to fetch all data concurrently
    const [categories, recentProducts, catalogues, aboutUs] = await Promise.all([
      getCategoriesData(),
      getRecentProductsData(),
      getCataloguesData(),
      getAboutUsData(req.query)
    ]);

    // Respond with a structured object containing all data
    res.status(200).json({
      category:categories,
      recentProducts: recentProducts,
      catalogue:catalogues,
      aboutUs: aboutUs.length ? aboutUs : null
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch home page data', 
      error: error.message 
    });
  }
};
