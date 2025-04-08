// controllers/testimonialController.js
const Testimonial = require('../model/testimonial');

// Create
exports.createTestimonial = async (req, res) => {
    try {
      const {
        altName,
        imgTitle,
        name,
        designation,
        company,
        rating,
        message
      } = req.body;
  
      const photo = req.file ? req.file.filename : null;
  
      const newTestimonial = new Testimonial({
        photo,
        altName,
        imgTitle,
        name,
        designation,
        company,
        rating,
        message
      });
  
      await newTestimonial.save();
      res.status(201).json({ message: 'Testimonial created', data: newTestimonial });
    } catch (err) {
      res.status(500).json({ message: 'Error creating testimonial', error: err.message });
    }
  };
  

// Get all
exports.getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.status(200).json({ data: testimonials });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching testimonials', error: err.message });
  }
};

// Get by ID
exports.getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ message: 'Not found' });
    res.status(200).json({ data: testimonial });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching testimonial', error: err.message });
  }
};

// Update
exports.updateTestimonial = async (req, res) => {
    try {
      const testimonial = await Testimonial.findById(req.params.id);
      if (!testimonial) return res.status(404).json({ message: 'Testimonial not found' });
  
      // Replace photo if new one is uploaded
      if (req.file) {
        if (testimonial.photo) {
          const oldImagePath = path.join(__dirname, '..', testimonial.photo);
          if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
        }
  
        testimonial.photo = req.file.filename;
      }
  
      const {
        altName,
        imgTitle,
        name,
        designation,
        company,
        rating,
        message
      } = req.body;
  
      testimonial.altName = altName || testimonial.altName;
      testimonial.imgTitle = imgTitle || testimonial.imgTitle;
      testimonial.name = name || testimonial.name;
      testimonial.designation = designation || testimonial.designation;
      testimonial.company = company || testimonial.company;
      testimonial.rating = rating || testimonial.rating;
      testimonial.message = message || testimonial.message;
  
      await testimonial.save();
  
      res.status(200).json({ message: 'Testimonial updated successfully', data: testimonial });
    } catch (err) {
      res.status(500).json({ message: 'Error updating testimonial', error: err.message });
    }
  };

// Delete
exports.deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) return res.status(404).json({ message: 'Not found' });
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting testimonial', error: err.message });
  }
};
