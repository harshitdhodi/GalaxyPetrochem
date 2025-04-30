const Blog = require('../model/blog'); // Import the Blog model
const blogCategory = require('../model/blogCategory');
const BlogCategory = require('../model/blogCategory'); // Import the BlogCategory model

// Create a new blog
const createBlog = async (req, res) => {
  console.log("Request Body:", req.body);
  console.log("Uploaded Files:", req.files);

  const {
      title,
      date,
      details,
      alt, imageTitle,
      postedBy,
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
      changeFreq,
      status,
      category,
  } = req.body;

  // Handle file uploads correctly
  let imagePaths = [];
  if (req.files && Array.isArray(req.files)) {
      imagePaths = req.files.map(file => file.filename);
  } else if (req.file) {
      imagePaths = [req.file.filename]; // Single file upload
  }

  try {
      const newBlog = new Blog({
          title,
          date,
          details,
          image: imagePaths,
          alt, imageTitle,
          postedBy,
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
          changeFreq,
          status,
          category,
      });

      const savedBlog = await newBlog.save();
      res.status(201).json(savedBlog);
  } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: 'Server error', error });
  }
};


// Get all blogs with populated category
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find(); // Populate the category field
    res.status(200).json(blogs); 
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get a single blog by ID with populated category
const getBlogById = async (req, res) => {
  const { id } = req.query;

  try {
    const blog = await Blog.findById(id); // Populate the category field
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update a blog by ID
const updateBlog = async (req, res) => {
    const { id } = req.query;
    console.log('Files:', req.files);
    
    const {
      title,
      date,
      details,
      alt,
      imageTitle,
      postedBy,
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
      changeFreq,
      status,
      category,
    } = req.body;
  
    try {
      // Create update object with existing fields
      const updateData = {
        title,
        date,
        details,
        imageTitle,
        alt,
        postedBy,
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
        changeFreq,
        status,
        category,
      };

      // Handle multiple images - adjusted for req.files.image structure
      if (req.files && req.files.image) {
        const newImagePaths = Array.isArray(req.files.image) 
          ? req.files.image.map(file => file.filename)
          : [req.files.image.filename];
        updateData.image = newImagePaths;
      }

      const updatedBlog = await Blog.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );
  
      if (!updatedBlog) {
        return res.status(404).json({ message: 'Blog not found' });
      }
  
      res.status(200).json(updatedBlog);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Server error', error });
    }
};
  

// Delete a blog by ID
const deleteBlog = async (req, res) => {
  const { id } = req.query;

  try {
    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (!deletedBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all blogs by category ID with populated category data
const getBlogsByCategory = async (req, res) => {
  const { categoryId } = req.query; // Extract the slug from the query parameters

  try {
      // Step 1: Find the category by slug
      const category = await blogCategory.findOne({ slug:categoryId });
      if (!category) {
          return res.status(404).json({ message: 'Category not found' });
      }

      // Step 2: Find the blog associated with the category
      const blog = await Blog.find({ category: category._id }).populate('category');
      if (!blog) {
          return res.status(404).json({ message: 'Blog not found for the given category' });
      }

      // Step 3: Return the blog
      res.status(200).json(blog);
  } catch (error) {
      res.status(500).json({ message: 'Server error', error });
  }
};


const getLatestBlog = async (req, res) => {
  try {
    const { slug } = req.query; // e.g. /api/blog/latest?slug=my-current-blog

    const latestBlog = await Blog.find({ slug: { $ne: slug } })
      .sort({ createdAt: -1 })
      .limit(1);

    if (latestBlog.length > 0) {
      res.status(200).json(latestBlog[0]);
    } else {
      res.status(404).json({ message: 'No blogs found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};



const getAllBlogsExceptLatest = async (req, res) => {
  try {
      // Get the slug from the query parameter
      const { slug } = req.query;

      if (!slug) {
          return res.status(400).json({ message: 'Slug query parameter is required' });
      }

      // Fetch all blogs except the one with the provided slug
      const allBlogsExceptSlug = await Blog.find({
          slug: { $ne: slug } // Exclude the blog with the provided slug
      });

      if (allBlogsExceptSlug.length === 0) {
          return res.status(404).json({ message: 'No other blogs found' });
      }

      res.status(200).json(allBlogsExceptSlug);
  } catch (error) {
      res.status(500).json({ message: 'Server error', error });
  }
};

const getBlogBySlug = async (req, res) => {
    const { slug } = req.query;  // Extract the slug from the query parameters
  
    try {
      const blog = await Blog.findOne({ slug });  // Find the blog by slug and populate category
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }
      res.status(200).json(blog);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };
  

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getBlogsByCategory,
  getLatestBlog ,
  getAllBlogsExceptLatest,
  getBlogBySlug

};
