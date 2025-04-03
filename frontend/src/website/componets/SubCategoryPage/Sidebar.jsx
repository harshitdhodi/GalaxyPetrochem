import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Plus, Minus } from 'lucide-react';

export default function Sidebar({ slug, data }) {
  const [openCategories, setOpenCategories] = useState({});
  const navigate = useNavigate();
  
  useEffect(() => {
    if (data) {
      const initialState = data.subCategories.reduce((acc, category) => {
        return { ...acc, [category.category]: false };
      }, {});
      setOpenCategories(initialState);
    }
  }, [data]);

  const toggleCategory = (e, categoryTitle) => {
    e.stopPropagation(); // Prevent event from bubbling up
    setOpenCategories((prev) => ({
      ...prev,
      [categoryTitle]: !prev[categoryTitle],
    }));
  };

  const handleCategoryClick = (categorySlug) => {
    navigate(`/${slug}/${categorySlug}`);
  };

  const handleSubCategoryClick = (categorySlug, subCategorySlug) => {
    navigate(`/${slug}/${categorySlug}/${subCategorySlug}`);
  };

  return (
    <div className="w-full border-2 bg-gray-50 p-4">
      <div className="flex items-center mb-6 gap-6">
        <img
          src="https://img.freepik.com/free-vector/abstract-chemical-logo_23-2148610094.jpg?w=200"
          alt="CDH Logo"
          className="h-8"
        />
        <h2 className="text-blue-800 font-bold text-lg md:text-xl lg:text-2xl">
         {data.name}
        </h2>
      </div>

      <nav>
        {data?.subCategories?.map((category) => (
          <div key={category._id} className="mb-3">
            <div className="bg-blue-100 p-1 text-lg px-3 flex items-center justify-between">
              <button
                onClick={() => handleCategoryClick(category.slug)}
                className="text-blue-900 text-sm md:text-lg hover:text-blue-700 text-left"
              >
                {category.category}
              </button>
              {category.subSubCategory?.length > 0 && (
                <button
                  onClick={(e) => toggleCategory(e, category.category)}
                  className="text-blue-800 p-1 hover:bg-blue-200 rounded-full transition-colors"
                >
                  {openCategories[category.category] ? (
                    <Minus size={20} />
                  ) : (
                    <Plus size={20} />
                  )}
                </button>
              )}
            </div>
            {openCategories[category.category] && (
              <ul className="pl-4 py-2 border grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2">
                {category.subSubCategory?.map((sub) => (
                  <li key={sub._id} className="py-1 flex items-center gap-2">
                    <ArrowRight size={16} className="text-gray-600" />
                    <button
                      onClick={() => handleSubCategoryClick(category.slug, sub.slug)}
                      className="text-gray-600 text-[16px] hover:text-blue-600 text-left"
                    >
                      {sub.category}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
