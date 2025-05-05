import { ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function ProductSection({ title, image, subcategories, slug }) {
  const navigate = useNavigate();
  console.log("Products in ProductSection:", subcategories); // Debugging line
  const handleProductClick = (subCategorySlug) => {
    navigate(`/${slug}/${subCategorySlug}`);
  };

  return (
    <div className=" ">
      <div className="flex  custom930:flex-row  items-center justify-between mb-5">
        <div>
          <h2 className="text-2xl font-bold text-[#0a3161] mb-2">{title}</h2>
          <div className="h-1 w-16 bg-[#0a3161] "></div>
        </div>
        <Link className='flex items-center gap-2 text-[#e95821] font-semibold' to={`/${slug}`}>
          View All <ArrowRight className="" />
        </Link>
      </div>
      <div className="flex  gap-6">
        {/* Category Image */}
        <div className="flex-shrink shadow-lg shadow-blue-300 rounded-md border ">
          <div className="w-64 h-64 p-5 m-4 overflow-hidden group relative">
            <img
              src={image || "/placeholder.svg"}
              alt={title}
              className="w-full h-full object-cover rounded-md transform transition-transform duration-500 group-hover:scale-110 "
            />
          </div>

        </div>

        {/* Products List */}
        <div className="flex-grow">
          <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2 scrollbar">
            {subcategories && subcategories.length > 0 ? (
              subcategories.map((product, index) => (
                <p
                  key={index}
                  className="bg-gray-100 shadow-sm py-2 px-5 text-sm rounded-md hover:text-[#2b60d9] cursor-pointer"
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

    </div>
  );
}

export default ProductSection;