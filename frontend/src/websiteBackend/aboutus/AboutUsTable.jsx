import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // import useNavigate
import axios from 'axios';
import { Edit } from 'lucide-react';
const StatsTable = () => {
  const [stats, setStats] = useState([]);
  const navigate = useNavigate(); // initialize navigate

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/aboutus/getAll');
      setStats(res.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await axios.delete(`/api/aboutus/deleteStats?id=${id}`);
        setStats(prev => prev.filter(item => item._id !== id));
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-about-us-form/${id}`);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="border p-2">Years</th>
            <th className="border p-2">Clients</th>
            <th className="border p-2">Experts</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((stat) => (
            <tr key={stat._id} className="hover:bg-gray-50">
              <td className="border p-2">{stat.years}</td>
              <td className="border p-2">{stat.clients}</td>
              <td className="border p-2">{stat.experts}</td>
              <td className="border p-2 flex gap-2">
                <button
                  onClick={() => handleEdit(stat._id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center gap-1"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(stat._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {stats.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center py-4 text-gray-500">
                No stats available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StatsTable;
