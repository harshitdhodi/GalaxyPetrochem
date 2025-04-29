import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react"; // Importing the MessageCircle icon from lucide-react
import { useGetWhatsUpInfoQuery } from '@/slice/whatsUpInfo/WhatsUpInfo';
import { useGetAllCataloguesQuery } from '@/slice/catalogue/catalogueslice';
import { WhatsAppOutlined } from '@ant-design/icons';

export default function MSDSSection({ msds, specs, name, onInquiry }) {
  const { data: whatsUpInfo, isLoading: isWhatsUpLoading } = useGetWhatsUpInfoQuery();
  const { data: catalogues, isLoading: isCataloguesLoading } = useGetAllCataloguesQuery(); // Fetch catalogues
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (whatsUpInfo && whatsUpInfo.length > 0) {
      setPhoneNumber(whatsUpInfo[0].number);
      setMessage(`Hi, I'm interested in ${name}`);
    }
  }, [whatsUpInfo, name]);

  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (isWhatsUpLoading || isCataloguesLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-12 bg-gradient-to-r from-blue-50 to-blue-100 p-5 shadow-md">
      <h2 className="text-xl font-semibold mb-6 text-blue-900 border-b border-blue-200 pb-3">
        {name} MSDS (Material Safety Data Sheet) or SDS, COA and Specs
      </h2>
      <div className="flex flex-wrap gap-4 mb-3">
        {catalogues && catalogues.length > 0 ? (
          catalogues.map((catalogue) => (
            <div key={catalogue._id} className="w-full md:w-1/3 lg:w-1/4">
              <Button
                onClick={() => window.open(`/api/image/view/${specs}`, '_blank')}
                className="w-full bg-[#e85920] hover:bg-[#0f7aa8] transition-colors duration-300 text-white text-md py-2"
              >
                Catalogue
              </Button>
            </div>
          ))
        ) : (
          <div>No catalogues available for download.</div>
        )}
        
        <Button
          onClick={() => window.open(`/api/image/view/${msds}`, '_blank')}
          className="w-full md:w-1/4 bg-[#e95821] hover:bg-[#e85920] transition-colors duration-300 text-white text-md py-5 flex items-center gap-2"
        >
          MSDS
        </Button>
        <Button
          onClick={onInquiry}
          className="w-full md:w-1/4 bg-[#e85920] hover:bg-[#e95821] transition-colors duration-300 text-white text-md py-5 flex items-center gap-2"
        >
          Inquiry Now
        </Button>
        <div 
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleWhatsAppClick}
        >
          <WhatsAppOutlined className="text-4xl text-green-500"/> {/* Using the MessageCircle icon from lucide-react */}
        </div>
      </div>
    </div>
  );
}