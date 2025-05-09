import React, { useEffect, useState } from 'react';
import axios from 'axios';
import contactImg from "../../../assets/contact.png";
import { Link } from 'react-router-dom';
import { Mail, PhoneCall } from 'lucide-react';

export default function LeftSection() {
  const [contactInfo, setContactInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await axios.get('/api/contactInfo/get');
        setContactInfo(response.data[0] || {}); // Default to an empty object if no data
      } catch (error) {
        console.error("Error fetching contact info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!contactInfo) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md shadow-sm">
        <p className="font-medium">Error loading contact information.</p>
        <p className="text-sm mt-1">Please try again later or contact support.</p>
      </div>
    );
  }

  // Assuming 'photo' is an array and using the first image filename
  const imageUrl = contactInfo.photo?.[0] ? `/api/image/download/${contactInfo.photo[0]}` : contactImg;

  return (
    <div className="px-6  space-y-6 bg-white rounded-xl shadow-sm">
 
      <div className="space-y-5">
        <div className="bg-custom-gradient p-4 rounded-lg shadow-md ">
          <h3 className="font-semibold text-white text-lg">Corporate Office</h3>
          <p className="text-white mt-2">{contactInfo.address || "Address not available"}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Display mobile numbers */}
          <div className="bg-custom-gradient p-4 rounded-lg  shadow-md ">
            <div className="flex gap-3 items-center mb-4">
              <div className="bg-blue-100 p-2 rounded-full">
                <PhoneCall className="w-6 h-6 text-primary" />
              </div>
              <span className="font-semibold text-white text-lg">Call Us</span>
            </div>
            <div className="space-y-2 pl-2 border-l-2 border-primary">
              {contactInfo.mobiles?.length > 0 ? (
                contactInfo.mobiles.map((mobile, index) => (
                  <p key={index} className="text-white hover:text-white transition-colors duration-200">
                    <a href={`tel:${mobile.replace(/\s+/g, '')}`} className="flex items-center">
                      {mobile}
                    </a>
                  </p>
                ))
              ) : (
                <p className="text-gray-500 italic">No phone numbers available</p>
              )}
            </div>
          </div>

          {/* Display emails */}
          <div className="bg-custom-gradient p-4 rounded-lg  shadow-md">
            <div className="flex gap-3 items-center mb-4">
              <div className="bg-indigo-100 p-2 rounded-full">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-white">Email Us</h2>
            </div>
            <div className="space-y-2 pl-2 border-l-2 border-primary">
              {contactInfo.emails?.length > 0 ? (
                contactInfo.emails.map((email, index) => (
                  <Link
                    key={index}
                    to={`mailto:${email}`}
                    className="text-white block hover:text-white transition-colors duration-200"
                  >
                    {email}
                  </Link>
                ))
              ) : (
                <p className="text-gray-500 italic">No email addresses available</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-12 overflow-hidden group">
        {/* Embedded Google Map */}
        <div className="relative overflow-hidden rounded-md shadow-lg">
          <iframe
            title="Google Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3740.436321742793!2d72.9233878!3d20.364892199999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be0cd408afbac0b%3A0x1d061ea33ce12c36!2sGALAXY%20PETROCHEMICALS!5e0!3m2!1sen!2sin!4v1746276172969!5m2!1sen!2sin"
            width="100%"
            height="410"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
          {/* <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent opacity-80"></div> */}

      
        </div>
      </div>




    </div>
  );
}