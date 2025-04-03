const BlogCard = require('../model/blogCard');

// Create a new blog card
const createBlogCard = async (req, res) => {
  try {
    const newBlogCard = new BlogCard(req.body);
    await newBlogCard.save();
    res.status(201).json(newBlogCard);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create blog card', error });
  }
};

// Get all blog cards
const getAllBlogCards = async (req, res) => {
  try {
    const blogCards = await BlogCard.find();
    res.status(200).json(blogCards);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch blog cards', error });
  }
};

// Get a single blog card by ID
const getBlogCardById = async (req, res) => {
  try {
    const blogCard = await BlogCard.findById(req.params.id);
    if (!blogCard) {
      return res.status(404).json({ message: 'Blog card not found' });
    }
    res.status(200).json(blogCard);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch blog card', error });
  }
};

// Update a blog card by ID or create if it doesn't exist
const updateBlogCard = async (req, res) => {
    try {
      let blogCard = await BlogCard.findById(req.params.id);
      if (!blogCard) {
        blogCard = new BlogCard(req.body);
        await blogCard.save();
        return res.status(201).json(blogCard);
      } else {
        const updatedBlogCard = await BlogCard.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.status(200).json(updatedBlogCard);
      }
    } catch (error) {
      res.status(500).json({ message: 'Failed to update or create blog card', error });
    }
  };

// Delete a blog card by ID
const deleteBlogCard = async (req, res) => {
  try {
    const deletedBlogCard = await BlogCard.findByIdAndDelete(req.params.id);
    if (!deletedBlogCard) {
      return res.status(404).json({ message: 'Blog card not found' });
    }
    res.status(200).json({ message: 'Blog card deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete blog card', error });
  }
};

module.exports = {
  createBlogCard,
  getAllBlogCards,
  getBlogCardById,
  updateBlogCard,
  deleteBlogCard,
};