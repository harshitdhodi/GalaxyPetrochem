import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductSection from "../componets/parentProductCategory/ProductSection";
import banner from "../.././assets/petrochemical.webp";
import { Banner } from "./Banner";
import { Breadcrumb } from "@/components/ui/breadcrumb";
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
        setAllCategories(data);
      } catch (error) {
        console.error("Error fetching categories with products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCategoriesWithProducts();
  }, []);

  if (loading) return <p className="text-center">Loading categories and products...</p>;

  return (
    <>
 <div className="relative">
  {/* Banner */}
  {banners && banners.length > 0 ? (
    <Banner imageUrl={`/api/image/download/${banners[0].image}`} />
  ) : (
    <Banner imageUrl={banner} />
  )}

  {/* Breadcrumb below the banner */}
  <div className="container mx-auto px-4 max-w-7xl -mt-8 relative z-10">
    <nav className="text-[#fff] text-md font-semibold">
      <Link to={'/'}>
        <span className="text-[12px] bg-gray-600 px-2 rounded-md sm:text-[15px] text-white">Home</span>
      </Link>
      <span className="mx-2 text-white">&gt;</span>
      <Link>
        <span className="text-[12px] bg-gray-600 px-2 rounded-md sm:text-[15px] text-white">Product</span>
      </Link>
    </nav>
  </div>
</div>

      <div className="container mx-auto px-4 max-w-7xl pt-10">
        <h2 className="text-4xl text-[#0a3161] font-bold mb-3 ">Our Categories</h2>
        {/* <div className="h-1 w-16 bg-[#0a3161] mb-6"></div> */}
      </div>
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 pb-8 max-w-7xl gap-10">
        {allCategories.length === 0 ? (
          <p>No categories found.</p>
        ) : (
          allCategories.map((category, i) => (
            <div key={i} className="mb-14">

              <ProductSection
                title={category.category}
                image={`/api/logo/download/${category.photo}`}
                products={category.products || []}
                slug={category.slug}
              />
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default ParentProductCategory;
