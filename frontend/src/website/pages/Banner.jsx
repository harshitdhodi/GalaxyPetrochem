import React from 'react';

export function Banner({ imageUrl }) {
  return (
    <div className="relative w-full h-[30vh] lg:h-[250px]">
      <img 
        src={imageUrl}
        alt="Banner"
        className="w-full h-full object-fill"
      />
    </div>
  );
} 