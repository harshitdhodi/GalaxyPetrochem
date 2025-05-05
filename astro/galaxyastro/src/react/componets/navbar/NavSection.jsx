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
        <nav className="text-white  bg-gradient-to-l from-[#2860da] to-[#9e5d94]">
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
                            AboutUs
                        </NavLink>
                   
                    </div>

                    {/* Products Dropdown */}
                    <NavLink
                        href="/products"
                        hasDropdown={true}
                        categories={categories}
                        state={{ categoryName: "Products" }}
                        className={() => `font-bold ${isProductsActive ? "text-primary" : ""}`}
                    >
                        Products
                    </NavLink>

                    {/* Static Links */}
                 
                    <NavLink 
                        href="/brands"
                        className={({ isActive }) => isActive ? "text-primary" : ""}
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
                            className={() => `block py-2 px-4 hover:text-secondary transition-colors ${isBlogActive ? "text-primary" : ""}`}
                        >
                            Blogs
                        </NavLink>
                        <div
                            className={`
                                absolute left-0 w-64 bg-main text-white shadow-lg z-50 font-normal
                                transition-all duration-200 ease-in-out
                                ${blogDropdownOpen 
                                    ? 'opacity-100 translate-y-0' 
                                    : 'opacity-0 -translate-y-2 pointer-events-none'}
                            `}
                        >
                            {parsedBlogCategories.length > 0 ? (
                                parsedBlogCategories.map((category) => (
                                    <Link
                                        key={category.id}
                                        to={`/blog/${category.slug}`}
                                        className="block px-4 py-2 hover:main_light transition-colors"
                                    >
                                        {category.name}
                                    </Link>
                                ))
                            ) : (
                                <p className="px-4 py-2">No blog categories available</p>
                            )}
                        </div>
                    </div>

                    {/* Contact Us Link */}
                    <NavLink 
                        href="/contact-us"
                        className={() => isContactActive ? "text-primary" : ""}
                    >
                        Contact Us
                    </NavLink>

                    {/* Advanced Search Button */}
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