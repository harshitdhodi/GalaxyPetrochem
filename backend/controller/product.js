const Product = require("../model/product");
const fs = require("fs");
const path = require("path");
const Category = require('../model/chemicalCategory');
// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { category, name, price, details,categorySlug, metaTitle, metaDescription, metaKeyword, metaSchema , slug, table } = req.body;

    // Process uploaded images
    let images = [];
    if (req.files && req.files.images) {
      images = req.files.images.map(file => ({
        url: `${file.filename}`,
        altText: name,
        title: name
      }));
    }

    const product = new Product({
      category,
      categorySlug,
      slug,
      name,
      price,
      images,
      table,
      details,
      metaTitle,
      metaDescription,
      metaKeyword,
      metaSchema
    });

    await product.save();
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a product by ID
exports.updateProduct = async (req, res) => {
  try {
    const { category, name, price, details, metaTitle, metaDescription, metaKeyword, metaSchema ,categorySlug,slug,table } = req.body;
    let updatedData = { category, name, price, details, metaTitle, metaDescription, metaKeyword, metaSchema,categorySlug,slug,table };

    // Store only the filename instead of the full path
    if (req.files && req.files.images) {
      updatedData.images = req.files.images.map(file => ({
        url: file.filename,  // Only store filename (e.g., 1742987124484.png)
        altText: name,
        title: name
      }));
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Remove images from the file system
    product.images.forEach(image => {
      const imagePath = path.join(__dirname, "..", image.url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    });

    await product.deleteOne();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get product by categorySlug
exports.getProductsByCategorySlug = async (req, res) => {
  try {
    const { categorySlug } = req.params; // Get slug from route params

    // Find the category by slug
    const category = await Category.findOne({ slug: categorySlug });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Fetch products with the found category ID
    const products = await Product.find({ category: category._id }).populate("category");

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductBySlug = async (req, res) => {
  try {
    const { productSlug } = req.params; // Get the product slug from route params

    // Find the product by slug
    const product = await Product.findOne({ slug: productSlug }).populate("category");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRecentProductsByCategorySlug = async (req, res) => {
  try {
    const { categorySlug } = req.params; // Get category slug from route params

    // Find the category by slug
    const category = await Category.findOne({ slug: categorySlug });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Fetch the most recent 6 products in this category
    const products = await Product.find({ category: category._id })
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(6)
      .populate("category"); // Populate category details if needed

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRecentProducts = async (req, res) => {
  try {
    // Fetch the most recent 6 products, sorted by createdAt in descending order
    const products = await Product.find()
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(6)
      .populate("category"); // Populate category if needed

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.filterProducts = async (req, res) => {
  try {
    const { search } = req.query;

    if (!search) {
      return res.status(400).json({ message: "Search parameter is required" });
    }

    // Convert to number if valid
    const numericSearch = !isNaN(search) ? Number(search) : null;

    // Create a regex pattern for case-insensitive search
    const searchRegex = new RegExp(search, "i");

    // Find products that match the search query
    const products = await Product.find({
      $or: [
        { name: searchRegex },
        { categorySlug: searchRegex },
        ...(numericSearch !== null ? [{ price: numericSearch }] : []) // Only include price if it's numeric
      ]
    }).populate("category");

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.AdvanceSearch = async (req, res) => {
  try {
    const { name, price, category } = req.query;
    let filter = {};

    console.log("Received Query:", req.query); // Debugging

    if (name) {
      filter.name = new RegExp(name.trim(), "i"); // Case-insensitive search
    }

    if (price) {
      // Remove extra quotes and spaces before converting to a number
      const cleanedPrice = price.replace(/['"]/g, "").trim();
      
      if (!isNaN(cleanedPrice)) {
        filter.price = Number(cleanedPrice); // Exact price match
      }
    }

    if (category) {
      filter.categorySlug = new RegExp(category.trim(), "i"); // Case-insensitive search
    }

    console.log("Applied Filter:", filter); // Debugging

    const products = await Product.find(filter).populate("category");

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};





