import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./website/navbar/Navbar";
import ContactPage from "./website/contactUs/ContactUs";
import PetrochemicalAboutUs from "./website/aboutUs/AboutUs";
import BlogPage from "./website/blog/Blog";
import Footer from "./website/navbar/componets/home/Footer";

// Lazy load pages
const HomePage = lazy(() => import("./website/homePage/HomePage"));

const App = () => {
  return (
    <>
      <Navbar /> {/* Navbar remains on all pages */}
      <Suspense fallback={<div className="text-center">Loading...</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about-us" element={<PetrochemicalAboutUs />} />
          <Route path="/contact-us" element={<ContactPage />} />
          <Route path="/blogs" element={<BlogPage />} />
        </Routes>
      </Suspense>
      <Footer/>
    </>
  );
};

export default App;
