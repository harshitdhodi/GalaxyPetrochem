import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Eye } from "lucide-react";
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Skeleton component for product cards
const ProductSkeleton = () => (
  <div className="overflow-hidden w-full lg:w-[250px] lg:h-[220px] md:w-full md:h-auto border animate-pulse">
    <div className="h-full flex flex-col items-center justify-between">
      <div className="w-full h-[160px] bg-gray-200"></div>
      <div className="bg-gray-400 w-full p-2 text-center h-[40px]"></div>
    </div>
  </div>
);

// Skeleton component for event card
const EventSkeleton = () => (
  <Card className="space-y-4 border p-4 animate-pulse">
    <div className="border-x border-t p-4">
      <div className="h-16 bg-gray-200"></div>
    </div>
  </Card>
);

// Skeleton component for catalogue
const CatalogueSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-8 bg-gray-200 w-3/4 mb-4"></div>
    <div className="h-24 bg-gray-200 w-[100px] mb-4"></div>
    <div className="h-10 bg-gray-300 w-[75%]"></div>
  </div>
);

export default function FeaturedProducts({ catalogues, recentProducts }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [event, setEvent] = useState(null);
  console.log(catalogues, recentProducts)
  
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setIsLoading(true);

        // Add timestamp parameter to prevent caching
        const response = await fetch(`/api/events/getEvent?t=${new Date().getTime()}`);

        if (!response.ok) {
          throw new Error('Failed to fetch event');
        }

        const data = await response.json();
        setEvent(data[0]); // Assuming the API returns an array of events
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false); // Reset loading state when done
      }
    };

    fetchEvent();
  }, []);

  if (error) {
    return <div>Error loading data: {error}</div>;
  }

  const defaultImage = '/path/to/default/image.jpg';

  return (
    <div className="w-full flex justify-center px-4 md:px-6 lg:px-8">
      <div className="max-w-[80rem] w-full lg:px-5 py-8">
        <div className="flex flex-col lg:flex-row justify-center">
          {/* Featured Products Section */}
          <div className="flex-1 w-full">
            <h2 className="text-4xl md:text-5xl font-bold pb-4 bg-gradient-to-r from-[#f18061] via-[#2860da] to-[#9e5d94] bg-clip-text text-transparent">Featured Products</h2>
            <div className="h-2 mt-1 w-[20%] bg-[#e84c20] mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 justify-center sm:justify-start">
              {isLoading ? (
                // Skeleton loaders for products
                Array(6)
                  .fill()
                  .map((_, index) => <ProductSkeleton key={index} />)
              ) : (
                recentProducts.map((product, index) => (
                  <div
                    key={index}
                    className="group overflow-hidden w-full lg:w-[250px] lg:h-[250px] h-[300px] md:w-full md:h-[250px] border rounded-md hover:shadow-lg transition-all duration-300 relative"
                  >
                    <div className="h-full flex flex-col  items-center justify-between">
                      {/* Product Image */}
                      <div className="relative w-full pb-5  flex items-center justify-center overflow-hidden">
                        {product.images?.length > 0 && product.images[0]?.photo ? (
                          <img
                            alt={product.name}
                            className="object-cover lg:mt-5 w-auto max-w-full max-h-full transition-transform duration-300 group-hover:scale-105"
                            src={`/api/image/download/${product.images[0].url}`}
                            loading="lazy"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = defaultImage;
                            }}
                          />
                        ) : (
                          <img
                            alt={product.name}
                            className="object-contain mt-16 w-full h-full transition-transform duration-300 group-hover:scale-105"
                            src={`/api/image/download/${product.images[0].url}`}
                            loading="lazy"
                          />
                        )}
                        
                        {/* Overlay with view button that slides in from left */}
                        <div className="absolute inset-0 hover:bg-[#e84c20]/10 bg-blue-600/10  group-hover:bg-opacity-30 transition-all duration-300 flex items-end justify-baseline">
                          <Link
                            to={`/${product.slug}`}
                            className="px-4 py-2 bg-[#e84c20] rounded-r-lg text-white  flex items-center space-x-2 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300 opacity-0 group-hover:opacity-100"
                          >
                      
                            <span>{product.name}</span>
                          </Link>
                        </div>
                      </div>

              
                    
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sidebar Section */}
          <div className="w-full lg:w-[30%]  md:w-[100%]  flex flex-col md:flex-row lg:flex-col justify-center items-center">
            {/* Forthcoming Events */}
            <div className="py-4 mt-20 pl-4 ">
              <h2 className="text-lg font-bold mb-4 px-4 text-blue-600 shadow-lg  w-fit py-1 bg-blue-50 rounded-full">Forthcoming Events</h2>
              {isLoading ? (
                <EventSkeleton />
              ) : (
                event && (
                  <Card className="space-y-4 lg:h-[25vh] border p-4 hover:shadow-md transition-shadow duration-300">
                    <div className="border-x border-t bg-blue-50 text-black p-4">
                      <div dangerouslySetInnerHTML={{ __html: event.events }} />
                    </div>
                  </Card>
                )
              )}
            </div>

            {/* Product Catalogue */}
            <div className="sm:w-1/2 lg:w-full w-full pl-4 md:mt-2">
              <Card className="border-x border h-full lg:h-fit rounded-lg  p-4 xl:h-full hover:shadow-md transition-shadow  duration-300">
                <div className="space-y-4">
                  {isLoading ? (
                    // Skeleton loader for catalogues
                    <CatalogueSkeleton />
                  ) : (
                    catalogues && catalogues.map((catalogue, index) => (
                      <div key={index} className="group relative">
                        <h3 className="text-xl md:text-2xl text-gray-600 font-bold mb-4">{catalogue.title}</h3>
                        <div className="relative overflow-hidden inline-block">
                          <img
                            src={`/api/image/view/${catalogue.image}`}
                            alt={catalogue.title}
                            loading="lazy"
                            className="w-[100px] transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => { e.target.onerror = null; e.target.src = defaultImage; }}
                          />
                        </div>
                        <Button 
                          className="w-[75%] mt-5  transition-all duration-300 transform group-hover:translate-y-0 flex items-center justify-center"
                          onClick={() => window.open(`/api/image/pdf/view/${catalogue.catalogue}`, '_blank')}
                        >
                          <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300">DOWNLOAD</span>
                          <ArrowRight className="ml-2 h-4 w-4 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}