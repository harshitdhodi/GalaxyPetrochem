"use client";

import { useState, useEffect, useRef } from "react";
import { Image } from "antd";
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
          top: headingOffset - 300, // Adjust offset for better alignment
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
      {banners && banners.length > 0 ? (
        <Banner imageUrl={`/api/image/download/${banners[0].image}`} />
      ) : (
        <Banner imageUrl={banner} />
      )}
      <div className="container mx-auto px-4 max-w-7xl -mt-8 relative z-10">
        <nav className="text-[#fff] text-md font-semibold">
          <Link to={'/'}>
            <span className="text-[12px] bg-gray-600 px-2 font- rounded-md sm:text-[15px] text-white">Home</span>
          </Link>
          <span className="mx-2 text-white">&gt;</span>
          <Link>
            <span className="text-[12px] bg-gray-600 px-2 rounded-md sm:text-[15px] text-white">Brands</span>
          </Link>
        </nav>
      </div>
      {/* Brands Section */}
      <section className="w-[80rem] mx-auto px-4 py-12">
        <div className="flex items-center mb-8">
          <div className="w-1 h-8 bg-[#e84c20] mr-3"></div>
          <h2 className="text-2xl font-bold text-gray-800">Featured Brands</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {brands.map((brand, index) => (
            <div
              key={brand._id}
              className="relative overflow-hidden bg-white rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
              style={{ borderTop: `4px solid ${getBrandColor(index)}` }}
            >
              <div className="p-5">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 relative mb-4">
                    <Image
                      src={`/api/logo/download/${brand.photo}`}
                      alt={brand.name}
                      width={96}
                      height={96}
                      className="object-contain"
                    />
                  </div>
                  <h3 className="text-center font-medium">{brand.name}</h3>

                  <div className="mt-3 w-full">
                    <button
                      className="w-full text-sm py-1 px-3 rounded bg-gray-100 hover:bg-gray-200 transition-colors duration-300 flex items-center justify-center"
                      style={{ color: getBrandColor(index) }}
                      onClick={(e) => handleViewProducts(e, brand._id)}
                    >
                      <span>View Products</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
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
          className="w-[80rem] mx-auto px-4 py-8 mb-12 transition-opacity duration-500"
        >
          <h2 className="text-2xl heading font-bold text-gray-800 mb-6">
            Products from {brands.find((b) => b._id === selectedBrand)?.name}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <div
                key={product._id}
                className="relative overflow-hidden bg-white rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl cursor-pointer"
                style={{ borderTop: `4px solid ${getBrandColor(index)}` }}
                onClick={() => handleProductClick(product.slug)}
              >
                <div className="p-5">
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 relative mb-4">
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={`/api/image/download/${product.images[0].url}`}
                          alt={product.name}
                          width={100}
                          height={96}
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 text-sm">No Image</span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-center font-medium">{product.name}</h3>
                    <p className="text-sm text-gray-500 mt-1 text-center">
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