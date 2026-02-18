import { X } from "lucide-react";
import { useEffect, useState, useRef } from "react";

const GalleryForm = ({
  isModalOpen,
  setIsModalOpen,
  modalMode,
  selectedItem,
  formData,
  formErrors,
  submitting,
  handleSubmit,
  handleInputChange,
  handleFileChange,
  formatDate
}) => {
  const [localErrors, setLocalErrors] = useState({});
  const prevSubmittingRef = useRef(false);

  useEffect(() => {
    if (modalMode === 'edit' && selectedItem) {
      handleInputChange('title', selectedItem.title || '');
      handleInputChange('altName', selectedItem.altName || '');
      handleInputChange('imgTitle', selectedItem.imgTitle || '');
      if (selectedItem.image) {
        const imageUrl = `/api/logo/download/${encodeURIComponent(selectedItem.image)}`;
        handleInputChange('imagePreview', imageUrl);
      }
    } else if (modalMode === 'create') {
      if (!formData.image) {
        handleInputChange('imagePreview', '');
      }
      setLocalErrors({});
    }
  }, [modalMode, selectedItem]);

  const onLocalSubmit = () => {
    const errors = {};

    if (!formData.title || !formData.title.toString().trim()) {
      errors.title = 'Title is required';
    }
    if (!formData.altName || !formData.altName.toString().trim()) {
      errors.altName = 'Alt name is required';
    }
    if (!formData.imgTitle || !formData.imgTitle.toString().trim()) {
      errors.imgTitle = 'Image title is required';
    }

    // ✅ Image only required in create mode
    if (modalMode === 'create' && !formData.image) {
      errors.image = 'Image file is required';
    }

    setLocalErrors(errors);

    if (Object.keys(errors).length === 0) {
      handleSubmit({ preventDefault: () => {} });
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setLocalErrors({});
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 ${isModalOpen ? '' : 'hidden'}`}>
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {modalMode === 'create' ? 'Add New Gallery Item' :
               modalMode === 'edit' ? 'Edit Gallery Item' : 'Gallery Item Details'}
            </h2>
            <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X size={24} />
            </button>
          </div>

          {modalMode === 'view' ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedItem?.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Alt Name</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedItem?.altName}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image Title</label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedItem?.imgTitle}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <p className="text-gray-600 text-sm break-all bg-gray-50 p-3 rounded-lg">{selectedItem?.image}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Created</label>
                  <p className="text-gray-600 text-sm">{formatDate(selectedItem?.createdAt)}</p>
                </div>
                {selectedItem?.updatedAt && selectedItem.updatedAt !== selectedItem.createdAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Updated</label>
                    <p className="text-gray-600 text-sm">{formatDate(selectedItem.updatedAt)}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {formData.imagePreview ? (
                <img
                  src={formData.imagePreview}
                  alt="Preview"
                  className="h-32 w-auto object-cover rounded"
                  loading="lazy"
                />
              ) : (
                <div className="h-32 w-full flex items-center justify-center bg-gray-100 rounded">
                  <span className="text-gray-400">No image selected</span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${(formErrors.title || localErrors.title) ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter gallery item title"
                  />
                  {(formErrors.title || localErrors.title) && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.title || localErrors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Image {modalMode === 'create' && <span className="text-red-500">*</span>}
                    {modalMode === 'edit' && <span className="text-gray-400 text-xs font-normal ml-1">(leave empty to keep current)</span>}
                  </label>
                  <div className="flex items-center">
                    <label className="cursor-pointer bg-white border border-gray-300 rounded-lg p-2 hover:bg-gray-50 transition-colors">
                      <span className="text-gray-700">{formData.image ? 'Change Image' : 'Choose Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                    {formData.image && (
                      <span className="ml-2 text-sm text-gray-600">{formData.image.name || 'Selected'}</span>
                    )}
                  </div>
                  {(formErrors.image || localErrors.image) && (
                    <p className="text-red-500 text-xs italic mt-1">{formErrors.image || localErrors.image}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alt Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.altName}
                    onChange={(e) => handleInputChange('altName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${(formErrors.altName || localErrors.altName) ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="alt-name-for-seo"
                  />
                  {(formErrors.altName || localErrors.altName) && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.altName || localErrors.altName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.imgTitle}
                    onChange={(e) => handleInputChange('imgTitle', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${(formErrors.imgTitle || localErrors.imgTitle) ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Descriptive image title"
                  />
                  {(formErrors.imgTitle || localErrors.imgTitle) && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.imgTitle || localErrors.imgTitle}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={onLocalSubmit}
                  disabled={submitting}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {modalMode === 'create' ? 'Creating...' : 'Updating...'}
                    </>
                  ) : (
                    modalMode === 'create' ? 'Create Item' : 'Update Item'
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={submitting}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GalleryForm;