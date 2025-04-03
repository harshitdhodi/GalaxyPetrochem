import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import ChemicalSubcategoryPage from './website/pages/category_subcategoryPage';
import AlphabetBasedProduct from './website/pages/AlphabetBasedProduct';

export default function Hello() {
  const location = useLocation();
  const { number, slug } = useParams();

  // Check if the URL contains '/products'
  const isProductsPath = location.pathname.startsWith('/products');

  return (
    <div>
      {isProductsPath ? (
        <AlphabetBasedProduct />
      ) : (
        <ChemicalSubcategoryPage />
      )}
    </div>
  );
}
