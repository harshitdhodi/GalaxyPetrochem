import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const formatSlug = (text) => {
  return text
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default function ProductDetailBreadcrumb({ subCategorySlug, chemicals = '', slug = '', categorySlug = '' }) {
  return (
    <nav className="pt-5 sm:text-xs md:text-sm lg:text-base text-md pb-3 w-full mb-5 py-2">
      <ul className="flex gap-2 flex-wrap">
        <li>
          <Link to="/" className="text-[#fff] hover:text-[#fff]">
            Home
          </Link>
        </li>
        <li className="text-[#fff]">/</li>
        <li>
          <Link to="/categories" className="text-[#fff] hover:text-[#fff]">
            Products
          </Link>
        </li>

        {chemicals && <li className="text-[#fff]">/</li>}
        {chemicals && (
          <li>
            <Link to={`/${slug}`} className="text-[#fff] hover:text-[#fff]">
              {formatSlug(chemicals)}
            </Link>
          </li>
        )}

        {subCategorySlug && <li className="text-[#fff]">/</li>}
        {subCategorySlug && (
          <li>
            <Link to={`/${slug}/${subCategorySlug}`} className="text-[#fff] hover:text-[#fff]">
              {formatSlug(subCategorySlug)}
            </Link>
          </li>
        )}

        {categorySlug && <li className="text-[#fff]">/</li>}
        {categorySlug && (
          <li>
            <span className="text-[#fff]">
              {formatSlug(categorySlug)}
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
  subCategorySlug: PropTypes.string,
  slug: PropTypes.string,
};
