import { useEffect, useState } from "react";
import banner from "../.././assets/petrochemical.webp";
import { Banner } from "./Banner.jsx";
// import { CompanyInfo } from "./aboutUs/CompanyInfo.jsx";
import { MissionVision } from "./aboutUs/MissionVision.jsx";
import CompanyInfo from "../componets/home/CompanyInfo";
import IndustryExpertise from "./aboutUs/IndustryExpertise";
import axios from "axios";


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

      <CompanyInfo />
      <MissionVision />
      {/* <ProductShowcase /> */}
      <IndustryExpertise />
      {/* <Sustainability /> */}
      {/* <GlobalPresence /> */}
   
    </div>
  );
}