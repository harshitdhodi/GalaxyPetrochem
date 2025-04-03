import React from 'react';
import { useLocation, useParams } from 'react-router-dom';

import SubCategories from './componets/SubCategoryPage/SubCategories';
import ProductDetailPage from './componets/productDetailPage/ProductDetailPage';

export default function Saperator() {
  const location = useLocation();
  const { number, slug } = useParams();

  // Check if the URL contains '/chemicals' or '/microbiology'
  const isProductsPath =
    location.pathname.startsWith('/chemicals') || location.pathname.startsWith('/microbiology') || location.pathname.startsWith('/plant-culture-tested-chemical') ||location.pathname.startsWith('/cell-culture-tested-chemical');

  return (
    <div>
      {isProductsPath ? (
        <SubCategories />
      ) : (
        <ProductDetailPage />
      )}
    </div>
  );
}
