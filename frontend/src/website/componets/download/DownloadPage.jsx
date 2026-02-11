import ProductList from "./product-list"
import { Link, useLocation } from "react-router-dom"
import { Banner } from "../Banner";
import axios from "axios";
import { useState, useEffect } from "react";

export default function DownloadPage() {
    const location = useLocation();
    const path = location.pathname.replace(/^\//, '') || 'introduction';
    const [banners, setBanners] = useState([]);
  
    useEffect(() => {
      const fetchBanner = async () => {
        try {
          const response = await axios.get(`/api/banner/getByPageSlug?pageSlug=${path}`);
          setBanners(response.data || []);
        } catch (error) {
          console.error('Failed to fetch banner:', error);
        }
      };
  
      fetchBanner();
    }, [path]);
  
    return (
        <main className="min-h-screen bg-background">
            <div className="relative">
                {/* Banner */}
                {banners && banners.length > 0 ? (
                    <Banner imageUrl={`/api/image/download/${banners[0].image}`} title={banners[0].title} />
                ) : (
                    <Banner imageUrl="/default-banner.jpg" />
                )}
       
                {/* Breadcrumb - centered horizontally, below the title */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 mt-5 z-10">
                    <nav className="px-4 py-2 rounded-md text-white text-sm sm:text-md font-semibold">
                        <Link to="/">
                            <span className="text-[12px] sm:text-[15px]">Home</span>
                        </Link>
                        <span className="mx-2">/</span>
                        <Link to="/download">
                            <span className="text-[12px] sm:text-[15px]">Download</span>
                        </Link>
                    </nav>
                </div>
            </div> 
            <div className="container mx-auto px-4 py-8">
                {/* <h1 className="text-4xl font-bold text-center mb-8 text-foreground">Product Catalog</h1> */}
                <ProductList />
            </div>
        </main>
    )
}