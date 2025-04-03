import React from 'react'
import img from "../images/adBanner.jpg"
import { Banner } from '../componets/Banner'
import SearchSections from '../componets/advanceSearch/SearchSections'
const AdvanceSearch = () => {
  return (
    <>
      <Banner imageUrl={img} /> 
     <div className='w-full flex flex-col justify-center items-center'>
     <div className='lg:max-w-[75rem]'>
        <div className="">
            <h2 className="text-3xl mt-8 font-bold text-gray-700">
                Advance Search
            </h2>
            <div className=" bg-secondary w-[6%] h-1 "></div>
        </div>
      <SearchSections/>
      </div>
     </div>
    </>
  )
}

export default AdvanceSearch
