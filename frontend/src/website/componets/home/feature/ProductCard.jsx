// ProductCard.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Link
      to={`/${product.slug}`}
      className="overflow-hidden w-full lg:w-[250px] lg:h-[220px] md:w-full md:h-auto border hover:shadow-lg transition-shadow"
    >
      <div className="h-full flex flex-col items-center justify-between">
        <div className="relative w-full h-[50%] flex items-center justify-center">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
          )}
          <img
            alt={product.title}
            className="object-contain mt-16 w-full h-full"
            src={product.image}
            title={product.title}
            style={{
              opacity: imageLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out',
            }}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/path/to/default/image.jpg';
              setImageLoaded(true);
            }}
            loading="lazy"
          />
        </div>
        <div className="bg-[#3B5998] w-full p-2 text-center">
          <h3 className="text-white font-medium text-sm">{product.title}</h3>
        </div>
      </div>
    </Link>
  );
}
