import React, { useState, useEffect, useMemo } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { Search, UserCircle, LogIn, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetAllCategoriesQuery } from "@/slice/blog/blogCategory";
import SearchBar from "./SearchBar";
import Footer from "../home/Footer";
import { useGetLogoQuery } from "@/slice/logo/LogoSlice";
import NavSection from "./NavSection";

export default function NavbarComp({ categories }) {
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [mobileMenuState, setMobileMenuState] = useState({
    open: false,
    categoryDropdown: null,
  });

  const { data: blogCategories = [], isLoading } = useGetAllCategoriesQuery();

  const parsedBlogCategories = blogCategories.map((blog) => ({
    id: blog._id,
    name: blog.category,
    slug: blog.slug,
  }));

  const { pathname } = useLocation();
  const isHomeActive = pathname === "/" || pathname === "/home";
  const isProductsActive = pathname.startsWith("/categories");
  const isBlogActive = pathname.startsWith("/blogs");
  const isContactActive = pathname.startsWith("/contact-us");

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent =
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      setIsSticky(scrollPercent >= 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { data: logoData } = useGetLogoQuery();

  // Preload the logo image with proper attributes
  useEffect(() => {
    if (logoData?.headerLogo) {
      const preloadLink = document.createElement("link");
      preloadLink.rel = "preload";
      preloadLink.href = `/api/logo/download/${logoData.headerLogo}`;
      preloadLink.as = "image";
      preloadLink.type = "image/svg+xml"; // Specify SVG type for better browser handling
      document.head.appendChild(preloadLink);
    }
  }, [logoData?.headerLogo]);

  // Update favicon dynamically
  useEffect(() => {
    if (logoData?.favIcon) {
      const faviconUrl = `/api/logo/download/${logoData.favIcon}`;
      const favicon = document.querySelector('link[rel="icon"]');
      if (favicon) {
        favicon.href = faviconUrl;
      } else {
        const newFavicon = document.createElement("link");
        newFavicon.rel = "icon";
        newFavicon.href = faviconUrl;
        document.head.appendChild(newFavicon);
      }
    }
  }, [logoData?.favIcon]);

  // Memoize the logo source to prevent recalculations
  const logoSrc = useMemo(() => {
    return logoData?.headerLogo ? `/api/logo/download/${logoData.headerLogo}` : "";
  }, [logoData?.headerLogo]);

  // Optimized LogoComponent with inline SVG or image fallback
  const LogoComponent = React.memo(({ src, alt, title }) => {
    return (
      
      <img
        src={src}
        alt={alt}
        title={title}
        width="150" // Explicit width to prevent layout shift
        height="50" // Adjust based on actual aspect ratio of your logo
        loading="eager"
        className="h-auto w-[150px] md:w-[130px] lg:w-[200px]"
        fetchpriority="high" // Prioritize loading
      />
    );
  });

  return (
    <>
      <header className={`w-full  relative z-[70] ${isSticky ? "sticky top-0 bg-white shadow-md" : ""}`}>
        <div className="max-w-[80rem] mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <LogoComponent src={logoSrc} alt="Company Logo" title={logoData?.headerLogoName} />
          </Link>
          <div className="w-1/2 md:mt-0 hidden md:block">
            <SearchBar />
          </div>
          <div className="flex items-center md:hidden">
            <div className="w-full">
              <SearchBar />
            </div>
            <Button
              variant="ghost"
              className="text-main hover:text-secondary hover:bg-transparent p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        <NavSection
          categories={categories}
          parsedBlogCategories={parsedBlogCategories}
          isHomeActive={isHomeActive}
          isProductsActive={isProductsActive}
          isBlogActive={isBlogActive}
          isContactActive={isContactActive}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        {/* Mobile Menu with CSS Animation */}
        <div
          className={`
            md:hidden fixed top-0 left-0 right-0 w-full z-[80]
            transition-all duration-300 ease-in-out
            ${
              mobileMenuOpen
                ? "opacity-100 h-screen"
                : "opacity-0 h-0 pointer-events-none overflow-hidden"
            }
          `}
        >
          {/* Backdrop */}
          <div
            className="fixed bg-black bg-opacity-50 z-[75]"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu Content */}
          <div className="relative h-[100vh] w-full px-4 pb-2 space-y-2 overflow-y-auto bg-gradient-to-b from-[#61b0ab] to-[#9e5d94]">
            <div className="flex items-center justify-between pb-4 bg-white -mx-4 px-4 pt-2">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                <img
                  src={logoData?.headerLogo ? `/api/logo/download/${logoData.headerLogo}` : ""}
                  alt="Company Logo"
                  width="150" // Explicit width for mobile logo
                  height="50" // Adjust based on actual aspect ratio
                  className="h-auto w-[150px]"
                  fetchpriority="high"
                />
              </Link>
              <button
                variant="ghost"
                className="text-main_light hover:text-secondary hover:bg-transparent p-1 border"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <Link
              to="/"
              className={`block py-2 text-white hover:text-secondary ${isHomeActive ? "text-primary" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/corporate"
              className="block py-2 text-white hover:text-secondary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Corporate
            </Link>

            {/* Products Dropdown */}
            <div>
              <button
                className="block w-full text-left py-2 text-white hover:text-secondary"
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              >
                Products
              </button>
              {categoryDropdownOpen && (
                <div className="pl-4 space-y-2 bg-white rounded-md shadow-md">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/${category.slug}`}
                      className="block py-1 text-main text-md hover:text-secondary"
                      onClick={() => setMobileMenuOpen(false)}
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
              onClick={() => setMobileMenuOpen(false)}
            >
              Worldwide
            </Link>
            <Link
              to="/careers"
              className="block py-2 text-white hover:text-secondary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Careers
            </Link>
            <Link
              to="/events"
              className="block py-2 text-white hover:text-secondary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Events
            </Link>
            <Link
              to="/contact-us"
              className={`block py-2 text-white hover:text-secondary ${isContactActive ? "text-primary" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact Us
            </Link>
            <Button
              variant="ghost"
              className="w-full text-white bg-primary rounded-none py-4 hover:text-primary text-sm"
              onClick={() => {
                navigate("/advance-search");
                setMobileMenuOpen(false);
              }}
            >
              Advanced Search
            </Button>
          </div>
        </div>
      </header>

      <main className="w-full mb-10 mx-auto">
        <Outlet />
      </main>
      {/* <Footer /> */}
    </>
  );
}