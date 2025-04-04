import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { X } from "lucide-react";

// Mobile menu component
const MobileMenu = ({ 
  isOpen, 
  onClose, 
  categories, 
  logoSrc, 
  logoName, 
  activeStates 
}) => {
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const navigate = useNavigate();
  
  // Close dropdown when menu closes
  useEffect(() => {
    if (!isOpen) setCategoryDropdownOpen(false);
  }, [isOpen]);

  return (
    <div
      className={`
        md:hidden fixed top-0 left-0 right-0 w-full z-[80]
        transition-all duration-300 ease-in-out
        ${isOpen ? "opacity-100 h-screen" : "opacity-0 h-0 pointer-events-none overflow-hidden"}
      `}
      role="dialog"
      aria-modal={isOpen}
      aria-label="Mobile navigation menu"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-[75]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Content */}
      <div className="relative h-screen w-full px-4 pb-2 space-y-2 overflow-y-auto bg-gradient-to-b from-[#61b0ab] to-[#9e5d94]">
        <div className="flex items-center justify-between pb-4 bg-white -mx-4 px-4 pt-2">
          <Link to="/" onClick={onClose}>
            <img
              src={logoSrc}
              alt="Company Logo"
              width="150"
              height="50"
              className="h-auto w-[150px]"
              fetchPriority="high"
            />
          </Link>
          <button
            aria-label="Close menu"
            className="text-main_light hover:text-secondary hover:bg-transparent p-1 border"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <Link
          to="/"
          className={`block py-2 text-white hover:text-secondary ${activeStates.isHomeActive ? "text-primary" : ""}`}
          onClick={onClose}
        >
          Home
        </Link>
        <Link
          to="/corporate"
          className="block py-2 text-white hover:text-secondary"
          onClick={onClose}
        >
          Corporate
        </Link>

        {/* Products Dropdown */}
        <div>
          <button
            className="block w-full text-left py-2 text-white hover:text-secondary"
            onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
            aria-expanded={categoryDropdownOpen}
            aria-controls="mobile-category-dropdown"
          >
            Products
          </button>
          {categoryDropdownOpen && (
            <div 
              id="mobile-category-dropdown"
              className="pl-4 space-y-2 bg-white rounded-md shadow-md"
            >
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/${category.slug}`}
                  className="block py-1 text-main text-md hover:text-secondary"
                  onClick={onClose}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link
          to="/worldwide"
          className="block py-2 text-white hover:text-secondary"
          onClick={onClose}
        >
          Worldwide
        </Link>
        <Link
          to="/careers"
          className="block py-2 text-white hover:text-secondary"
          onClick={onClose}
        >
          Careers
        </Link>
        <Link
          to="/events"
          className="block py-2 text-white hover:text-secondary"
          onClick={onClose}
        >
          Events
        </Link>
        <Link
          to="/contact-us"
          className={`block py-2 text-white hover:text-secondary ${activeStates.isContactActive ? "text-primary" : ""}`}
          onClick={onClose}
        >
          Contact Us
        </Link>
        <button
          className="w-full text-white bg-primary rounded-none py-4 hover:text-primary text-sm"
          onClick={() => {
            navigate("/advance-search");
            onClose();
          }}
        >
          Advanced Search
        </button>
      </div>
    </div>
  );
};

export default MobileMenu;