import { useNavigate } from 'react-router-dom';

function SubCategoryProductListCard({ product, categorySlug, subCategorySlug }) {
    console.log("SubCategoryProductListCard");
    const navigate = useNavigate();
    console.log("SubCategoryProductListCard", categorySlug, subCategorySlug, product);
    const handleViewDetails = () => {
        if (product?.slug) {
            navigate(`/${subCategorySlug}/${product.slug}`);
        } else {
            console.warn("Product slug not available for navigation.");
        }
    };

    // Extract a short description from the details field (first 100 characters or first paragraph)
    const getShortDescription = (details) => {
        if (!details) return "Explore this high-quality product for industrial applications.";
        const cleanText = details.replace(/<[^>]+>/g, ''); // Remove HTML tags
        return cleanText.length > 100 ? cleanText.substring(0, 100) + '...' : cleanText;
    };

    return (
        <div className="border rounded-lg shadow-md  flex flex-col gap-4 bg-white hover:shadow-lg transition-shadow cursor-pointer" onClick={handleViewDetails} >
            {/* Product Image */}
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0 border bg-[#2b60d9]">
                    <div className="w-64 h-64 rounded-full m-4 border overflow-hidden">
                        <img
                            src={product?.images?.[0]?.url ? `/api/image/download/${product.images[0].url}` : '/placeholder.svg'}
                            alt={product?.images?.[0]?.altText || product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col px-4 gap-2">
                <h3 className="text-xl font-bold text-[#0a3161]">{product?.name || 'Product Name'}</h3>
                <p className="text-sm text-gray-500">{product?.tagline || 'High-Performance Product'}</p>
            </div>

            {/* Action Button */}
            {/* <button
                className="mt-4 bg-[#e95821] hover:bg-[#eb4e10] text-white font-bold py-2 px-5 rounded transition-colors w-full"
                onClick={handleViewDetails}
            >
                VIEW DETAILS
            </button> */}
        </div>
    );
}

export default SubCategoryProductListCard;