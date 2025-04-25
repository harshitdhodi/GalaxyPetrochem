import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SubCategoryProductCard from "./SubCategoryProductCard";
import Breadcrumb from "../../SubCategoryPage/BreadCrumb";
import { Banner } from "../../Banner";
import banner from "../../../../assets/petrochemical.webp";
function SubCategoryProduct() {
    const { slug } = useParams();
    const [categoryData, setCategoryData] = useState(null);
    const [productGroups, setProductGroups] = useState({});
    const [loading, setLoading] = useState(true);
    const [banners, setBanners] = useState([]);
    const [isBannerLoading, setIsBannerLoading] = useState(true);
    const path = location.pathname.replace(/^\//, "") || "introduction";

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
        const fetchCategory = async () => {
            try {
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
            } catch (error) {
                console.error("Error fetching category data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategory();
    }, [slug]);

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
                <div className="container mx-auto px-4 max-w-7xl -mt-12 relative z-10">
                    <Breadcrumb categorySlug={categoryData?.category} slug={slug} />
                </div>
            </div>

            <div className="container mx-auto px-4 pb-8 max-w-7xl">

                <h1 className="text-4xl font-bold text-[#0a3161] mb-4">
                    {categoryData?.category || "INDUSTRIAL OILS"}
                </h1>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                ) : (
                    <p>No categories found.</p>
                )}
            </div></>
    );
}

export default SubCategoryProduct;
