import React, { useRef } from 'react';
import JoditEditor from 'jodit-react';

const ProductDetailsForm = ({ formData, handleInputChange }) => {
  const editor = useRef(null);

  const handleEditorChange = (value, name) => {
    handleInputChange({
      target: {
        name,
        value,
      },
    });
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Product Details</h2>
      <div className="space-y-8">

        {/* Specification */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Specification</label>
          <JoditEditor
            ref={editor}
            value={formData.specifiction}
            onChange={(newContent) => handleEditorChange(newContent, 'specifiction')}
          />
        </div>

        {/* Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
          <JoditEditor
            ref={editor}
            value={formData.details}
            onChange={(newContent) => handleEditorChange(newContent, 'details')}
          />
        </div>

        {/* Table Info */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Table Information</label>
          <JoditEditor
            ref={editor}
            value={formData.tableInfo}
            onChange={(newContent) => handleEditorChange(newContent, 'tableInfo')}
          />
        </div>

      </div>
    </div>
  );
};

export default ProductDetailsForm;
