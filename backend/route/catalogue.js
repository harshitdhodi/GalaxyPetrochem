const express = require('express');
const { createCatalogue, getAllCatalogues, getCatalogueById, updateCatalogue, deleteCatalogue } = require('../controller/catalogue');
const imgUpload = require('../middleware/imgUpload');

const router = express.Router();

router.post('/', imgUpload, createCatalogue);
router.get('/', getAllCatalogues);
router.get('/:id', getCatalogueById);
router.put('/:id', imgUpload, updateCatalogue);
router.delete('/:id', deleteCatalogue);

module.exports = router;