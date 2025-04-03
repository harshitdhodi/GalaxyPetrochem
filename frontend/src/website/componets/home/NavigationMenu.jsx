import { useEffect, useState, memo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

// Skeleton loader component
const NavigationSkeleton = memo(() => {
  // Create an array of 6 items for the skeleton
  const skeletonItems = Array(6).fill(0);
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-x-2 divide-y-2 md:divide-y-0 divide-gray-700/10">
      {skeletonItems.map((_, index) => (
        <div 
          key={index}
          className={`flex md:flex-col  gap-4 items-center justify-center lg:px-4 py-3 lg:py-6 animate-pulse ${index % 2 === 1 ? 'border-t-2 md:border-t-0' : ''}`}
        >
          <div className="bg-gray-300 rounded-full w-10 h-10 mx-auto"></div>
          <div className="bg-gray-300 h-4 w-16 mx-auto mt-2 rounded"></div>
        </div>
      ))}
    </div>
  );
});

// Memoized menu item component
const MenuItem = memo(({ item, index }) => (
  <Link
    to={item.href}
    className={`flex md:flex-col gap-4 items-center sm:justify-center pl-3 sm:pl-0 hover:bg-blue-900 transition-colors hover:text-white group lg:px-4 py-3 lg:py-6 ${index % 2 === 1 ? 'border-t-2 md:border-t-0' : ''}`}
  >
    <div className="text-orange-500 group-hover:scale-110 transition-transform">
      <img 
        src={`/api/logo/download/${item.icon}`} 
        alt={item.name || 'img'} 
        className="sm:w-10 w-5 object-fit sm:h-10 sm:object-fill"
        loading="lazy" 
        width="40"
        height="40"
      />
    </div>
    <span className="text-center sm:text-[18px] text-[12px] font-bold">{item.name}</span>
  </Link>
));

export default function NavigationMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Create an abort controller for cleanup
    const controller = new AbortController();
    
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get("/api/navigationLink/", {
          signal: controller.signal
        });
        
        if (Array.isArray(response.data)) {
          setMenuItems(response.data);
        } else {
          setError("API response is not an array");
          console.error("API response is not an array:", response.data);
        }
      } catch (error) {
        if (!axios.isCancel(error)) {
          setError("Failed to load navigation menu");
          console.error("Error fetching navigation links:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
    
    // Cleanup function to abort fetch on unmount
    return () => controller.abort();
  }, []);

  return (
    <nav className="w-full bg-gray-400/20">
      <div className="border-x-2 border-gray-700/10 max-w-6xl mx-auto">
        {loading ? (
          <NavigationSkeleton />
        ) : error ? (
          <div className="text-center p-4 text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-x-2 divide-y-2 md:divide-y-0 divide-gray-700/10">
            {menuItems.map((item, index) => (
              <MenuItem key={item._id} item={item} index={index} />
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}