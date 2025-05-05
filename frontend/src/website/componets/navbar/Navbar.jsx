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
  className={`md:hidden fixed top-0 left-0 w-full h-screen z-[80] transition-transform duration-300 ease-in-out ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
>
  {/* Backdrop */}
  <div
    className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[75]"
    onClick={() => setMobileMenuOpen(false)}
  />

  {/* Menu Content */}
  <div className="relative w-full h-full flex flex-col px-5 pb-6 space-y-4 overflow-y-auto bg-gradient-to-b from-[#3c8d89] to-[#a75d9e] bg-opacity-70 z-[80] text-white font-medium">
    
    {/* Header */}
    <div className="flex items-center justify-between py-4 border-b border-white/20">
      <Link to="/" onClick={() => setMobileMenuOpen(false)}>
        <img
          src={logoSrc}
          alt="Company Logo"
          width="140"
          className="h-auto"
        />
      </Link>
      <Button
        variant="ghost"
        className="p-2 rounded-full bg-white/10 hover:bg-white/20"
        onClick={() => setMobileMenuOpen(false)}
      >
        <X className="h-6 w-6 text-white" />
      </Button>
    </div>

    {/* Main Links */}
    {[
      { to: "/", label: "Home", active: isHomeActive },
      { to: "/about-us", label: "About Us" },
      { to: "/brands", label: "Brands" },
      { to: "/blogs", label: "Blogs" },
      { to: "/contact-us", label: "Contact Us", active: isContactActive },
    ].map(({ to, label, active }) => (
      <Link
        key={label}
        to={to}
        onClick={() => setMobileMenuOpen(false)}
        className={`block px-2 rounded-md transition-all hover:bg-white/20 hover:pl-4 ${active ? "text-orange-600 font-semibold" : ""}`}
      >
        {label}
      </Link>
    ))}

    {/* Products Dropdown */}
    <div className="border-t border-white/20 pt-4">
      <button
        className="w-full flex items-center justify-between py-2 px-2 rounded-md hover:bg-white/20 transition-all"
        onClick={() => toggleCategory("products")}
      >
        <span>Products</span>
        <ChevronDown
          className={`h-5 w-5 transition-transform ${openCategories["products"] ? "rotate-180" : ""}`}
        />
      </button>

      <div className={`ml-4 mt-2 transition-all duration-300 ease-in-out overflow-hidden ${openCategories["products"] ? "max-h-[1000px]" : "max-h-0"}`}>
        {categories?.map((category) => (
          <div key={category._id} className="mb-2">
            <button
              className="w-full flex items-center justify-between text-left text-sm font-semibold py-1 px-2 rounded hover:bg-white/10"
              onClick={() => toggleCategory(category._id)}
            >
              <span>{category.category}</span>
              {category.subCategories?.length > 0 && (
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${openCategories[category._id] ? "rotate-180" : ""}`}
                />
              )}
            </button>

            <div className={`ml-3 mt-1 transition-all ${openCategories[category._id] ? "block" : "hidden"}`}>
              <Link
                to={`/categories/${category.slug}`}
                className="block py-1 text-white/80 text-sm hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                All {category.category}
              </Link>
              {category.subCategories?.map((sub) => (
                <Link
                  key={sub._id}
                  to={`/categories/${category.slug}/${sub.slug}`}
                  className="block py-1 text-white/70 text-sm hover:text-white"
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

    {/* Advanced Search Button */}
    <div className="mt-auto pt-4 border-t border-white/20">
      <Button
        variant="ghost"
        className="w-full py-3 mt-2 bg-white text-primary font-semibold rounded-md hover:bg-orange-600 hover:text-white transition-all"
        onClick={() => {
          navigate("/advance-search");
          setMobileMenuOpen(false);
        }}
      >
        Advanced Search
      </Button>
    </div>
  </div>
</div>

      </header>

      <main className="w-full  mx-auto">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}