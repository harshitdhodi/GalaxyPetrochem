import React from 'react';
import img from '../images/introduction.png';
import { Banner } from "../componets/Banner";
import CountriesTable from "../componets/worldwide/CountriesTable";
import { Link, useLocation } from 'react-router-dom';
import { useGetAllWorldwideQuery } from '../../slice/worldwide/worldwide';
import { useGetBannerByPageSlugQuery } from '@/slice/banner/banner';

export default function WorldWide() {
    const location = useLocation();
    const path = location.pathname.replace(/^\//, '') || 'worldwide'; // Remove leading slash and default to 'worldwide'
    console.log(path);
    const { data: banners, isLoading: isBannerLoading } = useGetBannerByPageSlugQuery(path);
    const { data: worldwideData, isLoading: isWorldwideLoading } = useGetAllWorldwideQuery();
    const allData = worldwideData?.data || [];

    const internationalData = allData.filter(item => item.category === 'international');
    const indiaData = allData.filter(item => item.category === 'india');

    return (
        <main className="min-h-screen bg-white">
            {isBannerLoading ? (
                <div>Loading banner...</div>
            ) : (
                <Banner imageUrl={banners && banners.length > 0 ? `/api/image/download/${banners[0].image}` : img} />
            )}
            <div className="max-w-[75rem] mx-auto px-4 sm:px-6">
                <nav className="py-2 border-b border-gray-200">
                    <div className="flex items-center space-x-2 text-sm">
                        <Link to="/" className="text-gray-600 hover:text-gray-900">
                            Home
                        </Link>
                        <span className="text-gray-400">&raquo;</span>
                        <span className="text-secondary">Worldwide</span>
                    </div>
                </nav>
                <div className="py-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2 md:text-left">
                            Worldwide
                        </h2>
                        <div className="sm:w-[6%] w-1/4 h-1 bg-primary mb-5 mx-0 md:w-[10%]"></div>
                    </div>

                    {/* International Section */}
                    <div className="mb-12">
                        <div className="inline-block bg-main text-white px-4 py-1 mt-2 text-2xl md:text-3xl font-bold mb-6">
                            In International
                        </div>
                        <p className="text-gray-600 mb-8 text-left">
                            We are having distributors network for more than 50 countries of the world.
                        </p>
                        {isWorldwideLoading ? (
                            <div className="text-center">Loading...</div>
                        ) : (
                            <CountriesTable data={internationalData} />
                        )}
                    </div>

                    {/* India Section */}
                    <div className="mb-12">
                        <div className="inline-block bg-main text-white px-4 py-1 text-2xl md:text-3xl font-bold mb-6">
                            In India
                        </div>
                        <p className="text-gray-600 mb-8 text-left ">
                            Our presence across Indian states and cities
                        </p>
                        {isWorldwideLoading ? (
                            <div className="text-center">Loading...</div>
                        ) : (
                            <CountriesTable
                                data={indiaData}
                                isIndiaTable={true}
                            />
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}