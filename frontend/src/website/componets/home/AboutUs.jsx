import React from 'react';
import { useLocation } from 'react-router-dom';
import { useGetAboutUsBySlugQuery } from '@/slice/aboutUs/aboutUs';

export default function AboutDescription() {
  const location = useLocation();
  const slug = location.pathname.split('/').pop();
  const { data: aboutData, isLoading, error } = useGetAboutUsBySlugQuery(slug);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data</div>;

  const profileData = aboutData;

  if (!profileData) return <div>No data found</div>;

  return (
    <section className="lg:w-[48rem] w-full text-justify sm:mx-0 bg-white">
      <div className="w-full">
        <div className="prose prose-lg text-md text-gray-700 max-w-none"
          dangerouslySetInnerHTML={{ __html: profileData.description }}
        />
      </div>
    </section>
  );
}
