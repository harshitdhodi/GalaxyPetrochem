const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the Blog
const BlogSchema = new Schema({
    title: { type: String, required: true },
    date: { type: String, required: true },
    details: { type: String, required: true },
    image: [{ type: String, required: true }],
    alt: [{ type: String, default: '' }],
    imageTitle: [{ type: String, default: '' }],
    slug: { type: String, unique: true },
    postedBy: { type: String, required: true },
    visits: { type: Number, default: 0 },
    metatitle: { type: String },
    metadescription: { type: String },
    metakeywords: { type: String },
    metacanonical: { type: String },
    metalanguage: { type: String },
    metaschema: { type: String },
    otherMeta: { type: String },
    url: { type: String },
    priority: { type: Number },
    changeFreq: { type: String },
    lastmod: { type: Date, default: Date.now },
    status: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'BlogCategory' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

BlogSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Blog = mongoose.model('Blog', BlogSchema);

module.exports = Blog;
