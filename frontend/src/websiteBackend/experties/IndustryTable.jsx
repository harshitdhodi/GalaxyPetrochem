import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { EditIcon } from 'lucide-react';

const IndustryTable = ({ onEdit, refreshKey }) => {
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchIndustries = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/industry/getAll');
      console.log('API Response:', response.data); // Debugging
      setIndustries(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error(err);
      setError('Failed to load industries.');
      setIndustries([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchIndustries();
  }, [refreshKey]);

  return (
    <div className="max-w-4xl  bg-white mt-2">
      <h2 className="text-2xl font-bold mb-6 text-start">Industry Expertise List</h2>
      {error && (
        <div className="mb-4 text-center text-sm text-red-600">{error}</div>
      )}
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">Heading</th>
                <th className="py-2 px-4 border-b text-left">Sub Heading</th>
                <th className="py-2 px-4 border-b text-left">Items</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(industries) && industries.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-2 px-4 text-center">
                    No industries found.
                  </td>
                </tr>
              ) : (
                Array.isArray(industries) &&
                industries.map((industry) => (
                  <tr key={industry._id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{industry.heading}</td>
                    <td className="py-2 px-4 border-b">{industry.subHeading}</td>
                    <td className="py-2 px-4 border-b">
                      {industry.items.length} item(s):{' '}
                      {industry.items.slice(0, 2).map((item, index) => (
                        <span key={index}>
                          {item.name}
                          {index < industry.items.slice(0, 2).length - 1 ? ', ' : ''}
                        </span>
                      ))}
                      {industry.items.length > 2 && '...'}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => onEdit(industry._id)}
                        className="text-blue-700 rounded-md  transition"
                      >
                        <EditIcon size={16} className="inline mr-1" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default IndustryTable;