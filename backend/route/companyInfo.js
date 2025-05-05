const express = require('express');
const router = express.Router();
const companyInfo = require('../controller/companyInfo');
const { upload } = require('../middleware/companyImg');

// Create
router.post('/create', upload.single('photo'), companyInfo.createBrand);

// Read
router.get('/', companyInfo.getAllBrands);
router.get('/:id', companyInfo.getBrandById);

// Update
router.put('/:id', upload.single('photo'), companyInfo.updateBrand);

// Delete
router.delete('/:id', companyInfo.deleteBrand);

module.exports = router;
