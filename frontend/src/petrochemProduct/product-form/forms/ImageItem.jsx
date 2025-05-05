// src/components/petrochemical/forms/ImageItem.jsx
import React from 'react';

const ImageItem = ({ image, index, handleImageChange, removeImage }) => {
  return (
    <div className="border border-gray-200 p-3 rounded-md">
      <div className="flex justify-between mb-2">
        <h3 className="font-medium">Image {index + 1}</h3>
        <button
          type="button"
          onClick={() => removeImage(index)}
          className="text-red-500 text-sm"
        >
          Remove
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm text-gray-700 mb-1">URL</label>
          <input
            type="text"
            value={image.url || ''}
            onChange={(e) => handleImageChange(index, 'url', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-700 mb-1">Alt Text</label>
          <input
            type="text"
            value={image.altText || ''}
            onChange={(e) => handleImageChange(index, 'altText', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={image.title || ''}
            onChange={(e) => handleImageChange(index, 'title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      
      {/* Image Preview */}
      {image.url && (
        <div className="mt-3">
          <label className="block text-sm text-gray-700 mb-1">Preview</label>
          <div className="border border-gray-200 rounded p-2 bg-white">
            <img 
              src={`/api/image/download/${image.url}`} 
              alt={image.altText || "Product image"} 
              className="max-h-32 object-contain mx-auto"
              onError={(e) => {
                e.target.src = "/placeholder-image.jpg"; // Fallback image
                e.target.onerror = null;
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageItem;