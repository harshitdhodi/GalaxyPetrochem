import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Home } from 'lucide-react';

const ComingSoon = ({ pageName = "this page" }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="mx-auto w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6">
          <Wrench className="h-12 w-12 text-orange-600" />
        </div>
        <h2 className="mt-6 text-4xl font-extrabold text-gray-900">
          Coming Soon
        </h2>
        <p className="mt-2 text-lg text-gray-600">
          {pageName} is currently under development.
        </p>
        <p className="text-gray-500">
          We're working hard to bring you something amazing. Please check back later!
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            <Home className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
