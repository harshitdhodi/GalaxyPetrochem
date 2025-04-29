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
    <div className="min-h-screen bg-white">
      {/* Header */}
      {banners && banners.length > 0 ? (
        <Banner imageUrl={`/api/image/download/${banners[0].image}`} />
      ) : (
        <Banner imageUrl={banner} />
      )}
      {/* Breadcrumb below the banner */}
      <div className="container mx-auto px-4  max-w-7xl bottom-2 -mt-8 relative z-10">
        <nav className="text-[#fff] text-md  font-semibold">
          <Link to="/">
            <span className="text-[12px] bg-gray-600 px-4 py-1 rounded-md sm:text-[15px] text-white">Home</span>
          </Link>
          <span className="mx-2 text-white text-xl">&gt;</span>
          <Link to="#">
            <span className="text-[12px] bg-gray-600 px-4 py-1 rounded-md sm:text-[15px] text-white">About Us</span>
          </Link>
        </nav>
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