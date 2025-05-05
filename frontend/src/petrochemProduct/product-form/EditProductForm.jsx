
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

        // Debug: Log raw API response
        console.log('API response:', JSON.stringify(productData, null, 2));

        // Process images
        const images = Array.isArray(productData.images)
          ? productData.images.map((img) => ({
              file: null,
              url: img.url || `/Uploads/images/${img.name}`,
              name: img.name || '',
              altText: img.altText || '',
              title: img.title || '',
            }))
          : [];

        // Extract IDs
        const categoryId = productData.categoryId?._id || productData.categoryId || '';
        const subCategoryId = productData.subCategoryId?._id || productData.subCategoryId || '';
        const brandId = productData.brandId?._id || productData.brandId || '';

        setFormData({
          categoryId,
          subCategoryId,
          brandId,
          categorySlug: productData.categorySlug || '',
          subCategorySlug: productData.subCategorySlug || '',
          slug: productData.slug || '',
          name: productData.name || '',
          tagline: productData.tagline || '',
          specification: productData.specifiction || '',
          details: productData.details || '',
          tableInfo: productData.tableInfo || '',
          images,
          pdf: productData.pdf || '',
          msds: productData.msds || '',
          metaTitle: productData.metaTitle || '',
          metaDescription: productData.metaDescription || '',
          metaKeyword: productData.metaKeyword || '',
          metaSchema: productData.metaSchema || '',
        });

        // Debug: Log formData.images
        console.log('formData.images after fetch:', JSON.stringify(images, null, 2));

        // Fetch subcategories
        if (categoryId) {
          await fetchSubcategories(categoryId);
        } else {
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
      setSubcategories([]);
      return;
    }
    try {
      const response = await axios.get(`/api/subcategories?categoryId=${categoryId}`);
      const data = Array.isArray(response.data) ? response.data : [];
      setSubcategories(data);
    } catch (err) {
      console.error('Error fetching subcategories:', err);
      setSubcategories([]);
    }
  };

  // Handle category change
  const handleCategoryChange = async (e) => {
    const categoryId = e.target.value || '';
    const selectedCategory = categories?.find((cat) => cat._id === categoryId);
    setFormData((prev) => ({
      ...prev,
      categoryId,
      categorySlug: selectedCategory ? selectedCategory.slug : '',
      subCategoryId: '',
      subCategorySlug: '',
    }));

    if (categoryId) {
      await fetchSubcategories(categoryId);
    } else {
      setSubcategories([]);
    }
  };

  // Handle subcategory change
  const handleSubcategoryChange = (e) => {
    const subCategoryId = e.target.value || '';
    const selectedSubcategory = subcategories.find((sub) => sub._id === subCategoryId);
    setFormData((prev) => ({
      ...prev,
      subCategoryId,
      subCategorySlug: selectedSubcategory ? selectedSubcategory.slug : '',
    }));
  };

  // Handle brand change
  const handleBrandChange = (e) => {
    const brandId = e.target.value || '';
    setFormData((prev) => ({
      ...prev,
      brandId,
    }));
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

      // Debug: Log formData.images
      console.log('formData.images before submission:', JSON.stringify(formData.images, null, 2));

      // Create FormData object
      const formDataToSend = new FormData();

      // Append non-image fields
      Object.keys(formData).forEach((key) => {
        if (key !== 'images') {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append image files and metadata
      const imageMetadata = formData.images.map((image) => ({
        name: image.name || '',
        url: image.url && !image.url.startsWith('blob:') ? image.url : '',
        altText: image.altText || '',
        title: image.title || '',
      }));

      formData.images.forEach((image) => {
        if (image.file) {
          formDataToSend.append('images', image.file, image.name);
        }
      });

      // Append image metadata as JSON
      formDataToSend.append('imageMetadata', JSON.stringify(imageMetadata));

      // Debug: Log FormData contents
      for (let pair of formDataToSend.entries()) {
        console.log(`FormData: ${pair[0]} =`, pair[1]);
      }

      // Send request
      await axios.put(`/api/petrochemProduct/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

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
          handleSubcategoryChange={handleSubcategoryChange}
          handleBrandChange={handleBrandChange}
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
