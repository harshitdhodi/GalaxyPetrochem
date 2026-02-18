import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import SubCategoryProductCard from "./SubCategoryProductCard";
import SubCategoryProductListCard from "./SubCategoryProductListCard";
import Breadcrumb from "../../SubCategoryPage/BreadCrumb";
import { Banner } from "../../Banner";
// import banner from "../../../../../src/assets/petrochemical2.webp";
import noImageAvailable from "../../../../../src/assets/no-image-available.svg";
function SubCategoryProduct() {
    const { slug } = useParams();
    const location = useLocation();
    const [categoryData, setCategoryData] = useState(null);
    const [productGroups, setProductGroups] = useState({});
    const [groupedProducts, setGroupedProducts] = useState({});
    const [loading, setLoading] = useState(true);
    const [productsLoading, setProductsLoading] = useState(false);
    const [banners, setBanners] = useState([]);
    const [isBannerLoading, setIsBannerLoading] = useState(true);
    const path = location.pathname.replace(/^\//, "") || "introduction";

    // Fetch banner effect
    useEffect(() => {
        const fetchBanner = async () => {
            if (!slug) return;
            
            try {
                setIsBannerLoading(true);
                const response = await axios.get(`/api/banner/getByPageSlug?pageSlug=${slug}`);
                console.log("Banner response:", response.data);
                setBanners(response.data || []);
            } catch (error) {
                console.error("Failed to fetch banner:", error);
            } finally {
                setIsBannerLoading(false);
            }
        };

        fetchBanner();
    }, [slug]);

    // Main data fetching effect
    useEffect(() => {
        if (!slug) {
            console.log("No slug available, skipping API call");
            setLoading(false);
            return;
        }

        console.log("Current slug:", slug);

        // For aerosol category, fetch category info first, then products
        if (slug === "aerosol") {
            console.log("Fetching aerosol category and products");
            fetchAerosolCategory();
        } else {
            console.log("Fetching category data for slug:", slug);
            fetchCategory();
        }
    }, [slug]);

    // Function specifically for aerosol category
    const fetchAerosolCategory = async () => {
        try {
            setLoading(true);
            console.log("Fetching aerosol category info and products");
            
            // First, get category information
            const categoryResponse = await axios.get(`/api/chemicalCategory/getSpecificCategory?slug=${slug}`);
            console.log("Aerosol category response:", categoryResponse.data);
            
            // Handle the category data (assuming it returns category info)
            if (categoryResponse.data.category) {
                setCategoryData(categoryResponse.data.category);
            } else if (categoryResponse.data.chemicalCategory) {
                setCategoryData(categoryResponse.data.chemicalCategory);
            }

            // Then fetch products using the specific API you requested
            await fetchProductsByCategory(slug);
            
        } catch (error) {
            console.error("Error fetching aerosol category data:", error);
            console.error("Error details:", {
                message: error.message,
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchCategory = async () => {
        if (!slug) {
            console.error("No slug provided for fetchCategory");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            console.log("Making API call to:", `/api/chemicalCategory/getSpecificCategory?slug=${slug}`);
            
            const response = await axios.get(`/api/chemicalCategory/getSpecificCategory?slug=${slug}`);
            console.log("API Response:", response.data);
            
            const { category, products } = response.data;

            setCategoryData(category);

            // Group products by subCategoryId
            const grouped = {};
            if (products && Array.isArray(products)) {
                products.forEach(product => {
                    const subCatId = product.subCategoryId;
                    if (!grouped[subCatId]) {
                        grouped[subCatId] = [];
                    }
                    grouped[subCatId].push(product);
                });
            }

            setProductGroups(grouped);

            // If no subcategories, fetch products by category slug
            if (!category?.subCategories?.length) {
                console.log("No subcategories found, fetching products by category");
                await fetchProductsByCategory(category.slug || slug);
            }
        } catch (error) {
            console.error("Error fetching category data:", error);
            console.error("Error details:", {
                message: error.message,
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data
            });
        } finally {
            setLoading(false);
        }
    };

    // Function to fetch products by category slug and group by brand
    const fetchProductsByCategory = async (categorySlug) => {
        if (!categorySlug) {
            console.error("No categorySlug provided for fetchProductsByCategory");
            setProductsLoading(false);
            return;
        }

        try {
            setProductsLoading(true);
            console.log("Fetching products by category:", categorySlug);
            
            const response = await axios.get(`/api/petrochemProduct/getByCategorySlug/${categorySlug}`);
            console.log("Products response:", response.data);
            
            if (response.data.success && response.data.data.length > 0) {
                // Group products by brand
                const grouped = response.data.data.reduce((acc, product) => {
                    const brandName = product.brandId?.name || 'Other';
                    if (!acc[brandName]) {
                        acc[brandName] = [];
                    }
                    acc[brandName].push(product);
                    return acc;
                }, {});
                
                setGroupedProducts(grouped);
            }
        } catch (error) {
            console.error("Error fetching products by category:", error);
            console.error("Error details:", {
                message: error.message,
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data
            });
        } finally {
            setProductsLoading(false);
        }
    };

    // Debug render
    console.log("Component render - slug:", slug, "loading:", loading, "categoryData:", categoryData);

    return ( 
        <>
            <div className="relative">
                {/* Banner */}
                {banners && banners.length > 0 ? (
                    <Banner imageUrl={`/api/image/download/${banners[0].image}`} title={categoryData?.category} />
                ) : (
               <Banner imageUrl={noImageAvailable} />  )}

                {/* Breadcrumb below the banner */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 mt-5 z-10">
                    <Breadcrumb categorySlug={categoryData?.category} slug={slug} />
                </div>
            </div>

            <div className="container mx-auto px-4 mt-5 pb-8 max-w-7xl">

                <h2 className="text-4xl font-bold text-[#0a3161] mb-4">
                    {categoryData?.category || "INDUSTRIAL OILS"}
                </h2>
                <div className="h-1 w-24 bg-[#0a3161] mb-6"></div>

                <p
                    className="text-gray-700 mb-10"
                    dangerouslySetInnerHTML={{
                        __html: categoryData?.details || "Explore our range of industrial oils and lubricants.",
                    }}
                ></p>

                {loading ? (
                    <p>Loading products...</p>
                ) : categoryData?.subCategories?.length > 0 ? (
                    // Show subcategories if available
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {categoryData.subCategories.map((sub, index) => (
                            <SubCategoryProductCard
                                slug={slug}
                                subCategorySlug={sub.slug}
                                key={sub._id || index}
                                title={sub.category}
                                image={`/api/logo/download/${sub.photo}`}
                                products={productGroups[sub._id] || []}
                            />
                        ))}
                    </div>
                ) : productsLoading ? (
                    <p>Loading products...</p>
                ) : Object.keys(groupedProducts).length > 0 ? (
                    // Show grouped products by brand (for aerosol and other categories without subcategories)
                    <div>
                        {Object.keys(groupedProducts)
                            .sort()
                            .map((brandName) => (
                                <div key={brandName} className="mb-8">
                                    <h2 className="text-2xl font-bold text-[#0a3161] mb-4">{brandName}</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {groupedProducts[brandName].map((product, index) => (
                                            <SubCategoryProductListCard
                                                key={product._id || index}
                                                product={product}
                                                categorySlug={categoryData?.slug || slug}
                                                subCategorySlug={categoryData?.slug || slug}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                    </div>
                ) : (
                    <p>No products found.</p>
                )}
            </div>
        </>
    );
}

export default SubCategoryProduct;