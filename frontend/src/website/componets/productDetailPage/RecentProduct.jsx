import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const RecentProduct = () => {
  const [recentProducts, setRecentProducts] = useState([]);
  const { categorySlug, slug } = useParams();

  useEffect(() => {
    const fetchRecentProducts = async () => {
      try {
        const response = await axios.get(
          `/api/petrochemProduct/getRecentProductsByCategorySlug?slug=${slug}`
        );
        setRecentProducts(response.data?.slice(0, 6) || []);
      } catch (error) {
        console.error("Error fetching recent products:", error);
      }
    };

    fetchRecentProducts();
  }, [slug]);

  return (
    <div className="container mx-auto px-4 py-5">
      <div className="mb-5">
        <h2 className="text-2xl lg:text-3xl font-bold mb-2 text-blue-900">
          Recent Products
        </h2>
        <div className="w-24 h-1 bg-blue-800"></div>
      </div>

      {recentProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10">
          {recentProducts.map((product) => (
            <Link
              to={`/${categorySlug}/${product.slug}`}
              key={product._id}
              className="group bg-white hover:shadow-blue-100 shadow-blue-200 rounded-lg overflow-hidden shadow-md hover:shadow-2xl transform transition-transform duration-300 hover:-translate-y-2"
            >
              <div className="flex flex-col h-full">
                {/* Product Image */}
                <div className="relative bg-white h-56 flex items-center justify-center">
                  <img
                    src={
                      product.images?.[0]?.url
                        ? `/api/image/download/${product.images[0].url}`
                        : "/placeholder.jpg"
                    }
                    alt={product.images?.[0]?.altText || product.name}
                    className="max-h-48 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Product Details */}
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-blue-700 font-medium">
                      Category: {product.categoryId.category}
                    </p>
                    <p className="text-sm text-gray-600 font-medium mb-2">
                      Brand: {product.brandId.name}
                    </p>
                  </div>

                  {/* Custom Table Preview */}
                  {product.table && (
                    <div
                      className="text-sm text-gray-700 space-y-1 mt-2"
                      dangerouslySetInnerHTML={{
                        __html: product.table
                          .replace(/border:\s?1px\s?solid[^;]+;/g, "")
                          .replace(/<table[^>]*>/g, "<div class='space-y-1'>")
                          .replace(/<\/table>/g, "</div>")
                          .replace(/<tbody>|<\/tbody>/g, "")
                          .replace(/<tr>/g, "<div class='flex space-x-2'>")
                          .replace(/<\/tr>/g, "</div>")
                          .replace(
                            /<td[^>]*>(.*?)<\/td>\s*<td[^>]*>(.*?)<\/td>/g,
                            "<span class='font-semibold text-blue-800'>$1:</span><span class='text-gray-800'>$2</span>"
                          )
                          .split("</div>")
                          .slice(0, 2)
                          .join("</div>"),
                      }}
                    />
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No recent products found.
        </p>
      )}
    </div>
  );
};

export default RecentProduct;
