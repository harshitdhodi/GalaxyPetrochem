import { useEffect, useState } from "react";
import axios from "axios";
import ProductSection from "../componets/parentProductCategory/ProductSection";
import banner from "../.././assets/petrochemical.webp";
import { Banner } from "./Banner";
import { Link } from "react-router-dom";

function ParentProductCategory() {
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState([]);
  const [isBannerLoading, setIsBannerLoading] = useState(true);
  const path = location.pathname.replace(/^\//, "") || "introduction";

  // Fetch banner data
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await axios.get(`/api/banner/getByPageSlug?pageSlug=${path}`);
        console.log(response.data);
        setBanners(response.data || []);
      } catch (error) {
        console.error("Failed to fetch banner:", error);
      } finally {
        setIsBannerLoading(false);
      }
    };

    fetchBanner();
  }, [path]);

  useEffect(() => {
    const fetchAllCategoriesWithProducts = async () => {
      try {
        const response = await axios.get("/api/chemicalCategory/getAllCategoriesWithProducts");
        const data = response.data;
        console.log("Fetched categories with products:", data);
        setAllCategories(data);
      } catch (error) {
        console.error("Error fetching categories with products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCategoriesWithProducts();
  }, []);

  if (loading || isBannerLoading) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <div>
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
              <span className="    text-[12px] sm:text-[15px]">Product</span>
            </Link>
          </nav>
        </div>
      </div>
    
      <div className="container mx-auto px-4 max-w-7xl pt-5">
        <h2 className="text-4xl text-[#0a3161] font-bold mb-3">Our Categories</h2>
      </div>
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 pb-5 max-w-7xl lg:gap-10">
        {allCategories.length === 0 ? (
          <p>No categories found.</p>
        ) : (
          allCategories.map((category, i) => (
            <div key={i} >
              <ProductSection
                title={category.category}
                image={`/api/logo/download/${category.photo}`}
                subcategories={category.subCategories || []}
                slug={category.slug}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ParentProductCategory;