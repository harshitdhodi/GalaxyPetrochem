import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ImageSection from "./ProductImageSec";
import ProductInfo from "./ProductInfo";
import MSDSSection from "./MSDSSection";
import MadeInIndia from "./MadeInIndia";
import { useParams, useNavigate } from "react-router-dom";
import InquiryForm from "./InquiryForm";
import Footer from "../home/Footer";
import RecentProduct from "./RecentProduct";
import NotFoundPage from "../NotFoundPage.jsx";
import ProductDetailBreadcrumb from "../SubCategoryPage/ProductDetailBreadCrumb";

export default function ProductDetailPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [productData, setProductData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const { slug ,categorySlug } = useParams();
  const navigate = useNavigate();

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

        // Assuming the data array contains multiple products and you want the first one
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

  useEffect(() => {
    document.body.style.overflow = showInquiryForm ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showInquiryForm]);

  useEffect(() => {
    const defaultTitle = "Product Details";
    if (productData?.meta?.title) {
      document.title = `${productData.meta.title} - Product Details`;
      let metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute("content", productData.meta.description || `Details about ${productData.name}`);
      } else {
        const newMetaDescription = document.createElement("meta");
        newMetaDescription.setAttribute("name", "description");
        newMetaDescription.setAttribute("content", productData.meta.description || `Details about ${productData.name}`);
        document.head.appendChild(newMetaDescription);
      }
    } else {
      document.title = isLoading ? "Loading..." : defaultTitle;
    }

    return () => {
      document.title = defaultTitle;
    };
  }, [productData, isLoading]);

  const fallbackImage = "https://via.placeholder.com/300x300?text=No+Image+Available";
  
  // Handling product images
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
    <div className="max-w-7xl mx-auto mb-10 px-4 py-2 relative">
      {showInquiryForm && (
        <div className="fixed inset-0  z-50 flex items-center justify-center">
          <InquiryForm productName={productData?.name} onClose={() => setShowInquiryForm(false)} />
        </div>
      )}
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        </div>
      ) : (
        <>
          <ProductDetailBreadcrumb
            chemicals={productData?.categoryId?.category}
            slug={productData?.categoryId?.slug}
            categorySlug={productData?.name}
            subCategorySlug={categorySlug}
          />
          <div className="lg:flex gap-12">
            <ImageSection images={images} selectedImage={selectedImage} setSelectedImage={setSelectedImage} />
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
          <div className="mt-12 bg-gradient-to-r from-blue-50 to-blue-100 p-8 rounded-lg shadow-md border border-blue-200">
            <h2 className="text-2xl font-semibold mb-6 text-blue-900 border-b border-blue-200 pb-3">Product Description</h2>
            <div
              className="text-gray-700 bg-transparent leading-relaxed prose prose-sm max-w-none
    prose-headings:text-blue-900 
    prose-p:text-gray-600 
    prose-strong:text-blue-800
    prose-ul:list-disc 
    prose-ul:pl-5
    prose-li:my-1
    prose-a:text-blue-600 
    prose-a:hover:text-blue-800"
              style={{ backgroundColor: "transparent" }} // Ensure no background is applied
              dangerouslySetInnerHTML={{
                __html: productData?.details || "No description available for this product.",
              }}
            />
            <div
              className="bg-transparent leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{
                __html: productData?.tableInfo || "No description available for this product.",
              }}
            />
          </div>
        </>
      )}
      <RecentProduct />
      {/* <MadeInIndia name={productData?.name} /> */}
    </div>
  );
}
