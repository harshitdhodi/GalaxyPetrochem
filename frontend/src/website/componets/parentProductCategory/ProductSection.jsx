import { Link, useNavigate } from "react-router-dom";

function ProductSection({ title, image, subcategories, slug }) {
  const navigate = useNavigate();
console.log("Products in ProductSection:", subcategories); // Debugging line
  const handleProductClick = (subCategorySlug) => {
    navigate(`/${slug}/${subCategorySlug}`);
  };

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-[#0a3161] mb-2">{title}</h2>
      <div className="h-1 w-16 bg-[#0a3161] mb-6"></div>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Category Image */}
        <div className="flex-shrink-0 border bg-[#2b60d9]">
          <div className="w-64 h-64 bg-white p-5 rounded-full m-4 border overflow-hidden">
            <img
              src={image || "/placeholder.svg"}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Products List */}
        <div className="flex-grow">
          <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-2 scrollbar">
            {subcategories && subcategories.length > 0 ? (
              subcategories.map((product, index) => (
                <p
                  key={index}
                  className="bg-gray-200 py-2 px-5 text-sm rounded-md hover:text-[#2b60d9] cursor-pointer"
                  onClick={() => handleProductClick(product.slug)}
                >
                  {product.category
}
                </p>
              ))
            ) : (
              <p className="text-gray-500 bg-gray-200 py-2 px-5 text-sm rounded-md">
                No products available for this category.
              </p>
            )}
          </div>
        </div>
      </div>
      <Link to={`/${slug}`}>
        <button className="mt-6 bg-[#e95821] float-start hover:bg-[#e95821] text-white font-bold py-2 px-5 rounded transition-colors">
          VIEW MORE
        </button>
      </Link>
    </div>
  );
}

export default ProductSection;