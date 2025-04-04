import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';

import LeftSection from './components/LeftSection';
import RightSection from './components/RightSection';
import { Banner } from './components/Banner';

const ContactPage = () => {
  const location = useLocation();
  const path = location.pathname.replace(/^\//, '') || 'contact-us';

  const [banners, setBanners] = useState([]);
  const [isBannerLoading, setIsBannerLoading] = useState(true);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await axios.get(`/api/banner/getByPageSlug?pageSlug=${path}`);
     
        setBanners(response.data || []);
      } catch (error) {
        console.error('Failed to fetch banner:', error);
      } finally {
        setIsBannerLoading(false);
      }
    };

    fetchBanner();
  }, [path]);

  return (
    <>
      <div>
        {isBannerLoading ? (
          <div>Loading banner...</div>
        ) : (
          <Banner imageUrl={banners.length > 0 ? `/api/image/download/${banners[0].image}` : 'img'} />
        )}
      </div>

      <div className="max-w-7xl mx-auto py-4 mb-10">
        <nav className="py-2 border-b mb-8 border-gray-200 px-6">
          <div className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <span className="text-gray-400">&raquo;</span>
            <span className="text-secondary">Contact Us</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="col-span-1">
            <LeftSection />
          </div>
          <div className="col-span-1">
            <RightSection />
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
