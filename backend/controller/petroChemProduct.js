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
    // Extract form data from req.body
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
    // console.log("Form data:", req.body);

    // Prepare updates object
    const updates = {
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
    };

    // Handle multiple image files with metadata
    if (req.files && req.files.images) {
      const images = [];
      req.files.images.forEach((file, index) => {
        // Get the specific alt text and title for this image
        const altText = req.body[`altText${index}`] || "";
        const title = req.body[`imgTitle${index}`] || "";
        
        images.push({
          url: file.filename,
          altText: altText,
          title: title,
        });
      });
      updates.images = images; // Replace existing images with new ones
    }

    // Handle PDF file
    if (req.files?.pdf?.[0]?.filename) {
      updates.pdf = req.files.pdf[0].filename;
    }

    // Handle MSDS file
    if (req.files?.msds?.[0]?.filename) {
      updates.msds = req.files.msds[0].filename;
    }

    // Update the product in the database
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Return response similar to createProduct
    res.status(200).json({
      message: "Product updated successfully",
      product: {
        id: product._id,
        name: product.name,
        slug: product.slug,
        images: product.images,
        files: {
          pdf: product.pdf,
          msds: product.msds,
        },
      },
    });
  } catch (error) {
    console.error("Error updating product:", error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
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
      .limit(6)
      .populate("brandId categoryId subCategoryId");

    res.json(recentProducts);
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

    // Create a regex pattern for case-insensitive search
    const searchRegex = new RegExp(search, "i");

    // Find products that match the search query
    const products = await Product.find({
      $or: [
        { name: searchRegex },
        { categorySlug: searchRegex },
        { subCategorySlug: searchRegex },
        { slug: searchRegex },
        { tagline: searchRegex },
        { metaTitle: searchRegex },
        { metaDescription: searchRegex },
        { metaKeyword: searchRegex },
      ],
    })
      .populate("brandId")
      .populate("categoryId")
      .populate("subCategoryId");

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllProductImages = async (req, res) => {
  try {
    const images = await Product.find({}, { images: 1 }); // Include only images field

    if (!images.length) {
      return res.status(404).json({ message: "No product images found" });
    }

    res.status(200).json({ images });
  } catch (error) {
    console.error("Error fetching product images:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getAllSlugs = async (req, res) => {
  try {
    // Fetch only the 'slug' field from all documents
    const slugs = await Product.find({}, { slug: 1, _id: 0 });

    res.status(200).json({
      success: true,
      slugs: slugs.map((item) => item.slug), // Return an array of slugs
    });
  } catch (error) {
    console.error("Error fetching slugs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch slugs",
    });
  }
};