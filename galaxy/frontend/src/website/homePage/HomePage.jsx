import React, { useEffect, useState } from 'react'
import CategoryCards from '../componets/home/CategoryCards';
import FeaturedProducts from '../componets/home/FeatureProducts';
import CorporateProfile from '../componets/home/CorporateProfile.jsx';
import Slideshow from './component/SlideShow'
import CompanyInfo from '../componets/home/CompanyInfo.jsx';
import axios from 'axios';

const HomePage = () => {
  const [homeData, setHomeData] = useState({
    category: [],
    recentProducts: [],
    catalogue: [],
    aboutUs: []
  });

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await axios.get('/api/allHome/getAllHomePage');
        console.log(response.data)
        setHomeData(response.data); 
      } catch (error) {
        console.error('Error fetching home page data:', error);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className='w-full'>
      <Slideshow />
      <CompanyInfo />
      <CategoryCards categories={homeData.category} />
      <FeaturedProducts recentProducts={homeData.recentProducts}  catalogues={homeData.catalogue}/>
      <CorporateProfile aboutData={homeData.aboutUs} />
      {/* <Footer /> */}
    </div>
  );
};

export default HomePage
