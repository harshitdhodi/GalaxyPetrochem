import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Marquee = () => {
  const [marqueeData, setMarqueeData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch marqueeData from /api/brand
  useEffect(() => {
    const fetchMarqueeData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/brand');
      
        if (!response.ok) {
          throw new Error('Failed to fetch marquee data');
        }
        const responseData = await response.json();
        console.log('Response:', responseData.data);
        const dataArray = responseData.data || [];
        console.log('Fetched marqueeData:', dataArray);
        setMarqueeData(dataArray);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching marquee data:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchMarqueeData();
  }, []);

  // Duplicate marqueeData for seamless looping
  const combinedServices = Array.isArray(marqueeData)
    ? [...marqueeData, ...marqueeData]
    : [];

  // Group logos into sets of 5 for grid display
  const groupedLogos = [];
  for (let i = 0; i < combinedServices.length; i += 5) {
    groupedLogos.push(combinedServices.slice(i, i + 5));
  }

  return (
    <div className="relative w-full pt-10 container mx-auto overflow-hidden">
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-${100 * (marqueeData.length / 5)}%); }
          }
          .marquee-container {
            display: flex;
            animation: marquee ${marqueeData.length * 4}s linear infinite;
          }
          .marquee-grid {
            flex: 0 0 100%;
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            grid-template-rows: repeat(1, 1fr);
            gap: 3rem;
            padding: 1rem;
          }
          .marquee-item {
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .marquee-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
          }
          .marquee-container:hover {
            animation-play-state: paused;
          }
        `}
      </style>
      <div className="mb-5">
        <h2 className="text-2xl lg:text-3xl font-bold mb-2 text-blue-900">
          Our Brands
        </h2>
        <div className="w-24 h-1 bg-blue-800"></div>
      </div>
      <div className="relative my-5 bg-gradient-to-l from-[#2860da] to-[#9e5d94] overflow-hidden">
        {isLoading ? (
          <div className="grid grid-cols-4 gap-4 p-4">
            {[...Array(4)].map((_, index) => (
              <span
                key={index}
                className="text-xl font-semibold text-gray-500 animate-pulse flex items-center justify-center"
              >
                Loading... <span className="text-gray-400 text-3xl pl-4">●</span>
              </span>
            ))}
          </div>
        ) : error ? (
          <span className="text-xl font-semibold text-red-500">Error: {error}</span>
        ) : groupedLogos.length > 0 ? (
          <div className="marquee-container">
            {groupedLogos.map((group, groupIndex) => (
              <div key={groupIndex} className="marquee-grid">
                {group.map((brand, index) => (
                  <Link
                    key={`${brand._id}-${groupIndex}-${index}`}
                    to={`/brands/${brand.slug}`}
                    className="marquee-item bg-white p-5 px-10 my-6"
                    aria-label={`View ${brand.name} products`}
                  >
                    <img
                      src={`/api/logo/download/${brand.photo}`}
                      alt={brand.name}
                      className="h-auto w-full object-contain max-h-20"
                    />
                  </Link>
                ))}
                {/* Fill empty grid cells if less than 5 logos in a group */}
                {group.length < 5 &&
                  [...Array(5 - group.length)].map((_, index) => (
                    <div key={`empty-${index}`} className="marquee-item" />
                  ))}
              </div>
            ))}
          </div>
        ) : (
          <span className="text-xl font-semibold text-gray-500">No images available</span>
        )}
      </div>
    </div>
  );
};

export default Marquee;