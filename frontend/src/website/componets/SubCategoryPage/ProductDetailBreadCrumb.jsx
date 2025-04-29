import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default function ProductDetailBreadcrumb({ chemicals = '', slug = '', categorySlug = ''}) {
  console.log(slug)
  return (
    <nav className="pt-5 sm:text-xs md:text-sm  lg:text-base text-md pb-3 w-full mb-5 py-2 ">
      <ul className="flex gap-2 flex-wrap">
        <li>
          <Link to="/" className="text-[#000] hover:text-[#000]">
            Home
          </Link>
        </li>
        <li className="text-[#000]">&gt;</li>
        <li>
          <Link to="/categories" className="text-[#000] hover:text-[#000]">
            Products
          </Link>
        </li>
        {chemicals && <li className="text-secondary">&gt;</li>}
        {chemicals && ( 
          <li>
            <Link 
              to={`/${slug}`} 
              className="text-[#000] hover:text-[#000]"
            >
              {chemicals.charAt(0).toUpperCase() + chemicals.slice(1).toLowerCase()}
            </Link>
          </li>
        )}
        {categorySlug && <li className="text-[#e95821]">&gt;</li>}
        {categorySlug && (
  <li>
    <span className="text-[#e95821]">
      {categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1).toLowerCase()}
    </span>
  </li>
)}

       
      </ul>
    </nav>
  );
}

ProductDetailBreadcrumb.propTypes = {
  chemicals: PropTypes.string.isRequired,
  categorySlug: PropTypes.string.isRequired,
  selectedLetter: PropTypes.string,
};
