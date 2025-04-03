"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useGetBannerByPageSlugQuery } from "@/slice/banner/banner"
import { Link, useParams } from "react-router-dom"
import m2 from "../../images/m11.png"
import m1 from "../../images/m3.webp"

// Enhanced skeleton with better alignment to final content
const SkeletonLoader = () => (
  <div className="w-full h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] bg-gray-200 animate-pulse rounded overflow-hidden">
    <div className="absolute w-full top-1/2 transform -translate-y-1/2 px-4 sm:px-[15%]">
      <div className="w-32 h-10 bg-gray-300 animate-pulse rounded" />
    </div>
  </div>
)

// Add this at the top level to immediately begin preloading the LCP image
// This happens before React even hydrates
if (typeof window !== 'undefined') {
  // Detect if device is small
  const isSmallDevice = window.innerWidth < 640;

  // Immediately preload the appropriate LCP image based on device size
  const lcpImageSrc = isSmallDevice ?
    // Use the imported static image path
    new URL('../../images/m3.webp', import.meta.url).href :
    // Or API path for larger devices - adjust the URL as needed for your environment
    new URL('/api/image/download/first-banner-image-id', window.location.origin).href;

  // Create and append preload link to head - this happens before React rendering
  const preloadLink = document.createElement('link');
  preloadLink.rel = 'preload';
  preloadLink.as = 'image';
  preloadLink.href = lcpImageSrc;
  preloadLink.fetchPriority = 'high';
  preloadLink.importance = 'high';
  document.head.appendChild(preloadLink);

  // Also preconnect to API domain
  const preconnectLink = document.createElement('link');
  preconnectLink.rel = 'preconnect';
  preconnectLink.href = new URL('/api', window.location.href).origin;
  preconnectLink.crossOrigin = 'anonymous';
  document.head.appendChild(preconnectLink);
}

const Slideshow = () => {
  const { pageSlug } = useParams()
  const slug = pageSlug || "/"
  const { data: banners, isLoading } = useGetBannerByPageSlugQuery(slug)

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [imagesLoaded, setImagesLoaded] = useState({})
  const [lcpImageLoaded, setLcpImageLoaded] = useState(false)
  const [isSmallDevice, setIsSmallDevice] = useState(false)
  const lcpImageRef = useRef(null)
  const slideshowRef = useRef(null)

  // Check if device is small (based on screen width)
  useEffect(() => {
    const checkDeviceSize = () => {
      setIsSmallDevice(window.innerWidth < 640);
    };

    // Check on initial load
    checkDeviceSize();

    // Add event listener for resize
    window.addEventListener('resize', checkDeviceSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkDeviceSize);
  }, []);

  // Load Delay Optimization - Simplified
  useEffect(() => {
    if (isSmallDevice) {
      setLcpImageLoaded(true);
      setImagesLoaded((prev) => ({ ...prev, 0: true }));
    } else if (Array.isArray(banners) && banners.length > 0) {
      const lcpImage = banners[0];
      if (lcpImage) {
        const imagePath = `/api/image/download/${lcpImage.image}`;
        const img = new Image();
        img.src = imagePath;
        img.onload = () => {
          setLcpImageLoaded(true);
          setImagesLoaded((prev) => ({ ...prev, 0: true }));
        };
      }
    }
  }, [banners, isSmallDevice]);

  // Only preload next image for small devices or next image for larger devices
  // IMPORTANT: Reduced from preloading 2 images to just 1 next image to reduce contention
  useEffect(() => {
    if (!lcpImageLoaded) return;

    // Delay loading the next image by 500ms to prioritize the LCP image
    const timeoutId = setTimeout(() => {
      if (isSmallDevice) {
        const img = new Image();
        img.src = m2;
        img.fetchPriority = "low";
        img.onload = () => {
          setImagesLoaded((prev) => ({ ...prev, 1: true }));
        };
      } else if (Array.isArray(banners) && banners.length > 1) {
        // Only preload the next image to avoid resource contention
        const img = new Image();
        img.src = `/api/image/download/${banners[1].image}`;
        img.fetchPriority = "low";
        img.onload = () => {
          setImagesLoaded((prev) => ({ ...prev, 1: true }));
        };
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [banners, lcpImageLoaded, isSmallDevice]);

  // Slideshow interval - unchanged
  useEffect(() => {
    if (!lcpImageLoaded) return;

    if (isSmallDevice) {
      let animationFrameId;
      let lastTimestamp = 0;
      const intervalDuration = 3000;

      const animate = (timestamp) => {
        if (!lastTimestamp) lastTimestamp = timestamp;

        if (timestamp - lastTimestamp >= intervalDuration) {
          setCurrentImageIndex((prevIndex) => (prevIndex + 1) % 2);
          lastTimestamp = timestamp;
        }

        animationFrameId = requestAnimationFrame(animate);
      };

      animationFrameId = requestAnimationFrame(animate);

      return () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      };
    }

    if (!Array.isArray(banners)) return;

    let animationFrameId;
    let lastTimestamp = 0;
    const intervalDuration = 3000;

    const animate = (timestamp) => {
      if (!lastTimestamp) lastTimestamp = timestamp;

      if (timestamp - lastTimestamp >= intervalDuration) {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % banners.length);
        lastTimestamp = timestamp;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [banners, lcpImageLoaded, isSmallDevice]);

  // Render Delay Optimization
  useEffect(() => {
    if (slideshowRef.current && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.style.contentVisibility = 'visible';
            } else {
              entry.target.style.contentVisibility = 'auto';
            }
          });
        },
        { rootMargin: '200px 0px' }
      );

      observer.observe(slideshowRef.current);

      return () => {
        if (slideshowRef.current) {
          observer.unobserve(slideshowRef.current);
        }
      };
    }
  }, []);

  // LCP Measurement
  useEffect(() => {
    if (typeof PerformanceObserver !== "undefined") {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log("LCP:", lastEntry.startTime,
          "Element:", lastEntry.element,
          "Size:", lastEntry.size,
          "ID:", lastEntry.id,
          "URL:", lastEntry.url);
      });

      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });

      const resourceObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
          if ((entry.name.includes('/api/image/download/') ||
            entry.name.includes('m1.jpg') ||
            entry.name.includes('m2.jpg')) &&
            entry.initiatorType === 'img') {
            console.log('Image timing:', {
              name: entry.name,
              duration: entry.duration,
              transferSize: entry.transferSize,
              encodedBodySize: entry.encodedBodySize,
              decodedBodySize: entry.decodedBodySize
            });
          }
        });
      });

      resourceObserver.observe({ type: "resource", buffered: true });

      return () => {
        lcpObserver.disconnect();
        resourceObserver.disconnect();
      };
    }
  }, []);

  if ((isLoading || !Array.isArray(banners)) && !isSmallDevice) {
    return <SkeletonLoader />;
  }

  if (!isSmallDevice && banners?.length === 0) return <div>No banners available</div>;

  const staticImages = [
    { _id: 'static-1', image: m1, title: 'Image 1', altName: 'Static Image 1' },
    { _id: 'static-2', image: m2, title: 'Image 2', altName: 'Static Image 2' }
  ];

  const imageSource = isSmallDevice ? staticImages : banners;

  return (
    <div className="relative" ref={slideshowRef}>
      {/* Skeleton shows until first image loads */}
      {!lcpImageLoaded && <SkeletonLoader />}

      <div
        className={`relative w-full h-[35vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden ${!lcpImageLoaded ? "hidden" : ""}`}
        style={{
          contain: 'layout size',
          containIntrinsicSize: '1200px 800px'
        }}
      >
        {imageSource && imageSource.map((item, index) => {
          // Only render visible image and next image
          const isVisible = index === currentImageIndex;
          const isNextInQueue = isSmallDevice
            ? index === (currentImageIndex + 1) % 2
            : index === (currentImageIndex + 1) % imageSource.length;

          if (!isVisible && !isNextInQueue && index > 0) return null;

          return (
            <div
              key={item._id}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentImageIndex ? "opacity-100" : "opacity-0"}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                willChange: isVisible || isNextInQueue ? 'opacity' : 'auto',
                contain: isVisible || isNextInQueue ? 'none' : 'strict'
              }}
            >
              <img
                ref={index === 0 ? lcpImageRef : null}
                src={isSmallDevice ? item.image : `/api/image/download/${item.image}`}
                alt={item.altName || `Slide ${index + 1}`}
                className="w-full h-full object-cover"
                title={hoveredIndex === index ? item.title : ""}
                fetchPriority={index === 0 ? "high" : "low"}
                loading={index === 0 ? "eager" : "lazy"}
                decoding={index === 0 ? "sync" : "async"}
                width={1200}
                height={800}
                importance={index === 0 ? "high" : "low"}
                sizes="100vw"
                onLoad={() => {
                  if (index === 0) {
                    setLcpImageLoaded(true);
                    if (window.performance && window.performance.now) {
                      const loadTime = window.performance.now();
                      console.log(`First image loaded in ${loadTime}ms`);
                    }
                  }
                }}
                style={{
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden'
                }}
              />
            </div>
          );
        })}
      </div>

      <div
        className={`absolute w-full top-1/2 transform -translate-y-1/2 px-4 sm:px-[15%] ${!lcpImageLoaded ? "hidden" : ""}`}
      >
        <Link to="/introduction">
          <Button className="bg-orange-500 hover:bg-orange-600 text-xs sm:text-sm md:text-base font-medium sm:font-bold px-3 py-1 sm:px-4 sm:py-2 md:px-5 relative -bottom-52 md:py-2 sm:flex items-center sm:mb-16 hidden gap-1 sm:gap-2">
            <span>Read More</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </Button>
        </Link>
      </div>

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
    </div>
  );
};

export default Slideshow;