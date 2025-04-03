import React from 'react'
// import Slideshow from './../componets/home/SlideShow';
// import NavigationMenu from '../componets/home/NavigationMenu';
import CategoryCards from '../componets/home/CategoryCards';
import FeaturedProducts from '../componets/home/FeatureProducts';
import CorporateProfile from '../componets/home/CorporateProfile';
import Footer from '../componets/home/Footer';
import Slideshow from '../componets/home/slideshow/SlideShow';
import NavigationMenu from '../componets/home/navigation/Navigation';
import CompanyInfo from '../componets/home/CompanyInfo';
// import FeaturedProducts from '../componets/home/feature/FeatureProducts';

const HomePage = () => {
  return (
    <div className='w-full'>
      {/* <h1 className="text-3xl font-bold mb-4 text-center">Responsive Slideshow</h1> */}
      <Slideshow />
      <CompanyInfo />
      <CategoryCards />
      <FeaturedProducts />
      <CorporateProfile />
     
    </div>
  )
}

export default HomePage
