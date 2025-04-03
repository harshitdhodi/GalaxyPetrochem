// CatalogueItem.jsx
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState } from 'react';

export default function CatalogueItem({ catalogue }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleDownload = () => {
    window.open(`/api/image/pdf/view/${catalogue.catalogue}`, '_blank');
  };

  return (
    <div>
      <h3 className="text-2xl font-bold mb-4">{catalogue.title}</h3>
      <div className="relative" style={{ width: '100px', height: '100px' }}>
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
        )}
        <img
          src={`/api/image/view/${catalogue.image}`}
          alt={catalogue.title}
          style={{ 
            width: '100px',
            opacity: imageLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out'
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
      <Button 
        className="w-[75%] bg-orange-500 hover:bg-orange-600 mt-2" 
        onClick={handleDownload}
      >
        DOWNLOAD BROCHURE
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}