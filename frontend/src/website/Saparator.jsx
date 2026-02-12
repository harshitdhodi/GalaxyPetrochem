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
  const [categorySlugs, setCategorySlugs] = useState([]);
  const [subcategorySlugs, setSubcategorySlugs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSlugValid, setIsSlugValid] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all data in parallel
        const [productResponse, categoryResponse] = await Promise.all([
          axios.get('/api/petrochemProduct/getAllSlugs'),
          axios.get('/api/chemicalCategory/getAllSubcategories')
        ]);
        
        console.log("categoryResponse---", categoryResponse.data);
        
        // Set product slugs
        const slugs = productResponse.data.slugs || [];
        setValidSlugs(slugs);
        setIsSlugValid(slugs.includes(slug));
        console.log("product slugs---", slugs);

        // Extract parent category slugs and subcategory slugs
        if (categoryResponse.data.success && categoryResponse.data.data) {
          // Get unique parent category slugs
          const parentSlugs = categoryResponse.data.data.map(item => item.parentSlug);
          const uniqueParentSlugs = [...new Set(parentSlugs)]; // Remove duplicates
          setCategorySlugs(uniqueParentSlugs);
          console.log("category slugs---", uniqueParentSlugs);
          
          // Get all subcategory slugs
          const subCategorySlugs = categoryResponse.data.data.map(item => item.subcategorySlug);
          setSubcategorySlugs(subCategorySlugs);
          console.log("subcategory slugs---", subCategorySlugs);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  // Extract path segments
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const baseCategory = pathSegments[0]; // 'industrial-oils'
  const subCategorySlug = pathSegments[1]; // 'hydraulic-oils'

  console.log("baseCategory:", baseCategory);
  console.log("subCategorySlug:", subCategorySlug);
  console.log("categorySlugs includes baseCategory:", categorySlugs.includes(baseCategory));
  console.log("subcategorySlugs includes subCategorySlug:", subcategorySlugs.includes(subCategorySlug));

  const isBaseCategoryPath = categorySlugs.includes(baseCategory) && !subCategorySlug;

  const isSubCategoryPath =
    categorySlugs.includes(baseCategory) &&
    subcategorySlugs.includes(subCategorySlug);

  console.log("isBaseCategoryPath:", isBaseCategoryPath);
  console.log("isSubCategoryPath:", isSubCategoryPath);

  useEffect(() => {
    if (isLoading) {
      document.title = 'Loading...';
    } else if (isBaseCategoryPath || isSubCategoryPath) {
      document.title = 'Subcategory Products';
    } else if (isSlugValid) {
      document.title = 'Product Details';
    } else {
      document.title = '404';
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