import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import React from "react"; 

const MediaFiles = ({ product, handleImageChange, handleFileChange }) => {
  const [imageMetadata, setImageMetadata] = useState(
    product.images.map((img) => ({
      altText: img.altText || "",
      title: img.title || "",
    })) || []
  );

  // Sync imageMetadata with product.images
  useEffect(() => {
    if (imageMetadata.length !== product.images.length) {
      setImageMetadata(
        product.images.map((img) => ({
          altText: img.altText || "",
          title: img.title || "",
        }))
      );
    }
  }, [product.images.length, imageMetadata.length]);

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImages = files.map((file) => ({
        file,
        url: URL.createObjectURL(file),
        altText: "",
        title: "",
      }));
      handleImageChange(newImages);
    }
  };

  const handleMetadataChange = (index, field, value) => {
    // Update local state
    const updatedMetadata = [...imageMetadata];
    updatedMetadata[index] = {
      ...updatedMetadata[index],
      [field]: value,
    };
    setImageMetadata(updatedMetadata);

    // Update the images array in the parent component
    const updatedImages = [...product.images];
    updatedImages[index] = {
      ...updatedImages[index],
      [field]: value
    };
    
    handleImageChange(updatedImages, true);
  };

  return (
    <Card className="p-6 space-y-6">
      <h3 className="text-lg font-semibold">Media Files</h3>

      {/* Image Upload Section */}
      <div className="space-y-4">
        <Label className="text-lg font-semibold">Upload Product Images</Label>
        <Input
          type="file"
          id="imageUpload"
          accept="image/*"
          onChange={handleFileInputChange}
          multiple
        />
        <p className="text-sm text-gray-500">You can select multiple images</p>
      </div>

      {/* Image Previews and Metadata */}
      {product.images.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700">Selected Images</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.images.map((image, index) => (
              <div key={index} className="border p-4 rounded-md">
                <img
                  src={image.url}
                  alt={image.altText || "Product image preview"}
                  className="w-full h-24 object-cover rounded mb-4"
                />
                <div className="space-y-2">
                  <div>
                    <Label htmlFor={`altText-${index}`} className="block text-sm font-medium">
                      Alt Text for Image {index + 1}
                    </Label>
                    <Input
                      id={`altText-${index}`}
                      type="text"
                      value={imageMetadata[index]?.altText || ""}
                      onChange={(e) => handleMetadataChange(index, "altText", e.target.value)}
                      placeholder="Enter alt text"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`imgTitle-${index}`} className="block text-sm font-medium">
                      Title for Image {index + 1}
                    </Label>
                    <Input
                      id={`imgTitle-${index}`}
                      type="text"
                      value={imageMetadata[index]?.title || ""}
                      onChange={(e) => handleMetadataChange(index, "title", e.target.value)}
                      placeholder="Enter image title"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PDF and MSDS Uploads */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="pdf" className="block text-sm font-medium">
            PDF Document
          </Label>
          <Input
            id="pdf"
            type="file"
            name="pdf"
            onChange={handleFileChange}
            accept=".pdf"
          />
        </div>
        <div>
          <Label htmlFor="msds" className="block text-sm font-medium">
            MSDS Document
          </Label>
          <Input
            id="msds"
            type="file"
            name="msds"
            onChange={handleFileChange}
            accept=".pdf"
          />
        </div>
      </div>
    </Card>
  );
};

export default React.memo(MediaFiles);