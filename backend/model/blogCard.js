const mongoose = require('mongoose');

const BlogCardSchema = new mongoose.Schema({
    blogCard: {
        type: String,
        required: true
    },
}, { timestamps: true });

const BlogCard = mongoose.model('BlogCard', BlogCardSchema);

module.exports = BlogCard;