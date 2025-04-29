import React from 'react';
import { Trash2 } from 'lucide-react';
const ImagesForm = ({ formData, setFormData }) => {
  // Add a new empty image
  const addImage = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, { file: null, url: '', altText: '', title: '' }],
    }));
  };

  // Remove an image
  const removeImage = (index) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);

    setFormData((prev) => ({
      ...prev,
      images: updatedImages,
    }));
  };

  // Handle image file changes
  const handleImageFileChange = (index, file) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = {
      ...updatedImages[index],
      file,
      url: URL.createObjectURL(file), // Generate a preview URL for the image
    };

    setFormData((prev) => ({
      ...prev,
      images: updatedImages,
    }));
  };

  // Handle other image field changes (altText, title)
  const handleImageFieldChange = (index, field, value) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = {
      ...updatedImages[index],
      [field]: value,
    };

    setFormData((prev) => ({
      ...prev,
      images: updatedImages,
    }));
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Images</h2>
        <button
          type="button"
          onClick={addImage}
          className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600"
        >
          Add Image
        </button>
      </div>

      {formData.images.length === 0 ? (
        <p className="text-gray-500 italic">No images added</p>
      ) : (
        <div className="space-y-4">
          {formData.images.map((image, index) => (
            <div key={index} className="flex items-center gap-4">
              {/* File Input */}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageFileChange(index, e.target.files[0])}
                className="w-1/3 px-3 py-2 border border-gray-300 rounded-md"
              />

              {/* Image Preview */}
              {image.url && (
                <img
                  src={`/api/image/download/${image.url}`}
                  alt={image.altText || 'Image preview'}
                  className="w-16 h-16 object-cover rounded-md border"
                />
              )}

              {/* Alt Text Input */}
              <input
                type="text"
                placeholder="Alt Text"
                value={image.altText}
                onChange={(e) => handleImageFieldChange(index, 'altText', e.target.value)}
                className="w-1/3 px-3 py-2 border border-gray-300 rounded-md"
              />

              {/* Title Input */}
              <input
                type="text"
                placeholder="Title"
                value={image.title}
                onChange={(e) => handleImageFieldChange(index, 'title', e.target.value)}
                className="w-1/3 px-3 py-2 border border-gray-300 rounded-md"
              />

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2/>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImagesForm;