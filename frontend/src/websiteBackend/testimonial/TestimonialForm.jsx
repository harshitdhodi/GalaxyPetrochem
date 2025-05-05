import React, { useEffect, useState } from 'react';
import axios from 'axios';

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

  useEffect(() => {
    if (selected) {
      setFormData({ ...selected, photo: null });

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
      const file = files[0];
      setFormData({ ...formData, photo: file });

      // Create preview URL for new image
      if (file) {
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (let key in formData) {
      if (formData[key]) data.append(key, formData[key]);
    }

    if (selected && selected._id) {
      await axios.put(`/api/testimonial/update/${selected._id}`, data);
    } else {
      await axios.post('/api/testimonial/add', data);
    }

    fetchTestimonials();
    setFormData({
      altName: '', imgTitle: '', name: '', designation: '',
      company: '', rating: '', message: '', photo: null
    });
    setPreviewUrl(null);
    setSelected(null);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {[ 'name', 'designation', 'company', 'rating', 'message','altName', 'imgTitle', ].map((field) => (
        <input
          key={field}
          type="text"
          name={field}
          value={formData[field]}
          onChange={handleChange}
          placeholder={field}
          className="w-full p-2 border rounded"
        />
      ))}
  
      <div className="lg:col-span-2">
        <input type="file" name="photo" onChange={handleChange} className="w-full" />
      </div>
  
      {previewUrl && (
        <div className="lg:col-span-2 flex justify-start">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-32 h-32 object-cover rounded border"
          />
        </div>
      )}
    </div>
  
    <div className="mt-4">
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
        {selected ? 'Update' : 'Create'} Testimonial
      </button>
    </div>
  </form>
  
  );
};

export default TestimonialForm;
