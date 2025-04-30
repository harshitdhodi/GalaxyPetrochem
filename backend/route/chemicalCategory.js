const express = require('express');
const router = express.Router();
const { insertCategory,getAllCategories,getAllSubcategories, insertSubCategory, insertSubSubCategory, updateCategory, updateSubCategory, updatesubsubcategory, deletecategory, deletesubcategory, deletesubsubcategory, getAll, getSpecificCategory, getSpecificSubcategory, getSpecificSubSubcategory, fetchCategoryUrlPriorityFreq, editCategoryUrlPriorityFreq,
    getSpecificSubcategoryBySlug,getAllCategoriesWithProducts,
    fetchCategoryUrlPriorityFreqById,getSpecificCategoryById, fetchCategoryUrlmeta, editCategoryUrlmeta, fetchCategoryUrlmetaById } = require("../controller/chemicalCategory")

const { requireAuth } = require("../middleware/requireAuth")
const { uploadLogo } = require("../middleware/logoUpload")
router.post('/insertCategory', uploadLogo, insertCategory)
router.post('/insertSubCategory', uploadLogo, insertSubCategory)
router.post('/insertSubSubCategory', uploadLogo, insertSubSubCategory)
router.put('/updateCategory', uploadLogo, updateCategory)
router.put('/updateSubCategory', uploadLogo, updateSubCategory)
router.put('/updatesubsubcategory', uploadLogo, updatesubsubcategory)
router.delete('/deletecategory', deletecategory)
router.delete('/deletesubcategory', deletesubcategory)
router.delete('/deletesubsubcategory', deletesubsubcategory)
router.get('/getAll', getAll)
router.get('/getAllCategories', getAllCategories)
router.get('/getAllSubcategories', getAllSubcategories)
router.get('/getAllCategoriesWithProducts', getAllCategoriesWithProducts)
router.get('/getSpecificCategory', getSpecificCategory)
router.get('/getSpecificSubcategory', getSpecificSubcategory)
router.get('/getSpecificSubSubcategory', getSpecificSubSubcategory)
router.get('/fetchCategoryUrlPriorityFreq', fetchCategoryUrlPriorityFreq)
router.put('/editCategoryUrlPriorityFreq', editCategoryUrlPriorityFreq)
// router.delete('/deleteCategoryUrlPriorityFreq',deleteCategoryUrlPriorityFreq)
router.get('/fetchCategoryUrlPriorityFreqById', fetchCategoryUrlPriorityFreqById)
router.get('/fetchCategoryUrlmeta', fetchCategoryUrlmeta)
router.put('/editCategoryUrlmeta', editCategoryUrlmeta)
router.get('/fetchCategoryUrlmetaById', fetchCategoryUrlmetaById)
router.get('/getSpecificSubcategoryBySlug', getSpecificSubcategoryBySlug)
router.get('/getSpecificCategoryById', getSpecificCategoryById)
module.exports = router 