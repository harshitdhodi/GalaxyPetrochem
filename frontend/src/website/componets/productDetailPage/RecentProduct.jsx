import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const RecentProduct = () => {
  const [recentProducts, setRecentProducts] = useState([]);
  const { categorySlug } = useParams();

  useEffect(() => {
    const fetchRecentProducts = async () => {
      try {
        const response = await axios.get(`/api/product/getRecentProducts/${categorySlug}`);
        console.log(response.data);
        setRecentProducts(response.data?.slice(0, 6) || []);
      } catch (error) {
        console.error("Error fetching recent products:", error);
      }
    };

    fetchRecentProducts();
  }, [categorySlug]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-2xl lg:text-3xl font-bold mb-2 text-blue-900">Recent Products</h2>
        <div className="w-[10%] h-1 bg-blue-800"></div>
      </div>

      {recentProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentProducts.map((product) => (
            <Link
              to={`/${product.slug}`}
              key={product._id}
              className="group bg-white overflow-hidden shadow-lg hover:shadow-balck/70 hover:shadow-2xl 
              transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex flex-col h-full">
                <div className="relative p-4 bg-gray-50">
                  <div className="aspect-w-16 aspect-h-9 h-[40vh]">
                    <img
                      src={product.images?.[0]?.url ? `/api/image/download/${product.images[0].url}` : "/placeholder.jpg"}
                      alt={product.images?.[0]?.altText || product.name}
                      className="w-full h-full object-contain  
                      group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
                <div className="p-5 flex-1 bg-gradient-to-b from-blue-50 to-blue-100">
                  <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                  <div className="">
                    <p className="text-main mt-1 text-md  font-semibold">₹{product.price}<span className="text-black">/piece</span> </p>

                    {/* Render first two table rows as normal text with colon after the first column only */}
                    {product.table && (
                      <div
                        className="mt-1 text-blue-700 space-y-1"
                        dangerouslySetInnerHTML={{
                          __html: product.table
                            .replace(/border:\s?1px\s?solid[^;]+;/g, "") // Remove border styles
                            .replace(/<table[^>]*>/g, "<div class='space-y-1'>") // Replace table with div
                            .replace(/<\/table>/g, "</div>") // Close div
                            .replace(/<tbody>|<\/tbody>/g, "") // Remove tbody
                            .replace(/<tr>/g, "<div class='flex'>") // Convert row to flex div
                            .replace(/<\/tr>/g, "</div>") // Close row div
                            .replace(
                              /<td[^>]*>(.*?)<\/td>\s*<td[^>]*>(.*?)<\/td>/g,
                              "<p class='mr-2 font-semibold'>$1:</p><p class='text-gray-800 font-semibold'>$2</p>"
                            )
                            // Add colon only after first column
                            .split("</div>") // Split rows
                            .slice(0, 2) // Take only first 2 rows
                            .join("</div>") // Join back rows
                        }}
                      />
                    )}
                  </div>
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
