const express = require('express');
const router = express.Router();
const nameController = require('../controller/chemicalType');

router.post('/add', nameController.createName);
router.get('/get', nameController.getAllNames);
router.get('/getById', nameController.getNameById);
router.put('/update', nameController.updateName);
router.delete('/delete', nameController.deleteName);

module.exports = router;
