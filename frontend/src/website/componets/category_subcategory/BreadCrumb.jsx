import React from 'react';
import { Link } from 'react-router-dom';
// Utility function to capitalize words and handle multi-space words
const formatText = (text) => {
  if (!text) return '';
  
  // Split by hyphens and spaces
  return text
    .split(/[-\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};
export function Breadcrumb({ chemicalName,categorySlug, categoryName, slug2, subsubCategorySlug }) {
  console.log(categoryName) 
  return (
    <nav className="  mb-6 md:mx-5 lg:mx-5 lg:pl-4 xl:ml-0 border-b-2 pb-3">
      <ol className="list-none  inline-flex">
        <li className="flex items-center">
          <Link to="/" className="text-[12px] sm:text-[15px] text-secondary">Home</Link>
          <span className="mx-2">››</span>
        </li>
        <li className="flex items-center">
          <Link to="/categories" className="text-[12px] sm:text-[15px] text-secondary">Products</Link>
          <span className="mx-2">››</span>
        </li>
  
        <li className="flex items-center ">
          <span className="text-[12px] sm:text-[15px]">
            <Link to={`/chemicals/${slug2}`} className="text-main">
            {formatText(slug2)}
            </Link>
          </span>
        
        </li>
        {subsubCategorySlug && (
          <li className="flex items-center">
              <span className="mx-2">››</span>
            <span className="text-[15px] text-secondary"> 
             {formatText(subsubCategorySlug)}

            </span>
        
          </li>
        )}
       
      </ol>
    </nav>
  );
}
