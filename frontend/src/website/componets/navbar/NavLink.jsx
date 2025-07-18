import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

export function NavLink({
  href,
  children,
  hasDropdown = false,
  categories = [],
  className = ""
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [showDomain, setShowDomain] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const linkRef = useRef(null);
  let hoverTimer;

  useEffect(() => {
    return () => {
      if (hoverTimer) clearTimeout(hoverTimer);
    };
  }, []);

  const handleMouseEnter = (e) => {
    setIsHovered(true);
    if (linkRef.current) {
      const rect = linkRef.current.getBoundingClientRect();
      setPosition({ x: rect.left, y: rect.bottom });
    }
    hoverTimer = setTimeout(() => setShowDomain(true), 500);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowDomain(false);
    if (hoverTimer) clearTimeout(hoverTimer);
  };

  const getDomainFromUrl = (url) => {
    if (!url) return '';
    const domain = url.replace(/^https?:\/\//, '').split('/')[0];
    return domain.startsWith('www.') ? domain.substring(4) : domain;
  };

  const domain = getDomainFromUrl(window.location.origin + (href || ''));

  if (!hasDropdown) {
    return (
      <div className="relative">
        <Link
          to={href}
          ref={linkRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={`inline-block py-2 px-4 hover:text-secondary transition-colors ${className}`}
        >
          {children}
        </Link>
  
      </div>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={linkRef}
    >
      <Link
        to={href}
        className={`inline-block py-2 px-4 hover:text-secondary transition-colors ${className}`}
      >
        {children}
      </Link>

      {isHovered && categories?.length > 0 && (
        <div className="absolute left-0 w-64 bg-[#2b5fd9] text-white shadow-lg z-50 transition-all duration-200 ease-in-out">
          {categories.map((category) => (
            <div
              key={category._id}
              className="relative group"
              onMouseEnter={() => setActiveCategory(category)}
              onMouseLeave={() => setActiveCategory(null)}
            >
              <Link
                to={`/${category.slug}`}
                state={{
                  chemicalName: category.name,
                  categoryName: category.category,
                  slug2: category.slug
                }}
                className="block px-4 py-2 hover:bg-blue-600 transition-colors font-normal relative group"
              >
                {category.category}
              
              </Link>

              {activeCategory === category && category.subCategories?.length > 0 && (
                <div className="absolute left-full top-0 w-[50vh] bg-blue-600 text-white shadow-lg p-2">
                  <div className="grid grid-cols-2 gap-2">
                    {category.subCategories.map((subcategory) => (
                      <Link
                        key={subcategory._id}
                        to={`/${category.slug}/${subcategory.slug}`}
                        state={{
                          chemicalName: subcategory.category,
                          categoryName: category.name,
                          slug2: category.slug
                        }}
                        className="block px-2 py-1 hover:bg-blue-700 transition-colors text-sm text-center font-normal"
                      >
                        {subcategory.category}
                      </Link>
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