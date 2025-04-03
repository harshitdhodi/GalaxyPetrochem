const EmailCategory = require('../model/emailCategory');

exports.createEmailCategory = async (req, res) => {
    try {
        const category = new EmailCategory({
            emailCategory: req.body.emailCategory
        });
        const savedCategory = await category.save();
        res.status(201).json(savedCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getEmailCategories = async (req, res) => {
    try {
        const categories = await EmailCategory.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateEmailCategory = async (req, res) => {
    try {
        const updatedCategory = await EmailCategory.findByIdAndUpdate(
            req.query.id,
            { emailCategory: req.body.emailCategory },
            { new: true }
        );
        
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Email category not found' });
        }
        
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteEmailCategory = async (req, res) => {
    try {
        const deletedCategory = await EmailCategory.findByIdAndDelete(req.query.id);
        
        if (!deletedCategory) {
            return res.status(404).json({ message: 'Email category not found' });
        }

        res.status(200).json({ message: 'Email category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getEmailCategoryById = async (req, res) => {
    try {
        const category = await EmailCategory.findById(req.query.id);
        
        if (!category) {
            return res.status(404).json({ message: 'Email category not found' });
        }
        
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};