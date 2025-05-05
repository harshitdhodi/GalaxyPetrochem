import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function LogoSection() {
  const [logoData, setLogoData] = useState({
    footerLogo: null,
    footerLogoAltName: '',
    footerLogoDescription: '',
  });

  useEffect(() => {
    // Fetch logo data from the API
    const fetchLogoData = async () => {
      try {
        const response = await axios.get('/api/companyLogo/get-logo');
        if (response.data.success) {
          setLogoData({
            footerLogo: response.data.data.footerLogo
              ? `/api/logo/download/${response.data.data.footerLogo}`
              : null,
            footerLogoAltName: response.data.data.footerLogoAltName || '',
            footerLogoDescription: response.data.data.footerLogoDescription || '',
          });
        }
      } catch (error) {
        console.error('Error fetching logo data:', error);
      }
    };

    fetchLogoData();
  }, []);

  return (
    <div className="col-span-2 sm:col-span-1">
      <div className="flex flex-col space-y-4">
        {/* Logo */}
        <Link to="/" className="inline-block">
          {logoData.footerLogo ? (
            <img
              src={logoData.footerLogo}
              alt={logoData.footerLogoAltName || 'Footer Logo'}
              className="h-16 w-auto"
            />
          ) : (
            <p className="text-gray-300">Logo not available</p>
          )}
        </Link>

        {/* Short Description */}
        <p className="text-md text-justify text-gray-300 mt-3">
          {logoData.footerLogoDescription ||
            'Galaxy Petrochemical is a trusted supplier of industrial oils, greases, and lubricants. We provide high-quality solutions tailored to meet the needs of various industries.'}
        </p>

        {/* Inquiry Button */}
        <div className="mt-4">
          <Link
            to="/contact-us"
            className="inline-block px-4 py-2 bg-[#e85920] text-white font-medium rounded transition duration-300"
          >
            Make an Inquiry
          </Link>
        </div>
      </div>
    </div>
  );
}