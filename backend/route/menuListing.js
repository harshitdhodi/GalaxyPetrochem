const express = require('express');
const router = express.Router();
const menuListingController = require('../controller/menuListing');

router.post('/add-menu', menuListingController.createMenuListing);
router.get('/get-menu', menuListingController.getAllMenuListings);
router.get('/get-menu/:id', menuListingController.getMenuListingById);
router.put('/update-menu/:id', menuListingController.updateMenuListing);
router.delete('/delete-menu/:id', menuListingController.deleteMenuListing);

module.exports = router;