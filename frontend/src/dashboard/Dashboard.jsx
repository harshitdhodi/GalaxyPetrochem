import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [dataCount, setDataCount] = useState({
    inquiryCount: 0,
    categoryCount: 0,
    productCount: 0,
    brandCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data count from the API
  useEffect(() => {
    const fetchDataCount = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/count/dataCount');

        setDataCount({
          inquiryCount: response.data.inquiryCount || 0,
          categoryCount: response.data.categoryCount || 0,
          productCount: response.data.productCount || 0,
          brandCount: response.data.brandCount || 0,
        });
        setError(null);
      } catch (err) {
        console.error('Error fetching data count:', err);
        setError('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDataCount();
  }, []);

  return (
    <div className="p-1  mx-auto">
      <div>
        <h1 className="text-xl font-semibold text-purple-800 mb-4 pb-1 border-b border-purple-800">Dashboard</h1>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Loading dashboard data...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Inquiries Card */}
          <div 
            onClick={() => navigate('/inquiry-list')}
            className="bg-emerald-500 text-white p-6 rounded-md shadow-lg relative overflow-hidden cursor-pointer hover:bg-emerald-600 transition-colors"
          >
            <div className="text-4xl font-bold mb-2">{dataCount.inquiryCount}</div>
            <div className="text-lg">Total Inquiries</div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20">
              <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Total Categories Card */}
          <div 
            onClick={() => navigate('/chemical-category')}
            className="bg-amber-500 text-white p-6 rounded-md shadow-lg relative overflow-hidden cursor-pointer hover:bg-amber-600 transition-colors"
          >
            <div className="text-4xl font-bold mb-2">{dataCount.categoryCount}</div>
            <div className="text-lg">Total Categories</div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20">
              <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
          </div>

          {/* Total Products Card */}
          <div 
            onClick={() => navigate('/products-table')}
            className="bg-purple-600 text-white p-6 rounded-md shadow-lg relative overflow-hidden cursor-pointer hover:bg-purple-700 transition-colors"
          >
            <div className="text-4xl font-bold mb-2">{dataCount.productCount}</div>
            <div className="text-lg">Total Products</div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20">
              <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1zM8 11a1 1 0 100-2 1 1 0 000 2zm0 4a1 1 0 100-2 1 1 0 000 2zm9-11a1 1 0 011 1v10a1 1 0 01-1 1h-1V4h1z" />
              </svg>
            </div>
          </div>

          {/* Total Brands Card */}
          <div 
            onClick={() => navigate('/brands-list')}
            className="bg-blue-500 text-white p-6 rounded-md shadow-lg relative overflow-hidden cursor-pointer hover:bg-blue-600 transition-colors"
          >
            <div className="text-4xl font-bold mb-2">{dataCount.brandCount}</div>
            <div className="text-lg">Total Brands</div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20">
              <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;