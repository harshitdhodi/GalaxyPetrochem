const Customer = require('../model/customer');

// Create a new customer
exports.createCustomer = async (req, res) => {
    try {
        console.log('Request body:', req.body);
      
        // Ensure image is a single string value
        let imageFileName = null;
        if (req.file) {
            imageFileName = req.file.filename;
        } else if (req.body.image) {
            // Convert image to string if it's an array
            imageFileName = Array.isArray(req.body.image) 
                ? req.body.image[0].toString() 
                : req.body.image.toString();
        }

        // Create customer data object with explicit string conversion for image
        const customerData = {
            ...req.body,
            image: imageFileName
        };

        console.log('Customer data to save:', customerData);

        const customer = new Customer(customerData);
        const savedCustomer = await customer.save();
        res.status(201).json(savedCustomer);
    } catch (err) {
        console.error('Error creating customer:', err);
        res.status(400).json({ 
            message: err.message,
            details: err.errors?.image?.message || 'Unknown error'
        });
    }
};

// Get all customers
exports.getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find().populate('chemicalId', 'name cas_number');
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching customers", error: error.message });
    }
};

// Get customer by ID
exports.getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.query.id).populate('chemicalId', 'name cas_number');
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        res.status(200).json({ message: "Customer fetched successfully", data: customer });
    } catch (error) {
        res.status(500).json({ message: "Error fetching customer", error: error.message });
    }
};

// Update customer
exports.updateCustomer = async (req, res) => {
  
    try {
        console.log('Update request body:', req.body);
        console.log('Update request file:', req.file);

        let updateData = { ...req.body };

        // Handle image update
        if (req.file) {
            updateData.image = req.file.filename;
        } else if (req.body.image) {
            // If image is coming from body, ensure it's a string
            updateData.image = Array.isArray(req.body.image) 
                ? req.body.image[0] 
                : req.body.image;
        }

        // Remove undefined or null values
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined || updateData[key] === null) {
                delete updateData[key];
            }
        });

        console.log('Update data:', updateData);

        const updatedCustomer = await Customer.findByIdAndUpdate(
            req.query.id,
            updateData,
            { 
                new: true,
                runValidators: true // This ensures validation runs on update
            }
        ).populate('chemicalId');

        if (!updatedCustomer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.status(200).json({ 
            message: "Customer updated successfully", 
            data: updatedCustomer 
        });
    } catch (error) {
        console.error('Error updating customer:', error);
        res.status(500).json({ 
            message: "Error updating customer", 
            error: error.message,
            details: error.errors?.image?.message || 'Unknown error'
        });
    }
};

// Delete customer
exports.deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.query.id);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        res.status(200).json({ message: "Customer deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting customer", error: error.message });
    }
};

// Get customers by alphabet
exports.getAllCustomersByAlphabet = async (req, res) => {
    try {
        const { alphabet } = req.query;

        // Validate the query parameter
        const filter = alphabet
            ? { name: new RegExp(`^${alphabet}`, 'i') }
            : {};

        const customers = await Customer.find(filter)
            .populate('chemicalId', 'name cas_number')
            .exec();

        // Ensure unique chemicals
        customers.forEach(customer => {
            customer.chemicalId = [...new Set(customer.chemicalId.map(c => c._id))].map(id => {
                return customer.chemicalId.find(chemical => chemical._id.toString() === id.toString());
            });
        });

        res.json(customers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Add chemical IDs to customer
exports.addChemicalIdsToCustomer = async (req, res) => {
    console.log('Request body:', req.body);
    try {
        const customer = await Customer.findById(req.query.id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Convert chemicalId to array if it's not already
        const newChemicalIds = Array.isArray(req.body.chemicalId) 
            ? req.body.chemicalId 
            : [req.body.chemicalId];

        // Add new chemicalId to the customer's existing list
        const updatedChemicalIds = [...new Set([...customer.chemicalId, ...newChemicalIds])];
        customer.chemicalId = updatedChemicalIds;
        await customer.save();

        res.json(customer);
    } catch (err) {
        console.error('Error adding chemical IDs:', err);
        res.status(400).json({ message: err.message });
    }
};

// Get customer by chemical ID
exports.getCustomerByChemicalId = async (req, res) => {
    const { chemicalId } = req.query;

    if (!chemicalId) {
        return res.status(400).json({ message: 'Chemical ID is required' });
    }

    try {
        const customers = await Customer.find({ chemicalId: chemicalId })
            .populate('chemicalId');
        
        if (!customers || customers.length === 0) {
            return res.status(404).json({ 
                message: 'No customers found for the provided chemical ID' 
            });
        }

        res.json(customers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete chemical from customer
exports.deleteChemicalFromCustomer = async (req, res) => {
    const { customerId, chemicalId } = req.query;

    try {
        const updatedCustomer = await Customer.findOneAndUpdate(
            { _id: customerId },
            { $pull: { chemicalId: chemicalId } },
            { new: true }
        ).populate('chemicalId');

        if (!updatedCustomer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.status(200).json({ 
            message: 'Chemical removed successfully', 
            data: updatedCustomer 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};