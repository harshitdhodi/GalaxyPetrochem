import React, { useState, useEffect, useMemo } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "../../../components/components/ui/button";
import SearchBar from "./SearchBar";
import NavSection from "./NavSection.jsx";
import PropTypes from "prop-types";

const NavbarComp = ({ categories = [], blogCategories = [], logoData = {} }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

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

  useEffect(() => {
    if (logoData?.headerLogo) {
      const preloadLink = document.createElement("link");
      preloadLink.rel = "preload";
      preloadLink.href = `/api/logo/download/${logoData.headerLogo}`;
      preloadLink.as = "image";
      preloadLink.type = "image/svg+xml";
      preloadLink.onerror = () => console.error("Failed to preload logo");
      document.head.appendChild(preloadLink);
    }
  }, [logoData?.headerLogo]);

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

  const logoSrc = useMemo(
    () => (logoData?.headerLogo ? `/api/logo/download/${logoData.headerLogo}` : "/fallback-logo.png"),
    [logoData?.headerLogo]
  );

  const LogoComponent = React.memo(() => (
    <img
      src={logoSrc}
      alt="Company Logo"
      title={logoData?.headerLogoName || "Company Logo"}
      width="150"
      height="50"
      loading="eager"
      className="h-auto w-[150px] md:w-[130px] lg:w-[200px]"
      fetchpriority="high"
    />
  ));

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
    if (mobileMenuOpen) {
      setCategoryDropdownOpen(false);
    }
  };

  const navItems = [
    { to: "/", label: "Home", isActive: isHomeActive },
    { to: "/corporate", label: "Corporate" },
    { to: "/products", label: "Products", hasDropdown: true, dropdownItems: categories },
    { to: "/worldwide", label: "Worldwide" },
    { to: "/careers", label: "Careers" },
    { to: "/events", label: "Events" },
    { to: "/contact-us", label: "Contact Us", isActive: isContactActive },
  ];

  return (
    <>
      <header className={`w-full relative z-10 ${isSticky ? "sticky top-0 bg-white shadow-md" : ""}`}>
        <div className="max-w-[80rem] mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <LogoComponent />
          </Link>
          <div className="w-1/2 md:flex md:mt-0 gap-5 hidden">
            <SearchBar />
          </div>
          <div className="flex items-center md:hidden">
            <div className="w-full">
              <SearchBar />
            </div>
            <Button
              variant="ghost"
              className="text-main hover:text-secondary hover:bg-transparent p-2"
              onClick={toggleMobileMenu}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
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

        <div
          className={`
            md:hidden fixed top-0 left-0 right-0 w-full z-20
            transition-all duration-300 ease-in-out
            ${
              mobileMenuOpen
                ? "opacity-100 h-screen"
                : "opacity-0 h-0 pointer-events-none overflow-hidden"
            }
          `}
        >
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-10"
            onClick={toggleMobileMenu}
          />
          <div className="relative h-[100vh] w-full px-4 pb-2 space-y-2 overflow-y-auto bg-gradient-to-b from-[#61b0ab] to-[#9e5d94]">
            <div className="flex items-center justify-between pb-4 bg-white -mx-4 px-4 pt-2">
              <Link to="/" onClick={toggleMobileMenu}>
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
                className="text-main_light hover:text-secondary hover:bg-transparent p-1 border"
                onClick={toggleMobileMenu}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            {navItems.map((item) => (
              <div key={item.to}>
                {item.hasDropdown ? (
                  <button
                    className="block w-full text-left py-2 text-white hover:text-secondary"
                    onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                    aria-expanded={categoryDropdownOpen}
                    aria-controls="products-dropdown"
                  >
                    <Link to={item.to}>{item.label}</Link>
                  </button>
                ) : (
                  <Link
                    to={item.to}
                    className={`block py-2 text-white hover:text-secondary ${item.isActive ? "text-primary" : ""}`}
                    onClick={toggleMobileMenu}
                    aria-current={item.isActive ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                )}
                {item.hasDropdown && categoryDropdownOpen && (
                  <div className="pl-4 space-y-2 bg-white rounded-md shadow-md">
                    {item.dropdownItems.map((category) => (
                      <Link
                        key={category.id}
                        to={`/${category.slug}`}
                        className="block py-1 text-main text-md hover:text-secondary"
                        onClick={toggleMobileMenu}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Button
              variant="ghost"
              className="w-full text-white bg-primary rounded-none py-4 hover:text-primary text-sm"
              onClick={() => {
                navigate("/advance-search");
                toggleMobileMenu();
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
    </>
  );
};

NavbarComp.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
    })
  ),
  blogCategories: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
    })
  ),
  logoData: PropTypes.shape({
    headerLogo: PropTypes.string,
    headerLogoName: PropTypes.string,
    favIcon: PropTypes.string,
  }),
};

export default NavbarComp;