import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import ScrollLink from './ScrollLink';

export default function ContactSection({ contactInfo, navigate }) {
  return (
    <div className='col-span-2 sm:col-span-1'>
      <h2 className="text-xl font-medium mb-6">Corporate Office:</h2>
      {contactInfo ? (
        <div className="space-y-6 text-sm">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
            <p>{contactInfo.address}</p>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-primary flex-shrink-0" />
            <Link to={`mailto:${contactInfo.email}`} className="hover:text-gray-200">
              {contactInfo.emails}
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-primary flex-shrink-0" />
            <p>
              {contactInfo.mobiles && contactInfo.mobiles.length > 0 ? (
                <>
                  <span>{contactInfo.mobiles[0]}</span>
                  {contactInfo.mobiles[1] && <span>, {contactInfo.mobiles[1]}</span>}
                </>
              ) : (
                'No contact numbers available'
              )}
            </p>
          </div>
          <div className="flex  gap-4 text-gray-300 mt-6">
            <ScrollLink to="/privacy-policy" className="hover:text-gray-200" navigate={navigate}>
              Privacy Policy
            </ScrollLink>
            <ScrollLink to="/terms-and-conditions" className="hover:text-gray-200" navigate={navigate}>
              Terms & Conditions
            </ScrollLink>
          </div>
        </div>
      ) : (
        <LoadingContactInfo />
      )}
    </div>
  );
}

function LoadingContactInfo() {
  return (
    <div className="space-y-6 text-sm animate-pulse">
      <div className="flex items-start gap-3">
        <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0" />
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
      </div>
      <div className="flex items-center gap-3">
        <Mail className="w-5 h-5 text-orange-500 flex-shrink-0" />
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
      </div>
      <div className="flex items-center gap-3">
        <Phone className="w-5 h-5 text-orange-500 flex-shrink-0" />
        <div className="h-4 bg-gray-700 rounded w-2/3"></div>
      </div>
    </div>
  );
}