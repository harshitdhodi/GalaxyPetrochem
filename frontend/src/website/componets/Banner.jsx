import React from 'react';

const formatText = (text) => {
  if (!text) return '';
  return text
    .split(/[-\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export function Banner({ imageUrl, title }) {
  const formattedTitle = formatText(title);
  
  return (
    <div className="relative w-full h-[30vh] lg:h-[250px]">
      {/* Banner Image */}
      <img 
        src={imageUrl}
        alt="Banner"
        className="w-full h-full object-cover" // Changed to object-cover for better aspect ratio
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      {/* Centered Title */}
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-white text-2xl md:text-4xl font-bold text-center">
          {formattedTitle}
        </h1>
      </div>
    </div>
  );
}
