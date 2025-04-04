import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function NavLink({
  href,
  children,
  hasDropdown = false,
  categories = [],
  className = ""
}) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  const handleCategoryClick = (category) => {
    console.log("Category clicked:", category);
    // Hide dropdown
    setIsHovered(false);
    setActiveCategory(null);
    navigate(`/${category.slug}`, {
      state: { 
        chemicalName: category.name,
        categoryName: category.category,
        slug2: category.slug
      },
    });
  };

  const handleSubCategoryClick = (category, subcategory) => {
    console.log("Subcategory clicked:", subcategory);
    console.log("Parent category:", category.slug);
    // Hide dropdown
    setIsHovered(false);
    setActiveCategory(null);
    navigate(`/${category.slug}/${subcategory.slug}`, {
      state: { 
        chemicalName: subcategory.category,
        categoryName: category.name,
        slug2: category.slug
      },
    });
  };
  
  if (!hasDropdown) {
    return (
      <div
        onClick={() => navigate(href)}
        className={`block py-2 px-4 hover:text-secondary transition-colors cursor-pointer ${className}`}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setActiveCategory(null);
      }}
    >
      <div
        onClick={() => navigate(href)}
        className={`block py-2 px-4 hover:text-secondary transition-colors cursor-pointer ${className}`}
      >
        {children}
      </div>

      {isHovered && categories?.length > 0 && (
        <div
          className={`
            absolute left-0 w-64 bg-[blue-800] text-white shadow-lg z-50
            transition-all duration-200 ease-in-out
            ${isHovered 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 -translate-y-2 pointer-events-none'}
          `}
        >
          {categories.map((category) => (
            <div
              key={category._id}
              className="relative group"
              onMouseEnter={() => setActiveCategory(category)}
              onMouseLeave={() => setActiveCategory(null)}
            >
              <div
                onClick={() => handleCategoryClick(category)}
                className="block px-4 py-2 hover:bg-blue-600 transition-colors cursor-pointer font-normal"
              >
                {category.category}
              </div>

              {activeCategory === category && category.subCategories?.length > 0 && (
                <div
                  className={`
                    absolute left-full top-0 w-[40vh] bg-blue-800 text-white shadow-lg
                    transition-all duration-200 ease-in-out
                    ${activeCategory === category 
                      ? 'opacity-100 translate-x-0' 
                      : 'opacity-0 -translate-x-2 pointer-events-none'}
                  `}
                >
                  <div className="grid grid-cols-2 gap-2 p-2">
                    {category.subCategories.map((subcategory) => (
                      <div
                        key={subcategory._id}
                        onClick={() => handleSubCategoryClick(category, subcategory)}
                        className="block px-2 py-1 hover:bg-blue-600 transition-colors text-sm text-center cursor-pointer font-normal"
                      >
                        {subcategory.category}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}