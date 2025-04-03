import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [dataCount, setDataCount] = useState({
    customerCount: 0,
    supplierCount: 0,
    chemicalCount: 0,
    inquiryCount: 0,
  });

  // Fetch data count from the API
  useEffect(() => {
    const fetchDataCount = async () => {
      try {
        const response = await axios.get('/api/count/dataCount');
       console.log(response)
        // Assuming the response is structured like:
        // { customerCount, supplierCount, chemicalCount, inquiryCount }
        setDataCount(response.data);
      } catch (error) {
        console.error('Error fetching data count:', error);
      }
    };

    fetchDataCount();
  }, []);

  return (
    <div className="p-1  mx-auto">
      <div>
        <h1 className="text-xl font-semibold text-purple-800 mb-4 pb-1 border-b border-purple-800">Dashboard</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Inquiries Card */}
        <div className="bg-emerald-500 text-white p-6 rounded-md shadow-lg relative overflow-hidden">
          <div className="text-4xl font-bold mb-2">{dataCount.inquiryCount}</div>
          <div className="text-lg">Total Inquiries</div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20">
            <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Total Chemicals Card */}
        <div className="bg-amber-500 text-white p-6 rounded-md shadow-lg relative overflow-hidden">
          <div className="text-4xl font-bold mb-2">{dataCount.chemicalCount}</div>
          <div className="text-lg">Total Chemicals</div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20">
            <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
        </div>

        {/* Total Suppliers Card */}
        <div className="bg-purple-600 text-white p-6 rounded-md shadow-lg relative overflow-hidden">
          <div className="text-4xl font-bold mb-2">{dataCount.supplierCount}</div>
          <div className="text-lg">Total Suppliers</div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20">
            <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1zM8 11a1 1 0 100-2 1 1 0 000 2zm0 4a1 1 0 100-2 1 1 0 000 2zm9-11a1 1 0 011 1v10a1 1 0 01-1 1h-1V4h1z" />
            </svg>
          </div>
        </div>

        {/* Total Customers Card */}
        <div className="bg-blue-500 text-white p-6 rounded-md shadow-lg relative overflow-hidden">
          <div className="text-4xl font-bold mb-2">{dataCount.customerCount}</div>
          <div className="text-lg">Total Customers</div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20">
            <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
