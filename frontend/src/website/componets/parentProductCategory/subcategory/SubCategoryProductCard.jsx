import { Link, useNavigate } from 'react-router-dom';

function SubCategoryProductCard({ title, image, products, slug, subCategorySlug }) {
    console.log("SubCategoryProductCard", subCategorySlug);
    const navigate = useNavigate();

    const handleViewMore = () => {
        if (products && products.length > 0) {
            const productSlug = products[0].slug; // Assuming the first product's slug is used for redirection
            navigate(`/${slug}/${subCategorySlug}`);
        } else {
            console.warn("No products available to redirect.");
        }
    };

    return (
        <div>
            <div className='flex custom930:flex-row mb-4  items-center justify-between '>
                <div>  
                <h2 className="text-2xl font-bold text-[#0a3161] pb-2">{title}</h2>
                <div className="h-1 w-16 bg-[#0a3161]"></div>
                </div>
                <button
                    className="mt-6 bg-[#e95821] float-start hover:bg-[#eb4e10] text-white font-bold py-2 px-5 rounded transition-colors"
                    onClick={handleViewMore}
                >
                    VIEW MORE
                </button>
            </div>
           
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink shadow-lg shadow-blue-300 rounded-md border ">
                    <div className="w-64 h-64 p-5 m-4 overflow-hidden group relative">
                        <img src={image || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
                    </div>

                </div>

                <div className="flex-grow">
                    <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2 scrollbar">
                        {products && products.length > 0 ? (
                            products.map((product, index) => (
                                <div key={index}>
                                    <Link to={`/${product.subCategorySlug}/${product.slug}`} className="flex items-center rounded-md shadow-md gap-2 bg-gray-100">

                                        <p className=" py-2 px-5 text-sm rounded-md hover:text-[#2b60d9] cursor-pointer">{product.name}</p>
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 bg-gray-200 py-2 px-5 text-sm rounded-md">No products available for this subcategory.</p>
                        )}
                    </div>
                </div>
            </div>


        </div>
    );
}

export default SubCategoryProductCard;