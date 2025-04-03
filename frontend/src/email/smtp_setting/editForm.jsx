import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useGetServerByIdQuery, useUpdateServerMutation } from '@/slice/smtpSlice/smtp';

const EditSMTP = () => {
  const { id } = useParams(); // Get the server ID from the URL params
  const navigate = useNavigate();
  
  const { data: serverResponse, isLoading, error } = useGetServerByIdQuery(id); // Fetch the server data by ID
  const [updateServer, { isLoading: isUpdating, error: updateError }] = useUpdateServerMutation();

  const [formData, setFormData] = useState({
    host: '',
    name: '',
    isSSL: false,
    isDefault: false,
    password: '', // Assuming password can be updated
  });

  // Set initial form values when server data is fetched
  useEffect(() => {
    if (serverResponse && serverResponse.data) {
      const server = serverResponse.data;
      setFormData({
        host: server.host || '',
        name: server.name || '',
        isSSL: server.isSSL || false,
        isDefault: server.isDefault || false,
        password: server.password || '', // Set the password if needed
      });
    }
  }, [serverResponse]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id) {
      console.error("Server ID is not defined.");
      return;
    }
  
    // Ensure the form data is passed as 'updatedServer'
    const updatedServer = { ...formData };
  
    try {
      // Pass the server ID and updated server data to the mutation
      await updateServer({ id, updatedServer }).unwrap(); // Ensure id and updatedServer are passed correctly
      navigate('/smtp-table'); // Redirect after update
    } catch (err) {
      console.error('Failed to update server:', err);
    }
  };
  
  

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error fetching server data: {error.message}</p>;
  }

  return (
    <div className="p-4 w-full max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit SMTP Server</h1>

      <form onSubmit={handleSubmit}>
        {/* Host */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="host">
            Host
          </label>
          <input
            type="text"
            id="host"
            name="host"
            value={formData.host}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded-md"
            required
          />
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded-md"
            required
          />
        </div>

        {/* SSL */}
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="isSSL"
            name="isSSL"
            checked={formData.isSSL}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="text-sm font-medium text-gray-700" htmlFor="isSSL">
            Use SSL
          </label>
        </div>

        {/* Default */}
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="isDefault"
            name="isDefault"
            checked={formData.isDefault}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="text-sm font-medium text-gray-700" htmlFor="isDefault">
            Set as Default
          </label>
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded-md"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-between items-center">
          <Button
            variant="primary"
            type="submit"
            disabled={isUpdating}
            className="w-full"
          >
            {isUpdating ? 'Updating...' : 'Update SMTP Server'}
          </Button>
        </div>
      </form>

      {/* Error Display */}
      {updateError && (
        <div className="mt-4 text-red-500">
          <p>Error updating the server: {updateError.message}</p>
        </div>
      )}
    </div>
  );
};

export default EditSMTP;
