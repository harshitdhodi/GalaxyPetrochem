import React from 'react';
import { useGetAboutUsQuery } from '@/slice/aboutUs/aboutUs';
import { Link } from 'react-router-dom';

export default function AboutUs() {
  const { data: aboutData, isLoading } = useGetAboutUsQuery();

  if (isLoading) return <div>Loading...</div>;

  // Find the data that has slug "introduction"
  const profileData = aboutData?.find(item => item.slug === "introduction");

  if (!profileData) return null; // Hide component if no matching data

  return (
    <section className="bg-white">
      <div className="max-w-[75rem] mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold text-main mb-1">{profileData.title}</h1>
        <div className='w-16 h-1 bg-secondary mb-6'></div>   
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left side - Image */}
          <div className="md:[15%]">
            <img
              src={`/api/image/download/${profileData.image}`}
              alt={profileData.altName}
              title={profileData.title}
              className="w-full object-cover shadow-md"
            />
          </div>

          {/* Right side - Content */}
          <div className="md:w-[85%] flex flex-col justify-center">
            <div 
              className="text-gray-600 text-md leading-relaxed"
              dangerouslySetInnerHTML={{ __html: profileData.shortDescription }}
            />
            <Link to={`/introduction/${profileData.slug}`}>
              <span className='text-main/80 text-sm'> More...</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
