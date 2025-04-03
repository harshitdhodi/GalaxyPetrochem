'use client'

import React, { useState } from 'react';
import { ArrowBigLeft, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowRight } from "lucide-react";
import { cn } from '@/lib/utils';
import AboutDescription from '../home/AboutUs';
import MissionVision from './MissionVision';
import { useLocation, Link } from 'react-router-dom';
import { useGetBannerByPageSlugQuery } from '@/slice/banner/banner';
import img from "../../images/introduction.png";
import { Banner } from '../Banner';

const menuItems = [
  {
    title: 'Corporate Profile',
    items: [
      { title: 'Introduction', href: '/introduction', active: false },
      { title: 'Vision & Mission', href: '/vision-mission' },
    ]
  }
];

export default function MainContent() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const path = location.pathname.replace(/^\//, '') || 'introduction'; // Remove leading slash and default to 'introduction'
  const { data: banners, isLoading } = useGetBannerByPageSlugQuery(path);

  const MenuItem = ({ title, href }) => {
    const isActive = location.pathname === href ||
      (href === '/introduction' && location.pathname === '/');

    return (
      <Link
        to={href}
        className={cn(
          'flex items-center gap-2 px-4 py-3 text-sm transition-colors hover:text-white hover:bg-[#264796]',
          'last:mb-0 mb-2',
          isActive
            ? 'bg-main text-white'
            : 'text-gray-700'
        )}
      >
        <ArrowRight className={cn("h-4 w-4", isActive && "text-secondary")} />
        {title}
      </Link>
    );
  };

  const breadcrumbText = location.pathname === '/vision-mission' ? 'Vision & Mission' : 'Introduction';

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      {banners && banners.length > 0 ? (
        <Banner imageUrl={`/api/image/download/${banners[0].image}`} />
      ) : (
        <Banner imageUrl={img} />
      )}
      <div className="min-h-screen bg-white overflow-x-hidden">
        {/* Breadcrumb */}
        <div className="pt-3 mx-5 ">
          <div className="mx-auto  max-w-[75rem] border-b sm:px-4 pb-3">
            <div className="flex items-center gap-2 text-sm text-primary">
              <Link to="/" className="hover:text-gray-900">Home</Link>
              <ChevronRight className="h-4 w-4" />
              <Link to="/introduction" className="hover:text-gray-900">Corporate</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-main">{breadcrumbText}</span>
            </div>
          </div>
        </div>

        <div className="sm:mx-auto sm:max-w-6xl ml-5 lg:px-5 xl:px-0 mr-3 py-5 lg:py-8">
          <h1 className='text-2xl font-bold'>
            {location.pathname === '/vision-mission' ? 'Vision & Mission' : 'Introduction'}
          </h1>
          <div className='w-16 h-1 bg-primary mb-6'></div>

          <div className="flex flex-col-reverse lg:flex-row gap-8">
            {/* Mobile Sidebar (Bottom) */}
            <div className="lg:hidden block fixed bottom-0  w-[100%]  bg-white shadow-md p-4 border-t max-w-full">

              <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full flex justify-between">
                    <span className='font-bold text-center w-full text-main'>Corporate Profile</span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
                  </Button>

                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full mt-2" align="start">
                  <nav className="max-h-[50vh] overflow-auto">
                    {menuItems[0].items.map((item) => (
                      <MenuItem key={item.title} {...item} />
                    ))}
                  </nav>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Desktop Sidebar (Left) */}
            <div className="hidden lg:block w-[350px]">
              <nav className="overflow-auto border border-gray-200 max-h-[80vh]">
                {menuItems.map((section) => (
                  <div className="border-b border-gray-200" key={section.title}>
                    <button
                      className="flex w-full items-center justify-between bg-blue-50 px-4 py-3 lg:text-xl text-lg xl:text-2xl font-normal text-gray-600 hover:bg-blue-100"
                    >
                      {section.title}
                    </button>
                    <div className="bg-blue-50/50">
                      {section.items.map((item) => (
                        <MenuItem key={item.title} {...item} />
                      ))}
                    </div>
                  </div>
                ))}
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex mx-2">
              {location.pathname === "/vision-mission" ? <MissionVision /> : <AboutDescription />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
