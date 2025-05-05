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
    <section className="relative w-full px-5 lg:px-0 sm:py-7 overflow-hidden bg-gradient-to-b from-white to-gray-50">
      {/* Decorative elements */}
      <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-blue-100 opacity-20 -mr-32 -mb-32"></div>
      <div className="absolute top-1/4 left-0 w-32 h-32 rounded-full bg-purple-100 opacity-20 -ml-16"></div>

      <div className="max-w-[78rem] mx-auto pb-10 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          {/* Image Section */}
          <div className="flex justify-center w-full order-2 lg:order-1">
            <div className="relative w-full h-full group flex flex-col justify-between">
              <div className="relative w-full overflow-hidden rounded-md flex-1">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 to-purple-700/20 z-10 mix-blend-multiply"></div>
                <img
                  src={`/api/logo/download/${aboutData?.photo}`}
                  alt="Our company headquarters"
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-100 rounded-md"
                />
                <div className="absolute inset-0 border-2 border-white/20 rounded-2xl z-20 m-3 pointer-events-none"></div>
              </div>

              {/* Stats overlay */}
              <div className="sm:absolute -bottom-6 -right-6 bg-white rounded-xl shadow-lg shadow-blue-400 p-4 z-30 transition-transform duration-300 group-hover:translate-y-2 mt-4 sm:mt-0">
                <div className="flex gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-[#e84c20]">{aboutData?.years}+</p>
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

          {/* Content Section */}
          <div className="flex flex-col justify-center h-full order-1 lg:order-2">
            <div>
              <p
                className="text-xl text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: aboutData?.details || "Company description goes here.",
                }}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Link
                to="/products"
                className="inline-flex h-12 items-center justify-center border border-gray-200 rounded-lg bg-[#fff] px-8 text-base font-medium text-gray-700 shadow transition hover:shadow-md hover:text-white hover:bg-[#e84c20] hover:translate-y-[-2px]"
              >
                Our Products
              </Link>
              <Link
                to="/brands"
                className="inline-flex h-12 items-center justify-center border border-gray-200 rounded-lg bg-white px-8 text-base font-medium text-gray-700 shadow transition group hover:bg-[#e84c20] hover:text-white hover:translate-y-[-2px]"
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
