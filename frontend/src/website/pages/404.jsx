import React from 'react';
import { Link } from 'react-router-dom';

export default function Simple404Page() {
  return (
    
    <div className="min-h-screen bg-red-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-red-600">404</h1>
          <div className="h-2 w-24 bg-red-600 mx-auto my-4"></div>
        </div>
        
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">We couldn't find the page you were looking for.</p>
        
        <Link to="/" className="text-red-600 hover:text-red-700 font-medium mb-4 inline-block">
        <button className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg shadow hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500">
          Return Home
        </button>
        </Link>
      </div>
    </div>
  );
}