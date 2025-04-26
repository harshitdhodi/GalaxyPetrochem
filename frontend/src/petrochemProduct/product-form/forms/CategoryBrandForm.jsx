import React, { useEffect, useState } from 'react';

const CategoryBrandForm = ({
  formData,
  handleInputChange,
  handleCategoryChange,
  categories = [],
  brands = [],
}) => {
  const [localSubcategories, setLocalSubcategories] = useState([]);

  console.log('CategoryBrandForm:', { formData, brands, categories, localSubcategories });

  // Slugify function to generate slugs
  const slugify = (text) =>
    text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');

  // Update subcategories and slugs when formData or categories change
  useEffect(() => {
    // Extract categoryId (handle object or string)
    const categoryId = formData.categoryId?._id || (typeof formData.categoryId === 'string' ? formData.categoryId : '');

    // Update subcategories based on selected category
    if (categoryId && categories.length > 0) {
      const selectedCategory = categories.find((cat) => cat._id === categoryId);
      const newSubcategories = selectedCategory?.subCategories || [];
      setLocalSubcategories(newSubcategories);

      // Auto-generate categorySlug
      if (selectedCategory?.category) {
        const newSlug = slugify(selectedCategory.category);
        if (formData.categorySlug !== newSlug) {
          handleInputChange({
            target: { name: 'categorySlug', value: newSlug },
          });
        }
      }
    } else {
      setLocalSubcategories([]);
    }

    // Auto-generate subCategorySlug or infer subCategoryId
    const subCategoryId = formData.subCategoryId?._id || (typeof formData.subCategoryId === 'string' ? formData.subCategoryId : '');
    if (subCategoryId && localSubcategories.length > 0) {
      const selectedSubcat = localSubcategories.find((subcat) => subcat._id === subCategoryId);
      if (selectedSubcat && (selectedSubcat.category || selectedSubcat.name)) {
        const subCategorySlug = slugify(selectedSubcat.category || selectedSubcat.name);
        if (formData.subCategorySlug !== subCategorySlug) {
          handleInputChange({
            target: { name: 'subCategorySlug', value: subCategorySlug },
          });
        }
      }
    } else if (!subCategoryId && formData.subCategorySlug && localSubcategories.length > 0) {
      // Infer subCategoryId from subCategorySlug
      const matchingSubcat = localSubcategories.find(
        (subcat) => slugify(subcat.category || subcat.name) === formData.subCategorySlug
      );
      if (matchingSubcat) {
        handleInputChange({
          target: { name: 'subCategoryId', value: matchingSubcat._id },
        });
      }
    }
  }, [
    formData.categoryId,
    formData.subCategoryId,
    formData.subCategorySlug,
    categories,
    formData.categorySlug,
    handleInputChange,
  ]);

  // Handle subcategory change
  const handleSubcategoryChange = (e) => {
    const subCategoryId = e.target.value;
    const selectedSubcat = localSubcategories.find((subcat) => subcat._id === subCategoryId);
    const subCategorySlug = selectedSubcat ? slugify(selectedSubcat.category || selectedSubcat.name) : '';

    handleInputChange({ target: { name: 'subCategoryId', value: subCategoryId } });
    handleInputChange({ target: { name: 'subCategorySlug', value: subCategorySlug } });
  };

  // Handle brand change
  const handleBrandChange = (e) => {
    const brandId = e.target.value;
    handleInputChange({ target: { name: 'brandId', value: brandId } });
  };

  // Handle category change (override to ensure _id is passed)
  const handleCategoryChangeOverride = (e) => {
    const categoryId = e.target.value;
    handleCategoryChange({ target: { name: 'categoryId', value: categoryId } });
    // Reset subcategory when category changes
    handleInputChange({ target: { name: 'subCategoryId', value: '' } });
    handleInputChange({ target: { name: 'subCategorySlug', value: '' } });
  };

  // Extract IDs for dropdown values
  const brandId = formData.brandId?._id || (typeof formData.brandId === 'string' ? formData.brandId : '');
  const categoryId = formData.categoryId?._id || (typeof formData.categoryId === 'string' ? formData.categoryId : '');
  const subCategoryId = formData.subCategoryId?._id || (typeof formData.subCategoryId === 'string' ? formData.subCategoryId : '');

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Category & Brand Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
          <select
            name="brandId"
            value={brandId}
            onChange={handleBrandChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Brand</option>
            {brands.length > 0 ? (
              brands.map((brand) => (
                <option key={brand._id} value={brand._id}>
                  {brand.name}
                </option>
              ))
            ) : (
              <option value="" disabled>
                No brands available
              </option>
            )}
            {brandId && !brands.find((b) => b._id === brandId) && (
              <option value={brandId} disabled>
                {formData.brandId?.name || 'Brand not found'}
              </option>
            )}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            name="categoryId"
            value={categoryId}
            onChange={handleCategoryChangeOverride}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Category</option>
            {categories.length > 0 ? (
              categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.category}
                </option>
              ))
            ) : (
              <option value="" disabled>
                No categories available
              </option>
            )}
            {categoryId && !categories.find((c) => c._id === categoryId) && (
              <option value={categoryId} disabled>
                {formData.categoryId?.category || 'Category not found'}
              </option>
            )}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
          <select
            name="subCategoryId"
            value={subCategoryId || ''}
            onChange={handleSubcategoryChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            disabled={!categoryId || localSubcategories.length === 0}
          >
            <option value="">Select Subcategory</option>
            {localSubcategories.length > 0 ? (
              localSubcategories.map((subcategory) => (
                <option key={subcategory._id} value={subcategory._id}>
                  {subcategory.category || subcategory.name}
                </option>
              ))
            ) : (
              <option value="" disabled>
                No subcategories available
              </option>
            )}
            {subCategoryId && !localSubcategories.find((s) => s._id === subCategoryId) && (
              <option value={subCategoryId} disabled>
                Subcategory not found
              </option>
            )}
            {!subCategoryId && formData.subCategorySlug && (
              <option value="" disabled>
                {formData.subCategorySlug} (ID not set)
              </option>
            )}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category Slug</label>
          <input
            type="text"
            name="categorySlug"
            value={formData.categorySlug || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory Slug</label>
          <input
            type="text"
            name="subCategorySlug"
            value={formData.subCategorySlug || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryBrandForm;