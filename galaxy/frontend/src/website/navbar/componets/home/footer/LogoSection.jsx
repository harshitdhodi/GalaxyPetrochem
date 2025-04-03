import { Link } from 'react-router-dom';
import Logo from "../../../../../assets/Galaxy.svg"
export default function LogoSection({ navigate }) {
  return (
    <div className="col-span-2 sm:col-span-1">
      <div className="flex flex-col space-y-4">
        {/* Logo */}
        <Link to="/" className="inline-block">
          <img 
            src={Logo}
            alt="Vihani Enterprise Logo" 
            className="h-16 w-auto"
          />
        </Link>
        
        {/* Short Description */}
        <p className="text-md text-justify text-gray-300 mt-3">
        Vihani Enterprise is a trusted supplier of valves, gaskets, nuts and bolts, tools, and industrial hardware. We provide high-quality mechanical and engineering solutions for various industries.
        </p>
        
        {/* Inquiry Button */}
        <div className="mt-4">
          <Link 
            to="/contact-us" 
            className="inline-block px-4 py-2 bg-primary hover:bg-secondary text-white font-medium rounded transition duration-300"
          >
            Make an Inquiry
          </Link>
        </div>
      </div>
    </div>
  );
}