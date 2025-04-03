import { useState, useEffect, Suspense, lazy } from "react";
import { useGetAllCataloguesQuery } from "@/slice/catalogue/catalogueslice";
import LoadingSkeleton from "./Skeleton";

// Lazy-loaded components for code splitting
const ProductsSection = lazy(() => import("./ProductsSection"));
const EventsSection = lazy(() => import("./Sidebar"));
const CataloguesSection = lazy(() => import("./CatalogSection"));

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [event, setEvent] = useState(null);
  const { data: catalogues, isLoading: isCataloguesLoading } = useGetAllCataloguesQuery();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/chemical/latest");
        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();
        setProducts(
          data.map((chemical) => ({
            id: chemical.id || Math.random().toString(36).substr(2, 9),
            title: chemical.name || chemical.category,
            image:
              chemical.images && chemical.images.length > 0
                ? `/api/image/download/${chemical.images[0].url}`
                : "",
            slug:
              chemical.slug ||
              chemical.name?.toLowerCase().replace(/\s+/g, "-") ||
              chemical.category?.toLowerCase().replace(/\s+/g, "-"),
          }))
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchEvent = async () => {
      try {
        const response = await fetch("/api/events/getEvent");
        if (!response.ok) throw new Error("Failed to fetch event");

        const data = await response.json();
        setEvent(data[0]); // Assuming the API returns an array of events
      } catch (err) {
        console.error("Error fetching event:", err);
      }
    };

    // Fetch both products and events in parallel
    Promise.all([fetchProducts(), fetchEvent()]).catch((err) => console.error("Error in fetching data:", err));
  }, []);

  return (
    <div className="w-full flex justify-center px-4 md:px-6 lg:px-8">
      <div className="max-w-[75rem] w-full lg:px-5 py-8">
        <div className="flex flex-col lg:flex-row justify-center">
          {/* Featured Products Section */}
          <div className="flex-1 w-full">
            <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
            <Suspense fallback={<LoadingSkeleton type="products" count={6} />}>
              <ProductsSection products={products} isLoading={isLoading} error={error} />
            </Suspense>
          </div>

          {/* Sidebar Section */}
          <div className="w-full lg:w-[30%] md:w-[100%] flex flex-col md:flex-row lg:flex-col justify-center items-center">
            {/* Forthcoming Events */}
            <div className="py-4 pl-4 w-full">
              <h2 className="text-lg font-bold mb-4">Forthcoming Events</h2>
              <Suspense fallback={<LoadingSkeleton type="event" />}>
                <EventsSection event={event} isLoading={isLoading} />
              </Suspense>
            </div>

            {/* Product Catalogue */}
            <div className="w-full pl-4 md:mt-8">
              <div className="border-x border rounded-lg p-4">
                <Suspense fallback={<LoadingSkeleton type="catalogues" />}>
                  <CataloguesSection catalogues={catalogues} isLoading={isCataloguesLoading} />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
