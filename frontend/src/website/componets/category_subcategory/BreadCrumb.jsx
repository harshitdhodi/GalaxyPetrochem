import React from 'react';
import { Link } from 'react-router-dom';

// Utility function to capitalize words and handle multi-space words
const formatText = (text) => {
  if (!text) return '';
  return text
    .split(/[-\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export function Breadcrumb({ chemicalName, subCategorySlug, categorySlug, categoryName, slug2, subcategoryName }) {
  return (
    <nav className="mb-6 mt-2 pb-3 z-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            {/* First row: Home / Products */}
            <div className="flex items-center text-sm text-white whitespace-nowrap">
              <Link to="/" className="rounded-md">Home</Link>
              <span className="mx-2">/</span>
              <Link to="/products" className="rounded-md">Products</Link>
            </div>

            {/* Second row: path-style /category/subcategory */}
            <div className="flex items-center text-sm text-white mt-1 sm:mt-0 sm:ml-4 whitespace-nowrap">
              <span className="mr-2">/</span>
              <Link to={`/${categorySlug}`} className="rounded-md">{formatText(categorySlug)}</Link>
              {subcategoryName && (
                <>
                  <span className="mx-2">/</span>
                  <Link to={`/${categorySlug}/${subCategorySlug || subcategoryName}`} className="rounded-md">{formatText(subcategoryName)}</Link>
                </>
              )}
            </div>
          </div>
      </div>
    </nav>
  );
}
