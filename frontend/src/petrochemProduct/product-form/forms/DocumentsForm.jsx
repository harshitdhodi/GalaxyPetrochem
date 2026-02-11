import React from 'react';

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB in bytes

const DocumentsForm = ({ formData, handleInputChange, handleFileChange }) => {
  // Wrapper to validate file size before passing to parent handler
  const handleValidatedFileChange = (e, fieldName) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert(
        `File "${file.name}" is too large (${(file.size / 1024 / 1024).toFixed(2)} MB).\n` +
        `Maximum allowed size is 1MB.`
      );
      e.target.value = ''; // Clear the input so user can try again
      return;
    }

    // If size is okay → forward to parent handler
    handleFileChange(e, fieldName);
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Documents</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* PDF File Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            PDF Document
          </label>
          <input
            type="file"
            name="pdf"
            accept=".pdf"
            onChange={(e) => handleValidatedFileChange(e, 'pdf')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          <p className="mt-1 text-sm text-gray-500">Max 1MB</p>

          {formData.pdf ? (
            <a
              href={`/api/image/view/${formData.pdf}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-blue-600 hover:underline text-sm"
            >
              View current PDF
            </a>
          ) : (
            <span className="mt-2 inline-block text-sm text-gray-500">
              No PDF uploaded yet
            </span>
          )}
        </div>

        {/* MSDS File Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            MSDS Document
          </label>
          <input
            type="file"
            name="msds"
            accept=".pdf"
            onChange={(e) => handleValidatedFileChange(e, 'msds')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          <p className="mt-1 text-sm text-gray-500">Max 1MB</p>

          {formData.msds ? (
            <a
              href={`/api/image/view/${formData.msds}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-blue-600 hover:underline text-sm"
            >
              View current MSDS
            </a>
          ) : (
            <span className="mt-2 inline-block text-sm text-gray-500">
              No MSDS uploaded yet
            </span>
          )}
        </div>
      </div>

      <p className="mt-6 text-sm text-gray-600 italic">
        Note: Only PDF files up to 1MB are accepted for both document types.
      </p>
    </div>
  );
};

export default DocumentsForm;