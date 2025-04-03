"use client"

import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useGetBannerByPageSlugQuery } from "@/slice/banner/banner";

import SkeletonLoader from "./SkeletonLoader";
import SlideshowImages from "./SlideShowImages";
import SlideshowControls from "./SlideShowControlles";
import ReadMoreButton from "./ReadMoreButton";
import { preloadResources } from "./PreLoad";

if (typeof window !== "undefined") {
  preloadResources();
}

const Slideshow = () => {
  const { pageSlug } = useParams();
  const slug = pageSlug || "/";
  const { data: banners, isLoading } = useGetBannerByPageSlugQuery(slug);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [lcpImageLoaded, setLcpImageLoaded] = useState(false);
  const [isSmallDevice, setIsSmallDevice] = useState(false);
  const lcpImageRef = useRef(null);
  const slideshowRef = useRef(null);

  useEffect(() => {
    const checkDeviceSize = () => {
      setIsSmallDevice(window.innerWidth < 640);
    };
    checkDeviceSize();
    window.addEventListener("resize", checkDeviceSize);
    return () => window.removeEventListener("resize", checkDeviceSize);
  }, []);

  useEffect(() => {
    if (isSmallDevice) {
      setLcpImageLoaded(true);
      setImagesLoaded((prev) => ({ ...prev, 0: true }));
    } else if (Array.isArray(banners) && banners.length > 0) {
      const lcpImage = banners[0];
      if (lcpImage) {
        const imagePath = `/api/image/download/${lcpImage.photo || lcpImage.image}`;

        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "image";
        link.href = imagePath;
        document.head.appendChild(link);

        const img = new Image();
        img.src = imagePath;
        img.onload = () => {
          setLcpImageLoaded(true);
          setImagesLoaded((prev) => ({ ...prev, 0: true }));
        };
      }
    }
  }, [banners, isSmallDevice]);

  useEffect(() => {
    if (!lcpImageLoaded) return;

    setTimeout(() => {
      if (Array.isArray(banners) && banners.length > 1) {
        const nextImageSrc = banners[1]?.photo || banners[1]?.image;
        if (nextImageSrc) {
          const img = new Image();
          img.src = `/api/image/download/${nextImageSrc}`;
          img.loading = "lazy";
          img.fetchPriority = "low";
          img.onload = () => {
            setImagesLoaded((prev) => ({ ...prev, 1: true }));
          };
        }
      }
    }, 500);
  }, [banners, lcpImageLoaded]);

  if ((isLoading || !Array.isArray(banners)) && !isSmallDevice) {
    return <SkeletonLoader />;
  }

  if (!isSmallDevice && banners?.length === 0) return <div>No banners available</div>;

  const imageSource = banners?.map((banner) => ({
    ...banner,
    image: banner.photo || banner.image,
  }));

  return (
    <div className="relative" ref={slideshowRef}>
      {!lcpImageLoaded && <SkeletonLoader />}

      <SlideshowImages
        imageSource={imageSource}
        currentImageIndex={currentImageIndex}
        hoveredIndex={hoveredIndex}
        setHoveredIndex={setHoveredIndex}
        lcpImageRef={lcpImageRef}
        isSmallDevice={isSmallDevice}
        lcpImageLoaded={lcpImageLoaded}
        setLcpImageLoaded={setLcpImageLoaded}
      />

      <ReadMoreButton lcpImageLoaded={lcpImageLoaded} />

      <SlideshowControls
        imageSource={imageSource}
        currentImageIndex={currentImageIndex}
        setCurrentImageIndex={setCurrentImageIndex}
        lcpImageLoaded={lcpImageLoaded}
      />
    </div>
  );
};

export default Slideshow;