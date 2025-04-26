import React from 'react';
import { Link } from 'react-router-dom';

// Utility function to capitalize words and handle multi-space words
const formatText = (text) => {
  if (!text) return '';
  return text
    .split(/[-\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export function Breadcrumb({ chemicalName,subCategorySlug, categorySlug, categoryName, slug2, subcategoryName }) {
  console.log(subCategorySlug)
  return (
    <nav className="mb-6 md:mx-5  lg:mx-5  xl:ml-0 pb-3">
      <ol className="list-none inline-flex">
        <li className="flex items-center">
          <Link to="/" className="text-[12px] bg-gray-600 px-2 rounded-md sm:text-[15px] text-white">Home</Link>
          <span className="mx-2 text-white">&gt;</span>
        </li>
        <li className="flex items-center">
          <Link to="/categories" className="text-[12px] sm:text-[15px] text-white px-2 bg-gray-600 rounded-md">Products</Link>
          <span className="mx-2 text-white">&gt;</span>
        </li>
        <li className="flex items-center">
          <span className="text-[12px] sm:text-[15px]">
            <Link to={`/${categorySlug}`} className="text-white bg-gray-600 px-2 rounded-md">
              {formatText(categorySlug)}
            </Link>
          </span>
        </li>
        {subcategoryName && (
          <li className="flex items-center">
            <span className="mx-2 text-white">&gt;</span>
            <span className="text-[15px] text-white bg-gray-600 px-2 rounded-md">
              {formatText(subcategoryName)}
            </span>
          </li>
        )}
      </ol>
    </nav>
  );
}
