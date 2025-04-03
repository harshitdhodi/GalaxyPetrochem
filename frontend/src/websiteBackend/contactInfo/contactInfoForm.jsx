import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAddUserMutation } from '@/slice/contactInfo/contactInfo';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    photo: [],
    imgTitle: [''],
    altName: [''],
    address: '',
    mobiles: [''],
    emails: ['']
  });

  const [fileNames, setFileNames] = useState(['']);
  const [files, setFiles] = useState([]); // Store actual files
  const [addUser] = useAddUserMutation();

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      // Update file names for display
      const newFileNames = [...fileNames];
      newFileNames[index] = file.name;
      setFileNames(newFileNames);

      // Store the actual file
      const newFiles = [...files];
      newFiles[index] = file;
      setFiles(newFiles);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Create FormData object
      const formDataToSend = new FormData();

      // Append files
      files.forEach((file, index) => {
        if (file) {
          formDataToSend.append('photo', file);
        }
      });

      // Append other form data
      formDataToSend.append('imgTitle', JSON.stringify(formData.imgTitle.filter(t => t)));
      formDataToSend.append('altName', JSON.stringify(formData.altName.filter(n => n)));
      formDataToSend.append('address', formData.address);
      formDataToSend.append('mobiles', JSON.stringify(formData.mobiles.filter(m => m)));
      formDataToSend.append('emails', JSON.stringify(formData.emails.filter(e => e)));

      await addUser(formDataToSend).unwrap();
      
      // Reset form after successful submission
      setFormData({
        photo: [],
        imgTitle: [''],
        altName: [''],
        address: '',
        mobiles: [''],
        emails: ['']
      });
      setFileNames(['']);
      setFiles([]);
    } catch (error) {
      console.error('Failed to add user:', error);
    }
  };

  const handleArrayInput = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayField = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
    if (field === 'photo') {
      setFileNames(prev => [...prev, '']);
      setFiles(prev => [...prev, null]);
    }
  };

  const removeArrayField = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
    if (field === 'photo') {
      setFileNames(prev => prev.filter((_, i) => i !== index));
      setFiles(prev => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photos Section */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Photos</label>
          {fileNames.map((fileName, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="file"
                onChange={(e) => handleFileChange(e, index)}
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="flex-1 p-2 border rounded"
                required
              />
              {fileName && (
                <span className="text-sm text-gray-500">
                  {fileName}
                </span>
              )}
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeArrayField('photo', index)}
                  className="p-2 text-red-500"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField('photo')}
            className="text-sm text-blue-500"
          >
            + Add another photo
          </button>
        </div>

        {/* Rest of the form fields remain the same */}
        {/* Image Titles */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Image Titles</label>
          {formData.imgTitle.map((title, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={title}
                onChange={(e) => handleArrayInput('imgTitle', index, e.target.value)}
                placeholder="Enter image title"
                className="flex-1 p-2 border rounded"
                required
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeArrayField('imgTitle', index)}
                  className="p-2 text-red-500"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField('imgTitle')}
            className="text-sm text-blue-500"
          >
            + Add another title
          </button>
        </div>

        {/* Alt Names */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Alternative Names</label>
          {formData.altName.map((name, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => handleArrayInput('altName', index, e.target.value)}
                placeholder="Enter alternative name"
                className="flex-1 p-2 border rounded"
                required
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeArrayField('altName', index)}
                  className="p-2 text-red-500"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField('altName')}
            className="text-sm text-blue-500"
          >
            + Add another name
          </button>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium">Address</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            placeholder="Enter address"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Mobile Numbers */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Mobile Numbers</label>
          {formData.mobiles.map((mobile, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="tel"
                value={mobile}
                onChange={(e) => handleArrayInput('mobiles', index, e.target.value)}
                placeholder="Enter mobile number"
                className="flex-1 p-2 border rounded"
                required
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeArrayField('mobiles', index)}
                  className="p-2 text-red-500"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField('mobiles')}
            className="text-sm text-blue-500"
          >
            + Add another mobile
          </button>
        </div>

        {/* Email Addresses */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Email Addresses</label>
          {formData.emails.map((email, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => handleArrayInput('emails', index, e.target.value)}
                placeholder="Enter email address"
                className="flex-1 p-2 border rounded"
                required
                pattern="^\S+@\S+\.\S+$"
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeArrayField('emails', index)}
                  className="p-2 text-red-500"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField('emails')}
            className="text-sm text-blue-500"
          >
            + Add another email
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ContactForm;