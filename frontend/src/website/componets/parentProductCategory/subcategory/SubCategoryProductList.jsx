import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Breadcrumb } from "../../category_subcategory/BreadCrumb";
import { Banner } from "../../Banner";
import banner from "../../../../assets/petrochemical.webp";
import SubCategoryProductListCard from "./SubCategoryProductListCard";

function SubCategoryProductList() {
    const { slug ,categorySlug } = useParams();
    const [categoryData, setCategoryData] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await axios.get(
                    `/api/chemicalCategory/getSpecificSubcategoryBySlug?slug=${slug}`
                );
                const { subCategory, products } = response.data;

                setCategoryData(subCategory);
                setProducts(products);
            } catch (error) {
                console.error("Error fetching category data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategory();
    }, [slug]);

    const getShortDescription = (htmlString) => {
        const temp = document.createElement("div");
        temp.innerHTML = htmlString;
        const text = temp.textContent || temp.innerText || "";
        const shortLength = Math.floor(text.length * 0.2);
        return text.substring(0, shortLength) + "...";
    };

    return (
        <>
            <div className="relative">
                <Banner imageUrl={banner} />
                <div className="container mx-auto px-4 max-w-7xl -mt-8 relative z-10">
                    <Breadcrumb
                        subcategoryName={categoryData?.category}
                        subCategorySlug={categoryData?.slug}
                        categorySlug={categorySlug}
                    />
                </div>
            </div>

            <div className="container mx-auto px-4 pb-8 max-w-7xl">
                <h1 className="text-4xl font-bold text-[#0a3161] mb-4">
                    {categoryData?.category || "INDUSTRIAL OILS"}
                </h1>
                <div className="h-1 w-24 bg-[#0a3161] mb-6"></div>

                <div className="text-gray-700 mb-4">
                    {categoryData?.details && (
                        <>
                            <p
                                dangerouslySetInnerHTML={{
                                    __html: showMore
                                        ? categoryData.details
                                        : getShortDescription(categoryData.details),
                                }}
                            ></p>
                            <button
                                onClick={() => setShowMore(!showMore)}
                                className="text-blue-600 underline mt-2 inline-block"
                            >
                                {showMore ? "See Less" : "See More"}
                            </button>
                        </>
                    )}
                </div>

                {loading ? (
                    <p>Loading products...</p>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product, index) => (
                            <SubCategoryProductListCard
                                key={index}
                                product={product}
                                categorySlug={categoryData?.categorySlug}
                                subCategorySlug={categoryData?.slug}
                            />
                        ))}
                    </div>
                ) : (
                    <p>No products found.</p>
                )}
            </div>
        </>
    );
}

export default SubCategoryProductList;
