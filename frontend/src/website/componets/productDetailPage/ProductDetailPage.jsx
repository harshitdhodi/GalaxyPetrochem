import React, { useEffect, useState, useMemo } from "react";
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
import Marquee from "./marquee/Marquee";

export default function ProductDetailPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [productData, setProductData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const { slug, categorySlug } = useParams();
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);
  const [isBannerLoading, setIsBannerLoading] = useState(true);

  // Enhanced function to preserve HTML formatting while truncating
 // Enhanced function to preserve HTML formatting while truncating
 const truncateHTML = (html, percentage = 0.5) => {
  if (!html || typeof html !== 'string') return "No description available.";
  
  // Create a temporary div to parse HTML
  const div = document.createElement("div");
  div.innerHTML = html;
  
  // Get plain text for word counting
  const text = div.textContent || div.innerText || "";
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  const targetWordCount = Math.floor(words.length * percentage);
  
  // If content is short, return as-is
  if (words.length <= 50 || words.length <= targetWordCount) {
    return html;
  }
  
  // Simple truncation approach: extract text nodes and rebuild
  let wordCount = 0;
  let truncated = false;
  
  function truncateNode(node) {
    if (truncated) {
      return null;
    }
    
    if (node.nodeType === Node.TEXT_NODE) {
      const nodeWords = node.textContent.trim().split(/\s+/).filter(w => w.length > 0);
      
      if (wordCount + nodeWords.length <= targetWordCount) {
        wordCount += nodeWords.length;
        return node.cloneNode(true);
      } else {
        const remainingWords = targetWordCount - wordCount;
        if (remainingWords > 0) {
          const newText = nodeWords.slice(0, remainingWords).join(' ') + '...';
          const newNode = document.createTextNode(newText);
          wordCount = targetWordCount;
          truncated = true;
          return newNode;
        }
        truncated = true;
        return null;
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const newElement = document.createElement(node.tagName);
      
      // Copy attributes
      for (let i = 0; i < node.attributes.length; i++) {
        newElement.setAttribute(node.attributes[i].name, node.attributes[i].value);
      }
      
      // Process children
      for (let i = 0; i < node.childNodes.length; i++) {
        if (truncated) break;
        const newChild = truncateNode(node.childNodes[i]);
        if (newChild) {
          newElement.appendChild(newChild);
        }
      }
      
      return newElement.childNodes.length > 0 ? newElement : null;
    }
    
    return null;
  }
  
  const resultDiv = document.createElement('div');
  for (let i = 0; i < div.childNodes.length; i++) {
    if (truncated) break;
    const newChild = truncateNode(div.childNodes[i]);
    if (newChild) {
      resultDiv.appendChild(newChild);
    }
  }
  
  return resultDiv.innerHTML;
};

  // Function to clean and enhance HTML for proper display
  const enhanceHTMLForDisplay = (html) => {
    if (!html) return "No content available.";

    // Remove empty or whitespace-only p tags so they don't get spacing/layout
    let cleaned = html.replace(/<p(?:\s[^>]*)?>\s*<\/p>/gi, '');

    // Ensure proper list styling and formatting
    let enhancedHTML = cleaned
      // Add proper classes to lists
      .replace(/<ul(?![^>]*class)/g, '<ul class="list-disc pl-6 space-y-2 my-4"')
      .replace(/<ol(?![^>]*class)/g, '<ol class="list-decimal pl-6 space-y-2 my-4"')
      // Add proper classes to list items
      .replace(/<li(?![^>]*class)/g, '<li class="leading-relaxed"')
      // Add proper classes to paragraphs (only non-empty p tags remain)
      .replace(/<p(?![^>]*class)/g, '<p class="mb-4 leading-relaxed"')
      // Add proper classes to headings
      .replace(/<h1(?![^>]*class)/g, '<h1 class="text-2xl font-bold mb-4 mt-6"')
      .replace(/<h2(?![^>]*class)/g, '<h2 class="text-xl font-bold mb-3 mt-5"')
      .replace(/<h3(?![^>]*class)/g, '<h3 class="text-lg font-bold mb-3 mt-4"')
      .replace(/<h4(?![^>]*class)/g, '<h4 class="text-base font-bold mb-2 mt-3"')
      // Add proper classes to tables
      .replace(/<table(?![^>]*class)/g, '<table class="w-full border-collapse border border-gray-300 my-4"')
      .replace(/<th(?![^>]*class)/g, '<th class="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold text-left"')
      .replace(/<td(?![^>]*class)/g, '<td class="border border-gray-300 px-4 py-2"')
      // Ensure strong and em tags are properly styled
      .replace(/<strong>/g, '<strong class="font-bold">')
      .replace(/<em>/g, '<em class="italic">')
      // Handle nested lists properly
      .replace(/<ul class="[^"]*">\s*<ul/g, '<ul class="list-circle pl-4 mt-2"><ul')
      .replace(/<ol class="[^"]*">\s*<ol/g, '<ol class="list-lower-alpha pl-4 mt-2"><ol');
    
    return enhancedHTML;
  };

  // Helper function to check if HTML content is empty
  const isContentEmpty = (html) => {
    if (!html) return true;
    const strippedHtml = html.replace(/<[^>]+>/g, '').trim();
    return strippedHtml.length === 0;
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
          navigate("/404", { replace: true });
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

  const images = useMemo(() => {
    if (!productData?.images?.length) {
      return [{ url: fallbackImage, alt: "No Image Available", title: "No Image" }];
    }

    return productData.images.map((img, index) => ({
      url: imageErrors[index] ? fallbackImage : `/api/image/download/${img.url}`,
      originalUrl: img.url,
      alt: img.alt || `Product Image ${index + 1}`,
      title: img.title || "Product Image",
    }));
  }, [productData?.images, imageErrors]);

  const handleImageError = (index) => {
    setImageErrors(prev => ({
      ...prev,
      [index]: true
    }));
  };

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
              <div className="w-full lg:w-1/2 flex flex-col items-center justify-start">
                <ImageSection 
                  images={images} 
                  selectedImage={selectedImage} 
                  setSelectedImage={setSelectedImage} 
                  onError={handleImageError} 
                />
              </div>
              <div className="w-full ">
                <ProductInfo
                  productDetails={productData?.details}
                  name={productData?.name}
                  price={productData?.price}
                  categorySlug={productData?.categorySlug}
                  tagline={productData?.tagline}
                />
                
                <MSDSSection
                  msds={productData?.msds}
                  pdf={productData?.pdf}
                  name={productData?.name}
                  onInquiry={() => setShowInquiryForm(true)}
                />
              </div>
            </div>

            {/* Specifications section — details are already shown in ProductInfo above */}
            {(!isContentEmpty(productData?.specifiction) || !isContentEmpty(productData?.tableInfo)) && (
            <div className="mt-5 bg-gradient-to-r from-blue-50 to-blue-100 p-8 rounded-lg shadow-md border border-blue-200">
              <h2 className="text-2xl font-bold mb-6 text-blue-900 border-b border-blue-200 pb-3">
                Specifications
              </h2>

              {/* Specification content (if different from details) */}
              {!isContentEmpty(productData?.specifiction) && (
                <div className="mb-6 rich-content-display prose prose-blue max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: enhanceHTMLForDisplay(productData.specifiction),
                  }}
                />
              )}

              {/* Table Info (Specifications) */}
              {!isContentEmpty(productData?.tableInfo) && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-blue-800">Specifications</h3>
                  <div
                    className="rich-content-display prose prose-blue max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: enhanceHTMLForDisplay(productData?.tableInfo),
                    }}
                  />
                </div>
              )}
            </div>
            )}
          </>
        )}
        
        <Marquee />
        <RecentProduct />
      </div>

      {/* Enhanced CSS for rich content display */}

    </>
  );
}