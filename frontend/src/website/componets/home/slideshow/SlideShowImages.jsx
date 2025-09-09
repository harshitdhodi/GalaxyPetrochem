import React, { useState, useEffect, useRef } from "react";

// SlideshowImages component for displaying a responsive image slideshow
const SlideshowImages = ({
  imageSource = [], // Array of image objects
  currentImageIndex = 0, // Current image index
  hoveredIndex = null, // Hovered image index
  setHoveredIndex, // Callback to update hovered index
  lcpImageRef, // Ref for LCP image
  isSmallDevice, // Boolean for small device detection
  lcpImageLoaded, // Tracks LCP image load status
  setLcpImageLoaded, // Callback to update LCP load status
}) => {
  const [loadedImages, setLoadedImages] = useState({}); // Tracks loaded images
  const imageRef = useRef(null); // Ref for the active image

  // Handle image load completion
  const handleImageLoad = (index) => {
    setLoadedImages((prev) => ({ ...prev, [index]: true }));
    if (index === 0) {
      setLcpImageLoaded(true); // Mark LCP image as loaded
    }
  };

  // Preload images with optimized settings
  useEffect(() => {
    imageSource.forEach((item, index) => {
      if (item?.image) {
        const img = new Image();
        img.src = `/api/image/download/${item.image}?format=png`;
        img.onload = () => handleImageLoad(index);
        img.alt = item.title || `Slide ${index + 1}`;
        img.decoding = index <= 2 ? "sync" : "async"; // Sync for first 3 images
        img.fetchPriority = index <= 2 ? "high" : "low"; // High priority for first 3
      }
    });
  }, [imageSource]);

  // Determine active image index (hovered or current)
  const activeIndex = hoveredIndex !== null ? hoveredIndex : currentImageIndex;

  // Handle window resize for responsive image sizing
  useEffect(() => {
    const handleResize = () => {
      if (!imageRef.current || !imageRef.current.parentElement) return;
      const parent = imageRef.current.parentElement;
      imageRef.current.style.width = `${parent.clientWidth}px`;
      imageRef.current.style.height = `${parent.clientHeight}px`;
    };

    handleResize();
    const debouncedResize = debounce(handleResize, 100);
    window.addEventListener("resize", debouncedResize);

    return () => {
      window.removeEventListener("resize", debouncedResize);
    };
  }, []);

  // Debounce utility to throttle resize events
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Fallback UI for empty image source
  if (!imageSource || imageSource.length === 0) {
    return (
      <div className="relative w-full min-w-[300px] max-w-[1920px] h-[35vh] min-h-[250px] max-h-[800px] sm:h-[50vh] md:h-[60vh] lg:h-[75vh] mx-auto overflow-hidden bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  // Active image details
  const activeImage = imageSource[activeIndex]?.image;
  const imageUrl = activeImage ? `/api/image/download/${activeImage}?format=png` : "";
  const altText = imageSource[activeIndex]?.title || `Slide ${activeIndex + 1}`;

  return (
    <div className="relative w-full min-w-[300px] max-w-[1920px] h-[50vh] min-h-[300px] max-h-[800px] md:h-[60vh] lg:h-[75vh] mx-auto overflow-hidden flex items-center justify-center bg-gray-100">
      {/* Active image */}
      <img
        ref={imageRef}
        src={imageUrl}
        alt={altText}
        className="w-full h-full object-cover object-center"
        style={{
          display: loadedImages[activeIndex] ? 'block' : 'none',
          minWidth: '100%',
          minHeight: '100%',
          objectFit: 'cover',
          objectPosition: 'center center'
        }}
        decoding={activeIndex <= 2 ? "sync" : "async"}
        fetchpriority={activeIndex <= 2 ? "high" : "low"}
        onLoad={() => handleImageLoad(activeIndex)}
      />

      {/* Enhanced responsive details overlay */}
      {loadedImages[activeIndex] && imageSource[activeIndex]?.details && (
        <div className="absolute inset-x-0 bottom-0 sm:left-0 sm:top-1/2 sm:-translate-y-1/2 sm:bottom-auto sm:inset-x-auto w-full sm:w-3/4 md:w-2/3 lg:w-1/2 p-3 sm:p-4 md:p-6 lg:p-8 text-white text-center sm:text-left">
          <div
            className="rich-content-display prose prose-blue max-w-none mx-auto sm:mx-0"
            dangerouslySetInnerHTML={{ __html: imageSource[activeIndex].details }}
          />
        </div>
      )}

      {/* Loading placeholder */}
      {!loadedImages[activeIndex] && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      )}

      {/* Enhanced responsive CSS for rich content display */}
      <style jsx>{`
        .rich-content-display {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #ffffff !important;
        }

        .rich-content-display * {
          color: inherit !important;
        }

        /* Mobile-first responsive typography */
        .rich-content-display h1 {
          font-size: 1.5rem !important; /* 24px */
          font-weight: 700 !important;
          margin: 1rem 0 !important;
          line-height: 1.3 !important;
        }

        .rich-content-display h2 {
          font-size: 1.5rem !important; /* 24px */
          font-weight: 600 !important;
          margin: 0.875rem 0 !important;
          line-height: 1.3 !important;
        }

        .rich-content-display h3 {
          font-size: 1.25rem !important; /* 20px */
          font-weight: 600 !important;
          margin: 0.75rem 0 !important;
          line-height: 1.4 !important;
        }

        .rich-content-display p {
          font-size: 1.25rem !important; /* 20px */
          margin: 0.75rem 0 !important;
          line-height: 1.5 !important;
        }

        /* Tablet responsive styles */
        @media (min-width: 640px) {
          .rich-content-display h1 {
            font-size: 1.875rem !important;
          }
          .rich-content-display h2 {
            font-size: 1.5rem !important;
          }
          .rich-content-display h3 {
            font-size: 1.25rem !important;
          }
          .rich-content-display p {
            font-size: 1rem !important;
          }
        }

        /* Desktop responsive styles */
        @media (min-width: 1024px) {
          .rich-content-display h1 {
            font-size: 2.25rem !important;
          }
          .rich-content-display h2 {
            font-size: 2rem !important;
          }
          .rich-content-display h3 {
            font-size: 1.5rem !important;
          }
          .rich-content-display p {
            font-size: 1.125rem !important;
          }
        }

        /* Ultra-small mobile screens */
        @media (max-width: 359px) {
          .rich-content-display,
          .rich-content-display * {
            font-size: 1.3rem !important; /* 10px */
            line-height: 1.3 !important;
          }
          .rich-content-display h1,
          .rich-content-display h2,
          .rich-content-display h3 {
            font-size: 1rem !important; /* 16px */
          }
          .rich-content-display p,
          .rich-content-display li {
            font-size: 0.5rem !important; /* 10px */
          }
          .absolute.inset-x-0.bottom-0 {
            padding: 0.5rem !important; /* Reduced padding */
          }
        }

        .rich-content-display ul {
          list-style-type: disc !important;
          margin: 12px 0 !important;
          padding-left: 20px !important;
        }

        .rich-content-display ol {
          list-style-type: decimal !important;
          margin: 12px 0 !important;
          padding-left: 20px !important;
        }

        .rich-content-display li {
          margin: 6px 0 !important;
          line-height: 1.5 !important;
        }
      `}</style>
    </div>
  );
};

export default SlideshowImages;