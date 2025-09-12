import { useState, useEffect } from 'react';

export default function GallaryChild() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/gallery/all');
        if (!response.ok) {
          throw new Error(`Failed to fetch gallery items: ${response.status}`);
        }
        const responseData = await response.json();
        console.log('API Response:', responseData); // Log for debugging

        // Extract the 'data' array from the response
        const productsArray = Array.isArray(responseData.data) ? responseData.data : [];
        if (productsArray.length === 0 && responseData.message === 'Items fetched successfully') {
          console.warn('API returned empty data array');
        }
        setProducts(productsArray);
      } catch (err) {
        console.error('Error fetching gallery items:', err);
        setError(err.message);
        setProducts([]); // Fallback to empty array
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className=" bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-primary">Loading gallery items...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>Error loading gallery: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      {/* <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-primary text-balance">Premium Petrochemical Solutions</h1>
      </div> */}

      <main className="container mx-auto max-w-7xl mt-10 px-4 pb-12">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No gallery items found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="group overflow-hidden relative rounded-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                <img
                  src={`/api/logo/download/${product.image}`}
                  alt={product.title || 'Gallery item'}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                  }}
                />
               <div className="absolute inset-0  group-hover:bg-opacity-30 transition-all pb-3 duration-300 flex items-end justify-baseline">
                    <span className="px-4 py-2 bg-[#e84c20] group-hover:bg-[#995d96] rounded-r-lg text-white flex items-center space-x-2 transform translate-x-0 transition-transform duration-300 opacity-100">
                      {product.title || 'Untitled Item'}
                    </span>
                  </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}