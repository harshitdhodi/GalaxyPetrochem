import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import SearchBar from "./SearchBar.jsx";
import NavSection from "./NavSection";
import axios from "axios";
import MobileMenu from "./MobileMenu.jsx";

// Custom hooks for API fetching with proper caching
const useLogoData = () => {
  const [logoData, setLogoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await axios.get("/api/companyLogo/get-logo");
    
        setLogoData(response.data.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogo();
  }, []);

  return { logoData, loading, error };
};

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/chemicalCategory/getAll");
        const parsedCategories = response.data.map((blog) => ({
          id: blog._id,
          name: blog.category,
          slug: blog.slug,
        }));
        setCategories(parsedCategories);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};

// Optimized LogoComponent
const LogoComponent = React.memo(({ src, alt, title }) => {
  if (!src) return null;
  
  return (
    // <img
    //   src={src}
    //   alt={alt || "Company Logo"}
    //   title={title}
    //   width="150"
    //   height="50"
    //   loading="eager"
    //   className="h-auto w-[150px] md:w-[130px] lg:w-[200px]"
    //   fetchPriority="high"
    // />
  );
});

export default function NavbarComp({ categories: propCategories = [] }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const { pathname } = useLocation();
  
  // Use custom hooks for API data
  const { logoData } = useLogoData();
  console.log(logoData)
  const { categories: blogCategories } = useCategories();

  // Determine active state
  const activeStates = {
    isHomeActive: pathname === "/" || pathname === "/home",
    isProductsActive: pathname.startsWith("/categories"),
    isBlogActive: pathname.startsWith("/blogs"),
    isContactActive: pathname.startsWith("/contact-us")
  };

  // Handle scroll for sticky header
  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent =
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      setIsSticky(scrollPercent >= 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Preload the logo image with proper attributes
  useEffect(() => {
    if (logoData?.data?.headerLogo) {
      const preloadLink = document.createElement("link");
      preloadLink.rel = "preload";
      preloadLink.href = `/api/logo/download/${logoData.data.headerLogo}`;
      preloadLink.as = "image";
      preloadLink.type = "image/svg+xml";
      document.head.appendChild(preloadLink);
  
      return () => {
        document.head.removeChild(preloadLink);
      };
    }
  }, [logoData?.data?.headerLogo]);
  
  // Update favicon dynamically
  useEffect(() => {
    if (logoData?.favIcon) {
      const faviconUrl = `/api/logo/download/${logoData.favIcon}`;
      let favicon = document.querySelector('link[rel="icon"]');
      
      if (favicon) {
        favicon.href = faviconUrl;
      } else {
        favicon = document.createElement("link");
        favicon.rel = "icon";
        favicon.href = faviconUrl;
        document.head.appendChild(favicon);
      }
    }
  }, [logoData?.favIcon]);

  // Memoize logo source to prevent recalculations
  const logoSrc = useMemo(() => {
    return logoData?.headerLogo ? `/api/logo/download/${logoData.headerLogo}` : "";
  }, [logoData?.headerLogo]);

  // Toggle mobile menu with body scroll lock
  const toggleMobileMenu = useCallback(() => {
    const newState = !mobileMenuOpen;
    setMobileMenuOpen(newState);
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = newState ? 'hidden' : '';
  }, [mobileMenuOpen]);

  // Clean up body style on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <>
      <header 
        className={`w-full relative z-[70] ${isSticky ? "sticky top-0 bg-white shadow-md" : ""}`}
        role="banner"
      >
        <div className="max-w-[80rem] mx-auto  py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <LogoComponent 
              src={logoSrc} 
              alt="Company Logo" 
              title={logoData?.headerLogoName} 
            />
          </Link>
          
          <div className="w-1/2 md:mt-0 hidden md:block">
            <SearchBar />
          </div>
          
          <div className="flex gap-5 justify-between w-full items-center md:hidden">
            <div className="relative w-full">
              <SearchBar />
            </div>
            <button
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              className="text-main hover:text-secondary hover:bg-transparent p-2"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        <NavSection
          categories={propCategories}
          parsedBlogCategories={blogCategories}
          isHomeActive={activeStates.isHomeActive}
          isProductsActive={activeStates.isProductsActive}
          isBlogActive={activeStates.isBlogActive}
          isContactActive={activeStates.isContactActive}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        {/* Mobile Menu */}
        <MobileMenu 
          isOpen={mobileMenuOpen}
          onClose={toggleMobileMenu}
          categories={propCategories}
          logoSrc={logoSrc}
          logoName={logoData?.headerLogoName}
          activeStates={activeStates}
        />
      </header>

      <main className="w-full">
        <Outlet />
      </main>
      {/* Footer component would go here */}
    </>
  );
}