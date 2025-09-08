import { useEffect, useState, useCallback } from "react";
import GalleryForm from "./GallaryForm";
import GalleryTable from "./GallaryTable";
import { Plus, Search } from "lucide-react";

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
  
    // Mock API call function (unchanged)
    const apiCall = async (endpoint, options = {}) => {
        try {
          const defaultHeaders = {
            'Content-Type': 'application/json',
            // Add any auth headers if needed
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
          };
      
          // For file uploads, let the browser set the content-type with boundary
          if (options.body instanceof FormData) {
            delete defaultHeaders['Content-Type'];
          }
      
          const response = await fetch(`${endpoint}`, {
            ...options,
            headers: {
              ...defaultHeaders,
              ...options.headers
            },
            // For FormData, don't stringify the body
            body: options.body instanceof FormData ? options.body : JSON.stringify(options.body)
          });
      
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'API request failed');
          }
      
          // For DELETE requests that might not return content
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
        
        if (response.ok) {
          // Instead of just adding the new item, refresh the entire list
          const refreshResponse = await apiCall('/api/gallery/all');
          if (refreshResponse.ok) {
            const data = await refreshResponse.json();
            setGalleries(data.data);
          }
          setIsModalOpen(false);
          resetForm();
          setError('');
        } else {
          setError('Failed to create gallery item');
        }
      } catch (err) {
        console.error('Error creating gallery item:', err);
        setError('Error creating gallery item');
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
          // Update the local state with the updated item
          setGalleries(galleries.map(item => 
            item._id === id ? { ...item, ...updatedItem } : item
          ));
          setIsModalOpen(false);
          resetForm();
          setError('');
          // Refresh the galleries to ensure we have the latest data
          const refreshResponse = await apiCall('/api/gallery/all');
          if (refreshResponse.ok) {
            const data = await refreshResponse.json();
            setGalleries(data.data);
          }
        } else {
          setError('Failed to update gallery item');
        }
      } catch (err) {
        console.error('Error updating gallery item:', err);
        setError('Error updating gallery item');
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
              // Update the local state to remove the deleted item
              setGalleries(galleries.filter(item => item._id !== id));
            } else {
              setError('Failed to delete gallery item');
            }
          } catch (err) {
            console.error('Error deleting gallery item:', err);
            setError('Error deleting gallery item');
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
  
    // Wrap handleInputChange in useCallback
    const handleInputChange = useCallback((field, value) => {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
      if (formErrors[field]) {
        setFormErrors(prev => ({
          ...prev,
          [field]: ''
        }));
      }
    }, [formErrors]);
  
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        if (!file.type.match('image.*')) {
          setFormErrors({
            ...formErrors,
            image: 'Please select an image file (JPEG, PNG, etc.)'
          });
          return;
        }
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
          setFormErrors({
            ...formErrors,
            image: 'File size should be less than 5MB'
          });
          return;
        }
        const previewUrl = URL.createObjectURL(file);
        setFormData({
          ...formData,
          image: file,
          imagePreview: previewUrl
        });
        setFormErrors({
          ...formErrors,
          image: ''
        });
      }
    };
  
    const filteredGalleries = Array.isArray(galleries) ? galleries.filter(item => {
      const searchTermLower = (searchTerm || '').toLowerCase();
      const itemTitle = (item?.title || '').toLowerCase();
      const itemAltName = (item?.altName || '').toLowerCase();
      const itemImgTitle = (item?.imgTitle || '').toLowerCase();
      return (
        itemTitle.includes(searchTermLower) ||
        itemAltName.includes(searchTermLower) ||
        itemImgTitle.includes(searchTermLower)
      );
    }) : [];
  
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
      e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="%23e5e7eb"><rect width="24" height="24" fill="none"/><path d="M21 5v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2zm-2 0H5v14h14V5zm-3 4v2h-2V9h-2v2h-2v2h2v2h2v-2h2v-2h-2z" fill="%236b7280"/></svg>';
    };
  
    useEffect(() => {
      loadGalleries();
    }, []);
  
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Gallery Management</h1>
                <p className="text-gray-600 mt-1">Manage your gallery items and media content</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span>Total Items: {galleries.length}</span>
                  <span>•</span>
                  <span>Filtered: {filteredGalleries.length}</span>
                </div>
              </div>
              <button
                onClick={() => openModal('create')}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Plus size={20} />
                Add New Item
              </button>
            </div>
          </div>
  
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by title, alt name, or image title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={loadGalleries}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>
  
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}
  
          <GalleryTable
            galleries={galleries}
            filteredGalleries={filteredGalleries}
            loading={loading}
            error={error}
            openModal={openModal}
            deleteGallery={deleteGallery}
            formatDate={formatDate}
            handleImageError={handleImageError}
          />
  
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
        </div>
      </div>
    );
  };

  export default GalleryCRUD;