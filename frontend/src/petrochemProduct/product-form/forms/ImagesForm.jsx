import React, { useEffect } from 'react';
import { Trash2 } from 'lucide-react';

const ImagesForm = ({ formData, setFormData }) => {
  // Generate a unique name for the image
  const generateImageName = () => `${Date.now()}.png`;

  // Add a new empty image
  const addImage = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, { file: null, url: '', altText: '', title: '', name: generateImageName() }],
    }));
  };

  // Remove an image
  const removeImage = (index) => {
    const updatedImages = [...formData.images];
    const [removedImage] = updatedImages.splice(index, 1);

    // Revoke object URL if it exists and is a blob URL
    if (removedImage.url && removedImage.url.startsWith('blob:')) {
      URL.revokeObjectURL(removedImage.url);
    }

    setFormData((prev) => ({
      ...prev,
      images: updatedImages,
    }));
  };

  // Handle image file changes
  const handleImageFileChange = (index, file) => {
    if (!file) return;

    const updatedImages = [...formData.images];

    // Revoke the previous object URL if it exists and is a blob URL
    if (updatedImages[index].url && updatedImages[index].url.startsWith('blob:')) {
      URL.revokeObjectURL(updatedImages[index].url);
    }

    updatedImages[index] = {
      ...updatedImages[index],
      file, // Store the file object
      url: URL.createObjectURL(file), // Generate a preview URL
      name: updatedImages[index].name || generateImageName(), // Ensure name is set
    };

    setFormData((prev) => ({
      ...prev,
      images: updatedImages,
    }));
  };

  // Handle text field changes (altText, title)
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

  // Cleanup object URLs on component unmount
  useEffect(() => {
    return () => {
      formData.images.forEach((image) => {
        if (image.url && image.url.startsWith('blob:')) {
          URL.revokeObjectURL(image.url);
        }
      });
    };
  }, [formData.images]);

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
                <div className="w-16 h-16 flex-shrink-0">
                  <img
                    src={image.url}
                    alt={image.altText || 'Image preview'}
                    className="w-full h-full object-cover rounded-md border"
                  />
                </div>
              )}

              {/* Alt Text Input */}
              <input
                type="text"
                placeholder="Alt Text"
                value={image.altText || ''}
                onChange={(e) => handleImageFieldChange(index, 'altText', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
              />

              {/* Title Input */}
              <input
                type="text"
                placeholder="Title"
                value={image.title || ''}
                onChange={(e) => handleImageFieldChange(index, 'title', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
              />

         

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="text-red-500 hover:text-red-700"
                aria-label="Remove image"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImagesForm;