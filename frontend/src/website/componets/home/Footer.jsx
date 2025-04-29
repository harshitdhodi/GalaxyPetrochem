import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import CorporateSection from './footer/CorporateSection.jsx';
import ProductsSection from './footer/ProductSection';
import ContactSection from './footer/ContactSection';
import Copyright from './footer/CopyRight';
import LogoSection from './footer/LogoSection';

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();
  const [contactInfo, setContactInfo] = useState(null);
  const [bgImage, setBgImage] = useState('');
  const footerRef = useRef(null);
  const hasFetched = useRef(false); // To prevent multiple API calls

  // For scroll behavior on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  // For triggering API call after 80% scroll
  useEffect(() => {
    const handleScroll = () => {
      if (hasFetched.current) return; // Skip if API has already been called

      // Calculate scroll percentage
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;

      // Trigger API call when scroll reaches 80%
      if (scrollPercentage >= 85) {
        axios
          .get('/api/contactInfo/get')
          .then((response) => {
            if (response.data && response.data.length > 0) {
              setContactInfo(response.data[0]);
            } else {
              console.error('API response is empty or invalid:', response.data);
            }
          })
          .catch((error) => {
            console.error('Error fetching contact info:', error);
          })
          .finally(() => {
            hasFetched.current = true; // Mark as fetched
          });
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <footer
        ref={footerRef}
        className="relative text-white py-8 md:py-16 bg-gray-800"
        style={{
          backgroundImage: bgImage ? `url(${bgImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Dark Blue Overlay */}
        <div className="absolute inset-0 bg-gradient-to-l from-[#9e5d94] to-[#2860da] text-white"></div>
        
        {/* Content Container */}
        <div className="relative w-full max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8 md:gap-6 lg:gap-8">
            {/* Logo Section */}
            <div className="col-span-1 md:col-span-2 lg:col-span-1 xl:col-span-2">
              <div className="max-w-full sm:max-w-xs md:max-w-sm">
                <LogoSection navigate={navigate} />
              </div>
            </div>

            {/* Corporate Section */}
            <div className="col-span-1">
              <CorporateSection navigate={navigate} />
            </div>

            {/* Products Section */}
            <div className="col-span-1">
              <ProductsSection navigate={navigate} />
            </div>

            {/* Contact Section */}
            <div className="col-span-1">
              <ContactSection contactInfo={contactInfo} navigate={navigate} />
            </div>
          </div>
        </div>
      </footer>
        
      {/* Copyright Section */}
      <Copyright />
    </>
  );
}