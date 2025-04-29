import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import JoditEditor from 'jodit-react';

const EditAboutUsForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    years: '',
    clients: '',
    experts: '',
    details: '',
    photo: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const fetchStatById = async () => {
    try {
      const res = await axios.get(`/api/aboutus/${id}`);
      const { years, clients, experts, details, photo } = res.data.data;
      setFormData({ years, clients, experts, details, photo });

      if (photo) {
        setPreviewUrl(`/api/logo/download/${photo}`);
      }
    } catch (error) {
      console.error('Error fetching stat by ID:', error);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleEditorChange = (content) => {
    setFormData(prev => ({
      ...prev,
      details: content
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = new FormData();
      updatedData.append('years', formData.years);
      updatedData.append('clients', formData.clients);
      updatedData.append('experts', formData.experts);
      updatedData.append('details', formData.details);

      if (selectedFile) {
        updatedData.append('photo', selectedFile);
      }

      await axios.put(`/api/aboutus/${id}`, updatedData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Updated successfully!');
      navigate('/about-us-table'); // replace with your list page route
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchStatById();
    }
  }, [id]);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 border rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">{id ? 'Edit' : 'Add'} About Us Stat</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 font-medium">Years</label>
          <input
            type="number"
            name="years"
            value={formData.years}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Clients</label>
          <input
            type="number"
            name="clients"
            value={formData.clients}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Experts</label>
          <input
            type="number"
            name="experts"
            value={formData.experts}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Photo Upload Section */}
        <div>
          <label className="block mb-1 font-medium">Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="w-full p-2 border rounded"
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="mt-4 h-40 object-contain rounded"
            />
          )}
        </div>

        {/* Jodit Editor for Details */}
        <div>
          <label className="block mb-1 font-medium">Details</label>
          <JoditEditor
            value={formData.details}
            onChange={handleEditorChange}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-8 py-2 rounded hover:bg-blue-600"
          >
            {id ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAboutUsForm;
