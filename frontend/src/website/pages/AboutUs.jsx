import { useEffect, useState } from "react";
import banner from "../.././assets/petrochemical.webp";
import { Banner } from "./Banner.jsx";
// import { CompanyInfo } from "./aboutUs/CompanyInfo.jsx";
import { MissionVision } from "./aboutUs/MissionVision.jsx";
import CompanyInfo from "../componets/home/CompanyInfo";
import IndustryExpertise from "./aboutUs/IndustryExpertise";
import axios from "axios";
import { Link } from "react-router-dom";


export default function PetrochemicalAboutUs() {
  const path = location.pathname.replace(/^\//, '') || 'introduction';
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await axios.get(`/api/banner/getByPageSlug?pageSlug=${path}`);
        setBanners(response.data || []);
      } catch (error) {
        console.error('Failed to fetch banner:', error);
      }
    };

    fetchBanner();
  }, [path]);

  return (
    <div className="min-h-screen mb-2 bg-white">
    
    <div className="relative">
           {/* Banner */}
           {banners && banners.length > 0 ? (
             <Banner imageUrl={`/api/image/download/${banners[0].image}`} title={banners[0].title} />
           ) : (
             <Banner imageUrl={banner} />
           )}
   
           {/* Breadcrumb - centered horizontally, below the title */}
           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 mt-5 z-10">
             <nav className=" px-4 py-2 rounded-md text-white text-sm sm:text-md font-semibold">
               <Link to="/">
                 <span className="    text-[12px] sm:text-[15px]">Home</span>
               </Link>
               <span className="mx-2">/</span>
               <Link to="#">
                 <span className="text-[12px] sm:text-[15px]">About Us</span>
               </Link>
             </nav>
           </div>
         </div>
      <CompanyInfo />
      <MissionVision />
      {/* <ProductShowcase /> */}
      <IndustryExpertise />
      {/* <Sustainability /> */}
      {/* <GlobalPresence /> */}

    </div>
  );
}