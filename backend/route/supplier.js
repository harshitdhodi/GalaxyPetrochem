// /routes/supplierRoutes.js
const express = require('express');
const router = express.Router();
const supplierController = require('../controller/supplier');
const  upload  = require('../middleware/supplierImage');
router.post('/add',upload.single('image'), supplierController.createsupplier);    // Create supplier
router.get('/get', supplierController.getAllsuppliers);    // Get all suppliers
router.get('/getById', supplierController.getsupplierById); // Get supplier by ID
router.put('/update',upload.single('image'), supplierController.updatesupplier);  // Update supplier
router.delete('/delete', supplierController.deletesupplier); // Delete supplier
router.get('/count',supplierController.countChemical)
router.get('/getChemicalsForSupplier',supplierController.getChemicalsForSupplier )
router.put('/addChemicalIdsToSupplier',supplierController.addChemicalIdsToSupplier)
router.get('/getAllSuppliersByAlphabet',supplierController.getAllSuppliersByAlphabet)
router.get('/getSupplierByChemicalId',supplierController.getSupplierByChemicalId)
router.get('/getSupplierCountByChemicalId' , supplierController.getSupplierCountByChemicalId);
router.delete('/deleteChemicalFromSupplier',supplierController.deleteChemicalFromSupplier);
module.exports = router;
 