const path = require('path');
const Chemical = require('../model/chemical');  // Assuming the model is in models/Chemical.js
const Customer = require('../model/customer');
const Supplier = require('../model/supplier');
const ChemicalCategory = require('../model/chemicalCategory');
const { default: mongoose } = require('mongoose');

const fs = require('fs');
// Create new chemical
exports.createChemical = async (req, res) => {
  try {
    // Generate a unique 6-digit product code
    const generateUniquePCode = async () => {
      while (true) {
        const auto_p_code = Math.floor(100000 + Math.random() * 900000).toString();
        const existingChemical = await Chemical.findOne({ auto_p_code });
        if (!existingChemical) {
          return auto_p_code;
        }
      }
    };

    const uniquePCode = await generateUniquePCode();

    // Initialize the images array if files are provided
    let images = [];

    if (req.files && req.files.images) {
      const imageFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      
      images = imageFiles.map((file, index) => ({
        url: path.basename(file.path),
        altText: req.body[`altText-${index}`] || '',
        title: req.body[`title-${index}`] || ''
      }));
    }

    // Parse arrays from JSON strings
    const parseArrayField = (field) => {
      if (!field) return [];
      try {
        return JSON.parse(field);
      } catch (e) {
        console.error('Error parsing array field:', e);
        return [];
      }
    };

    // Handle the specs and msds files
    const specs = req.files?.specs?.[0]?.filename || '';
    const msds = req.files?.msds?.[0]?.filename || '';

    // Parse array fields from JSON strings
    const packings = parseArrayField(req.body.packings);
    const application = parseArrayField(req.body.application);
    const synonyms = parseArrayField(req.body.synonyms);
    const chemical_industries = parseArrayField(req.body.chemical_industries);

    // Debugging log for request body
    console.log("Request Body:", req.body);

    // Validate category ID
    if (!req.body.category || !mongoose.Types.ObjectId.isValid(req.body.category)) {
      return res.status(400).json({ success: false, message: 'Invalid or missing category ID' });
    }
    const category = new mongoose.Types.ObjectId(req.body.category);

    // Validate sub_category ID
    if (!req.body.sub_category || !mongoose.Types.ObjectId.isValid(req.body.sub_category)) {
      return res.status(400).json({ success: false, message: 'Invalid or missing sub_category ID' });
    }
    const sub_category = new mongoose.Types.ObjectId(req.body.sub_category);

    // Ensure categorySlug is provided
    if (!req.body.categorySlug) {
      return res.status(400).json({ success: false, message: 'categorySlug is required' });
    }

    // Create chemical object
    const chemical = new Chemical({
      ...req.body,
      category,
      sub_category,
      packings, // Save packings as an array
      application,
      synonyms,
      chemical_industries,
      specs,
      msds,
      images,
      auto_p_code: uniquePCode,
      categorySlug: req.body.categorySlug
    });

    const savedChemical = await chemical.save();
    
    return res.status(201).json({
      success: true,
      message: 'Chemical inserted successfully',
      chemical: savedChemical
    });
  } catch (err) {
    console.error('Error creating chemical:', err);
    return res.status(400).json({
      success: false,
      message: err.message || 'Failed to create chemical'
    });
  }
};

exports.updateChemical = async (req, res) => {
  try {
    const { id } = req.query;
    const existingChemical = await Chemical.findById(id);
    if (!existingChemical) {
      return res.status(404).json({ message: 'Chemical not found' });
    }

    // Initialize updateData with the request body
    const updateData = { ...req.body };

    // Handle specs file - fix the logic
    if (req.files?.specs?.[0]) {
      // New file uploaded - use the new filename
      updateData.specs = req.files.specs[0].filename;
    } else if (req.body.specs === '') {
      // Explicitly set to empty - clear the specs file
      updateData.specs = '';
    } else {
      // No new file and no explicit empty string - keep existing value
      // Don't add to updateData so it won't get overwritten
      delete updateData.specs;
    }

    // Handle msds file - fix the logic
    if (req.files?.msds?.[0]) {
      // New file uploaded - use the new filename
      updateData.msds = req.files.msds[0].filename;
    } else if (req.body.msds === '') {
      // Explicitly set to empty - clear the msds file
      updateData.msds = '';
    } else {
      // No new file and no explicit empty string - keep existing value
      // Don't add to updateData so it won't get overwritten
      delete updateData.msds;
    }

    // Safe parsing function for arrays
    const safeParseArray = (value) => {
      if (!value) return undefined; // Return undefined to skip updating this field
      try {
        if (Array.isArray(value)) return value; // If already an array, return as is
        return JSON.parse(value); // Try parsing as JSON
      } catch (e) {
        console.warn('Failed to parse array:', e);
        return undefined;
      }
    };

    // Only add array fields if they exist in the request
    if (req.body.synonyms !== undefined) {
      updateData.synonyms = safeParseArray(req.body.synonyms);
    }
    if (req.body.chemical_industries !== undefined) {
      updateData.chemical_industries = safeParseArray(req.body.chemical_industries);
    }
    if (req.body.packings !== undefined) {
      updateData.packings = safeParseArray(req.body.packings);
    }
    if (req.body.application !== undefined) {
      updateData.application = safeParseArray(req.body.application);
    }

    // Handle images
    let images = existingChemical.images || [];

    if (req.files?.images) {
      req.files.images.forEach((file, index) => {
        images.push({
          url: file.filename,
          altText: req.body[`altText-${index + 1}`] || 'Default Alt Text',
          title: req.body[`title-${index + 1}`] || 'Default Title'
        });
      });
    }

    // Handle images to delete
    if (req.body.imagesToDelete) {
      const imagesToDelete = Array.isArray(req.body.imagesToDelete)
        ? req.body.imagesToDelete
        : JSON.parse(req.body.imagesToDelete);

      images = images.filter(image => !imagesToDelete.includes(image._id.toString()));

      // Delete image files from the server
      imagesToDelete.forEach(imageId => {
        const image = existingChemical.images.find(img => img._id.toString() === imageId);
        if (image) {
          const imagePath = path.join(__dirname, '../uploads', image.url);
          fs.unlink(imagePath, (err) => {
            if (err) console.error('Failed to delete image file:', err);
          });
        }
      });
    }

    updateData.images = images;

    // Remove any undefined values from updateData
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    );

    const updatedChemical = await Chemical.findByIdAndUpdate(
      id, 
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Chemical updated successfully',
      chemical: updatedChemical
    });
  } catch (err) {
    console.error('Error updating chemical:', err);
    res.status(400).json({
      success: false,
      message: err.message || 'Failed to update chemical'
    });
  }
};

// Get all chemicals
exports.getAllChemicals = async (req, res) => {
  try {
      // Step 1: Fetch all chemicals from the Chemical collection
      const chemicals = await Chemical.find();

      // Step 2: Initialize counts for Customer and Supplier separately
      const customerChemicalCounts = {};
      const supplierChemicalCounts = {};

      // Step 3: Count occurrences of each chemicalId in the Customer schema
      const customers = await Customer.find();
      customers.forEach(customer => {
          customer.chemicalId.forEach(chemicalId => {
              customerChemicalCounts[chemicalId] = (customerChemicalCounts[chemicalId] || 0) + 1;
          });
      });

      // Step 4: Count occurrences of each chemicalId in the Supplier schema
      const suppliers = await Supplier.find();
      suppliers.forEach(supplier => {
          supplier.chemical_ids.forEach(chemicalId => {
              supplierChemicalCounts[chemicalId] = (supplierChemicalCounts[chemicalId] || 0) + 1;
          });
      });

      // Step 5: Enhance the chemical data with the count of occurrences for Customer and Supplier separately
      const enhancedChemicals = chemicals.map(chemical => {
          const chemicalId = chemical._id.toString(); // Convert ObjectId to string
          return {
              ...chemical.toObject(),
              customerCount: customerChemicalCounts[chemicalId] || 0,
              supplierCount: supplierChemicalCounts[chemicalId] || 0
          };
      });

      // Step 6: Return the enhanced chemicals with separate counts for customer and supplier
      res.status(200).json(enhancedChemicals);
  } catch (err) {
      res.status(400).json({ message: err.message });
  }
};

// Get chemical by ID
exports.getChemicalById = async (req, res) => {
  try {
      // First, find the chemical
      const chemical = await Chemical.findById(req.query.id);
      if (!chemical) return res.status(404).json({ message: 'Chemical not found' });

      // Find the category document
      const category = await ChemicalCategory.findOne({ slug: chemical.categorySlug });
      if (!category) return res.status(404).json({ message: 'Category not found' });

      // Find the subcategory within the category
      const subCategory = category.subCategories.find(
          sub => sub.slug === chemical.subCategorySlug
      );

      // Find the sub-subcategory within the subcategory
      const subSubCategory = subCategory?.subSubCategory.find(
          subsub => subsub.slug === chemical.subSubCategorySlug
      );

      // Construct the response
      const response = {
          ...chemical.toObject(),
          category: {
              _id: category._id,
              name: category.category,
              slug: category.slug,
              details: category.details
          },
          sub_category: subCategory ? {
              _id: subCategory._id,
              name: subCategory.category,
              slug: subCategory.slug,
              details: subCategory.details
          } : null,
          subsub_category_id: subSubCategory ? {
              _id: subSubCategory._id,
              name: subSubCategory.category,
              slug: subSubCategory.slug,
              details: subSubCategory.details
          } : null
      };

      res.status(200).json(response);
  } catch (err) {
      console.error('Error in getChemicalById:', err);
      res.status(400).json({ message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
    const { slugs } = req.query;
  
    try {
      const product = await Chemical.findOne({slug:slugs});
  
      product.photo.forEach(filename => {
        const filePath = path.join(__dirname, '../images', filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        } else {
          console.warn(`File not found: ${filename}`);
        }
      });
  
      const deletedProduct = await Product.findOneAndDelete({slug:slugs});
    
  
      if (!deletedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Server error', error });
    }
  };
  
// get chemical by slug
exports.getChemicalBySlug = async (req, res) => {
  try {
    const { slug } = req.query;
    const chemical = await Chemical.findOne({ slug })
      .populate({
        path: 'category',
        select: 'name slug',
        model: 'ChemicalCategory'
      })
      .populate({
        path: 'sub_category',
        select: 'name slug',
        model: 'ChemicalCategory'
      })
      .populate({
        path: 'subsub_category_id',
        select: 'name slug',
        model: 'ChemicalCategory'
      });
    
    if (!chemical) {
      return res.status(404).json({ message: 'Chemical not found' });
    }
    
    res.status(200).json(chemical);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

  // count Chemical 
exports.countChemicals = async (req, res) => {
    try {
      // Count the total number of chemicals in the collection
      const chemicalCount = await Chemical.countDocuments();
  
      res.status(200).json({
        totalChemicals: chemicalCount,
        message: "Total number of chemicals counted successfully",
      });
    } catch (err) {
      console.log(err)
      res.status(400).json({
        message: "Error counting chemicals",
        error: err.message,
      });
    }
  };
  
  //Filter Chemical
exports.filterChemical = async (req, res) => {
  try {
    // Get the starting alphabet from the query parameter
    const { alphabet } = req.query;

    // Create a filter to match chemicals starting with the specified alphabet (case-insensitive)
    const filter = alphabet
      ? { name: new RegExp(`^${alphabet}`, 'i') }
      : {};

    // Fetch chemicals based on the filter
    const chemicals = await Chemical.find(filter);

    res.status(200).json(chemicals);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.filterChemicalByName_CASNumber = async (req, res) => {
  try {
    // Get the starting alphabet from the query parameter
    const { alphabet } = req.query;

    // Create a filter to match chemicals starting with the specified alphabet (case-insensitive)
    const filter = alphabet
      ? {
          $or: [
            { name: new RegExp(`^${alphabet}`, 'i') },  // Match name starting with the alphabet
            { cas_number: new RegExp(`^${alphabet}`, 'i') }  // Match cas_number starting with the alphabet
          ]
        }
      : {};

    // Fetch chemicals based on the filter
    const chemicals = await Chemical.find(filter);

    res.status(200).json(chemicals);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// get chemical by category and sub category slug 
exports.getChemicalByCategorySubCategorySlug = async (req, res) => {
 
  try {
    // Destructure category and subCategory from query parameters
    const { categoryslug, subcategoryslug } = req.query;
    
    // Step 1: Query for chemicals by category and subCategory
    const chemicals = await Chemical.find({
      'categorySlug': categoryslug, // Query based on category
      'subCategorySlug': subcategoryslug, // Query based on subCategory slug within the subCategories array
    });

    // Step 2: Return the fetched chemicals
    res.status(200).json(chemicals);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

// get chemical by category and Alphabet 
exports.getChemicalByCategoryAndAlphabet = async (req, res) => {
  try {
    // Destructure categoryslug and the selected alphabet from query parameters
    const { alphabet } = req.query;
    
    // Step 1: Query for chemicals by category and name starting with the provided alphabet (case-insensitive)
    const chemicals = await Chemical.find({
      'name': { $regex: `^${alphabet}`, $options: 'i' } // Match name starting with alphabet (case-insensitive)
    });

    // Step 2: Return the fetched chemicals
    res.status(200).json(chemicals);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

//get chemical by sub sub category slug
exports.getChemicalBysubsubCategorySlug = async (req, res) => {
  try {
    const { slug } = req.query;  // Destructure the slug from the query parameters
    const chemical = await Chemical.find({ 
      subSubCategorySlug:slug });  // Use findOne to find a single document by slug
    
    if (!chemical) {
      return res.status(404).json({ message: 'Chemical not found' });
    }
    
    res.status(200).json(chemical);  // Send the found chemical as the response
  } catch (err) {
    res.status(400).json({ message: err.message });  // Send error message if something goes wrong
  }
};

exports.deleteChemical = async (req, res) => {
  try {
      const { id } = req.query; // Get the chemical ID from the URL parameters

      // Find the chemical by its unique ID or product code
      const chemical = await Chemical.findById(id);
      
      if (!chemical) {
          return res.status(404).json({ message: "Chemical not found" });
      }

      // Optionally, you can also delete the images associated with the chemical (if needed)
      // You might use a file system operation here, depending on how you handle image storage

      // Delete the chemical from the database
      await Chemical.findByIdAndDelete(id);

      res.status(200).json({ message: "Chemical deleted successfully" });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "An error occurred while deleting the chemical" });
  }
};

// Add update chemical method
exports.updateChemical = async (req, res) => {
  try {
    const { id } = req.query;
    const existingChemical = await Chemical.findById(id);
    if (!existingChemical) {
      return res.status(404).json({ message: 'Chemical not found' });
    }

    // Handle specs file
    let specs = existingChemical.specs;
    if (req.files?.specs?.[0]) {
      specs = req.files.specs[0].filename;
    }

    // Handle msds file
    let msds = existingChemical.msds;
    if (req.files?.msds?.[0]) {
      msds = req.files.msds[0].filename;
    }

    // Safe parsing function for arrays
    const safeParseArray = (value) => {
      if (!value) return undefined; // Return undefined to skip updating this field
      try {
        if (Array.isArray(value)) return value; // If already an array, return as is
        return JSON.parse(value); // Try parsing as JSON
      } catch (e) {
        console.warn('Failed to parse array:', e);
        return undefined;
      }
    };

    // Only include fields that are actually present in the request
    const updateData = {
      ...req.body,
      specs,
      msds
    };

    // Only add array fields if they exist in the request
    if (req.body.synonyms !== undefined) {
      updateData.synonyms = safeParseArray(req.body.synonyms);
    }
    if (req.body.chemical_industries !== undefined) {
      updateData.chemical_industries = safeParseArray(req.body.chemical_industries);
    }
    if (req.body.packings !== undefined) {
      updateData.packings = safeParseArray(req.body.packings);
    }
    if (req.body.application !== undefined) {
      updateData.application = safeParseArray(req.body.application);
    }

    // Handle images
    let images = existingChemical.images || [];

    if (req.files?.images) {
      req.files.images.forEach((file, index) => {
        images.push({
          url: file.filename,
          altText: req.body[`altText-${index + 1}`] || 'Default Alt Text',
          title: req.body[`title-${index + 1}`] || 'Default Title'
        });
      });
    }

    // Handle images to delete
    if (req.body.imagesToDelete) {
      const imagesToDelete = Array.isArray(req.body.imagesToDelete)
        ? req.body.imagesToDelete
        : JSON.parse(req.body.imagesToDelete);

      images = images.filter(image => !imagesToDelete.includes(image._id.toString()));

      // Delete image files from the server
      imagesToDelete.forEach(imageId => {
        const image = existingChemical.images.find(img => img._id.toString() === imageId);
        if (image) {
          const imagePath = path.join(__dirname, '../uploads', image.url);
          fs.unlink(imagePath, (err) => {
            if (err) console.error('Failed to delete image file:', err);
          });
        }
      });
    }

    updateData.images = images;

    // Remove any undefined values from updateData
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    );

    const updatedChemical = await Chemical.findByIdAndUpdate(
      id, 
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Chemical updated successfully',
      chemical: updatedChemical
    });
  } catch (err) {
    console.error('Error updating chemical:', err);
    res.status(400).json({
      success: false,
      message: err.message || 'Failed to update chemical'
    });
  }
};

exports.searchChemicals = async (req, res) => {
    try {
        const { query } = req.query; // Get the search query from URL parameters
        
        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        // Create a case-insensitive regular expression for the search query
        const searchRegex = new RegExp(query, 'i');

        // Search across multiple fields
        const chemicals = await Chemical.find({
            $or: [
                { name: searchRegex },
                { cas_number: searchRegex },
                { grade: searchRegex },
                { chemical_type: searchRegex },
                { molecular_formula: searchRegex },
                { synonyms: searchRegex },
                { product_code: searchRegex },
                { auto_p_code: searchRegex }
            ]
        })
        .select('name cas_number grade slug chemical_type molecular_formula product_code auto_p_code') // Select only needed fields
        .limit(10); // Limit results for better performance

        // Format the response
        const formattedResults = chemicals.map(chemical => ({
            _id: chemical._id,
            name: chemical.name,
            cas_number: chemical.cas_number,
            grade: chemical.grade,
            slug: chemical.slug,
            chemical_type: chemical.chemical_type,
            molecular_formula: chemical.molecular_formula,
            product_code: chemical.product_code,
            auto_p_code: chemical.auto_p_code,
            matchedOn: [ // Indicate which fields matched the search
                chemical.name.match(searchRegex) ? 'name' : null,
                chemical.cas_number.match(searchRegex) ? 'cas_number' : null,
                chemical.grade.match(searchRegex) ? 'grade' : null,
                chemical.chemical_type.match(searchRegex) ? 'chemical_type' : null,
                chemical.molecular_formula.match(searchRegex) ? 'molecular_formula' : null,
                chemical.product_code.match(searchRegex) ? 'product_code' : null,
                chemical.auto_p_code.match(searchRegex) ? 'auto_p_code' : null
            ].filter(Boolean)
        }));

        return res.status(200).json({
            success: true,
            count: formattedResults.length,
            data: formattedResults
        });

    } catch (error) {
        console.error('Search error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error searching chemicals',
            error: error.message
        });
    }
};

exports.getLatestChemicals = async (req, res) => {
    try {
        // Step 1: Fetch latest 6 chemicals from the Chemical collection
        const chemicals = await Chemical.find()
            .sort({ createdAt: -1 })  // Sort by creation date in descending order
            .limit(6);                // Limit to 6 items

        // Step 2: Initialize counts for Customer and Supplier separately
        const customerChemicalCounts = {};
        const supplierChemicalCounts = {};

        // Step 3: Count occurrences of each chemicalId in the Customer schema
        const customers = await Customer.find();
        customers.forEach(customer => {
            customer.chemicalId.forEach(chemicalId => {
                customerChemicalCounts[chemicalId] = (customerChemicalCounts[chemicalId] || 0) + 1;
            });
        });

        // Step 4: Count occurrences of each chemicalId in the Supplier schema
        const suppliers = await Supplier.find();
        suppliers.forEach(supplier => {
            supplier.chemical_ids.forEach(chemicalId => {
                supplierChemicalCounts[chemicalId] = (supplierChemicalCounts[chemicalId] || 0) + 1;
            });
        });

        // Step 5: Enhance the chemical data with the count of occurrences
        const enhancedChemicals = chemicals.map(chemical => {
            const chemicalId = chemical._id.toString();
            return {
                ...chemical.toObject(),
                customerCount: customerChemicalCounts[chemicalId] || 0,
                supplierCount: supplierChemicalCounts[chemicalId] || 0
            };
        });

        res.status(200).json(enhancedChemicals);
    } catch (err) {
        res.status(500).json({ 
            success: false,
            message: "Error fetching latest chemicals",
            error: err.message 
        });
    }
};

exports.getLatestChemicalsExcept = async (req, res) => {
  try {
    const { slug } = req.query;

    // Fetch latest 8 chemicals excluding the one with matching slug
    const chemicals = await Chemical.find({ slug: { $ne: slug } })
      .sort({ createdAt: -1 })  // Sort by creation date in descending order
      .limit(8);                // Limit to 8 items

    // Initialize counts for Customer and Supplier
    const customerChemicalCounts = {};
    const supplierChemicalCounts = {};

    // Count occurrences in Customer schema
    const customers = await Customer.find();
    customers.forEach(customer => {
      customer.chemicalId.forEach(chemicalId => {
        customerChemicalCounts[chemicalId] = (customerChemicalCounts[chemicalId] || 0) + 1;
      });
    });

    // Count occurrences in Supplier schema
    const suppliers = await Supplier.find();
    suppliers.forEach(supplier => {
      supplier.chemical_ids.forEach(chemicalId => {
        supplierChemicalCounts[chemicalId] = (supplierChemicalCounts[chemicalId] || 0) + 1;
      });
    });

    // Enhance the chemical data with counts
    const enhancedChemicals = chemicals.map(chemical => {
      const chemicalId = chemical._id.toString();
      return {
        ...chemical.toObject(),
        customerCount: customerChemicalCounts[chemicalId] || 0,
        supplierCount: supplierChemicalCounts[chemicalId] || 0
      };
    });

    res.status(200).json({
      success: true,
      data: enhancedChemicals
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: "Error fetching latest chemicals",
      error: err.message 
    });
  }
};

// Update chemical by ID
exports.updateChemicalById = async (req, res) => {
  try {
    const { id } = req.query;

    // Parse arrays with custom delimiter handling - only if they exist in req.body
    const parseArrayField = (field) => {
      if (field === undefined) return undefined; // Don't update if field not provided
      if (!field) return [];
      if (Array.isArray(field)) return field;
      try {
        // Try parsing as JSON first
        return JSON.parse(field);
      } catch {
        // Fall back to comma splitting if not valid JSON
        return field.split(',').map(item => item.trim()).filter(Boolean);
      }
    };

    // Only include array fields in updateData if they exist in req.body
    const updateData = { ...req.body };
    
    if ('packings' in req.body) {
      updateData.packings = parseArrayField(req.body.packings);
    }
    if ('application' in req.body) {
      updateData.application = parseArrayField(req.body.application);
    }
    if ('synonyms' in req.body) {
      updateData.synonyms = parseArrayField(req.body.synonyms);
    }
    if ('chemical_industries' in req.body) {
      updateData.chemical_industries = parseArrayField(req.body.chemical_industries);
    }

    // Handle files only if they exist
    if (req.files?.specs?.[0]) {
      updateData.specs = req.files.specs[0].filename;
    }
    if (req.files?.msds?.[0]) {
      updateData.msds = req.files.msds[0].filename;
    }
    if (req.files?.images) {
      updateData.images = req.files.images.map((file, index) => ({
        url: file.filename,
        altText: req.body[`altText-${index}`] || '',
        title: req.body[`title-${index}`] || ''
      }));
    }

    const updatedChemical = await Chemical.findByIdAndUpdate(
      id,
      { $set: updateData }, // Use $set to only update provided fields
      { new: true, runValidators: true }
    );

    if (!updatedChemical) {
      return res.status(404).json({
        success: false,
        message: 'Chemical not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Chemical updated successfully',
      chemical: updatedChemical
    });
  } catch (err) {
    console.error('Error updating chemical:', err);
    return res.status(400).json({
      success: false,
      message: err.message || 'Failed to update chemical'
    });
  }
};





 