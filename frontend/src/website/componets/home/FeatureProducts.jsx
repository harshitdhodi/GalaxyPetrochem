import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowBigDown, ArrowRight, Eye } from "lucide-react";
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
    <>
      {/* Featured Products Section */}
      <div className="max-w-[78rem]  mx-auto">
        <div className='pt-4 ml-4 xl:ml-0 lg:flex lg:items-center lg:justify-between gap-2 '>
          <div className="">
            <p className='text-3xl md:text-4xl font-bold  text-[#9c5d95] font-daysOne text-left  md:text-left'>Featured Products</p>
            <div className="h-1 w-[25%] bg-[#9c5d95]"></div>

          </div> <p className='py-3 text-gray-400 font-semibold flex flex-wrap gap-2'>
            {/* Explore Fresh Perspectives on Products and Industry Innovations. */}
            <Link to="/products" className='flex items-center gap-2 text-[#9c5d95] font-semibold'>
              View All <ArrowRight className="" />
            </Link>
          </p>
        </div>
      </div>
      <div className="w-full flex justify-center px-4 md:px-6 lg:px-8">

        <div className="max-w-[81rem] w-full lg:px-5 py-8">
          <div className="flex flex-col lg:flex-row justify-center">

            <div className="flex-1 w-full">
              {/* <h2 className="text-4xl md:text-4xl font-bold pb-2 text-[#9c5d95] bg-clip-text">Featured Products</h2>
            <div className="h-1 w-[15%] bg-[#9c5d95] mb-6"></div> */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 justify-center sm:justify-start">
  {isLoading ? (
    Array(6)
      .fill()
      .map((_, index) => <ProductSkeleton key={index} />)
  ) : (
    recentProducts.map((product, index) => (
      <Link
        key={index}
        to={`/${product.subcategorySlug}/${product.slug}`} // Make the whole card clickable
        className="group overflow-hidden w-full lg:w-[400px] lg:h-[350px] h-[300px] md:w-full md:h-[250px] border rounded-md hover:shadow-lg transition-all duration-300 relative"
      >
        <div className="h-full flex flex-col items-center justify-between">
          {/* Product Image */}
          <div className="relative w-full py-12 sm:pb-5 flex items-center justify-center overflow-hidden">
            {product.images?.length > 0 && product.images[0]?.url ? (
              <img
                alt={product.name}
                className="object-fill sm:object-fill min-w-[200px] max-w-[400px] sm:min-h-[350px] max-h-[200px] w-full h-auto transition-transform duration-300 group-hover:scale-105"
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
                src={defaultImage}
                loading="lazy"
              />
            )}
          </div>

          {/* Product Name */}
        {/* Product Name */}
<div className="absolute inset-0 hover:bg-[#e84c20]/10 bg-blue-600/10 group-hover:bg-opacity-30 transition-all duration-300 flex items-end justify-baseline">
  <span className="px-4 py-2 bg-[#e84c20] group-hover:bg-[#995d96] rounded-r-lg text-white flex items-center space-x-2 transform translate-x-0 transition-transform duration-300 opacity-100">
    {product.name}
  </span>
</div>
        </div>
      </Link>
    ))
  )}
</div>
            </div>


          </div>
        </div>
      </div>
    </>
  );
}