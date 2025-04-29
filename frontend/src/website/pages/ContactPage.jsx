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
      <div>
        {isBannerLoading ? (
          <div>Loading banner...</div>
        ) : (
          <Banner imageUrl={banners && banners.length > 0 ? `/api/image/download/${banners[0].image}` : img} />
        )}
         {/* Breadcrumb below the banner */}
                <div className="container mx-auto px-4 max-w-7xl -mt-8 relative z-10">
                  <nav className="text-[#fff] text-md font-semibold">
                    <Link to="/">
                      <span className="text-[12px] bg-gray-600 px-2 rounded-md sm:text-[15px] text-white">Home</span>
                    </Link>
                    <span className="mx-2 text-white">&gt;</span>
                    <Link to="#">
                      <span className="text-[12px] bg-gray-600 px-2 rounded-md sm:text-[15px] text-white">Contact Us</span>
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