import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default function Breadcrumb({ chemicals = '', slug = '', categorySlug = ''}) {
  console.log(slug)
  return (
    <nav className="pt-5 sm:text-xs md:text-sm  lg:text-base text-md pb-3 w-full mb-5 py-2 px-4">
      <ul className="flex gap-2 flex-wrap">
        <li>
          <Link to="/" className="text-[#ffff] hover:text-[#ffff]">
            Home
          </Link>
        </li>
        <li className="text-[#ffff]">/</li>
        <li>
          <Link to="/products" className="text-[#ffff] hover:text-[#ffff]">
            Products
          </Link>
        </li>
        {chemicals && <li className="text-secondary">/</li>}
        {chemicals && ( 
          <li>
            <Link 
              to={`/${slug}`} 
              className="text-[#e95821] hover:text-[#ffff]"
            >
              {chemicals.charAt(0).toUpperCase() + chemicals.slice(1).toLowerCase()}
            </Link>
          </li>
        )}
        {categorySlug && <li className="text-[#ffff]">/</li>}
        {categorySlug && (
          <li>
            <span className="text-[#ffff]"> {categorySlug?.charAt(0)?.toUpperCase() + categorySlug?.slice(1)}</span>
          </li>
        )}
       
      </ul>
    </nav>
  );
}

Breadcrumb.propTypes = {
  chemicals: PropTypes.string.isRequired,
  categorySlug: PropTypes.string.isRequired,
  selectedLetter: PropTypes.string,
};
