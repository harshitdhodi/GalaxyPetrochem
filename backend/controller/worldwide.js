const Worldwide = require('../model/worldwide');

// Create new worldwide entry
const createWorldwide = async (req, res) => {
    try {
        const { category, name, state, city } = req.body;

        if (!category || !name) {
            return res.status(400).json({
                success: false,
                message: 'Category and name are required'
            });
        }

        const worldwide = new Worldwide({
            category,
            name,
            state,
            city
        });

        await worldwide.save();

        res.status(201).json({
            success: true,
            message: 'Worldwide entry created successfully',
            data: worldwide
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating worldwide entry',
            error: error.message
        });
    }
};

// Get all worldwide entries
const getAllWorldwide = async (req, res) => {
    try {
        const worldwide = await Worldwide.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: worldwide
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching worldwide entries',
            error: error.message
        });
    }
};

// Get worldwide entry by ID
const getWorldwideById = async (req, res) => {
    try {
        const worldwide = await Worldwide.findById(req.query.id);
        
        if (!worldwide) {
            return res.status(404).json({
                success: false,
                message: 'Worldwide entry not found'
            });
        }

        res.status(200).json({
            success: true,
            data: worldwide
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching worldwide entry',
            error: error.message
        });
    }
};

// Update worldwide entry
const updateWorldwide = async (req, res) => {
    try {
        const { category, name, state, city } = req.body;
        const worldwide = await Worldwide.findByIdAndUpdate(
            req.query.id,
            { category, name, state, city },
            { new: true, runValidators: true }
        );

        if (!worldwide) {
            return res.status(404).json({
                success: false,
                message: 'Worldwide entry not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Worldwide entry updated successfully',
            data: worldwide
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating worldwide entry',
            error: error.message
        });
    }
};

// Delete worldwide entry
const deleteWorldwide = async (req, res) => {
    try {
        const worldwide = await Worldwide.findByIdAndDelete(req.query.id);

        if (!worldwide) {
            return res.status(404).json({
                success: false,
                message: 'Worldwide entry not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Worldwide entry deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting worldwide entry',
            error: error.message
        });
    }
};

// Add default international countries
const addInternationalCountries = async (req, res) => {
    try {
        // First, delete all existing entries
        await Worldwide.deleteMany({});

        const countries = [
            'Algeria', 'Cuba', 'Kuwait', 'Philippines', 'Togo',
            'Argentina', 'Egypt', 'Lebanon', 'Qatar', 'Tunisia',
            'Armenia', 'Estonia', 'Madagascar', 'Republic of Korea', 'Turkey',
            'Australia', 'Ethiopia', 'Malaysia', 'Romania', 'Uganda',
            'Azerbaijan', 'France', 'Mauritius', 'Russian Federation', 'Ukraine',
            'Bahrain', 'Germany', 'Mexico', 'Rwanda', 'United Arab Emirates',
            'Bangladesh', 'Ghana', 'Mozambique', 'Saudi Arabia', 'United Republic of Tanzania',
            'Belgium', 'Indonesia', 'Myanmar', 'Serbia', 'Uruguay',
            'Benin', 'Iran', 'Nepal', 'Singapore', 'Uzbekistan',
            'Bhutan', 'Iraq', 'New Zealand', 'South Africa', 'Yemen',
            'Botswana', 'Israel', 'Nigeria', 'Spain', 'Zimbabwe',
            'Brazil', 'Italy', 'Oman', 'Sri Lanka',
            'Cameroon', 'Jordan', 'Pakistan', 'Sudan',
            'Colombia', 'Kazakhstan', 'Panama', 'Switzerland',
            'Costa Rica', 'Kenya', 'Peru', 'Tajikistan'
        ];

        const countryObjects = countries.map(country => ({
            category: 'international',
            name: country,
            state: '',
            city: ''
        }));

        const result = await Worldwide.insertMany(countryObjects);

        res.status(201).json({
            success: true,
            message: 'International countries reset successfully',
            count: result.length,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error resetting international countries',
            error: error.message
        });
    }
};

const addIndianLocations = async (req, res) => {
    // try {
    //     // First, delete all existing India category entries
    //     await Worldwide.deleteMany({ category: 'india' });

    //     // Get all states of India
    //     const indianStates = State.getStatesOfCountry('IN');
        
    //     const locationObjects = [];

    //     // For each state, get exactly 5 cities and create entry
    //     for (const state of indianStates) {
    //         const stateCities = City.getCitiesOfState('IN', state.isoCode);
            
    //         // Log warning if state has less than 5 cities
    //         if (stateCities.length < 5) {
    //             console.warn(`Warning: ${state.name} has only ${stateCities.length} cities available`);
    //         }

    //         // Ensure exactly 5 cities by repeating the last city if needed
    //         const cities = [];
    //         for (let i = 0; i < 5; i++) {
    //             // If we run out of cities, use the last available city
    //             const cityIndex = Math.min(i, stateCities.length - 1);
    //             cities.push(stateCities[cityIndex]?.name || stateCities[0]?.name || 'Unknown City');
    //         }

    //         locationObjects.push({
    //             category: 'india',
    //             name: 'India',
    //             state: state.name,
    //             cities: cities
    //         });
    //     }

    //     const result = await Worldwide.insertMany(locationObjects);

    //     res.status(201).json({
    //         success: true,
    //         message: 'Indian locations reset successfully',
    //         count: result.length,
    //         data: result
    //     });
    // } catch (error) {
    //     res.status(500).json({
    //         success: false,
    //         message: 'Error resetting Indian locations',
    //         error: error.message
    //     });
    // }
};

module.exports = { 
    createWorldwide,
    getAllWorldwide,
    getWorldwideById,
    updateWorldwide,
    deleteWorldwide,
    addInternationalCountries,
    addIndianLocations
};
