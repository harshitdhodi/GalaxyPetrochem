const { default: mongoose } = require('mongoose');
const BlogCategory = require('../model/blogCategory'); // Assuming the model is in the models folder

// Create a new category
const createCategory = async (req, res) => {
  const {
    category,
    slug,
    metatitle,
    metadescription,
    metakeywords,
    metacanonical,
    metalanguage,
    metaschema,
    otherMeta,
    url,
    priority
  } = req.body;

  try {
    // Check if category already exists (case-insensitive)
    const existingCategory = await BlogCategory.findOne({
      category: { $regex: new RegExp(`^${category}$`, 'i') }
    });

    if (existingCategory) {
      return res.status(400).json({
        message: 'Category already exists'
      });
    }

    const newCategory = new BlogCategory({
      category,
      slug,
      metatitle,
      metadescription,
      metakeywords,
      metacanonical,
      metalanguage,
      metaschema,
      otherMeta,
      url,
      priority
    });

    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

  
// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await BlogCategory.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get a category by ID
const getCategoryById = async (req, res) => {
  const { id } = req.query;

  try {
    const category = await BlogCategory.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update a category by ID
const updateCategory = async (req, res) => {
  const { id } = req.query;
  const {
    category,
    slug,
    metatitle,
    metadescription,
    metakeywords,
    metacanonical,
    metalanguage,
    metaschema,
    otherMeta,
    url,
    priority,
  } = req.body;

  try {
    if (!id) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    const trimmedCategory = category.trim();
    const trimmedSlug = slug.trim();

    // ✅ Direct update without duplicate check
    const updatedCategory = await BlogCategory.findByIdAndUpdate(
      id,
      {
        category: trimmedCategory,
        slug: trimmedSlug,
        metatitle,
        metadescription,
        metakeywords,
        metacanonical,
        metalanguage,
        metaschema,
        otherMeta,
        url,
        priority,
        updatedAt: Date.now(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(updatedCategory);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete a category by ID
const deleteCategory = async (req, res) => {
  const { id } = req.query;

  try {
    // Find and delete the category by ID
    const deletedCategory = await BlogCategory.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};
