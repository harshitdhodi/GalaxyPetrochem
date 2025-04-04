import React from 'react'
import CategoryCards from '../componets/home/CategoryCards';
import FeaturedProducts from '../componets/home/FeatureProducts';
import CorporateProfile from '../componets/home/CorporateProfile';
import Slideshow from '../componets/home/slideshow/SlideShow';
import CompanyInfo from '../componets/home/CompanyInfo';

const HomePage = () => {
  return (
    <div className='w-full'>
      <Slideshow />
      <CompanyInfo />
      <CategoryCards />
      <FeaturedProducts />
      <CorporateProfile />
     
    </div>
  )
}

export default HomePage
