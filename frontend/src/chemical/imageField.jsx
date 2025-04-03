import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export default function ImageField({ formData, setFormData }) {
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
        altName: "", // Default alt name
        imgTitle: "Default Title", // Default title
      });
    }
  };

  return (
    <Card className="max-w-md mx-auto space-y-6 p-4">
      <Label className="text-lg font-semibold">Upload Image</Label>

      <div className="border border-dashed border-gray-300 rounded-md p-4 text-center">
        <div className="w-32 h-32 mx-auto mb-4">
          <img
            src={formData.image ? URL.createObjectURL(formData.image) : "/placeholder.svg"}
            alt={formData.altName || "Image preview"}
            className="w-full h-full object-contain rounded"
          />
        </div>
        <button
          type="button"
          className="button"
          onClick={() => document.getElementById("imageUpload").click()}
        >
          Add Image
        </button>
        <input
          type="file"
          id="imageUpload"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {formData.image && (
        <div className="space-y-4 mt-4">
          {/* Alt Name Input */}
          <div>
            <Label htmlFor="altName" className="block text-sm font-medium">
              Alt Name
            </Label>
            <Input
              id="altName"
              type="text"
              value={formData.altName || ""}
              onChange={(e) =>
                setFormData({ ...formData, altName: e.target.value })
              }
              placeholder="Enter alt text for the image"
            />
          </div>

          {/* Image Title Input */}
          <div>
            <Label htmlFor="imgTitle" className="block text-sm font-medium">
              Image Title
            </Label>
            <Input
              id="imgTitle"
              type="text"
              value={formData.imgTitle || ""}
              onChange={(e) =>
                setFormData({ ...formData, imgTitle: e.target.value })
              }
              placeholder="Enter image title"
            />
          </div>
        </div>
      )}
    </Card>
  );
}
