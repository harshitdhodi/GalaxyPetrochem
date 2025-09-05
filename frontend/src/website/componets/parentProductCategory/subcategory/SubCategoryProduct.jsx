import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SubCategoryProductCard from "./SubCategoryProductCard";
import SubCategoryProductListCard from "./SubCategoryProductListCard";
import Breadcrumb from "../../SubCategoryPage/BreadCrumb";
import { Banner } from "../../Banner";
import banner from "../../../../assets/petrochemical.webp";

function SubCategoryProduct() {
    const { slug } = useParams();
    const [categoryData, setCategoryData] = useState(null);
    const [productGroups, setProductGroups] = useState({});
    const [groupedProducts, setGroupedProducts] = useState({});
    const [loading, setLoading] = useState(true);
    const [productsLoading, setProductsLoading] = useState(false);
    const [banners, setBanners] = useState([]);
    const [isBannerLoading, setIsBannerLoading] = useState(true);
    const path = location.pathname.replace(/^\//, "") || "introduction";

    useEffect(() => {
        const fetchBanner = async () => {
            try {
                const response = await axios.get(`/api/banner/getByPageSlug?pageSlug=${slug}`);
                console.log(response.data)
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
        // Check if slug is "aerosol" - if so, directly fetch products
        if (slug === "aerosol") {
            fetchProductsByCategory(slug);
        } else {
            fetchCategory();
        }
    }, [slug]);

    const fetchCategory = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/chemicalCategory/getSpecificCategory?slug=${slug}`);
            const { category, products } = response.data;

            setCategoryData(category);

            // Group products by subCategoryId
            const grouped = {};
            products.forEach(product => {
                const subCatId = product.subCategoryId;
                if (!grouped[subCatId]) {
                    grouped[subCatId] = [];
                }
                grouped[subCatId].push(product);
            });

            setProductGroups(grouped);

            // If no subcategories, fetch products by category slug
            if (!category?.subCategories?.length) {
                await fetchProductsByCategory(category.slug);
            }
        } catch (error) {
            console.error("Error fetching category data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Function to fetch products by category slug and group by brand
    const fetchProductsByCategory = async (categorySlug) => {
        try {
            setProductsLoading(true);
            const response = await axios.get(`/api/petrochemProduct/getByCategorySlug/${categorySlug}`);
            
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
        } finally {
            setProductsLoading(false);
        }
    };

    return ( 
        <>
            <div className="relative">
                {/* Banner */}
                {banners && banners.length > 0 ? (
                    <Banner imageUrl={`/api/image/download/${banners[0].image}`} title={categoryData?.category} />
                ) : (
                    // <Banner imageUrl={banner} />
                    "images"
                )}

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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {categoryData.subCategories.map((sub, index) => (
                            <SubCategoryProductCard
                                slug={slug}
                                subCategorySlug={sub.slug}
                                key={index}
                                title={sub.category}
                                image={`/api/logo/download/${sub.photo}`}
                                products={productGroups[sub._id] || []} // matching products for this sub-category
                            />
                        ))}
                    </div>
                ) : productsLoading ? (
                    <p>Loading products...</p>
                ) : Object.keys(groupedProducts).length > 0 ? (
                    <div>
                        {Object.keys(groupedProducts)
                            .sort()
                            .map((brandName) => (
                                <div key={brandName} className="mb-8">
                                    <h2 className="text-2xl font-bold text-[#0a3161] mb-4">{brandName}</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {groupedProducts[brandName].map((product, index) => (
                                            <SubCategoryProductListCard
                                                key={index}
                                                product={product}
                                                categorySlug={categoryData?.categorySlug}
                                                subCategorySlug={categoryData?.slug}
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