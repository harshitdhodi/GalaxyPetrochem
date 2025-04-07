import React, { useEffect } from "react";

const SlideshowImages = ({
  imageSource,
  currentImageIndex,
  hoveredIndex,
  setHoveredIndex,
  lcpImageRef,
  lcpImageLoaded,
  setLcpImageLoaded
}) => {
  useEffect(() => {
    if (imageSource) {
      imageSource.forEach((item) => {
        const link = document.createElement("link");
        link.rel = "preload";
        link.href = item.image; // Construct URL dynamically
        link.as = "image";
        document.head.appendChild(link);
      });
    }
  }, [imageSource]);

  return (
    <div
      className="relative w-full h-[35vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden"
      style={{
        contain: "layout size",
        containIntrinsicSize: "1200px 800px",
        aspectRatio: "1200 / 800", // Reserve space to prevent layout shift
      }}
    >
      {imageSource &&
        imageSource.map((item, index) => {
          const isVisible = index === currentImageIndex;
          const isNextInQueue = index === (currentImageIndex + 1) % imageSource.length;

          if (!isVisible && !isNextInQueue) return null;

          return (
            <div
              key={item._id}
              className={`absolute inset-0 transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"
                }`}
              style={{ willChange: "opacity" }}
            >
              <img
                src={item.image}
                alt={item.altName || `Slide ${index + 1}`}
                className="w-full h-full object-fill"
                fetchPriority={isVisible ? "high" : "low"}
                // loading={isVisible ? "eager" : "lazy"}
                decoding={isVisible ? "sync" : "async"}
                width={1200}
                height={800}
                onLoad={() => index === 0 && setLcpImageLoaded(true)}
              />
            </div>
          );
        })}
    </div>
  );
};

export default SlideshowImages;
