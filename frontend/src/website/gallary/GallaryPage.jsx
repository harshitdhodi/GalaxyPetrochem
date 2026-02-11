import React, { useEffect, useState } from 'react';
import GallaryChild from './GallaryChild';
import { Banner } from '../pages/Banner';
import axios from 'axios';
import { Link } from 'react-router-dom';

const GallaryPage = () => {
  const [banners, setBanners] = useState([]);
  const [error, setError] = useState(null);
  const path = location.pathname.replace(/^\//, '') || 'introduction';

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await axios.get(`/api/banner/getByPageSlug?pageSlug=${path}`);
        console.log(response.data);
        const bannersArray = Array.isArray(response.data) ? response.data : [];
        console.log(bannersArray);
        setBanners(bannersArray);
      } catch (error) {
        console.error('Failed to fetch banner:', error);
        setError('Failed to load banner. Please try again later.');
        setBanners([]);
      }
    };

    fetchBanner();
  }, [path]);

  const defaultBannerImage = 'https://via.placeholder.com/1200x400?text=Default+Banner';

  return (
    <div>
      <div className="relative">
        {/* Banner */}
        {error ? (
          <div className="text-center text-red-500 py-4 bg-gray-100 rounded-md">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        ) : banners.length > 0 ? (
          <Banner
            imageUrl={`/api/image/download/${banners[0].image}`}
            title={banners[0].title !== 'undefined' ? banners[0].title : 'Gallery'}
          />
        ) : (
          <Banner imageUrl={defaultBannerImage} title="Gallery" />
        )}

        {/* Breadcrumb */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 mt-5 z-10">
          <nav className="px-4 py-2 rounded-md text-white text-sm sm:text-base font-semibold">
            <Link to="/">
              <span className="text-xs sm:text-sm hover:underline">Home</span>
            </Link>
            <span className="mx-2">/</span>
            <Link to="/gallery">
              <span className="text-xs sm:text-sm hover:underline">Gallery</span>
            </Link>
          </nav>
        </div>
      </div>

      <GallaryChild />
    </div>
  );
};

export default GallaryPage;