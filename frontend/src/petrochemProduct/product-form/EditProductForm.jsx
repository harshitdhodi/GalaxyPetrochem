import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetAllChemicalCategoriesQuery } from '@/slice/chemicalSlice/chemicalCategory';
import BasicInfoForm from './forms/BasicInfoForm';
import CategoryBrandForm from './forms/CategoryBrandForm';
import ProductDetailsForm from './forms/ProductDetailsForm';
import DocumentsForm from './forms/DocumentsForm';
import ImagesForm from './forms/ImagesForm';
import SeoForm from './forms/SeoForm';

const UpdatePetrochemicalProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formSubmitting, setFormSubmitting] = useState(false);
    const [subcategories, setSubcategories] = useState([]);
    const [brands, setBrands] = useState([]);

    // Fetch all chemical categories
    const { data: categories, isLoading: categoriesLoading } = useGetAllChemicalCategoriesQuery();

    const [formData, setFormData] = useState({
        categorySlug: '',
        subCategorySlug: '',
        slug: '',
        name: '',
        tagline: '',
        specification: '',
        details: '',
        tableInfo: '',
        images: [],
        pdf: '',
        msds: '',
        brandId: '',
        categoryId: '',
        subCategoryId: '',
        metaTitle: '',
        metaDescription: '',
        metaKeyword: '',
        metaSchema: '',
    });

    // Fetch product data, brands, and subcategories on component mount
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/petrochemProduct/${id}`);
                const productData = response.data;

                // Ensure images is an array
                if (!Array.isArray(productData.images)) {
                    productData.images = [];
                }

                console.log('Fetched product data:', productData);
                setFormData(productData);

                // Fetch subcategories if categoryId exists
                if (productData.categoryId) {
                    console.log('Fetching subcategories for categoryId:', productData.categoryId);
                    await fetchSubcategories(productData.categoryId);
                } else {
                    console.warn('No categoryId found in product data');
                    setSubcategories([]);
                }

                setLoading(false);
            } catch (err) {
                setError('Failed to fetch product data. Please try again.');
                setLoading(false);
                console.error('Error fetching product:', err);
            }
        };

        const fetchBrands = async () => {
            try {
                const response = await axios.get('/api/brand');
                const data = Array.isArray(response.data.data) ? response.data.data : [];
                console.log('Fetched brands:', data);
                setBrands(data);
            } catch (err) {
                console.error('Error fetching brands:', err);
                setBrands([]);
            }
        };

        fetchProduct();
        fetchBrands();
    }, [id]);

    // Fetch subcategories when category changes
    const fetchSubcategories = async (categoryId) => {
        if (!categoryId) {
            console.warn('No categoryId provided, setting subcategories to empty array');
            setSubcategories([]);
            return;
        }
        try {
            const response = await axios.get(`/api/subcategories?categoryId=${categoryId}`);
            const data = Array.isArray(response.data) ? response.data : [];
            console.log('Fetched subcategories:', data);
            setSubcategories(data);
        } catch (err) {
            console.error('Error fetching subcategories:', err);
            setSubcategories([]);
        }
    };

    // Handle category change and fetch related subcategories
    const handleCategoryChange = async (e) => {
        const categoryId = e.target.value || '';
        setFormData((prev) => ({
            ...prev,
            categoryId,
            subCategoryId: '',
            subCategorySlug: '',
        }));

        if (categoryId) {
            await fetchSubcategories(categoryId);
        } else {
            setSubcategories([]);
        }
    };

    // Handle form field changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Generate slug from name
    const generateSlug = () => {
        const slug = formData.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        setFormData((prev) => ({
            ...prev,
            slug,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setFormSubmitting(true);
            await axios.put(`/api/petrochemProduct/${id}`, formData);
            setFormSubmitting(false);
            navigate('/products-table');
        } catch (err) {
            setFormSubmitting(false);
            setError('Failed to update product. Please try again.');
            console.error('Error updating product:', err);
        }
    };

    if (loading || categoriesLoading) {
        return <div className="text-center p-8">Loading product data...</div>;
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
                {error}
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Update Petrochemical Product</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <CategoryBrandForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleCategoryChange={handleCategoryChange}
                    categories={categories || []}
                    subcategories={subcategories || []}
                    brands={brands}
                />
                <BasicInfoForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    generateSlug={generateSlug}
                />
                <ProductDetailsForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                />
                <DocumentsForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                />
                <ImagesForm
                    formData={formData}
                    setFormData={setFormData}
                />
                <SeoForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                />
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/products-table')}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={formSubmitting}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                    >
                        {formSubmitting ? 'Saving...' : 'Update Product'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdatePetrochemicalProduct;