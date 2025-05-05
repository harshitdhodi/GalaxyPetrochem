import React, { useState, useEffect } from "react";

const SlideshowImages = ({
  imageSource = [],
  currentImageIndex = 0,
  hoveredIndex = null,
  setHoveredIndex,
  lcpImageRef,
  isSmallDevice,
  lcpImageLoaded,
  setLcpImageLoaded
}) => {
  const [loadedImages, setLoadedImages] = useState({});
  console.log("Loaded images:", loadedImages);

  // Handle image loading
  const handleImageLoad = (index) => {
    setLoadedImages((prev) => ({ ...prev, [index]: true }));
    if (index === 0) {
      setLcpImageLoaded(true);
    }
  };

  // Determine active index for display
  const activeIndex = hoveredIndex !== null ? hoveredIndex : currentImageIndex;

  // Empty state handling
  if (!imageSource || imageSource.length === 0) {
    return (
      <div className="relative w-full min-w-[300px] max-w-[1920px] h-[35vh] min-h-[250px] max-h-[800px] sm:h-[50vh] md:h-[60vh] lg:h-[75vh] mx-auto overflow-hidden bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full min-w-[300px] max-w-[1920px] min-h-[250px] max-h-[800px] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] mx-auto overflow-hidden">
      {imageSource.map((item, index) => {
        const isActive = index === activeIndex;
        const imagePath = item?.image ? `/api/image/download/${item.image}` : "";

        return (
          <div
            key={`slide-${index}`}
            className={`absolute inset-0 transition-opacity duration-500 will-change-[opacity] ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={imagePath}
              alt={item.title || `Slide ${index + 1}`}
              ref={index === 0 ? lcpImageRef : null}
              className="w-full h-full object-fill" // Ensure image fills the container without preserving aspect ratio
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "low"}
              decoding={index === 0 ? "sync" : "async"}
              onLoad={() => handleImageLoad(index)}
            />
          </div>
        );
      })}
    </div>
  );
};

export default SlideshowImages;
