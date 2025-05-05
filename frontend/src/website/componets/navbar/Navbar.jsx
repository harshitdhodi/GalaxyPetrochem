import React, { useState, useEffect, useMemo } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { Search, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetAllCategoriesQuery } from "@/slice/blog/blogCategory";
import SearchBar from "./SearchBar";
import Footer from "../home/Footer";
import { useGetLogoQuery } from "@/slice/logo/LogoSlice";
import NavSection from "./NavSection";
import GoogleTranslate from "@/GoogleTranslate";

export default function NavbarComp({ categories }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [openCategories, setOpenCategories] = useState({});

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

  // Log categories for debugging
  console.log("Categories:", categories);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent =
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      setIsSticky(scrollPercent >= 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { data: logoData } = useGetLogoQuery();

  // Preload the logo image
  useEffect(() => {
    if (logoData?.headerLogo) {
      const preloadLink = document.createElement("link");
      preloadLink.rel = "preload";
      preloadLink.href = `/api/logo/download/${logoData.headerLogo}`;
      preloadLink.as = "image";
      preloadLink.type = "image/svg+xml";
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

  // Prevent body scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const logoSrc = useMemo(() => {
    return logoData?.headerLogo ? `/api/logo/download/${logoData.headerLogo}` : "";
  }, [logoData?.headerLogo]);

  const LogoComponent = React.memo(({ src, alt, title }) => (
    <img
      src={src}
      alt={alt}
      title={title}
      width="150"
      height="50"
      loading="eager"
      className="h-auto w-[150px] md:w-[130px] lg:w-[200px]"
      fetchpriority="high"
    />
  ));

  const toggleCategory = (categoryId) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  return (
    <>
      <header className={`w-full relative z-[70] ${isSticky ? "sticky top-0 bg-white shadow-md" : ""}`}>
        <div className="max-w-[80rem] mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <LogoComponent src={logoSrc} alt="Company Logo" title={logoData?.headerLogoName} />
          </Link>
          <div className="hidden md:flex items-center gap-4 w-1/2 justify-end">
            <SearchBar />
            <div className="translate-container w-auto max-w-[120px]">
              <GoogleTranslate />
            </div>
          </div>
          <div className="flex items-center md:hidden">
            <SearchBar />
            <Button
              variant="ghost"
              className="text-main hover:bg-transparent p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
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

        {/* Mobile Menu */}
        <div
          className={`md:hidden fixed top-0 left-0 w-full h-screen z-[80] transition-transform duration-300 ease-in-out ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[75]"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu Content */}
          <div className="relative w-full h-full flex flex-col px-4 pb-4 space-y-2 overflow-y-auto bg-gradient-to-b from-[#61b0ab] to-[#9e5d94] z-[80]">
            <div className="flex items-center justify-between pb-4 bg-white -mx-4 px-4 pt-2">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                <img
                  src={logoSrc}
                  alt="Company Logo"
                  width="150"
                  height="50"
                  className="h-auto w-[150px]"
                  fetchpriority="high"
                />
              </Link>
              <Button
                variant="ghost"
                className="text-main_light hover:bg-transparent p-1 border"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            <Link
              to="/"
              className={`block pt-5 text-white ${isHomeActive ? "text-primary" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about-us"
              className="block  text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              About Us
            </Link>

            {/* Products Dropdown */}
            <div className="">
              <button
                className="block w-full text-left py-2 text-white  flex items-center justify-between"
                onClick={() => toggleCategory("products")}
                aria-expanded={openCategories["products"]}
              >
                <span>Products</span>
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${openCategories["products"] ? "rotate-180" : ""
                    }`}
                />
              </button>
              <div
                className="ml-4 space-y-2 w-full "
                style={{ display: openCategories["products"] ? "block" : "none" }}
              >
                {categories?.map((category) => (
                  <div key={category._id} className="w-full">
                    <button
                      className="block w-full text-left py-1 text-white font-medium flex items-center justify-between"
                      onClick={() => toggleCategory(category._id)}
                      aria-expanded={openCategories[category._id]}
                    >
                      <span>{category.category}</span>
                      {category.subCategories?.length > 0 && (
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${openCategories[category._id] ? "rotate-180" : ""
                            }`}
                        />
                      )}
                    </button>
                    <div
                      className="ml-4 space-y-1"
                      style={{ display: openCategories[category._id] ? "block" : "none" }}
                    >
                      <Link
                        to={`/categories/${category.slug}`}
                        className="block py-1 text-white text-sm"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {/* All {category.category} */}
                      </Link>
                      {category.subCategories?.map((sub) => (
                        <Link
                          key={sub._id}
                          to={`/categories/${category.slug}/${sub.slug}`}
                          className="block py-1 text-white text-sm"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          - {sub.category}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link
              to="/contact-us"
              className={`block  text-white ${isContactActive ? "text-primary" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact Us
            </Link>
            <div className="w-full flex justify-center items-center">
             
            </div>
            <Button
              variant="ghost"
              className="w-full text-white bg-primary rounded-none  hover:text-primary text-sm"
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
      <Footer />
    </>
  );
}