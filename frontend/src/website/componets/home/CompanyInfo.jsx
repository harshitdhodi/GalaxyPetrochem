"use client"
import { useEffect, useState } from "react";
import axios from "axios";
import company from "../../../assets/petrochemical.webp";
import { ArrowRight, Award, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function CompanyInfo() {
  const [aboutData, setAboutData] = useState(null);

  useEffect(() => {
    axios.get("/api/aboutus/getAll")
      .then(res => {
        // Assuming data is in res.data.data[0]
        setAboutData(res.data?.data?.[0]);
      })
      .catch(err => {
        console.error("Failed to fetch About Us data:", err);
      });
  }, []);

  if (!aboutData) return null; // or a loading spinner

  return (
    <section className="relative w-full sm:py-10 overflow-hidden bg-gradient-to-b from-white to-gray-50">
      {/* Decorative elements */}
      <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-blue-100 opacity-20 -mr-32 -mb-32"></div>
      <div className="absolute top-1/4 left-0 w-32 h-32 rounded-full bg-purple-100 opacity-20 -ml-16"></div>

      <div className="max-w-[78rem] mx-auto pb-10  relative z-10">
        <div className="grid items-start gap-16 lg:grid-cols-2">
          {/* Image section */}
          <div className="flex justify-center w-full order-2 lg:order-1">
            <div className="relative w-full group">
              <div className="relative w-full mt-1 overflow-hidden rounded-md hover:shadow-[0_20px_50px_rgba(8,112,184,0.3)] transition-all duration-500 group-hover:shadow-[0_20px_50px_rgba(8,112,184,0.5)]">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 to-purple-700/20 z-10 mix-blend-multiply"></div>
                <div className="w-full  h-full">
                  <img
                    src={`/api/logo/download/${aboutData?.photo}`}
                    alt="Our company headquarters"
                    className="object-cover w-full lg:h-[60vh] scale-105 transition-all duration-700 group-hover:scale-100"
                  />
                </div>
                <div className="absolute inset-0 border-2 border-white/20 rounded-2xl z-20 m-3 pointer-events-none"></div>
              </div>

              {/* Stats overlay */}
              <div className="sm:absolute mb-6 mt-2 sm:mb-0 sm:mt-0 -bottom-6 -right-6 bg-white rounded-xl shadow-lg shadow-blue-400 p-4 z-30 transition-transform duration-300 group-hover:translate-y-2">
                <div className="flex gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-[#e84c20]">{aboutData?.years}+ </p>
                    <p className="text-sm text-gray-900">Years</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-[#e84c20]">{aboutData?.clients}+</p>
                    <p className="text-sm text-gray-900">Clients</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-[#e84c20]">{aboutData?.experts}+</p>
                    <p className="text-sm text-gray-900">Experts</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content section */}
          <div className="flex flex-col mt-8 sm:mt-0 justify-center  order-1 lg:order-2">
            <div>
      
              <p
                className="text-xl text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: aboutData?.details || "Company description goes here.",
                }}
              />
            
            </div>

           

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to={"/products"}
                className="inline-flex h-12 items-center justify-center border border-gray-200 rounded-lg bg-[#fff] px-8 text-base font-medium text-gray-700  shadow-[#e84c20]/20 transition-all duration-300  hover:shadow-[#e84c20]/30 hover:text-white hover:bg-[#e84c20] hover:translate-y-[-2px] "
              >
                Our Products
              </Link>
              <Link
                to={"/brands"}
                className="inline-flex h-12 items-center justify-center rounded-lg border border-gray-200 hover:bg-[#e84c20] bg-white px-8 text-base font-medium text-gray-700 shadow-sm transition-all duration-300  hover:text-white  hover:translate-y-[-2px] focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 group"
              >
                Our Brands
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
