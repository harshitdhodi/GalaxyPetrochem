import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';

import SubCategoryProductList from './componets/parentProductCategory/subcategory/SubCategoryProductList';
import ProductDetailPage from './componets/productDetailPage/ProductDetailPage';
import Simple404Page from './pages/404';

export default function Saperator() {
  const location = useLocation();
  const { slug } = useParams();
  const [validSlugs, setValidSlugs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSlugValid, setIsSlugValid] = useState(false);

  const subcategoryNames = [
    'Hydraulic Oils',
    'Gear Oils',
    'Cutting oil',
    'Turbine oil',
    'Refrigeration Oil',
    'Rust Prevention Oil',
    'Slideway Oil',
    'Engine Oil',
    'Knitting Oil',
    'Food Grade Mineral Oil',
    'Thermic Oil',
    'Compressor Oil'
  ];

  // Convert to lowercase and replace spaces with dashes
  const subcategorySlugs = subcategoryNames.map(name =>
    name.toLowerCase().replace(/\s+/g, '-')
  );

  useEffect(() => {
    const fetchSlugs = async () => {
      try {
        const response = await axios.get('/api/petrochemProduct/getAllSlugs');
        const slugs = response.data.slugs || [];
        setValidSlugs(slugs);
        setIsSlugValid(slugs.includes(slug));
      } catch (error) {
        console.error('Error fetching slugs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSlugs();
  }, [slug]);

  // Extract path segments
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const baseCategory = pathSegments[0]; // 'industrial-oils' or 'greases'
  const subCategorySlug = pathSegments[1]; // e.g., 'hydraulic-oils'

  const isBaseCategoryPath =
    (baseCategory === 'industrial-oils' || baseCategory === 'greases') && !subCategorySlug;

  const isSubCategoryPath =
    (baseCategory === 'industrial-oils' || baseCategory === 'greases') &&
    subcategorySlugs.includes(subCategorySlug);

  useEffect(() => {
    if (isLoading) {
      document.title = 'Loading...';
    } else if (isBaseCategoryPath || isSubCategoryPath) {
      document.title = 'Subcategory Products';
    } else if (isSlugValid) {
      document.title = 'Product Details';
    } else {
      document.title = '404'; // Set meta title to "404" for the 404 page
    }
  }, [isLoading, isBaseCategoryPath, isSubCategoryPath, isSlugValid]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {isBaseCategoryPath || isSubCategoryPath ? (
        <SubCategoryProductList />
      ) : isSlugValid ? (
        <ProductDetailPage />
      ) : (
        <Simple404Page />
      )}
    </div>
  );
}