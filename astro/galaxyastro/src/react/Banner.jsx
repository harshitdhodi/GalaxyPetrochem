// BannerSliderClient.jsx
"use client"

import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BannerSliderClient = ({ banners = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
// console.log(banners)
  // Auto-slide functionality
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [banners.length]);

  // Navigation functions
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? banners.length - 1 : prevIndex - 1));
  }, [banners.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  }, [banners.length]);

  const goToSlide = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  // If no banners available, show empty state
  if (banners.length === 0) {
    return (
      <div className="relative w-full h-[400px] bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">No banner images available</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] overflow-hidden">
      {/* Banner Images */}
      <div 
        className="flex transition-transform duration-500 ease-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <div 
            key={banner.id || index} 
            className="min-w-full h-full relative"
          >
            <img
              src={banner.image}
              alt={banner.title || `Banner ${index + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-l0rYAAkLBQqmle2NMDsVQDqoq1DsvP.png"; // Fallback image
              }}
            />
            
            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/50 to-transparent">
              {banner.title && (
                <h2 className="text-white text-2xl md:text-3xl font-bold mb-2">{banner.title}</h2>
              )}
              {banner.description && (
                <p className="text-white text-sm md:text-base mb-4 max-w-md">{banner.description}</p>
              )}
              {banner.link && (
                <a 
                  href={banner.link} 
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded inline-flex items-center w-fit transition-colors"
                >
                  Read More
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button 
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button 
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dots Navigation */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? 'bg-orange-500' : 'bg-white/70 hover:bg-white'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BannerSliderClient;