const CompanyInfo = require('../model/CompanyInfo');
const path = require('path');
const fs = require('fs');

exports.createBrand = async (req, res) => {
    try {
      let photoFilename;
  
      // ✅ Use req.file when using upload.single('photo')
      if (req.file) {
        photoFilename = req.file.filename;
      }
  
      const newBrand = new CompanyInfo({
        brand: req.body.brand,
        photo: photoFilename,
        altName: req.body.altName,
        imgTitle: req.body.imgTitle,
        year: req.body.year,
        experts: req.body.experts,
        details: req.body.details
      });
  
      await newBrand.save();
      res.status(201).json({ message: 'Brand created successfully', data: newBrand });
    } catch (error) {
      console.error('Create Brand Error:', error);
      res.status(500).json({ error: 'Error creating brand', details: error.message });
    }
  };

exports.getAllBrands = async (req, res) => {
  try {
    const brands = await CompanyInfo.find().sort({ createdAt: -1 });
    res.status(200).json({ data: brands });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching brands', details: error.message });
  }
};

exports.getBrandById = async (req, res) => {
  try {
    const brand = await CompanyInfo.findById(req.params.id);
    if (!brand) return res.status(404).json({ error: 'Brand not found' });
    res.status(200).json({ data: brand });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching brand', details: error.message });
  }
};

exports.updateBrand = async (req, res) => {
    try {
      const updatedFields = {
        brand: req.body.brand,
        altName: req.body.altName,
        imgTitle: req.body.imgTitle,
        year: req.body.year,
        experts: req.body.experts,
        details: req.body.details,
      };
  
      // ✅ Multer with single('photo') => use req.file instead of req.files
      if (req.file) {
        updatedFields.photo = req.file.filename;
      }
  
      const updatedBrand = await CompanyInfo.findByIdAndUpdate(
        req.params.id,
        updatedFields,
        { new: true }
      );
  
      res.status(200).json({ message: 'Brand updated successfully', data: updatedBrand });
    } catch (error) {
      console.error('Update Brand Error:', error);
      res.status(500).json({ error: 'Error updating brand', details: error.message });
    }
  };
  
  

exports.deleteBrand = async (req, res) => {
  try {
    const brand = await CompanyInfo.findByIdAndDelete(req.params.id);
    if (!brand) return res.status(404).json({ error: 'Brand not found' });
    res.status(200).json({ message: 'Brand deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting brand', details: error.message });
  }
};
