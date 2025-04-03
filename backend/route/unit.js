const express = require('express');
const router = express.Router();
const unitController = require('../controller/unit');

router.post('/add', unitController.createUnit);
router.get('/get', unitController.getAllUnits);
router.get('/getById', unitController.getUnitById);
router.put('/update', unitController.updateUnit);
router.delete('/delete', unitController.deleteUnit);

module.exports = router;
