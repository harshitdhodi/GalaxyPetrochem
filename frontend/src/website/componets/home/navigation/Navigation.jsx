// NavigationMenu.jsx
import { lazy, Suspense, useState, useEffect, memo } from 'react';
import axios from 'axios';

// Lazy loaded components
const NavigationSkeleton = lazy(() => import('./NavigationSkeleton'));
const NavigationItems = lazy(() => import('./NavigationItem'));
const ErrorDisplay = lazy(() => import('./ErrorDisplay'));

export default function NavigationMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
    
    return () => controller.abort();
  }, []);

  return (
    <nav className="w-full bg-gray-400/20">
      <div className="border-x-2 border-gray-700/10 max-w-6xl mx-auto">
        <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
          {loading ? (
            <NavigationSkeleton />
          ) : error ? (
            <ErrorDisplay message={error} />
          ) : (
            <NavigationItems items={menuItems} />
          )}
        </Suspense>
      </div>
    </nav>
  );
}