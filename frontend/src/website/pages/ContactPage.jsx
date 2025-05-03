import { Link, useLocation } from 'react-router-dom';
import { Banner } from '../componets/Banner';
import LeftSection from '../componets/contact_sec/LeftSide';
import RightSection from '../componets/contact_sec/RightSide';
import img from "../images/contact-us.png";
import { useGetBannerByPageSlugQuery } from '@/slice/banner/banner';

const ContactPage = () => {
  const location = useLocation();
  const path = location.pathname.replace(/^\//, '') || 'contact';
  const { data: banners, isLoading: isBannerLoading } = useGetBannerByPageSlugQuery(path);

  return (
    <>
     <div className="relative">
          {/* Banner */}
          {banners && banners.length > 0 ? (
            <Banner imageUrl={`/api/image/download/${banners[0].image}`} title={banners[0].title} />
          ) : (
           "no image"
          )}
  
          {/* Breadcrumb - centered horizontally, below the title */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 mt-5 z-10">
            <nav className=" px-4 py-2 rounded-md text-white text-sm sm:text-md font-semibold">
              <Link to="/">
                <span className="text-[12px] sm:text-[15px]">Home</span>
              </Link>
              <span className="mx-2">/</span>
              <Link to="#">
                <span className="    text-[12px] sm:text-[15px]">Contact Us</span>
              </Link>
            </nav>
          </div>
        </div>

      <div className="max-w-7xl mx-auto mt-16 py-4 mb-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
       <div className='col-span-1'>
       <LeftSection />
       </div>
        <div className='col-span-1'>
        <RightSection />
        </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;