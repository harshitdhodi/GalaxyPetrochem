import { useEffect, useState } from "react";

const CategoryInformation = ({ product, categories = [], handleChange }) => {
  console.log("Product in CategoryInformation:", product);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [isCategorySlugEdited, setIsCategorySlugEdited] = useState(false);
  const [isSubCategorySlugEdited, setIsSubCategorySlugEdited] = useState(false);

  const slugify = (text) =>
    text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-");

  // Update filtered subcategories and category slug when category changes
  useEffect(() => {
    const selectedCategory = categories.find((cat) => cat._id === product.categoryId);
    const newSubCategories = selectedCategory?.subCategories || [];
    setFilteredSubCategories(newSubCategories);

    if (!isCategorySlugEdited && selectedCategory?.category) {
      const newSlug = slugify(selectedCategory.category);
      if (newSlug !== product.categorySlug) {
        handleChange({
          target: {
            name: "categorySlug",
            value: newSlug,
          },
        });
      }
    }
  }, [product.categoryId, categories, isCategorySlugEdited, product.categorySlug, handleChange]);

  // Auto-generate subCategorySlug when subCategoryId changes
  useEffect(() => {
    const selectedCategory = categories.find((cat) => cat._id === product.categoryId);
    const sub = selectedCategory?.subCategories?.find(
      (subCat) => subCat._id === product.subCategoryId
    );
    if (!isSubCategorySlugEdited && sub?.category) {
      const newSlug = slugify(sub.category);
      if (newSlug !== product.subCategorySlug) {
        handleChange({
          target: {
            name: "subCategorySlug",
            value: newSlug,
          },
        });
      }
    }
  }, [
    product.subCategoryId,
    product.categoryId,
    categories,
    isSubCategorySlugEdited,
    product.subCategorySlug,
    handleChange,
  ]);

  // Recalculate subcategories when categories are loaded after product is set
  useEffect(() => {
    if (product.categoryId && categories.length > 0) {
      const selectedCategory = categories.find((cat) => cat._id === product.categoryId);
      const newSubCategories = selectedCategory?.subCategories || [];
      setFilteredSubCategories(newSubCategories);
    }
  }, [categories, product.categoryId]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Category Information</h3>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
        <select
          name="categoryId"
          value={product.categoryId || ""}
          onChange={(e) => {
            setIsCategorySlugEdited(false);
            handleChange(e);
          }}
          required
          className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        </select>
      </div>

      {/* Category Slug */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category Slug</label>
        <input
          type="text"
          name="categorySlug"
          value={product.categorySlug || ""}
          onChange={(e) => {
            setIsCategorySlugEdited(true);
            handleChange(e);
          }}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Sub Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category</label>
        <select
          name="subCategoryId"
          value={product.subCategoryId || ""}
          onChange={(e) => {
            setIsSubCategorySlugEdited(false);
            handleChange(e);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Sub Category</option>
          {filteredSubCategories.length > 0 ? (
            filteredSubCategories.map((subCategory) => (
              <option key={subCategory._id} value={subCategory._id}>
                {subCategory.category}
              </option>
            ))
          ) : (
            <option value="" disabled>
              No subcategories available
            </option>
          )}
        </select>
      </div>

      {/* Sub Category Slug */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category Slug</label>
        <input
          type="text"
          name="subCategorySlug"
          value={product.subCategorySlug || ""}
          onChange={(e) => {
            setIsSubCategorySlugEdited(true);
            handleChange(e);
          }}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default CategoryInformation;
