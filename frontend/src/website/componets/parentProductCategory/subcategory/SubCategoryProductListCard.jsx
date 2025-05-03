import { useNavigate } from 'react-router-dom';

function SubCategoryProductListCard({ product, categorySlug, subCategorySlug }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    if (product?.slug) {
      navigate(`/${subCategorySlug}/${product.slug}`);
    } else {
      console.warn("Product slug not available for navigation.");
    }
  };

  const getShortDescription = (details) => {
    if (!details) return "Explore this high-quality product for industrial applications.";
    const cleanText = details.replace(/<[^>]+>/g, '');
    return cleanText.length > 100 ? cleanText.substring(0, 100) + '...' : cleanText;
  };

  return (
    <div
      className="border shadow-md shadow-blue-200 hover:shadow-blue-300 rounded-lg bg-white transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer"
      onClick={handleViewDetails}
    >
      <div className="flex flex-col gap-4 p-4">
        {/* Image */}
        <div className="flex-shrink-0 w-full md:w-64 h-64 mx-auto md:mx-0">
          <img
            src={product?.images?.[0]?.url ? `/api/image/download/${product.images[0].url}` : '/placeholder.svg'}
            alt={product?.images?.[0]?.altText || product.name}
            className="w-full h-full object-contain "
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-center px-2">
          <h3 className="text-lg md:text-lg font-semibold text-[#0a3161]">{product?.name || 'Product Name'}</h3>
      
        </div>
      </div>
    </div>
  );
}

export default SubCategoryProductListCard;
