import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateIndustryForm = ({ industryId, setIndustryId, onSuccess }) => {
    const [formData, setFormData] = useState({
        heading: '',
        subHeading: '',
        items: [{ name: '', description: '' }],
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Fetch existing industry data if industryId is provided
    useEffect(() => {
        if (industryId) {
            const fetchIndustry = async () => {
                try {
                    const response = await axios.get(`/api/industry/get/${industryId}`);
                    setFormData({
                        heading: response.data.heading,
                        subHeading: response.data.subHeading,
                        items: response.data.items.length > 0 ? response.data.items : [{ name: '', description: '' }],
                    });
                } catch (error) {
                    console.error(error);
                    setMessage('Failed to load industry data.');
                }
            };
            fetchIndustry();
        }
    }, [industryId]);

    const handleChange = (e, index) => {
        const { name, value } = e.target;
        if (name === 'heading' || name === 'subHeading') {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        } else {
            const newItems = [...formData.items];
            newItems[index][name] = value;
            setFormData((prev) => ({
                ...prev,
                items: newItems,
            }));
        }
    };

    const addItem = () => {
        setFormData((prev) => ({
            ...prev,
            items: [...prev.items, { name: '', description: '' }],
        }));
    };

    const removeItem = (index) => {
        if (formData.items.length > 1) {
            const newItems = formData.items.filter((_, i) => i !== index);
            setFormData((prev) => ({
                ...prev,
                items: newItems,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        // Validate items
        const invalidItem = formData.items.some((item) => !item.name || !item.description);
        if (invalidItem) {
            setMessage('All items must have a name and description.');
            setLoading(false);
            return;
        }

        try {
            let response;
            if (industryId) {
                // Update existing industry
                response = await axios.put(`/api/industry/update/${industryId}`, formData);
                setMessage('Industry updated successfully!');
            } else {
                // Create new industry
                response = await axios.post('/api/industry/create', formData);
                setMessage('Industry created successfully!');
            }

            // Reset form and ID
            setFormData({
                heading: '',
                subHeading: '',
                items: [{ name: '', description: '' }],
            });
            setIndustryId(null);
            if (onSuccess) onSuccess(); // Trigger table refresh
        } catch (error) {
            console.error(error);
            setMessage(error.response?.data?.message || `Failed to ${industryId ? 'update' : 'create'} industry.`);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            heading: '',
            subHeading: '',
            items: [{ name: '', description: '' }],
        });
        setIndustryId(null);
        setMessage('');
    };

    return (
        <div className="max-w-4xl p-6 bg-white">
            <h2 className="text-2xl font-bold mb-6 text-start">
                {industryId ? 'Update Industry Expertise' : 'Create Industry Expertise'}
            </h2>
            {message && (
                <div className={`mb-4 text-center text-sm ${message.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>
                    {message}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700">Heading</label>
                    <input
                        type="text"
                        name="heading"
                        value={formData.heading}
                        onChange={handleChange}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700">Sub Heading</label>
                    <textarea
                        name="subHeading"
                        value={formData.subHeading}
                        onChange={handleChange}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 mb-2">Items</label>
                    {formData.items.map((item, index) => (
                        <div key={index} className="border p-4 mb-4 rounded-md space-y-2">
                            <div>
                                <label className="block text-gray-700">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={item.name}
                                    onChange={(e) => handleChange(e, index)}
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Description</label>
                                <textarea
                                    name="description"
                                    value={item.description}
                                    onChange={(e) => handleChange(e, index)}
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    rows="4"
                                    required
                                />
                            </div>
                            {formData.items.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeItem(index)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    Remove Item
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addItem}
                        className="bg-green-500 text-white py-1 px-4 rounded-md hover:bg-green-600 transition"
                    >
                        Add Item
                    </button>
                </div>

                <div className="flex space-x-4">
                    {industryId && (
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : 'Update Industry'}
                        </button>
                    )}


                    {industryId && (
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="w-full bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default CreateIndustryForm;