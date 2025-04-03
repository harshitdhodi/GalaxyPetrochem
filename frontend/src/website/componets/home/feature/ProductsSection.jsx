// ProductsSection.jsx
import { useState } from 'react';
import LoadingSkeleton from './Skeleton';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard'; // Import ProductCard

export default function ProductsSection({ products, isLoading, error }) {
  // Render loading state
  if (isLoading) {
    return <LoadingSkeleton type="products" count={6} />;
  }

  // Render error state
  if (error) {
    return <div className="col-span-full text-red-500">Error loading products: {error.message || error}</div>;
  }

  // Render products
  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 justify-center sm:justify-start">
      {products?.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
