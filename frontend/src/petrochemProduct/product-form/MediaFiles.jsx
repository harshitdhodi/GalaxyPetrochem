import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import React from "react";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB in bytes

const MediaFiles = ({ product, handleImageChange, handleFileChange }) => {
  const [imageMetadata, setImageMetadata] = useState(
    product.images.map((img) => ({
      altText: img.altText || "",
      title: img.title || "",
    })) || []
  );

  // Sync imageMetadata when product.images length changes
  useEffect(() => {
    if (imageMetadata.length !== product.images.length) {
      setImageMetadata(
        product.images.map((img) => ({
          altText: img.altText || "",
          title: img.title || "",
        }))
      );
    }
  }, [product.images.length]);

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const validFiles = [];
    const invalidFiles = [];

    files.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        invalidFiles.push(file.name);
      } else {
        validFiles.push(file);
      }
    });

    if (invalidFiles.length > 0) {
      alert(
        `The following file(s) exceed 1MB limit and were skipped:\n${invalidFiles.join("\n")}`
      );
    }

    if (validFiles.length > 0) {
      const newImages = validFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
        altText: "",
        title: "",
      }));
      handleImageChange(newImages);
    }

    // Reset input value so same file can be selected again if needed
    e.target.value = "";
  };

  const handleMetadataChange = (index, field, value) => {
    // Update local metadata state
    const updatedMetadata = [...imageMetadata];
    updatedMetadata[index] = {
      ...updatedMetadata[index],
      [field]: value,
    };
    setImageMetadata(updatedMetadata);

    // Update parent images array (metadata only - not replacing file/url)
    const updatedImages = [...product.images];
    updatedImages[index] = {
      ...updatedImages[index],
      [field]: value,
    };

    handleImageChange(updatedImages, true); // true = metadata update only
  };

  // Optional: Add size validation for PDF & MSDS too
  const handleDocumentChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert(`File "${file.name}" exceeds 1MB limit. Maximum allowed size is 1MB.`);
      e.target.value = ""; // clear input
      return;
    }

    // If valid → pass to parent handler
    handleFileChange(e);
  };

  return (
    <Card className="p-6 space-y-6">
      <h3 className="text-lg font-semibold">Media Files</h3>

      {/* Image Upload Section */}
      <div className="space-y-4">
        <Label className="text-lg font-semibold">Upload Single Product Image</Label>
        <Input
          type="file"
          id="imageUpload"
          accept="image/*"
          onChange={handleFileInputChange}
        />
        <p className="text-sm text-gray-500">
          Max 1MB per image 
        </p>
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
            onChange={handleDocumentChange}   // ← now validated
            accept=".pdf"
          />
          <p className="text-sm text-gray-500 mt-1">Max 1MB</p>
          {product.pdf && typeof product.pdf === "string" && (
            <p className="text-sm text-gray-500 mt-1">
              Current file:{" "}
              <a
                href={`/api/image/view/${product.pdf}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {product.pdf}
              </a>
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="msds" className="block text-sm font-medium">
            MSDS Document
          </Label>
          <Input
            id="msds"
            type="file"
            name="msds"
            onChange={handleDocumentChange}   // ← now validated
            accept=".pdf"
          />
          <p className="text-sm text-gray-500 mt-1">Max 1MB</p>
          {product.msds && typeof product.msds === "string" && (
            <p className="text-sm text-gray-500 mt-1">
              Current file:{" "}
              <a
                href={`/api/image/view/${product.msds}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {product.msds}
              </a>
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default React.memo(MediaFiles);