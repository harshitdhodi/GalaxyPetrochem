const Product = require("../model/petrochemProduct");

// CREATE
exports.createProduct = async (req, res) => {
  try {
    const {
      categorySlug,
      subCategorySlug,
      slug,
      name,
      tagline,
      specifiction,
      details,
      tableInfo,
      brandId,
      categoryId,
      subCategoryId,
      metaTitle,
      metaDescription,
      metaKeyword,
      metaSchema,
    } = req.body;
    
    console.log("Files received:", req.files);
    console.log("Form data:", req.body);

    // Handle multiple image files with metadata
    const images = [];
    if (req.files && req.files.images) {
      req.files.images.forEach((file, index) => {
        // Get the specific alt text and title for this image
        // Format: altText0, altText1, altText2, etc. and imgTitle0, imgTitle1, imgTitle2, etc.
        const altText = req.body[`altText${index}`] || "";
        const title = req.body[`imgTitle${index}`] || "";
        
        images.push({
          url: file.filename,
          altText: altText,
          title: title,
        });
      });
    }

    // Handle PDF file
    const pdf = req.files?.pdf?.[0]?.filename || null;
    
    // Handle MSDS file
    const msds = req.files?.msds?.[0]?.filename || null;
    
    // Create the product with fields that match the schema
    const product = new Product({
      categorySlug,
      subCategorySlug,
      slug,
      name,
      tagline,
      specifiction,
      details,
      tableInfo,
      images,
      pdf,
      msds,
      brandId,
      categoryId,
      subCategoryId,
      metaTitle,
      metaDescription,
      metaKeyword,
      metaSchema,
    });

    await product.save();

    res.status(201).json({ 
      message: "Product created successfully", 
      product: {
        id: product._id,
        name: product.name,
        slug: product.slug,
        images: product.images,
        files: {
          pdf: product.pdf,
          msds: product.msds
        }
      }
    });
  } catch (error) {
    console.error("Error creating product:", error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

// GET ALL
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("brandId categoryId subCategoryId");
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET BY ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("brandId categoryId subCategoryId");

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE
exports.updateProduct = async (req, res) => {
  try {
    const updates = req.body;
    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json({ message: "Product updated", product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all products by brandId
exports.getProductsByBrandId = async (req, res) => {
  try {
    const { brandId } = req.query;

    const products = await Product.find({ brandId })
      .populate("brandId categoryId subCategoryId");

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found for this brand" });
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get product by slug
exports.getProductBySlug = async (req, res) => {
  try {
    const product = await Product.find({ slug: req.query.slug })
      .populate("brandId categoryId subCategoryId");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRecentProductsByCategorySlug = async (req, res) => {
  const { slug } = req.query;

  try {
    // Step 1: Find the current product by slug
    const currentProduct = await Product.findOne({ slug });

    if (!currentProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Step 2: Find the 5 most recent products in the same category excluding the current product
    const recentProducts = await Product.find({
      categoryId: currentProduct.categoryId,
      slug: { $ne: slug } // Exclude the current product
    })
      .sort({ createdAt: -1 }) // Most recent first
      .limit(5)
      .populate("brandId categoryId subCategoryId");

    res.json(recentProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};