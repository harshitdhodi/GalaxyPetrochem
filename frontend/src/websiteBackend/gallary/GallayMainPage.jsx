import { useEffect, useState, useCallback } from "react";
import GalleryForm from "./GallaryForm";
import GalleryTable from "./GallaryTable";
import { Plus, Search } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GalleryCRUD = () => {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    image: null,
    imagePreview: '',
    altName: '',
    imgTitle: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const apiCall = async (endpoint, options = {}) => {
    try {
      const defaultHeaders = {
        'Content-Type': 'application/json',
      };

      if (options.body instanceof FormData) {
        delete defaultHeaders['Content-Type'];
      }

      const response = await fetch(`${endpoint}`, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
        body: options.body instanceof FormData ? options.body : JSON.stringify(options.body)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'API request failed');
      }

      if (response.status === 204) {
        return { ok: true, json: async () => ({}) };
      }

      return {
        ok: response.ok,
        status: response.status,
        json: async () => await response.json()
      };
    } catch (error) {
      console.error('API call error:', error);
      throw error;
    }
  };

  const loadGalleries = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await apiCall('/api/gallery/all');
      if (response.ok) {
        const data = await response.json();
        console.log(data.data);
        setGalleries(data.data);
      } else {
        setError('Failed to load galleries');
      }
    } catch (err) {
      console.error('Error loading galleries:', err);
      setError('Error loading galleries');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (data, isEditMode = false) => {
    const errors = {};
    if (!data.title.trim()) errors.title = 'Title is required';
    if (!isEditMode && !data.image) errors.image = 'Image is required';
    if (!data.altName.trim()) errors.altName = 'Alt name is required';
    if (!data.imgTitle.trim()) errors.imgTitle = 'Image title is required';
    return errors;
  };

  const createGallery = async (data) => {
    try {
      setSubmitting(true);
      setError('');
      const errors = validateForm(data);
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('title', data.title);
      formDataToSend.append('altName', data.altName);
      formDataToSend.append('imgTitle', data.imgTitle);
      if (data.image) formDataToSend.append('image', data.image);

      const response = await apiCall('/api/gallery/create', {
        method: 'POST',
        body: formDataToSend,
        headers: {}
      });
  toast.success('Gallery item created successfully!'); // ✅ Show toast FIRST
      if (response.ok) {
  const refreshResponse = await apiCall('/api/gallery/all');
  if (refreshResponse.ok) {
    const data = await refreshResponse.json();
    setGalleries(data.data);
  }


  setIsModalOpen(false); // ✅ Then close modal
  resetForm();
  setError('');
} else {
        setError('Failed to create gallery item');
        toast.error('Failed to create gallery item');
      }
    } catch (err) {
      console.error('Error creating gallery item:', err);
      setError('Error creating gallery item');
      toast.error('Error creating gallery item');
    } finally {
      setSubmitting(false);
    }
  };

  const updateGallery = async (id, data) => {
    try {
      setSubmitting(true);
      setError('');
      const errors = validateForm(data, true);
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('title', data.title);
      formDataToSend.append('altName', data.altName);
      formDataToSend.append('imgTitle', data.imgTitle);
      if (data.image) formDataToSend.append('image', data.image);

      const response = await apiCall(`/api/gallery/update/${id}`, {
        method: 'PUT',
        body: formDataToSend,
        headers: {}
      });

      if (response.ok) {
        const result = await response.json();
        const updatedItem = result.data;
        setGalleries(galleries.map(item =>
          item._id === id ? { ...item, ...updatedItem } : item
        ));
        setIsModalOpen(false);
        resetForm();
        setError('');
        toast.success('Gallery item updated successfully!');

        const refreshResponse = await apiCall('/api/gallery/all');
        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          setGalleries(data.data);
        }
      } else {
        setError('Failed to update gallery item');
        toast.error('Failed to update gallery item');
      }
    } catch (err) {
      console.error('Error updating gallery item:', err);
      setError('Error updating gallery item');
      toast.error('Error updating gallery item');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteGallery = async (id) => {
    if (window.confirm('Are you sure you want to delete this gallery item?')) {
      try {
        const response = await apiCall(`/api/gallery/delete/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setGalleries(galleries.filter(item => item._id !== id));
          toast.success('Gallery item deleted successfully!');
        } else {
          setError('Failed to delete gallery item');
          toast.error('Failed to delete gallery item');
        }
      } catch (err) {
        console.error('Error deleting gallery item:', err);
        setError('Error deleting gallery item');
        toast.error('Error deleting gallery item');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      image: null,
      imagePreview: '',
      altName: '',
      imgTitle: ''
    });
    setSelectedItem(null);
    setFormErrors({});
  };

  const openModal = (mode, item = null) => {
    setModalMode(mode);
    setSelectedItem(item);
    setFormErrors({});
    setError('');
    if (item) {
      setFormData({
        title: item.title,
        image: null,
        imagePreview: item.image,
        altName: item.altName,
        imgTitle: item.imgTitle
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (modalMode === 'create') {
      createGallery(formData);
    } else if (modalMode === 'edit') {
      updateGallery(selectedItem._id, formData);
    }
  };

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [formErrors]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        setFormErrors({ ...formErrors, image: 'Please select an image file (JPEG, PNG, etc.)' });
        return;
      }
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setFormErrors({ ...formErrors, image: 'File size should be less than 5MB' });
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setFormData({ ...formData, image: file, imagePreview: previewUrl });
      setFormErrors({ ...formErrors, image: '' });
    }
  };

  const filteredGalleries = Array.isArray(galleries)
    ? galleries.filter(item => {
      const searchTermLower = (searchTerm || '').toLowerCase();
      const itemTitle = (item?.title || '').toLowerCase();
      const itemAltName = (item?.altName || '').toLowerCase();
      const itemImgTitle = (item?.imgTitle || '').toLowerCase();
      return (
        itemTitle.includes(searchTermLower) ||
        itemAltName.includes(searchTermLower) ||
        itemImgTitle.includes(searchTermLower)
      );
    })
    : [];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'data:image/svg+xml;utf8,';
  };

  useEffect(() => {
    loadGalleries();
  }, []);

  return (
    <div>
      {/* ToastContainer — place once at the top level */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />

      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gallery Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your gallery items and media content</p>
          <p className="text-gray-400 text-xs mt-1">
            Total Items: {galleries.length} • Filtered: {filteredGalleries.length}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button
            onClick={() => openModal('create')}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus size={18} />
            Add New Item
          </button>

          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search galleries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={loadGalleries}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <GalleryTable
          galleries={filteredGalleries}
          loading={loading}
          onEdit={(item) => openModal('edit', item)}
          onDelete={deleteGallery}
          formatDate={formatDate}
          handleImageError={handleImageError}
          openModal={openModal}
        />

        {isModalOpen && (
          <GalleryForm
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            modalMode={modalMode}
            selectedItem={selectedItem}
            formData={formData}
            formErrors={formErrors}
            submitting={submitting}
            handleSubmit={handleSubmit}
            handleInputChange={handleInputChange}
            handleFileChange={handleFileChange}
            formatDate={formatDate}
          />
        )}
      </div>
    </div>
  );
};

export default GalleryCRUD;