import React from "react";

const SlideshowImages = ({ setLcpImageLoaded }) => {
  const staticImage = "https://ik.imagekit.io/mikbqwyy0/img-01.jpg?updatedAt=1743741160411";

  return (
    <div className="relative w-full min-w-[300px] max-w-[1920px] h-[35vh] min-h-[250px] max-h-[800px] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] mx-auto overflow-hidden">
      <div className="absolute inset-0 transition-opacity duration-500 opacity-100 will-change-[opacity]">
        <img
          src={staticImage}
          alt="Static Slide"
          className=" min-w-full min-h-full max-w-[320px] max-h-[237px] object-cover"
          fetchPriority="high"
          decoding="sync"
          onLoad={() => setLcpImageLoaded && setLcpImageLoaded(true)}
        />
      </div>
    </div>
  );
};

export default SlideshowImages;