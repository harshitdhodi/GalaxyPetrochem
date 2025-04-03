import React from "react";

const SlideshowControls = ({ 
  imageSource, 
  currentImageIndex, 
  setCurrentImageIndex,
  lcpImageLoaded 
}) => {
  return (
    <div
      className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 ${!lcpImageLoaded ? "hidden" : ""}`}
      style={{ contain: 'layout style' }}
    >
      {imageSource && imageSource.map((_, index) => (
        <button
          key={index}
          onClick={() => setCurrentImageIndex(index)}
          className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${index === currentImageIndex ? "bg-orange-500" : "bg-gray-300"}`}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default SlideshowControls;