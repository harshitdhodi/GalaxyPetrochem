import React, { useCallback, useEffect } from "react";
import { useFieldArray, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const ImageUploadForm = ({ control, setValue }) => {
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "images",
  });

  // ReactQuill modules configuration with enhanced features
  const quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],                      // blocks
      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],     // lists
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // indentation
      [{ 'direction': 'rtl' }],                         // text direction
      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults
      [{ 'font': [] }],                                 // font family
      [{ 'align': [] }],                                // text align
      ['clean'],                                         // remove formatting
      ['link', 'image']                                  // link and image
    ]
  };

  // ReactQuill formats configuration
  const quillFormats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'color', 'background', 
    'align', 'direction', 'code-block', 'script'
  ];

  const handleImageChange = useCallback(
    (e, index) => {
      const file = e.target.files[0];
      if (file) {
        // Revoke the old preview URL if it exists
        if (fields[index]?.preview?.startsWith("blob:")) {
          URL.revokeObjectURL(fields[index].preview);
        }

        const preview = URL.createObjectURL(file);

        // Update the specific index using update() instead of modifying fields directly
        update(index, {
          ...fields[index],
          file,
          preview,
          altText: fields[index]?.altText || "",
          title: fields[index]?.title || "",
          url: null, // Reset URL for new uploads
        });
      }
    },
    [fields, update]
  );

  // Cleanup effect to revoke old preview URLs
  useEffect(() => {
    return () => {
      fields.forEach((field) => {
        if (field?.preview?.startsWith("blob:")) {
          URL.revokeObjectURL(field.preview);
        }
      });
    };
  }, [fields]);

  const handleRemove = useCallback(
    (index) => {
      if (fields[index]?.preview?.startsWith("blob:")) {
        URL.revokeObjectURL(fields[index].preview);
      }
      // Mark the image for deletion if it has an ID
      if (fields[index]._id) {
        setValue(`imagesToDelete.${fields[index]._id}`, true);
      }
      remove(index);
    },
    [fields, remove, setValue]
  );

  return (
    <div className="space-y-6">
      {/* Global Tagline Field - as a simple string */}
      <div className="space-y-2">
        <Label htmlFor="global_tagline">Global Tagline</Label>
        <Controller
          name="global_tagline"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input 
              id="global_tagline"
              placeholder="Enter global tagline"
              {...field}
            />
          )}
        />
        <p className="text-xs text-gray-500">A brief tagline that will appear globally.</p>
      </div>

      {/* Description Field */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Controller
          name="description"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value } }) => (
            <div className="quill-container">
              <ReactQuill 
                id="description"
                theme="snow"
                value={value}
                onChange={onChange}
                className="bg-white"
                modules={quillModules}
                formats={quillFormats}
                placeholder="Enter detailed description..."
              />
            </div>
          )}
        />
        <p className="text-xs text-gray-500 mt-1">
          Format your content using the toolbar above. Use headings, lists, and formatting to create well-structured content.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="synonyms">Synonyms</Label>
        <Controller
          name="synonyms"
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input 
                  placeholder="Enter synonym"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const value = e.target.value.trim();
                      if (value && !field.value.includes(value)) {
                        field.onChange([...field.value, value]);
                        e.target.value = '';
                      }
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={(e) => {
                    const input = e.currentTarget.previousSibling;
                    const value = input.value.trim();
                    if (value && !field.value.includes(value)) {
                      field.onChange([...field.value, value]);
                      input.value = '';
                    }
                  }}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(field.value) && field.value.map((synonym, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md"
                  >
                    <span>{synonym}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const newSynonyms = field.value.filter((_, i) => i !== index);
                        field.onChange(newSynonyms);
                      }}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        />
      </div>

      <Label>Images</Label>
      {fields.map((field, index) => (
        <div key={field.id} className="space-y-2 border p-4 rounded-lg">
          {/* Image Preview */}
          {field.preview || field.url ? (
            <img
              src={field.preview || `/api/image/download/${field.url}`}
              alt={field.altText || "Image preview"}
              className="w-32 h-32 object-cover rounded border"
            />
          ) : (
            <div className="w-32 h-32 flex items-center justify-center border rounded bg-gray-100">
              No Preview
            </div>
          )}

          {/* File Input */}
          <input
            type="file"
            onChange={(e) => handleImageChange(e, index)}
            accept="image/*"
            className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
          />

          {/* Alt Text Input */}
          <Label htmlFor={`alt-text-${index}`}>Alt Text</Label>
          <Controller
            name={`images.${index}.altText`}
            control={control}
            defaultValue={field.altText || ""}
            render={({ field }) => (
              <Input
                id={`alt-text-${index}`}
                placeholder="Alt Text"
                {...field}
              />
            )}
          />

          {/* Title Input */}
          <Label htmlFor={`image-title-${index}`}>Image Title</Label>
          <Controller
            name={`images.${index}.title`}
            control={control}
            defaultValue={field.title || ""}
            render={({ field }) => (
              <Input
                id={`image-title-${index}`}
                placeholder="Image Title"
                {...field}
              />
            )}
          />

          {/* Remove Button */}
          <button
            type="button"
            onClick={() => handleRemove(index)}
            className="text-red-600 hover:underline"
          >
            Remove
          </button>
        </div>
      ))}

      {/* Add Image Button */}
      <button
        type="button"
        onClick={() =>
          append({ file: null, preview: null, altText: "", title: "", url: null })
        }
        className="px-4 py-2 mt-4 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Add Image
      </button>
    </div>
  );
};

export default ImageUploadForm;