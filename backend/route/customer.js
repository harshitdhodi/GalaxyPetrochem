const express = require('express');
const router = express.Router();
const customerController = require('../controller/customer');
const {singleImage} = require('../middleware/singleImage');  // Import Multer middleware

// Routes
router.post('/create', singleImage, customerController.createCustomer);  // Handle image upload
router.get('/get', customerController.getCustomers);
router.get('/getById', customerController.getCustomerById);
router.put('/update', singleImage, customerController.updateCustomer); // Handle image upload
router.delete('/delete', customerController.deleteCustomer);
router.get('/getAllCustomersByAlphabet', customerController.getAllCustomersByAlphabet);
router.put('/addChemicalIdsToCustomer',customerController.addChemicalIdsToCustomer)
router.get('/getCustomerByChemicalId',customerController.getCustomerByChemicalId);
router.delete('/deleteChemicalFromCustomer', customerController.deleteChemicalFromCustomer)
module.exports = router;
