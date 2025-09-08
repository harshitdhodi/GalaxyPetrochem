import React, { useState, useEffect, useRef } from "react";

const SlideshowImages = ({
  imageSource = [],
  currentImageIndex = 0,
  hoveredIndex = null,
  setHoveredIndex,
  lcpImageRef,
  isSmallDevice,
  lcpImageLoaded,
  setLcpImageLoaded,
}) => {
  const [loadedImages, setLoadedImages] = useState({});
  const canvasRef = useRef(null);
  const imageCache = useRef({});
  const animationFrameRef = useRef(null);

  const handleImageLoad = (index, img) => {
    setLoadedImages((prev) => ({ ...prev, [index]: true }));
    imageCache.current[index] = img;
    if (index === 0) {
      setLcpImageLoaded(true);
    }
  };

  useEffect(() => {
    imageSource.forEach((item, index) => {
      if (!imageCache.current[index] && item?.image) {
        const img = new Image();
        img.src = `/api/image/download/${item.image}?format=png`;
        img.onload = () => handleImageLoad(index, img);
        img.alt = item.title || `Slide ${index + 1}`;
        img.decoding = index <= 2 ? "sync" : "async";
        img.fetchPriority = index <= 2 ? "high" : "low";
      }
    });
  }, [imageSource]);

  const activeIndex = hoveredIndex !== null ? hoveredIndex : currentImageIndex;

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { colorSpace: "srgb" });
    const img = imageCache.current[activeIndex];

    if (img && loadedImages[activeIndex]) {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Set canvas opacity to 1 before drawing
      canvas.style.opacity = '1';
      
      // Set high-quality rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Calculate dimensions to maintain aspect ratio
      const canvasRatio = canvas.width / canvas.height;
      const imgRatio = img.width / img.height;
      let drawWidth, drawHeight, offsetX, offsetY;

      if (imgRatio > canvasRatio) {
        drawHeight = canvas.height;
        drawWidth = drawHeight * imgRatio;
        offsetX = (canvas.width - drawWidth) / 2;
        offsetY = 0;
      } else {
        drawWidth = canvas.width;
        drawHeight = drawWidth / imgRatio;
        offsetX = 0;
        offsetY = (canvas.height - drawHeight) / 2;
      }

      // Draw the image
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    } else {
      // If image not loaded yet, show a background color
      ctx.fillStyle = '#f5f5f5';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  // Handle window resize with debounce
  useEffect(() => {
    if (!canvasRef.current) return;

    const handleResize = () => {
      if (!canvasRef.current) return;
      const parent = canvasRef.current.parentElement;
      if (!parent) return;
      
      canvasRef.current.width = parent.clientWidth;
      canvasRef.current.height = parent.clientHeight;
      drawCanvas();
    };

    // Initial setup
    handleResize();
    
    // Debounce resize events
    const debouncedResize = debounce(handleResize, 100);
    window.addEventListener('resize', debouncedResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', debouncedResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Handle image changes and loading
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const animate = () => {
      drawCanvas();
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [activeIndex, loadedImages]);

  // Simple debounce function
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  if (!imageSource || imageSource.length === 0) {
    return (
      <div className="relative w-full min-w-[300px] max-w-[1920px] h-[35vh] min-h-[250px] max-h-[800px] sm:h-[50vh] md:h-[60vh] lg:h-[75vh] mx-auto overflow-hidden bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full min-w-[300px] max-w-[1920px] min-h-[250px] max-h-[700px] sm:h-[50vh] md:h-[60vh] lg:h-[75vh] mx-auto overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: "block" }}
      />
    </div>
  );
};

export default SlideshowImages;