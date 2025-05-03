import { useState } from "react";
import { Link } from "react-router-dom";
import { NavLink } from "./NavLink";

const NavSection = ({
  categories,
  parsedBlogCategories,
  isHomeActive,
  isProductsActive,
  isBlogActive,
  isContactActive,
  mobileMenuOpen,
  setMobileMenuOpen
}) => {
  const [corporateDropdownOpen, setCorporateDropdownOpen] = useState(false);
  const [blogDropdownOpen, setBlogDropdownOpen] = useState(false);

  return (
    <nav className="text-white bg-gradient-to-l from-[#2860da] to-[#9e5d94]">
      <div className="max-w-[75rem] mx-auto px-4 flex items-center justify-evenly">
        <div className="space-x-2 lg:space-x-3 hidden md:flex text-sm items-center lg:text-[16px] font-bold">
          
          {/* Corporate Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setCorporateDropdownOpen(true)}
            onMouseLeave={() => setCorporateDropdownOpen(false)}
          >
            <NavLink
              href="/about-us"
              className={() => isHomeActive ? "text-primary" : ""}
              end
            >
              About Us
            </NavLink>

            {corporateDropdownOpen && (
              <div
                className="absolute left-0 mt-2 bg-white shadow-lg rounded-md z-50"
                style={{ width: "300px" }}
              >
                <ul className="py-2">
                  <li className="px-4 py-2 hover:bg-gray-100">
                    <Link to="/subcategory-1" className="text-black">Subcategory 1</Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100">
                    <Link to="/subcategory-2" className="text-black">Subcategory 2</Link>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Products */}
          <NavLink
            href="/products"
            hasDropdown={true}
            categories={categories}
            state={{ categoryName: "Products" }}
            className={() => `font-bold ${isProductsActive ? "text-primary" : ""}`}
          >
            Products
          </NavLink>

          {/* Brands */}
          <NavLink
            href="/brands"
            className={({ isActive }) => (isActive ? "text-primary" : "")}
          >
            Brands
          </NavLink>

          {/* Blog Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setBlogDropdownOpen(true)}
            onMouseLeave={() => setBlogDropdownOpen(false)}
          >
            <NavLink
              href="/blogs"
              className={() => `block py-2 px-4 transition-colors ${isBlogActive ? "text-primary" : ""}`}
            >
              Blogs
            </NavLink>

            {blogDropdownOpen && parsedBlogCategories?.length > 0 && (
              <div className="absolute left-0 mt-2 bg-white shadow-lg rounded-md z-50 w-[300px]">
                <ul className="py-2">
                  {parsedBlogCategories.map((category) => (
                    <li key={category.slug} className="px-4 py-2 hover:bg-gray-100">
                      <Link to={`/blogs/${category.slug}`} className="text-black">
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Contact */}
          <NavLink
            href="/contact-us"
            className={() => (isContactActive ? "text-primary" : "")}
          >
            Contact Us
          </NavLink>

          {/* Advanced Search */}
          {!mobileMenuOpen && (
            <div className="hidden md:flex justify-center items-center">
              <Link
                to="/advance-search"
                className="text-white bg-primary rounded-none px-4 lg:px-7 py-6 lg:py-5 hover:text-white text-sm lg:text-[16px] font-bold"
              >
                Advanced Search
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavSection;
