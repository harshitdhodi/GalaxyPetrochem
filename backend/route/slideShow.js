const express = require('express');
const { uploadImage, getAllImages, getImageById, updateImage, deleteImage } = require('../controller/slideShow');
const { singleImage } = require('../middleware/singleImage');

const router = express.Router();

router.post('/addimages', singleImage, uploadImage);
router.get('/getAll', getAllImages);
router.get('/getById', getImageById);
router.put('/update', singleImage, updateImage);
router.delete('/delete', deleteImage);

module.exports = router;
