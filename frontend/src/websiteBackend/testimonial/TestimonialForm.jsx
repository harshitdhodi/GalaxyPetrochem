import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB

const TestimonialForm = ({ selected, setSelected, fetchTestimonials }) => {
  const [formData, setFormData] = useState({
    altName: '',
    imgTitle: '',
    name: '',
    designation: '',
    company: '',
    rating: '',
    message: '',
    photo: null,
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null); // Ref to control file input reset

  useEffect(() => {
    if (selected) {
      setFormData({
        altName: selected.altName || '',
        imgTitle: selected.imgTitle || '',
        name: selected.name || '',
        designation: selected.designation || '',
        company: selected.company || '',
        rating: selected.rating || '',
        message: selected.message || '',
        photo: null, // file input can't be pre-filled
      });

      if (selected?.photo) {
        setPreviewUrl(`/api/image/download/${selected.photo}`);
      }
    } else {
      setPreviewUrl(null);
    }
  }, [selected]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'photo') {
      const file = files?.[0];

      if (file) {
        // Check file size immediately
        if (file.size > MAX_FILE_SIZE) {
          toast.error(
            `Photo size must be 1 MB or less (your file: ${(file.size / 1024 / 1024).toFixed(2)} MB)`
          );
          e.target.value = ''; // clear the input
          setFormData({ ...formData, photo: null });
          setPreviewUrl(null);
          return;
        }

        setFormData({ ...formData, photo: file });
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setFormData({ ...formData, photo: null });
        setPreviewUrl(null);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.name?.trim()) errors.push("Name is required");
    if (!formData.designation?.trim()) errors.push("Designation is required");
    if (!formData.company?.trim()) errors.push("Company is required");
    if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
      errors.push("Rating must be between 1 and 5");
    }
    if (!formData.message?.trim()) errors.push("Message is required");
    if (!formData.altName?.trim()) errors.push("Image Alt Name is required");
    if (!formData.imgTitle?.trim()) errors.push("Image Title is required");

    // Photo required only on create
    if (!selected && !formData.photo) {
      errors.push("Photo is required when creating a new testimonial");
    }

    // Extra safety check
    if (formData.photo && formData.photo.size > MAX_FILE_SIZE) {
      errors.push("Photo exceeds the 1 MB size limit");
    }

    if (errors.length > 0) {
      errors.forEach((err) => toast.error(err));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    const data = new FormData();
    for (let key in formData) {
      if (formData[key] !== null && formData[key] !== '') {
        data.append(key, formData[key]);
      }
    }

    try {
      if (selected && selected._id) {
        // Update
        await axios.put(`/api/testimonial/update/${selected._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success("Testimonial updated successfully!");
      } else {
        // Create
        await axios.post('/api/testimonial/add', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success("Testimonial created successfully!");
      }

      fetchTestimonials();

      // Reset form
      setFormData({
        altName: '',
        imgTitle: '',
        name: '',
        designation: '',
        company: '',
        rating: '',
        message: '',
        photo: null,
      });
      setPreviewUrl(null);

      // Force clear the file input visually (this is the key fix)
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      setSelected(null);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field, type = 'text', extraProps = {}) => (
    <div>
      <label className="block mb-1 font-medium text-gray-700">
        {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
        <span className="text-red-600 ml-1">*</span>
      </label>
      <input
        type={type}
        name={field}
        value={formData[field] ?? ''}
        onChange={handleChange}
        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        {...extraProps}
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="p-6 border rounded-lg shadow-md bg-white">
      <p className="text-sm text-gray-500 mb-4">
        Fields marked with <span className="text-red-600">*</span> are required.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {renderField('name')}
        {renderField('designation')}
        {renderField('company')}
        {renderField('rating', 'number', {
          min: 1,
          max: 5,
          step: 0.1,
        })}
        {renderField('message', 'text', {
          placeholder: "Customer message / review",
        })}
        {renderField('altName', 'text', {
          placeholder: "Alt text for accessibility (SEO)",
        })}
        {renderField('imgTitle', 'text', {
          placeholder: "Title attribute for image",
        })}

        <div className="lg:col-span-2">
          <label className="block mb-1 font-medium text-gray-700">
            Photo <span className="text-red-600">*</span>
          </label>
          <input
            type="file"
            name="photo"
            ref={fileInputRef} // ← This allows us to clear it
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            accept="image/*"
          />
          <p className="text-xs text-gray-500 mt-1">
            Max 1 MB • {selected ? '(Leave empty to keep existing photo)' : 'Required for new testimonials'} • JPG, PNG, WebP recommended
          </p>
        </div>

        {previewUrl && (
          <div className="lg:col-span-2 flex justify-start">
            <div className="border rounded overflow-hidden shadow-sm">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-32 h-32 object-cover"
              />
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className={`px-8 py-3 bg-blue-600 text-white font-medium rounded-lg shadow
            ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-blue-700 transition-colors'}`}
        >
          {loading
            ? 'Saving...'
            : selected
            ? 'Update Testimonial'
            : 'Create Testimonial'}
        </button>
      </div>
    </form>
  );
};

export default TestimonialForm;