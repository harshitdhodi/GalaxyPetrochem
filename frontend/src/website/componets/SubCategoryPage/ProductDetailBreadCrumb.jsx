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
    <nav className="mb-5 w-full pb-3 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-1 text-sm text-[#fff] sm:flex-row sm:items-center sm:justify-between sm:gap-2 sm:whitespace-nowrap sm:overflow-x-auto">
          {/* First row: Home / Products */}
          <div className="flex items-center text-sm text-[#fff] whitespace-nowrap">
            <Link to="/" className="hover:text-[#fff]">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/products" className="hover:text-[#fff]">Products</Link>
          </div>

          {/* Second row: path-style /category/subcategory (wrap on xs/sm) */}
            <div className="flex flex-wrap sm:flex-nowrap items-center text-sm text-[#fff] whitespace-normal sm:whitespace-nowrap sm:overflow-visible">
            <span className="mr-2">/</span>
            {chemicals ? (
              <Link to={`/${slug}`} className="hover:text-[#fff]">{formatSlug(chemicals)}</Link>
            ) : null}

            {categorySlug && !chemicals && (
              <Link to={`/${categorySlug}`} className="hover:text-[#fff]">{formatSlug(categorySlug)}</Link>
            )}

            {subCategorySlug && (
              <>
                {chemicals || categorySlug ? <span className="mx-2">/</span> : null}
                <Link to={`/${slug}/${subCategorySlug}`} className="hover:text-[#fff]">{formatSlug(subCategorySlug)}</Link>
              </>
            )}

            {categorySlug && chemicals && (
              <>
                <span className="mx-2 mt-2 sm:mt-0">/</span>
                <span>{formatSlug(categorySlug)}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

ProductDetailBreadcrumb.propTypes = {
  chemicals: PropTypes.string.isRequired,
  categorySlug: PropTypes.string.isRequired,
  subCategorySlug: PropTypes.string,
  slug: PropTypes.string,
};
