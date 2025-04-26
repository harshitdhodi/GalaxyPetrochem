import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const RecentProduct = () => {
  const [recentProducts, setRecentProducts] = useState([]);
  const { slug } = useParams();

  useEffect(() => {
    const fetchRecentProducts = async () => {
      try {
        const response = await axios.get(`/api/petrochemProduct/getRecentProductsByCategorySlug?slug=${slug}`);
        console.log(response.data);
        setRecentProducts(response.data?.slice(0, 6) || []);
      } catch (error) {
        console.error("Error fetching recent products:", error);
      }
    };

    fetchRecentProducts();
  }, [slug]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-2xl lg:text-3xl font-bold mb-2 text-blue-900">Recent Products</h2>
        <div className="w-[10%] h-1 bg-blue-800"></div>
      </div>

      {recentProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {recentProducts.map((product) => (
            <Link
              to={`/${product.slug}`}
              key={product._id}
              className="group bg-white overflow-hidden shadow-lg hover:shadow-balck/70 hover:shadow-2xl 
              transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex flex-col h-full">
                <div className="relative  bg-gray-50">
                  <div className="flex-shrink-0 border bg-[#2b60d9]">
                    <div className="w-52 h-52 ml-9 rounded-full m-4  border overflow-hidden">
                      <img
                        src={product.images?.[0]?.url ? `/api/image/download/${product.images[0].url}` : "/placeholder.jpg"}
                        alt={product.images?.[0]?.altText || product.name}
                        className="w-full h-full  object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </div>

                </div>
                <div className="w-2/3 p-4 bg-gradient-to-br from-blue-50 to-white">
                <h3 className="text-xl font-bold text-blue-900 mb-1">{product.name}</h3>
                <p className="text-sm text-blue-700 mb-1 font-semibold">Category: {product.categoryId.category}</p>
                <p className="text-sm text-gray-600 mb-3 font-medium">Brand: {product.brandId.name}</p>

                {/* Table Data in bullet-like format */}
                {product.table && (
                  <div
                    className="text-sm text-gray-700 space-y-1"
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
                        .join("</div>")
                    }}
                  />
                )}
              </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No recent products found.</p>
      )}
    </div>
  );
};

export default RecentProduct;
