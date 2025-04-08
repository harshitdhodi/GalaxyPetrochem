import React from "react";

const SlideshowImages = ({ setLcpImageLoaded }) => {
  const staticImage = "https://ik.imagekit.io/mikbqwyy0/img-01.jpg?updatedAt=1743741160411";

  return (
    <div
      className="relative w-full h-[35vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden"
      style={{
        contain: "layout size",
        containIntrinsicSize: "1200px 800px",
        aspectRatio: "1200 / 800",
      }}
    >
      <div className="absolute inset-0 transition-opacity duration-500 opacity-100" style={{ willChange: "opacity" }}>
        <img
          src={staticImage}
          alt="Static Slide"
          className="w-full h-full object-fill 
                     min-w-full max-w-[320px] min-h-full max-h-[234px]"
          fetchPriority="high"
          decoding="sync"
          onLoad={() => setLcpImageLoaded && setLcpImageLoaded(true)}
        />
      </div>
    </div>
  );
};

export default SlideshowImages;
