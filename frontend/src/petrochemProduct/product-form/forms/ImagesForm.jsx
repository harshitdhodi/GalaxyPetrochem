import React, { useEffect } from 'react';
import { Trash2 } from 'lucide-react';

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB in bytes

const ImagesForm = ({ formData, setFormData }) => {
  // Generate a unique name for the image
  const generateImageName = () => `${Date.now()}.png`;

  // Initialize with single empty image if not present
  React.useEffect(() => {
    if (!formData.images || formData.images.length === 0) {
      setFormData((prev) => ({
        ...prev,
        images: [{ file: null, url: '', altText: '', title: '', name: generateImageName() }],
      }));
    }
  }, []);

  // Remove and reset the single image
  const removeImage = () => {
    const image = formData.images[0];

    // Revoke object URL if it exists and is a blob URL
    if (image?.url && image.url.startsWith('blob:')) {
      URL.revokeObjectURL(image.url);
    }

    setFormData((prev) => ({
      ...prev,
      images: [{ file: null, url: '', altText: '', title: '', name: generateImageName() }],
    }));
  };

  // Handle image file changes with size validation
  const handleImageFileChange = (file) => {
    if (!file) return;

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      alert(
        `File "${file.name}" is too large (${(file.size / 1024 / 1024).toFixed(2)} MB).\n` +
        `Maximum allowed size is 1MB.`
      );
      return; // skip update
    }

    // Revoke previous blob URL if it exists
    if (formData.images[0]?.url && formData.images[0].url.startsWith('blob:')) {
      URL.revokeObjectURL(formData.images[0].url);
    }

    setFormData((prev) => ({
      ...prev,
      images: [{
        file,                    // Store the file object
        url: URL.createObjectURL(file), // Generate preview
        altText: prev.images[0]?.altText || '',
        title: prev.images[0]?.title || '',
        name: prev.images[0]?.name || generateImageName(),
      }],
    }));
  };

  // Handle text field changes (altText, title)
  const handleImageFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      images: [{
        ...prev.images[0],
        [field]: value,
      }],
    }));
  };

  // Cleanup object URLs on unmount or when images change significantly
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
        <h2 className="text-lg font-semibold">Image</h2>
      </div>

      {formData.images && formData.images[0] && (
        <div className="flex items-center gap-4">
          {/* File Input */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageFileChange(e.target.files[0])}
            className="w-1/3 px-3 py-2 border border-gray-300 rounded-md"
          />

          {/* Image Preview */}
          {formData.images[0].url && (
            <div className="w-16 h-16 flex-shrink-0">
              <img
                src={
                  formData.images[0].file
                    ? formData.images[0].url
                    : formData.images[0].url.startsWith('http')
                    ? formData.images[0].url
                    : `/api/image/download/${formData.images[0].url}`
                }
                alt={formData.images[0].altText || 'Image preview'}
                className="w-full h-full object-cover rounded-md border"
                onError={(e) => {
                  if (!formData.images[0].file && !formData.images[0].url.startsWith('http')) {
                    e.target.src = formData.images[0].url;
                  }
                }}
                loading="lazy"
              />
            </div>
          )}

          {/* Alt Text Input */}
          <input
            type="text"
            placeholder="Alt Text"
            value={formData.images[0].altText || ''}
            onChange={(e) => handleImageFieldChange('altText', e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
          />

          {/* Title Input */}
          <input
            type="text"
            placeholder="Title"
            value={formData.images[0].title || ''}
            onChange={(e) => handleImageFieldChange('title', e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
          />

          {/* Remove Button */}
          {/* <button
            type="button"
            onClick={() => removeImage()}
            className="text-red-500 hover:text-red-700"
            aria-label="Remove image"
          >
            <Trash2 size={20} />
          </button> */}
        </div>
      )}

      <p className="text-sm text-gray-500 mt-3">
        Maximum file size: 1MB per image
      </p>
    </div>
  );
};

export default ImagesForm;