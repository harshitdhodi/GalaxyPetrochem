import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./website/navbar/Navbar";
import ContactPage from "./website/contactUs/ContactUs";
import PetrochemicalAboutUs from "./website/aboutUs/AboutUs";
import BlogPage from "./website/blog/Blog";

// Lazy load pages
const HomePage = lazy(() => import("./website/homePage/HomePage"));
// const AboutPage = lazy(() => import("./website/about/AboutPage"));
// const NotFound = lazy(() => import("./website/NotFound"));

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
    </>
  );
};

export default App;
