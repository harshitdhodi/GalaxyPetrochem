"use client";
import { ArrowRight, Award, Clock, Users } from "lucide-react";

export default function CompanyInfo() {
  return (
    <section className="relative w-full py-16 overflow-hidden bg-gradient-to-b from-white to-gray-50">
      <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-blue-100 opacity-20 -mr-32 -mb-32"></div>
      <div className="absolute top-1/4 left-0 w-32 h-32 rounded-full bg-purple-100 opacity-20 -ml-16"></div>

      <div className="max-w-[80rem] mx-auto px-6 relative z-10">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="flex justify-center w-full order-2 lg:order-1">
            <div className="relative w-full group">
              <div className="relative w-full lg:mt-8 overflow-hidden rounded-md shadow-[0_20px_50px_rgba(8,112,184,0.3)] transition-all duration-500 group-hover:shadow-[0_20px_50px_rgba(8,112,184,0.5)]">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 to-purple-700/20 z-10 mix-blend-multiply"></div>
                <div className="w-full h-full">
                  <img
                    src="/petrochemical.webp"
                    alt="Our company headquarters"
                    className="object-cover w-full lg:h-[60vh] scale-105 transition-all duration-700 group-hover:scale-100"
                    width={1200} // Adjust based on image dimensions
                    height={800} // Adjust based on image dimensions
                  />
                </div>
                <div className="absolute inset-0 border-2 border-white/20 rounded-2xl z-20 m-3 pointer-events-none"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-lg shadow-blue-400 p-4 z-30 transition-transform duration-300 group-hover:translate-y-2">
                <div className="flex gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-[#e84c20]">13+</p>
                    <p className="text-sm text-gray-900">Years</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-[#e84c20]">200+</p>
                    <p className="text-sm text-gray-900">Clients</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-[#e84c20]">50+</p>
                    <p className="text-sm text-gray-900">Experts</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Rest of your component remains unchanged */}
          <div className="flex flex-col justify-center space-y-8 order-1 lg:order-2">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-4">
                <Clock className="w-4 h-4 mr-2" />
                Established 2010
              </div>
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl text-[#e84c20] mb-4 leading-tight">
                Transforming Industries <span className="text-gray-600">Through Innovation</span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                For over a decade, we've been at the forefront of innovation and excellence, delivering exceptional
                solutions to complex challenges.
              </p>
            </div>
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Award className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Excellence in Everything</h3>
                  <p className="text-gray-600">
                    Our team of experienced professionals brings together diverse expertise to create tailored
                    strategies that drive sustainable growth and success.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Client-Centered Approach</h3>
                  <p className="text-gray-600">
                    We believe in building lasting relationships with our clients based on trust, transparency, and
                    mutual respect, guided by our core values.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href="#contact"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-[#e84c20] px-8 text-base font-medium text-white shadow-lg shadow-[#e84c20]/20 transition-all duration-300 hover:bg-[#e83720] hover:shadow-[#e84c20]/30 hover:translate-y-[-2px] focus:ring-2 focus:ring-[#e84c20] focus:ring-offset-2"
              >
                Contact Us
              </a>
              <a
                href="#services"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-gray-200 bg-white px-8 text-base font-medium text-gray-700 shadow-sm transition-all duration-300 hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200 hover:translate-y-[-2px] focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 group"
              >
                Our Services
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}