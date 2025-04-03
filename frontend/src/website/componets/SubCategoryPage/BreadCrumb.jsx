import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default function Breadcrumb({ chemicals = '', slug = '', categorySlug = '', selectedLetter = '' }) {
  return (
    <nav className="pt-5 sm:text-xs md:text-sm lg:text-base text-[11px] border-b pb-3 w-full mb-5 py-2 px-4">
      <ul className="flex gap-2 flex-wrap">
        <li>
          <Link to="/" className="text-secondary hover:text-main">
            Home
          </Link>
        </li>
        <li className="text-secondary">&gt;</li>
        <li>
          <Link to="/categories" className="text-secondary hover:text-main">
            Products
          </Link>
        </li>
        {chemicals && <li className="text-secondary">&gt;</li>}
        {chemicals && ( 
          <li>
            <Link 
              to={`/${slug}`} 
              className="text-secondary hover:text-main"
            >
              {chemicals.charAt(0).toUpperCase() + chemicals.slice(1).toLowerCase()}
            </Link>
          </li>
        )}
        {categorySlug && <li className="text-main">&gt;</li>}
        {categorySlug && (
          <li>
            <span className="text-main"> {categorySlug?.charAt(0)?.toUpperCase() + categorySlug?.slice(1)}</span>
          </li>
        )}
        {selectedLetter && <li className="text-secondary">&gt;</li>}
        {selectedLetter && (
          <li>
            <span className="text-primary">
              {selectedLetter?.charAt(0)?.toUpperCase() + selectedLetter?.slice(1)}
            </span>
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
