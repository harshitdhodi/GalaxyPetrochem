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
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Enhanced function to preserve HTML formatting while truncating
  const truncateHTML = (html, percentage = 0.5) => {
    if (!html || typeof html !== 'string') return "No description available.";
    
    // Create a temporary div to parse HTML
    const div = document.createElement("div");
    div.innerHTML = html;
    
    // Get plain text for word counting
    const text = div.textContent || div.innerText || "";
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const wordCount = Math.floor(words.length * percentage);
    
    if (words.length <= wordCount) {
      return html; // Return full HTML if already short enough
    }
    
    // Find truncation point in HTML while preserving structure
    let currentWordCount = 0;
    let truncatedHTML = '';
    const walker = document.createTreeWalker(
      div,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    let node;
    while (node = walker.nextNode()) {
      const nodeWords = node.textContent.split(/\s+/).filter(word => word.length > 0);
      if (currentWordCount + nodeWords.length <= wordCount) {
        currentWordCount += nodeWords.length;
      } else {
        // Truncate this text node
        const remainingWords = wordCount - currentWordCount;
        if (remainingWords > 0) {
          const truncatedText = nodeWords.slice(0, remainingWords).join(' ');
          node.textContent = truncatedText + '...';
        } else {
          node.textContent = '';
        }
        break;
      }
    }
    
    return div.innerHTML;
  };

  // Function to clean and enhance HTML for proper display
  const enhanceHTMLForDisplay = (html) => {
    if (!html) return "No content available.";
    
    // Ensure proper list styling and formatting
    let enhancedHTML = html
      // Add proper classes to lists
      .replace(/<ul(?![^>]*class)/g, '<ul class="list-disc pl-6 space-y-2 my-4"')
      .replace(/<ol(?![^>]*class)/g, '<ol class="list-decimal pl-6 space-y-2 my-4"')
      // Add proper classes to list items
      .replace(/<li(?![^>]*class)/g, '<li class="leading-relaxed"')
      // Add proper classes to paragraphs
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
              <div className="w-full">
                <ProductInfo
                  productDetails={productData?.details}
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

            {/* Enhanced Product Description Section */}
            <div className="mt-5 bg-gradient-to-r from-blue-50 to-blue-100 p-8 rounded-lg shadow-md border border-blue-200">
              <h2 className="text-2xl font-bold mb-6 text-blue-900 border-b border-blue-200 pb-3">
                Product Description
              </h2>
              
              {/* Product Details */}
              {(productData?.details || productData?.specifiction) && (
                <div className="mb-6">
                  <div
                    className="rich-content-display prose prose-blue max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: showFullDescription
                        ? enhanceHTMLForDisplay(productData?.details || productData?.specifiction || "No description available.")
                        : enhanceHTMLForDisplay(truncateHTML(productData?.details || productData?.specifiction || "")),
                    }}
                  />
                </div>
              )}

              {/* Table Info (Specifications) */}
              {showFullDescription && productData?.tableInfo && (
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

              {/* Show More/Less Button */}
              {(productData?.details?.length > 0 || productData?.specifiction?.length > 0 || productData?.tableInfo?.length > 0) && (
                <button
                  onClick={() => setShowFullDescription((prev) => !prev)}
                  className="mt-4 px-4  text-blue-600 hover:border-b-2 hover:border-blue-600 hover:text-blue-700   font-medium   transition-colors duration-200"
                >
                  {showFullDescription ? "Show Less" : "Show More"}
                </button>
              )}
            </div>
          </>
        )}
        
        <Marquee />
        <RecentProduct />
      </div>

      {/* Enhanced CSS for rich content display */}
      <style jsx>{`
        .rich-content-display {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #374151;
        }

        .rich-content-display ul {
          list-style-type: disc !important;
          margin: 16px 0 !important;
          padding-left: 24px !important;
        }

        .rich-content-display ol {
          list-style-type: decimal !important;
          margin: 16px 0 !important;
          padding-left: 24px !important;
        }

        .rich-content-display li {
          margin: 8px 0 !important;
          line-height: 1.6 !important;
          display: list-item !important;
        }

        .rich-content-display ul ul {
          list-style-type: circle !important;
          margin: 8px 0 !important;
        }

        .rich-content-display ul ul ul {
          list-style-type: square !important;
        }

        .rich-content-display ol ol {
          list-style-type: lower-alpha !important;
        }

        .rich-content-display ol ol ol {
          list-style-type: lower-roman !important;
        }

        .rich-content-display p {
          margin: 12px 0 !important;
          line-height: 1.6 !important;
        }

        .rich-content-display h1,
        .rich-content-display h2,
        .rich-content-display h3,
        .rich-content-display h4,
        .rich-content-display h5,
        .rich-content-display h6 {
          margin-top: 24px !important;
          margin-bottom: 16px !important;
          line-height: 1.3 !important;
          color: #1e40af !important;
        }

        .rich-content-display h1 { font-size: 1.5rem !important; font-weight: 700 !important; }
        .rich-content-display h2 { font-size: 1.25rem !important; font-weight: 600 !important; }
        .rich-content-display h3 { font-size: 1.125rem !important; font-weight: 600 !important; }

        .rich-content-display strong,
        .rich-content-display b {
          font-weight: 700 !important;
          color: #1f2937 !important;
        }

        .rich-content-display em,
        .rich-content-display i {
          font-style: italic !important;
        }

        .rich-content-display table {
          width: 100% !important;
          border-collapse: collapse !important;
          margin: 16px 0 !important;
          border: 1px solid #d1d5db !important;
        }

        .rich-content-display th,
        .rich-content-display td {
          border: 1px solid #d1d5db !important;
          padding: 12px !important;
          text-align: left !important;
        }

        .rich-content-display th {
          background-color: #f3f4f6 !important;
          font-weight: 600 !important;
        }

        .rich-content-display blockquote {
          border-left: 4px solid #3b82f6 !important;
          padding-left: 16px !important;
          margin: 16px 0 !important;
          font-style: italic !important;
          color: #4b5563 !important;
        }

        .rich-content-display div {
          margin: 8px 0 !important;
        }

        /* Ensure nested content displays properly */
        .rich-content-display > *:first-child {
          margin-top: 0 !important;
        }

        .rich-content-display > *:last-child {
          margin-bottom: 0 !important;
        }
      `}</style>
    </>
  );
}