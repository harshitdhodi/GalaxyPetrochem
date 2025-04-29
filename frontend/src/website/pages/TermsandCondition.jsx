import { useState, useEffect } from 'react';
import axios from 'axios';

const TermsAndConditions = () => {
  const [termsCondition, setTermsCondition] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTermsCondition = async () => {
      try {
        const response = await axios.get('/api/terms');
        if (response.data.length > 0) {
          const termsData = response.data[0]; // Assuming the API returns an array with one object
          setTermsCondition(termsData.termsCondition);
        }
      } catch (error) {
        console.error('Failed to fetch terms and conditions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTermsCondition();
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white mt-8 shadow-xl rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Terms and Conditions</h1>
          </div>
          <div className="p-6 sm:p-8">
            <div dangerouslySetInnerHTML={{ __html: termsCondition }} />
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsAndConditions;