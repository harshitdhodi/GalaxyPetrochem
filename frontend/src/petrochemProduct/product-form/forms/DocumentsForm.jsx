import React from 'react';

const DocumentsForm = ({ formData, handleInputChange, handleFileChange }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Documents</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* PDF File Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">PDF Document</label>
          <input
            type="file"
            name="pdf"
            accept=".pdf"
            onChange={(e) => handleFileChange(e, 'pdf')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          {formData.pdf ? (
            <a
              href={`/api/image/view/${formData.pdf}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-blue-600 hover:underline"
            >
              Preview PDF
            </a>
          ) : (
            <span className="mt-2 inline-block text-gray-500">No PDF available for preview</span>
          )}
        </div>

        {/* MSDS File Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">MSDS Document</label>
          <input
            type="file"
            name="msds"
            accept=".pdf"
            onChange={(e) => handleFileChange(e, 'msds')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          {formData.msds ? (
            <a
              href={`/api/image/view/${formData.msds}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-blue-600 hover:underline"
            >
              Preview MSDS
            </a>
          ) : (
            <span className="mt-2 inline-block text-gray-500">No MSDS available for preview</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentsForm;