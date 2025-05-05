"use client";

import { useState, useEffect, useRef } from "react";
import { Banner } from "./Banner";
import axios from "axios";
import banner from "../.././assets/petrochemical.webp";
import { Link, useNavigate } from "react-router-dom";

export default function BrandsPage() {
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const productsRef = useRef(null);
  const path = location.pathname.replace(/^\//, "") || "introduction";
  const navigate = useNavigate();

  // Fetch brands from /api/brand/
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get("/api/brand/");
        setBrands(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch brands:", error);
      }
    };

    fetchBrands();
  }, []);

  // Fetch banner data
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await axios.get(`/api/banner/getByPageSlug?pageSlug=${path}`);
        setBanners(response.data || []);
      } catch (error) {
        console.error("Failed to fetch banner:", error);
      }
    };

    fetchBanner();
  }, [path]);

  // Fetch products by brandId
  useEffect(() => {
    if (selectedBrand !== null) {
      const fetchProducts = async () => {
        try {
          const response = await axios.get(`/api/petrochemProduct/brandId?brandId=${selectedBrand}`);
          console.log(response.data);
          setProducts(response.data || []);
        } catch (error) {
          console.error("Failed to fetch products:", error);
        }
      };

      fetchProducts();
    }
  }, [selectedBrand]);

  // Handle brand selection and scroll to products
  const handleViewProducts = (e, brandId) => {
    e.stopPropagation();
    setSelectedBrand(brandId);

    setTimeout(() => {
      if (productsRef.current) {
        const headingOffset = productsRef.current.querySelector(".heading").offsetTop;
        window.scrollTo({
          top: headingOffset - 100, // Adjusted for smaller screens
          behavior: "smooth",
        });
      }
    }, 150);
  };

  const handleProductClick = (slug) => {
    navigate(`/blogs/${slug}`);
  };

  // Determine brand card color
  const getBrandColor = (index) => {
    const colors = ["#e84c20", "#2294d6", "#9c5f96"];
    return colors[index % 3];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner */}
      <div className="relative">
        {/* Banner */}
        {banners && banners.length > 0 ? (
          <Banner imageUrl={`/api/image/download/${banners[0].image}`} title={banners[0].title} />
        ) : (
          <Banner imageUrl={banner} />
        )}

        {/* Breadcrumb - centered horizontally, below the title */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 mt-5 z-10">
          <nav className=" px-4 py-2 rounded-md text-white text-sm sm:text-md font-semibold">
            <Link to="/">
              <span className="    text-[12px] sm:text-[15px]">Home</span>
            </Link>
            <span className="mx-2">/</span>
            <Link to="#">
              <span className="    text-[12px] sm:text-[15px]">Brands</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Brands Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-5">
        <div className="flex items-center mb-6 sm:mb-8">
          <div className="w-1 h-6 sm:h-8 bg-[#a75d9e] mr-3"></div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#a75d9e]">Featured Brands</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
          {brands.map((brand, index) => (
            <div
              key={brand._id}
              className="relative cursor-pointer overflow-hidden bg-white rounded-lg shadow-md transition-all hover:shadow-blue-300 shadow-blue-200 duration-300 transform hover:-translate-y-1 hover:shadow-lg"
              onClick={(e) => handleViewProducts(e, brand._id)}
            >
              <div className="p-4 sm:p-5">
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 relative mb-3 sm:mb-4">
                    <img
                      src={`/api/logo/download/${brand.photo}`}
                      alt={brand.name}
                      width={96}
                      height={96}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <h3 className="text-center font-medium text-sm sm:text-base">{brand.name}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Products Section */}
      {selectedBrand !== null && (
        <section
          ref={productsRef}
          className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 mb-12 transition-opacity duration-500"
        >
          <h2 className="text-xl sm:text-2xl lg:text-3xl heading font-bold text-[#a75d9e] mb-6">
            Products from {brands.find((b) => b._id === selectedBrand)?.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
            {products.map((product, index) => (
              <div
                key={product._id}
                className="relative overflow-hidden bg-white rounded-lg shadow-md shadow-blue-200 hover:shadow-blue-300 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg cursor-pointer"
                onClick={() => handleProductClick(product.slug)}
              >
                <div className="p-4 sm:p-5">
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 relative mb-3 sm:mb-4">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={`/api/image/download/${product.images[0].url}`}
                          alt={product.name}
                          width={100}
                          height={100}
                          className="object-cover w-full h-full rounded-md"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-md">
                          <span className="text-gray-500 text-xs sm:text-sm">No Image</span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-center font-medium text-sm sm:text-base">{product.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1 text-center line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}