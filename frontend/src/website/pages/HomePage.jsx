import  { useEffect, useState } from 'react';
import CategoryCards from '../componets/home/CategoryCards';
import FeaturedProducts from '../componets/home/FeatureProducts';
import Slideshow from '../componets/home/SlideShow';
import CompanyInfo from '../componets/home/CompanyInfo.jsx';
import axios from 'axios';
import TestimonialSection from './component/Testimonial.jsx';
import HomeBlogCom from './component/HomeMainBlogCom';

const HomePage = () => {
  const [homeData, setHomeData] = useState({
    category: [],
    recentProducts: [],
    catalogue: [],
    aboutUs: []
  });

  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollY / docHeight) * 100;

      if (scrollPercent > 20 && !hasScrolled) {
        setHasScrolled(true);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasScrolled]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await axios.get('/api/allHome/getAllHomePage');
        setHomeData(response.data);
      } catch (error) {
        console.error('Error fetching home page data:', error);
      }
    };

    if (hasScrolled) {
      fetchHomeData();
    }
  }, [hasScrolled]);

  return (
    <div className='w-full'>
      <Slideshow />
      <CompanyInfo />
      {hasScrolled && (
        <>
          <CategoryCards categories={homeData.category} />
          <FeaturedProducts recentProducts={homeData.recentProducts} catalogues={homeData.catalogue} />
          <TestimonialSection />
          <HomeBlogCom />
        </>
      )}
    </div>
  );
};

export default HomePage;
