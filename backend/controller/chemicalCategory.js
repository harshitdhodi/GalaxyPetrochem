const ProductCategory = require("../model/chemicalCategory");
const Product=require("../model/petrochemProduct")
const fs = require('fs');
const path = require('path');

const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Error deleting file: ${err.message}`);
    }
  });
};

const insertCategory = async (req, res) => {
  const { category,details,
    alt,imgtitle,slug, metatitle, metadescription, metakeywords, metacanonical, metalanguage, metaschema, otherMeta, url, priority, changeFreq } = req.body;

  const photo = req.file ? req.file.filename : null;

  try {
    const existingCategory = await ProductCategory.findOne({ category });

    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const newCategory = new ProductCategory({  category,alt,imgtitle,photo,
      details,
      slug, metatitle, metadescription, metakeywords, metacanonical, metalanguage, metaschema, otherMeta, url, priority, changeFreq  });
    const savedCategory = await newCategory.save();

    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const insertSubCategory = async (req, res) => {
  const { categoryId } = req.query;
  const { category, alt,imgtitle,details,
     slug, metatitle, metadescription, metakeywords, metacanonical, metalanguage, metaschema, otherMeta, url, priority, changeFreq } = req.body;

  try {
    // Find the category by its ID
    const categoryDoc = await ProductCategory.findById(categoryId);
    if (!categoryDoc) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if the subcategory already exists
    const existingSubCategory = categoryDoc.subCategories.find((subCat) => subCat.category === category);
    if (existingSubCategory) {
      return res.status(400).json({ message: 'Subcategory already exists' });
    }

    // Handle the photo upload if there's a file in the request
    let photo = null;
    if (req.file) {
      photo = req.file.filename; // Assuming you're using multer for handling file uploads
    }

    // Push the new subcategory to the category document
    categoryDoc.subCategories.push({ category, alt,imgtitle,details,
       photo, slug, metatitle, metadescription, metakeywords, metacanonical, metalanguage, metaschema, otherMeta, url, priority, changeFreq });

    // Save the updated document
    await categoryDoc.save();

    res.status(201).json(categoryDoc);
  } catch (error) {
    console.error('Error inserting subcategory:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};


const insertSubSubCategory = async (req, res) => {
  const { categoryId, subCategoryId } = req.query;
  const { category,alt,imgtitle,slug,details,
     metatitle, metadescription, metakeywords, metacanonical, metalanguage, metaschema, otherMeta, url, priority, changeFreq } = req.body;
  const photo=req.file.filename
  try {
    const categoryDoc = await ProductCategory.findById(categoryId);

    if (!categoryDoc) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const subCategory = categoryDoc.subCategories.id(subCategoryId);
    if (!subCategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    const existingSubSubCategory = subCategory.subSubCategory.find((subSubCat) => subSubCat.category === category);
    if (existingSubSubCategory) {
      return res.status(400).json({ message: 'Sub-subcategory already exists' });
    }

    subCategory.subSubCategory.push({ category,alt,imgtitle,photo,details,
      slug, metatitle, metadescription, metakeywords, metacanonical, metalanguage, metaschema, otherMeta, url, priority, changeFreq });
    await categoryDoc.save();

    res.status(201).json(categoryDoc);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const updateCategory = async (req, res) => {
  const { categoryId } = req.query;

  const { 
    category, alt, imgtitle, slug, metatitle, metadescription, details,
    metakeywords, metacanonical, metalanguage, metaschema, 
    otherMeta, url, priority, changeFreq 
  } = req.body;

  let photo = req.body.photo;

  // Handle uploaded photo from multer.fields
  if (req.files && req.files.photo && req.files.photo[0]) {
    photo = req.files.photo[0].filename;
  }

  try {
    const existingCategory = await ProductCategory.findById(categoryId);
    if (!existingCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Delete old image if a new one was uploaded
    if (req.files && req.files.photo && existingCategory.photo) {
      const oldImagePath = path.join(__dirname, '../logos', existingCategory.photo);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Update category
    const updatedCategory = await ProductCategory.findByIdAndUpdate(
      categoryId,
      { 
        category, alt, imgtitle, photo, slug, details,
        metatitle, metadescription, metakeywords, metacanonical,
        metalanguage, metaschema, otherMeta, url, priority, changeFreq
      },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const sharp = require('sharp');
const updateSubCategory = async (req, res) => {
  const { categoryId, subCategoryId } = req.query;

  const {
    category,
    alt,
    imgtitle,
    slug,
    metatitle,
    details,
    metadescription,
    metakeywords,
    metacanonical,
    metalanguage,
    metaschema,
    otherMeta,
    url,
    priority,
    changeFreq,
  } = req.body;

  let photo = req.body.photo;

  // Handle uploaded photo via multer and processed earlier
  if (req.files?.photo?.[0]) {
    const tempPath = req.files.photo[0].path;
    const finalFileName = req.files.photo[0].filename;
    const finalPath = path.join(__dirname, '../logos', finalFileName);

    try {
      if (path.extname(tempPath).toLowerCase() === '.svg') {
        await fs.promises.rename(tempPath, finalPath);
      } else {
        await sharp(tempPath)
          .webp({ quality: 90 })
          .resize({ width: 1024, withoutEnlargement: true })
          .toFile(finalPath);
        fs.unlink(tempPath, (err) => err && console.error('Error deleting temp file:', err));
      }
      photo = finalFileName;
    } catch (err) {
      return res.status(500).json({ message: 'Error processing uploaded photo', error: err.message });
    }
  }

  try {
    const categoryDoc = await ProductCategory.findById(categoryId);
    if (!categoryDoc) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const subCategory = categoryDoc.subCategories.id(subCategoryId);
    if (!subCategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    subCategory.category = category || subCategory.category;
    subCategory.photo = photo || subCategory.photo;
    subCategory.alt = alt || subCategory.alt;
    subCategory.imgtitle = imgtitle || subCategory.imgtitle;
    subCategory.slug = slug || subCategory.slug;
    subCategory.details = details || subCategory.details;
    subCategory.metatitle = metatitle || subCategory.metatitle;
    subCategory.metadescription = metadescription || subCategory.metadescription;
    subCategory.metakeywords = metakeywords || subCategory.metakeywords;
    subCategory.metacanonical = metacanonical || subCategory.metacanonical;
    subCategory.metalanguage = metalanguage || subCategory.metalanguage;
    subCategory.metaschema = metaschema || subCategory.metaschema;
    subCategory.otherMeta = otherMeta || subCategory.otherMeta;
    subCategory.url = url || subCategory.url;
    subCategory.priority = priority !== null && priority !== undefined ? priority : subCategory.priority;
    subCategory.changeFreq = changeFreq || subCategory.changeFreq;

    await categoryDoc.save();

    res.status(200).json({ message: 'Subcategory updated successfully', data: categoryDoc });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updatesubsubcategory = async (req, res) => {
  const { categoryId, subCategoryId, subSubCategoryId } = req.query;
  const {category,alt,imgtitle,slug,details,
     metatitle, metadescription, metakeywords, metacanonical, metalanguage, metaschema, otherMeta, url, priority, changeFreq} = req.body;
  let photo = req.body.photo; 

  if (req.file) {
    photo = req.file.filename; 
  }
  try {
    const categoryDoc = await ProductCategory.findById(categoryId);
    if (!categoryDoc) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const subCategory = categoryDoc.subCategories.id(subCategoryId);
    if (!subCategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    const subSubCategory = subCategory.subSubCategory.id(subSubCategoryId);
    if (!subSubCategory) {
      return res.status(404).json({ message: 'Sub-subcategory not found' });
    }

    subSubCategory.category = category || subSubCategory.category;
    subSubCategory.photo = photo || subSubCategory.photo;
    subSubCategory.alt = alt || subSubCategory.alt;
    subSubCategory.imgtitle = imgtitle || subSubCategory.imgtitle;
    subSubCategory.slug = slug || subSubCategory.slug;
    subSubCategory.details = details||subSubCategory.details;
    subSubCategory.metatitle = metatitle || subSubCategory.metatitle;
    subSubCategory.metadescription = metadescription || subSubCategory.metadescription;
    subSubCategory.metakeywords = metakeywords || subSubCategory.metakeywords;
    subSubCategory.metacanonical = metacanonical || subSubCategory.metacanonical;
    subSubCategory.metalanguage = metalanguage || subSubCategory.metalanguage;
    subSubCategory.metaschema = metaschema || subSubCategory.metaschema;
    subSubCategory.otherMeta = otherMeta || subSubCategory.otherMeta;
    subSubCategory.url = url || subSubCategory.url;
    subSubCategory.priority = priority || subSubCategory.priority;
    subSubCategory.changeFreq = changeFreq || subSubCategory.changeFreq;

    await categoryDoc.save();
    res.status(200).json(categoryDoc);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}

const deletecategory = async (req, res) => {
  const { id } = req.query;
  console.log(id)
  try {
    // Find the category by its ID
    const category = await ProductCategory.findById(id);

    // Check if the category exists
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if there are subcategories or sub-subcategories
    const hasSubcategories = category.subCategories.length > 0;
    const hasSubSubcategories = category.subCategories.some(subCat => subCat.subSubCategory.length > 0);

    if (hasSubcategories || hasSubSubcategories) {
      return res.status(400).json({ message: 'Category has associated subcategories or sub-subcategories and cannot be deleted' });
    }

    
    const photoPath = path.join(__dirname, '../logos', category.photo);
    deleteFile(photoPath);


    // Proceed to delete the category
    const deletedCategory = await ProductCategory.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }


    // Find and update all products that reference this category, removing the category reference
    await Product.updateMany(
      { categories: id },
      { $pull: { categories: id } }
    );

    res.status(200).json({ message: 'Category deleted successfully and references removed from products' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const deletesubcategory = async (req, res) => {
  // Delete subcategory
  const { categoryId, subCategoryId } = req.query;


  try {
    const categoryDoc = await ProductCategory.findById(categoryId);
    if (!categoryDoc) {
  
      return res.status(404).json({ message: 'Category not found' });
    }

    const subCategoryIndex = categoryDoc.subCategories.findIndex(subCat => subCat._id.toString() === subCategoryId);
    if (subCategoryIndex === -1) {
    
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    const subCategory = categoryDoc.subCategories[subCategoryIndex];
   
    // Check if there are sub-subcategories
    if (subCategory.subSubCategory && subCategory.subSubCategory.length > 0) {
 
      return res.status(400).json({ message: 'Subcategory has associated sub-subcategories and cannot be deleted' });
    }

    const photoPath = path.join(__dirname, '../logos', subCategory.photo);
    deleteFile(photoPath);

    // Remove the subcategory from the array
    categoryDoc.subCategories.splice(subCategoryIndex, 1);

    await categoryDoc.save();
   

    // Find and update all products that reference this subcategory, removing the subcategory reference
    await Product.updateMany(
      { subcategories: subCategoryId },
      { $pull: { subcategories: subCategoryId } }
    );

    res.status(200).json({ message: 'Subcategory deleted successfully and references removed from products' });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: 'Server error', error });
  }
};


const deletesubsubcategory = async (req, res) => {
  // Delete sub-subcategory
  const { categoryId, subCategoryId, subSubCategoryId } = req.query;


  try {
    const categoryDoc = await ProductCategory.findById(categoryId);
    if (!categoryDoc) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const subCategory = categoryDoc.subCategories.id(subCategoryId);
    if (!subCategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    const subSubCategoryIndex = subCategory.subSubCategory.findIndex(subSubCat => subSubCat._id.toString() === subSubCategoryId);
    if (subSubCategoryIndex === -1) {
     
      return res.status(404).json({ message: 'Sub-subcategory not found' });
    }

    const photoPath = path.join(__dirname, '../logos', subCategory.subSubCategory[subSubCategoryIndex].photo);
    deleteFile(photoPath);

   

    subCategory.subSubCategory.splice(subSubCategoryIndex, 1);

    await categoryDoc.save();
    await Product.updateMany(
      { subSubcategories: subSubCategoryId },
      { $pull: { subSubcategories: subSubCategoryId } }
    );
    res.status(200).json({ message: 'SubSubcategory deleted successfully and references removed from services' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}

const getAll = async (req, res) => {
  try {
    const categories = await ProductCategory.find();
   
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}

const getSpecificCategory = async (req, res) => {
  try {
    const { slug } = req.query;

    if (!slug) {
      return res.status(400).json({ message: 'Slug is required' });
    }

    // Step 1: Get the main category by slug
    const category = await ProductCategory.findOne({ slug });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Step 2: Extract all subCategory _id values
    const subCategoryIds = category.subCategories.map(sub => sub._id);

    // Step 3: Find all products that match any of the subCategoryIds
    const products = await Product.find({
      subCategoryId: { $in: subCategoryIds }
    });

    // Step 4: Return both category and matched products
    res.status(200).json({
      category,
      products
    });

  } catch (error) {
    console.error('Error fetching category and products:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};




const getSpecificSubcategory = async (req, res) => {
  const { categoryId, subCategoryId } = req.query;
  try {
    const category = await ProductCategory.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    const subCategory = category.subCategories.id(subCategoryId);
    if (!subCategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }
    res.status(200).json(subCategory);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}

const getSpecificSubSubcategory = async (req, res) => {
  const { categoryId, subCategoryId, subSubCategoryId } = req.query;

  try {
    const category = await ProductCategory.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const subCategory = category.subCategories.id(subCategoryId);
    if (!subCategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    const subSubCategory = subCategory.subSubCategory.id(subSubCategoryId);
    if (!subSubCategory) {
      return res.status(404).json({ message: 'Sub-subcategory not found' });
    }

    res.status(200).json(subSubCategory);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};



const fetchCategoryUrlPriorityFreq  = async (req, res) => {
  try {
    const categories = await ProductCategory.find({}, 'id url changeFreq priority lastmod subCategories')
      .populate({
        path: 'subCategories',
        select: 'id url changeFreq priority lastmod subSubCategory',
        populate: {
          path: 'subSubCategory',
          select: 'id url changeFreq lastmod priority',
        },
      });

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const fetchCategoryUrlmeta  = async (req, res) => {
  try {
    const categories = await ProductCategory.find({}, 'id url metatitle metadescription metakeywords metacanonical metalanguage metaschema otherMeta subCategories')
      .populate({
        path: 'subCategories',
        select: 'id url metatitle metadescription metakeywords metacanonical metalanguage metaschema otherMeta subSubCategory',
        populate: {
          path: 'subSubCategory',
          select: 'id url metatitle metadescription metakeywords metacanonical metalanguage metaschema otherMeta',
        },
      });

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const editCategoryUrlPriorityFreq = async (req, res) => {
  try {
    const { id } = req.query;
    const { url, priority, changeFreq} = req.body;
   ;

    const updateFields = { url, priority, changeFreq};
    let updatedDocument = null;

    // Search and update the top-level ProductCategory document
    updatedDocument = await ProductCategory.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedDocument) {
      // If not found, search and update in subCategories
      updatedDocument = await ProductCategory.findOneAndUpdate(
        { 'subCategories._id': id },
        { $set: { 'subCategories.$.url': url, 'subCategories.$.priority': priority, 'subCategories.$.changeFreq': changeFreq} },
        { new: true }
      );
    }

    if (!updatedDocument) {
      // If not found, search and update in subSubCategories
      updatedDocument = await ProductCategory.findOneAndUpdate(
        { 'subCategories.subSubCategory._id': id },
        { $set: { 'subCategories.$[subCat].subSubCategory.$[subSubCat].url': url, 'subCategories.$[subCat].subSubCategory.$[subSubCat].priority': priority, 'subCategories.$[subCat].subSubCategory.$[subSubCat].changeFreq': changeFreq } },
        { arrayFilters: [{ 'subCat.subSubCategory._id': id }, { 'subSubCat._id': id }], new: true }
      );
    }

    if (!updatedDocument) {
      return res.status(404).json({ error: "ID not found in any category" });
    }

    res.status(200).json({ message: "Url, priority, change frequency, and lastmod updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const editCategoryUrlmeta = async (req, res) => {
  try {
    const { id } = req.query;
    const { url, metatitle, metadescription, metakeywords, metalanguage, metacanonical, metaschema, otherMeta } = req.body;
    console.log(id);

    const updateFields = { url, metatitle, metadescription, metakeywords, metalanguage, metacanonical, metaschema, otherMeta };
    let updatedDocument = null;

    // Search and update the top-level ProductCategory document
    updatedDocument = await ProductCategory.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedDocument) {
      // If not found, search and update in subCategories
      updatedDocument = await ProductCategory.findOneAndUpdate(
        { 'subCategories._id': id },
        { $set: {
            'subCategories.$.url': url,
            'subCategories.$.metatitle': metatitle,
            'subCategories.$.metadescription': metadescription,
            'subCategories.$.metakeywords': metakeywords,
            'subCategories.$.metalanguage': metalanguage,
            'subCategories.$.metacanonical': metacanonical,
            'subCategories.$.metaschema': metaschema,
            'subCategories.$.otherMeta': otherMeta,
          } 
        },
        { new: true }
      );
    }

    if (!updatedDocument) {
      // If not found, search and update in subSubCategories
      updatedDocument = await ProductCategory.findOneAndUpdate(
        { 'subCategories.subSubCategory._id': id },
        { $set: {
            'subCategories.$[subCat].subSubCategory.$[subSubCat].url': url,
            'subCategories.$[subCat].subSubCategory.$[subSubCat].metatitle': metatitle,
            'subCategories.$[subCat].subSubCategory.$[subSubCat].metadescription': metadescription,
            'subCategories.$[subCat].subSubCategory.$[subSubCat].metakeywords': metakeywords,
            'subCategories.$[subCat].subSubCategory.$[subSubCat].metalanguage': metalanguage,
            'subCategories.$[subCat].subSubCategory.$[subSubCat].metacanonical': metacanonical,
            'subCategories.$[subCat].subSubCategory.$[subSubCat].metaschema': metaschema,
            'subCategories.$[subCat].subSubCategory.$[subSubCat].otherMeta': otherMeta,
          }
        },
        { arrayFilters: [{ 'subCat.subSubCategory._id': id }, { 'subSubCat._id': id }], new: true }
      );
    }

    if (!updatedDocument) {
      return res.status(404).json({ error: "ID not found in any category" });
    }

    res.status(200).json({ message: "Meta details updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};


const fetchCategoryUrlPriorityFreqById = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    let categoryData = null;

    // Attempt to find the category by ID at the top level
    const topCategory = await ProductCategory.findById(id).select('url priority changeFreq');

    if (topCategory) {
      categoryData = {
        url: topCategory.url,
        priority: topCategory.priority,
        changeFreq: topCategory.changeFreq
      };
    } else {
      // If not found at the top level, search in subcategories
      const parentCategory = await ProductCategory.findOne(
        { 'subCategories._id': id },
        { 'subCategories.$': 1 }
      );

      if (parentCategory && parentCategory.subCategories && parentCategory.subCategories.length > 0) {
        const subCategory = parentCategory.subCategories[0];
        categoryData = {
          url: subCategory.url,
          priority: subCategory.priority,
          changeFreq: subCategory.changeFreq
        };
      }
    }

    if (!categoryData) {
      // If not found in subcategories, search in sub-subcategories
      const parentCategory = await ProductCategory.findOne(
        { 'subCategories.subSubCategory._id': id },
        { 'subCategories.subSubCategory.$': 1 }
      );

      if (parentCategory && parentCategory.subCategories && parentCategory.subCategories.length > 0) {
        const subSubCategory = parentCategory.subCategories[0].subSubCategory[0];
        categoryData = {
          url: subSubCategory.url,
          priority: subSubCategory.priority,
          changeFreq: subSubCategory.changeFreq
        };
      }
    }

    if (!categoryData) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json(categoryData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const fetchCategoryUrlmetaById = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    let categoryData = null;

    // Find the product category by ID and select specific fields
    categoryData = await ProductCategory.findById(id).select('url metatitle metadescription metakeywords metalanguage metacanonical metaschema otherMeta');

    if (!categoryData) {
      // If not found at the top level, search in subcategories
      categoryData = await ProductCategory.findOne(
        { 'subCategories._id': id },
        {
          'subCategories.$': 1,
          'subCategories.url': 1,
          'subCategories.metatitle': 1,
          'subCategories.metadescription': 1,
          'subCategories.metakeywords': 1,
          'subCategories.metalanguage': 1,
          'subCategories.metacanonical': 1,
          'subCategories.metaschema': 1,
          'subCategories.otherMeta': 1,
        }
      );
    }

    if (!categoryData) {
      // If not found in subcategories, search in sub-subcategories
      categoryData = await ProductCategory.findOne(
        { 'subCategories.subSubCategory._id': id },
        {
          'subCategories.subSubCategory.$': 1,
          'subCategories.subSubCategory.url': 1,
          'subCategories.subSubCategory.metatitle': 1,
          'subCategories.subSubCategory.metadescription': 1,
          'subCategories.subSubCategory.metakeywords': 1,
          'subCategories.subSubCategory.metalanguage': 1,
          'subCategories.subSubCategory.metacanonical': 1,
          'subCategories.subSubCategory.metaschema': 1,
          'subCategories.subSubCategory.otherMeta': 1,
        }
      );
    }

    if (!categoryData) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json(categoryData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const getSpecificSubcategoryBySlug = async (req, res) => {
  const { slug } = req.query;

  try {
    // Step 1: Find the category containing the subcategory with the given slug
    const category = await ProductCategory.findOne({
      subCategories: { $elemMatch: { slug } },
    });

    if (!category) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    // Step 2: Extract the matched subcategory
    const subCategory = category.subCategories.find((sub) => sub.slug === slug);

    if (!subCategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    // Step 3: Fetch all products that belong to this subcategory
    const products = await Product.find({ subCategoryId: subCategory._id });

    // Step 4: Return both the subcategory and its products
    res.status(200).json({
      subCategory,
      products,
    });

  } catch (error) {
    console.error('Error fetching subcategory and products:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};


const getSpecificCategoryById = async (req, res) => {
  try {
    const { categoryId } = req.query; // Get the slug from the query parameters
    if (!categoryId) {
      return res.status(400).json({ message: 'Slug is required' }); // Check if slug is provided
    }

    // Find the category by slug
    const category = await ProductCategory.findOne({_id: categoryId});

    if (!category) {
      return res.status(404).json({ message: 'Category not found' }); // If category is not found, return 404
    }

    res.status(200).json(category); // Return the category if found
  } catch (error) {
    res.status(500).json({ message: 'Server error', error }); // Return server error in case of any issue
  }
};


const getAllCategoriesWithProducts = async (req, res) => {
  try {
    const categories = await ProductCategory.aggregate([
      {
        $lookup: {
          from: "petrochemproducts", // this must match the **collection name** (check in MongoDB)
          localField: "_id",
          foreignField: "categoryId",
          as: "products",
        },
      },
    ]);

    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories with products:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


const getAllCategories = async (req, res) => {
  try {
    const categories = await ProductCategory.find().lean();

    if (!categories.length) {
      return res.status(404).json({ message: 'No categories found' });
    }

    res.status(200).json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

const getAllSubcategories = async (req, res) => {
  try {
    const categories = await ProductCategory.find().lean();

    if (!categories.length) {
      return res.status(404).json({ message: 'No categories found' });
    }

    const result = categories.map(category => ({
      categoryId: category._id,
      categoryName: category.name,
      categorySlug: category.slug,
      subCategories: category.subCategories || []
    }));

    res.status(200).json({ data: result });
  } catch (error) {
    console.error('Error fetching subcategories with categories:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};



module.exports = { insertCategory,getAllCategories,getAllSubcategories, insertSubCategory, insertSubSubCategory, updateCategory, updateSubCategory, updatesubsubcategory, deletecategory, deletesubcategory, deletesubsubcategory, getAll, getSpecificCategory, getSpecificSubcategory, getSpecificSubSubcategory,fetchCategoryUrlPriorityFreq, editCategoryUrlPriorityFreq, fetchCategoryUrlPriorityFreqById,fetchCategoryUrlmeta, editCategoryUrlmeta ,getSpecificSubcategoryBySlug,getAllCategoriesWithProducts, fetchCategoryUrlmetaById, getSpecificCategoryById };