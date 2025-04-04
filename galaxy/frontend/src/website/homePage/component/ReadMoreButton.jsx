import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const ReadMoreButton = ({ lcpImageLoaded }) => {
  return (
    <div
      className={`absolute w-full top-1/2 md:mb-5 transform -translate-y-1/2 px-4 sm:px-[15%] ${!lcpImageLoaded ? "hidden" : ""}`}
    >
      <Link to="/introduction">
        <button className="bg-[#e84c20] hover:bg-[#e83e20] text-md sm:text-sm md:text-base font-medium sm:font-bold px-3 py-1 sm:px-4 sm:py-2 md:px-5 relative -bottom-52 rounded-md shadow-md shadow-[#416360] text-white md:py-2 sm:flex items-center sm:mb-16 hidden gap-1 sm:gap-2">
          <span className="lg:text-lg  ">Read More</span>
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
        </button>
      </Link>
    </div>
  );
};

export default ReadMoreButton;