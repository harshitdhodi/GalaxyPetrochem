import { Link } from 'react-router-dom';
import Logo from "../../../../assets/Galaxy.svg"
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
          Galaxy Petrochemical is a trusted supplier of industrial oils, greases, and lubricants. We provide high-quality solutions tailored to meet the needs of various industries.
        </p>

        {/* Inquiry Button */}
        <div className="mt-4">
          <Link
            to="/contact-us"
            className="inline-block px-4 py-2 bg-[#e85920]  text-white font-medium rounded transition duration-300"
          >
            Make an Inquiry
          </Link>
        </div>
      </div>
    </div>
  );
}