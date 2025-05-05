import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ImageSection from "./ProductImageSec";
import ProductInfo from "./ProductInfo";
import MSDSSection from "./MSDSSection";
import { useParams, useNavigate, Link } from "react-router-dom";
import InquiryForm from "./InquiryForm";
import RecentProduct from "./RecentProduct";
import ProductDetailBreadcrumb from "../SubCategoryPage/ProductDetailBreadCrumb";
import { Banner } from "../Banner";
import axios from "axios";

export default function ProductDetailPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [productData, setProductData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const { slug, categorySlug } = useParams();
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);
  const [isBannerLoading, setIsBannerLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const truncateHTML = (html, percentage = 0.9) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    const text = div.textContent || div.innerText || "";
    const wordCount = Math.floor(text.split(" ").length * percentage);
    return text.split(" ").slice(0, wordCount).join(" ") + "...";
  };

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await axios.get(`/api/banner/getByPageSlug?pageSlug=hydraulic-oils`);
        console.log(response.data);
        setBanners(response.data || []);
      } catch (error) {
        console.error("Failed to fetch banner:", error);
      } finally {
        setIsBannerLoading(false);
      }
    };

    fetchBanner();
  }, []);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        const response = await fetch(`/api/petrochemProduct/getbySlug?slug=${slug}`);
        const data = await response.json();
        console.log(data);

        if (!response.ok) throw new Error("Failed to fetch product data");

        if (!data || data.length === 0) {
          navigate("/404", { replace: true }); // Redirect to 404 page if no data
          return;
        }

        setProductData(data[0]);
      } catch (error) {
        console.error("Error fetching product data:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchProductData();
    }
  }, [slug, navigate]);

  const fallbackImage = "https://via.placeholder.com/300x300?text=No+Image+Available";

  const images = productData?.images?.length
    ? productData.images.map((img) => ({
        url: img.url || fallbackImage,
        alt: img.alt || "Product Image",
        title: img.title || "Product Image",
      }))
    : [{ url: fallbackImage, alt: "No Image Available", title: "No Image" }];

  const productDetails = productData?.details || "";

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-600 font-semibold">Error fetching product data.</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="relative">
        {/* Banner */}
        {banners && banners.length > 0 ? (
          <Banner imageUrl={`/api/image/download/${banners[0].image}`} title={productData?.name} />
        ) : (
          <div className="h-[30vh] flex items-center justify-center bg-gray-200">
            <p className="text-gray-500">Banner not found</p>
          </div>
        )}

        {/* Breadcrumb */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 mt-5 z-10">
        <ProductDetailBreadcrumb
              chemicals={productData?.categoryId?.category}
              slug={productData?.categoryId?.slug}
              categorySlug={productData?.name}
              subCategorySlug={categorySlug}
            />
        </div>
      </div>

      <div className="max-w-7xl mx-auto mb-10 px-4 py-2 relative">
        {showInquiryForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <InquiryForm productName={productData?.name} onClose={() => setShowInquiryForm(false)} />
          </div>
        )}
        {isLoading ? (
          <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          </div>
        ) : (
          <>
            
            <div className="lg:flex gap-12 mt-5">
              <div className="w-full lg:w-1/2  flex flex-col items-center justify-start">
                <ImageSection images={images} selectedImage={selectedImage} setSelectedImage={setSelectedImage} />
              </div>
              <div className="w-full">
                <ProductInfo
                  productDetails={productDetails}
                  name={productData?.name}
                  price={productData?.price}
                  categorySlug={productData?.categorySlug}
                  tagline={productData?.tagline}
                />
                <MSDSSection
                  msds={productData?.msds}
                  specs={productData?.pdf}
                  name={productData?.name}
                  onInquiry={() => setShowInquiryForm(true)}
                />
              </div>
            </div>
            <div className="mt-5 bg-gradient-to-r from-blue-50 to-blue-100 p-8 rounded-lg shadow-md border border-blue-200">
              <h2 className="text-2xl font-semibold mb-6 text-blue-900 border-b border-blue-200 pb-3">
                Product Description
              </h2>
              <div
                className="text-gray-700 leading-relaxed prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: showFullDescription
                    ? productData?.details || "No description available."
                    : truncateHTML(productData?.details || ""),
                }}
              />
              {showFullDescription && productData?.tableInfo && (
                <div
                  className="bg-transparent leading-relaxed prose prose-sm max-w-none mt-4"
                  dangerouslySetInnerHTML={{
                    __html: productData?.tableInfo,
                  }}
                />
              )}
              {(productData?.details?.length > 0 || productData?.tableInfo?.length > 0) && (
                <button
                  onClick={() => setShowFullDescription((prev) => !prev)}
                  className="mt-4 text-blue-700 hover:text-blue-900 font-medium underline"
                >
                  {showFullDescription ? "See Less" : "See More"}
                </button>
              )}
            </div>
          </>
        )}
        <RecentProduct />
      </div>
    </>
  );
}