import React, { useState } from 'react';
import axios from 'axios';
import JoditEditor from 'jodit-react';

const AddStatsForm = () => {
  const [formData, setFormData] = useState({
    years: '',
    clients: '',
    experts: '',
    details: '',
    imgTitle: '',
    altName: '',
    photo: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      setFormData((prevData) => ({
        ...prevData,
        photo: files[0],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleDetailsChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      details: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('years', formData.years);
      data.append('clients', formData.clients);
      data.append('experts', formData.experts);
      data.append('details', formData.details);
      data.append('imgTitle', formData.imgTitle);
      data.append('altName', formData.altName);
      if (formData.photo) {
        data.append('photo', formData.photo);
      }

      const response = await axios.post('/api/aboutus/addStats', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Response:', response.data);
      alert('Stats added successfully!');
      // Reset form
      setFormData({
        years: '',
        clients: '',
        experts: '',
        details: '',
        imgTitle: '',
        altName: '',
        photo: null,
      });
    } catch (error) {
      console.error('Error submitting form:', error.response?.data || error.message);
      alert('Failed to add stats.');
    } finally {
      setLoading(false);
    }
  };

  // Minimal toolbar configuration
  const editorConfig = {
    readonly: false,
    height: 300,
    toolbarAdaptive: false,
    toolbarButtonSize: 'small',
    buttons: [
      'source', '|',
      'bold', 'italic', 'underline', 'strikethrough', '|',
      'fontsize', 'brush', 'paragraph', '|',
      'ul', 'ol', 'align', '|',
      'link', 'image', '|',
      'undo', 'redo', '|',
      'hr', 'eraser', 'copyformat', '|',
      'fullsize'
    ],
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    allowResizeX: false,
    allowResizeY: false,
    cleanHTML: {
      fillEmptyParagraph: false,
      removeEmptyElements: false
    },
    defaultActionOnPaste: 'insert_as_html',
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    pasteFromWord: true
  };
  

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Add Stats</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="number"
          name="years"
          value={formData.years}
          onChange={handleChange}
          placeholder="Years"
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="number"
          name="clients"
          value={formData.clients}
          onChange={handleChange}
          placeholder="Clients"
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="number"
          name="experts"
          value={formData.experts}
          onChange={handleChange}
          placeholder="Experts"
          required
          className="w-full p-2 border rounded"
        />

        <div className="w-full border rounded p-2">
          <JoditEditor
            value={formData.details}
            config={editorConfig}
            onBlur={handleDetailsChange} // Save on blur
            tabIndex={1}
          />
        </div>

        <input
          type="text"
          name="imgTitle"
          value={formData.imgTitle}
          onChange={handleChange}
          placeholder="Image Title"
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="altName"
          value={formData.altName}
          onChange={handleChange}
          placeholder="Alt Name"
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="file"
          name="photo"
          accept="image/*"
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default AddStatsForm;
