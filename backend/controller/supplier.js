// /controllers/supplierController.js
const Supplier = require('../model/supplier');

// Create a new supplier
exports.createsupplier = async (req, res) => {
    try {
        const supplierData = {
            name: req.body.name,
            mobile: req.body.mobile,
            email: req.body.email,
            website: req.body.website || '',
            contact_person: req.body.contact_person || '',
            address: req.body.address || '',
            country: req.body.country,
            city: req.body.city || '',
            description: req.body.description || '',
            image: req.file ? req.file.filename : '', // Get filename from uploaded file
            chemical_ids: req.body.chemicalId ? [req.body.chemicalId] : []
        };

        const supplier = new Supplier(supplierData);
        const savedSupplier = await supplier.save();
        
        res.status(201).json({
            success: true,
            message: 'Supplier added successfully',
            data: savedSupplier
        });
    } catch (err) {
        console.error('Error creating supplier:', err);
        res.status(400).json({ 
            success: false,
            message: err.message 
        });
    }
};

// Get all suppliers
exports.getAllsuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find().populate('chemical_ids');
        
        // Add totalChemicalIds for each supplier
        const suppliersWithChemicalCount = suppliers.map(supplier => ({
            ...supplier.toObject(),
            totalChemicalIds: supplier.chemical_ids.length
        }));

        res.json(suppliersWithChemicalCount);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// count chemical 
exports.countChemical = async (req, res) => {
    const { supplierId } = req.query; // Extract supplierId from request parameters
  
    try {
      // Find the supplier by ID and populate the chemical_ids
      const supplier = await Supplier.findById(supplierId).populate('chemical_ids');
  
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }
  
      // Count the number of chemical_ids for the supplier
      const chemicalCount = supplier.chemical_ids.length;
  
      res.status(200).json({ chemicalCount });
    } catch (err) {
      res.status(500).json({ message: "Error counting chemicals", error: err.message });
    }
  };
  
// Get a supplier by ID
exports.getsupplierById = async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.query.id).populate('chemical_ids');
        if (!supplier) return res.status(404).json({ message: 'supplier not found' });
        res.json(supplier);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Update a supplier
exports.updatesupplier = async (req, res) => {
    try {
        const updateData = {
            name: req.body.name,
            mobile: req.body.mobile,
            email: req.body.email,
            website: req.body.website,
            contact_person: req.body.contact_person,
            address: req.body.address,
            country: req.body.country,
            city: req.body.city,
            description: req.body.description
        };

        // Only update image if a new file is uploaded
        if (req.file) {
            updateData.image = req.file.filename;
        }

        const supplier = await Supplier.findByIdAndUpdate(
            req.query.id, 
            updateData,
            { new: true }
        );

        if (!supplier) {
            return res.status(404).json({ 
                success: false,
                message: 'Supplier not found' 
            });
        }

        res.json({
            success: true,
            message: 'Supplier updated successfully',
            data: supplier
        });
    } catch (err) {
        res.status(400).json({ 
            success: false,
            message: err.message 
        });
    }
};

// Delete a supplier
exports.deletesupplier = async (req, res) => {
    try {
        const supplier = await Supplier.findByIdAndDelete(req.query.id);
        if (!supplier) return res.status(404).json({ message: 'supplier not found' });
        res.json({ message: 'supplier deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Fetch chemicals for a particular supplier
exports.getChemicalsForSupplier = async (req, res) => {
    const { supplierId } = req.query;

    try {
        const supplier = await Supplier.findById(supplierId).populate('chemical_ids');

        if (!supplier) {
            return res.status(404).json({ message: "Supplier not found" });
        }

        // Fetch and return the chemicals associated with this supplier
        const chemicals = supplier.chemical_ids;

        res.json({ supplier, chemicals });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// get supplier based on Alphabets'
exports.getAllSuppliersByAlphabet = async (req, res) => {
    try {
      const { alphabet } = req.query;
  
      // Validate the query parameter
      if (!alphabet || alphabet.length !== 1 || !/^[A-Za-z]$/.test(alphabet)) {
        return res.status(400).json({ message: "Invalid alphabet parameter" });
      }
  
      // Fetch suppliers whose names start with the given alphabet (case-insensitive)
      const suppliers = await Supplier.find({
        name: { $regex: `^${alphabet}`, $options: "i" }
      }).populate('chemical_ids');
  
      // Add totalChemicalIds for each supplier
      const suppliersWithChemicalCount = suppliers.map(supplier => ({
        ...supplier.toObject(),
        totalChemicalIds: supplier.chemical_ids.length
      }));
  
      res.json(suppliersWithChemicalCount);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }  };
  
// Add chemical Ids to supplier 
exports.addChemicalIdsToSupplier = async (req, res) => {
    try {
        // Log the incoming body to check if the data is being parsed correctly
        console.log('Received request body:', req.body);

        // Ensure the request body contains the chemical_ids as an array
        if (!req.body.chemical_ids || !Array.isArray(req.body.chemical_ids)) {
            return res.status(400).json({ message: 'Invalid chemical_ids. It should be an array.' });
        }

        // Find the supplier by the ID passed in the query parameter
        const supplier = await Supplier.findById(req.query.id);

        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }

        // Add new chemical_ids to the supplier's existing list of chemical_ids
        const updatedChemicalIds = [...new Set([...supplier.chemical_ids, ...req.body.chemical_ids])];

        // Update the supplier with the new list of chemical_ids
        supplier.chemical_ids = updatedChemicalIds;

        // Save the updated supplier
        await supplier.save();

        res.json(supplier);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// get supplier by chemical id 
exports.getSupplierByChemicalId = async (req, res) => {
    const { chemicalId } = req.query;
    if (!chemicalId) {
        return res.status(400).json({ message: 'Chemical ID is required' });
    }

    try {
        const suppliers = await Supplier.find({ chemical_ids: chemicalId }).populate('chemical_ids');
        
        if (!suppliers || suppliers.length === 0) {
            return res.status(404).json({ message: 'No suppliers found for the provided chemical ID' });
        }
        
        res.json(suppliers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getSupplierCountByChemicalId = async (req, res) => {
    const { chemicalId } = req.query;
    if (!chemicalId) {
        return res.status(400).json({ message: 'Chemical ID is required' });
    }

    try {
        // Count the number of suppliers with the provided chemicalId
        const supplierCount = await Supplier.countDocuments({ chemical_ids: chemicalId });

        if (supplierCount === 0) {
            return res.status(404).json({ message: 'No suppliers found for the provided chemical ID' });
        }

        res.json({ totalSuppliers: supplierCount });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteChemicalFromSupplier = async (req, res) => {
    const { supplierId, chemicalId } = req.query;

    try {
        // Find the supplier by ID
        const supplier = await Supplier.findById(supplierId);

        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }

        // Check if the chemicalId exists in the supplier's chemical_ids array
        if (!supplier.chemical_ids.includes(chemicalId)) {
            return res.status(404).json({ message: 'Chemical ID not found for this supplier' });
        }

        // Remove the chemical ID from the chemical_ids array
        supplier.chemical_ids = supplier.chemical_ids.filter(
            id => id.toString() !== chemicalId
        );

        // Save the updated supplier document
        await supplier.save();

        res.status(200).json({ message: 'Chemical ID removed successfully', supplier });
    } catch (error) {
        console.error('Error removing chemical ID:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};   