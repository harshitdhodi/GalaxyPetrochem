// routes/testimonialRoutes.js
const express = require('express');
const router = express.Router();
const testimonialController = require('../controller/testimonial');
const { upload } = require('../middleware/companyImg');

router.post('/add', upload.single('photo'), testimonialController.createTestimonial);
router.get('/getAll', testimonialController.getAllTestimonials);
router.get('/getById/:id', testimonialController.getTestimonialById);
router.put('/update/:id', upload.single('photo'), testimonialController.updateTestimonial);
router.delete('/delete/:id', testimonialController.deleteTestimonial);

module.exports = router;
