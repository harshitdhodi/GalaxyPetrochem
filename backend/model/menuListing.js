const mongoose = require('mongoose');

const MenuListingSchema = new mongoose.Schema(
    {
        parent: { 
            name: { type: String, required: true }, 
            path: { type: String, required: true } 
        },
        children: [
            {
                name: { type: String, required: true }, 
                path: { type: String, required: true },
                subChildren: [
                    {
                        name: { type: String, required: true }, 
                        path: { type: String, required: true }
                    }
                ]
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('MenuListing', MenuListingSchema);
