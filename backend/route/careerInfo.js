const express = require('express');
const router = express.Router();
const careerInfoController = require('../controller/careerInfo');
const imgUpload = require('../middleware/imgUpload');
router.get('/', careerInfoController.getAllCareerInfo);
router.get('/:id', careerInfoController.getCareerInfoById);
router.post('/',imgUpload, careerInfoController.createCareerInfo);
router.put('/:id',imgUpload, careerInfoController.updateCareerInfo);
router.delete('/:id', careerInfoController.deleteCareerInfo);

module.exports = router;