
import img from "../images/adBanner.jpg"
import { Banner } from "./Banner";
import SearchSections from '../componets/advanceSearch/SearchSections'
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const AdvanceSearch = () => {
    const [banners, setBanners] = useState([]);
    const [isBannerLoading, setIsBannerLoading] = useState(true);
    const path = location.pathname.replace(/^\//, "") || "introduction";

      // Fetch banner data
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await axios.get(`/api/banner/getByPageSlug?pageSlug=${path}`);
        console.log(response.data);
        setBanners(response.data || []);
      } catch (error) {
        console.error("Failed to fetch banner:", error);
      } finally {
        setIsBannerLoading(false);
      }
    };

    fetchBanner();
  }, [path]);

  return (
    <>
           <div className="relative">
              {/* Banner */}
              {banners && banners.length > 0 ? (
                <Banner imageUrl={`/api/image/download/${banners[0].image}`} title={banners[0].title} />
              ) : (
                <Banner imageUrl={img} />
              )}
      
              {/* Breadcrumb - centered horizontally, below the title */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 mt-5 z-10">
                <nav className=" px-4 py-2 rounded-md text-white text-sm sm:text-md font-semibold">
                  <Link to="/">
                    <span className="    text-[12px] sm:text-[15px]">Home</span>
                  </Link>
                  <span className="mx-2">/</span>
                  <Link to="#">
                    <span className="    text-[12px] sm:text-[15px]">Advanced Search</span>
                  </Link>
                </nav>
              </div>
            </div>
     <div className='w-full flex flex-col justify-center items-center'>
     <div className='lg:max-w-[75rem]'>
        <div className="">
            <h2 className="text-3xl mt-8 font-bold text-gray-700">
                Advance Search
            </h2>
            <div className=" bg-[#e85920] w-[6%] h-1 "></div>
        </div>
      <SearchSections/>
      </div>
     </div>
    </>
  )
}

export default AdvanceSearch
