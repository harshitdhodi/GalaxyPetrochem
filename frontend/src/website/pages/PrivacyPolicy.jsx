import { useState, useEffect } from 'react';
import axios from 'axios';

const PrivacyPolicy = () => {
  const [privacyPolicy, setPrivacyPolicy] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrivacyPolicy = async () => {
      try {
        const response = await axios.get('/api/privacy');
        if (response.data.length > 0) {
          const privacyData = response.data[0];
          setPrivacyPolicy(privacyData.privacyPolicy);
        }
      } catch (err) {
        console.error('Failed to fetch privacy policy:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrivacyPolicy();
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto mt-8 bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Privacy Policy</h1>
        </div>
        <div className="p-6 sm:p-8">
          <div dangerouslySetInnerHTML={{ __html: privacyPolicy }} />
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;