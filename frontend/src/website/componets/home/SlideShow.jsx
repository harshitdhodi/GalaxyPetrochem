"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import SkeletonLoader from "./slideshow/SkeletonLoader";
import SlideshowImages from "./slideshow/SlideShowImages";
import SlideshowControls from "./slideshow/SlideShowControlles";
import ReadMoreButton from "./slideshow/ReadMoreButton";
import { preloadResources } from "./slideshow/PreLoad";

if (typeof window !== "undefined") {
  preloadResources();
}

const Slideshow = () => {
  const { pageSlug } = useParams();
  const slug = pageSlug || "/";
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [lcpImageLoaded, setLcpImageLoaded] = useState(false);
  const [isSmallDevice, setIsSmallDevice] = useState(false);
  const [isPaused, setIsPaused] = useState(false); // New state to pause auto-slide
  const lcpImageRef = useRef(null);
  const slideshowRef = useRef(null);

  // Fetch banners
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(`/api/banner/getByPageSlug?pageSlug=${encodeURIComponent(slug)}`);
        const data = await res.json();
        console.log(data);
        setBanners(data || []);
      } catch (error) {
        console.error("Failed to fetch banners:", error);
        setBanners([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, [slug]);

  // Check device size
  useEffect(() => {
    const checkDeviceSize = () => {
      setIsSmallDevice(window.innerWidth < 640);
    };
    checkDeviceSize();
    window.addEventListener("resize", checkDeviceSize);
    return () => window.removeEventListener("resize", checkDeviceSize);
  }, []);

  // Preload LCP image
  useEffect(() => {
    if (isSmallDevice) {
      setLcpImageLoaded(true);
      setImagesLoaded((prev) => ({ ...prev, 0: true }));
    } else if (Array.isArray(banners) && banners.length > 0) {
      const lcpImage = banners[0];
      if (lcpImage) {
        const imagePath = `/api/image/download/${lcpImage.photo || lcpImage.image}?v=${Date.now()}`;

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

  // Preload next image
  useEffect(() => {
    if (!lcpImageLoaded) return;

    setTimeout(() => {
      if (Array.isArray(banners) && banners.length > 1) {
        const nextImageSrc = banners[1]?.photo || banners[1]?.image;
        if (nextImageSrc) {
          const img = new Image();
          img.src = `/api/image/download/${nextImageSrc}`;
          img.fetchPriority = "low";
          img.onload = () => {
            setImagesLoaded((prev) => ({ ...prev, 1: true }));
          };
        }
      }
    }, 500);
  }, [banners, lcpImageLoaded]);

  // Auto-slide logic
  useEffect(() => {
    if (!lcpImageLoaded || isPaused || banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval); // Clean up interval on unmount
  }, [lcpImageLoaded, isPaused, banners.length]);

  // Pause auto-slide on hover
  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  // Resume auto-slide on mouse leave
  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  if ((isLoading || !Array.isArray(banners)) && !isSmallDevice) {
    return <SkeletonLoader />;
  }

  if (!isSmallDevice && banners?.length === 0) return <div>No banners available</div>;

  const imageSource = banners?.map((banner) => ({
    ...banner,
    image: banner.photo || banner.image,
  }));

  return (
    <div
      className="relative"
      ref={slideshowRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
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