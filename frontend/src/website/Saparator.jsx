import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';

import SubCategoryProductList from './componets/parentProductCategory/subcategory/SubCategoryProductList';
import ProductDetailPage from './componets/productDetailPage/ProductDetailPage';
import Simple404Page from './pages/404';

export default function Separator() {
  const location = useLocation();
  const { slug } = useParams();

  const [validProductSlugs, setValidProductSlugs] = useState([]);
  const [subcategorySlugs, setSubcategorySlugs] = useState([]);
  const [supportedBaseCategories, setSupportedBaseCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch all three endpoints in parallel
        const [productRes, subRes, categoryRes] = await Promise.all([
          axios.get('/api/petrochemProduct/getAllSlugs'),
          axios.get('/api/chemicalCategory/getAllSubcategories'),
          axios.get('/api/chemicalCategory/getAll')
        ]);

        console.log('Fetched Data:', {
          products: productRes.data,
          subcategories: subRes.data,
          categories: categoryRes.data
        });

        // Set product slugs (normalized to lowercase)
        const productSlugs = (productRes.data.slugs || [])
          .map(s => s.trim().toLowerCase());
        console.log('Valid Product Slugs:', productSlugs);
        setValidProductSlugs(productSlugs);

        // Set subcategory slugs (normalized to lowercase)
        if (subRes.data?.success && Array.isArray(subRes.data?.data)) {
          const slugs = subRes.data.data
            .filter(item => item.subcategorySlug)
            .map(item => item.subcategorySlug.trim().toLowerCase());
          console.log('Subcategory Slugs:', slugs);
          setSubcategorySlugs(slugs);
        }

        // Set dynamic base categories (normalized to lowercase)
        if (categoryRes.data?.success && Array.isArray(categoryRes.data?.data)) {
          const categories = categoryRes.data.data
            .filter(item => item.categorySlug)
            .map(item => item.categorySlug.trim().toLowerCase());
          console.log('Supported Base Categories:', categories);
          setSupportedBaseCategories(categories);
        } else if (Array.isArray(categoryRes.data?.categories)) {
          const categories = categoryRes.data.categories
            .filter(item => item.slug)
            .map(item => item.slug.trim().toLowerCase());
          console.log('Supported Base Categories (alt):', categories);
          setSupportedBaseCategories(categories);
        } else if (Array.isArray(categoryRes.data)) {
          // In case API returns array directly
          const categories = categoryRes.data
            .filter(item => item.categorySlug || item.slug)
            .map(item => (item.categorySlug || item.slug).trim().toLowerCase());
          console.log('Supported Base Categories (direct array):', categories);
          setSupportedBaseCategories(categories);
        }

      } catch (err) {
        console.error('Error fetching dynamic data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Analyze current path
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const baseCategory = pathSegments[0]?.toLowerCase();
  const subCategorySlugFromUrl = pathSegments[1]?.toLowerCase();

  // Debug logging for path analysis
  useEffect(() => {
    if (!isLoading) {
      console.log('Path Analysis:', {
        pathname: location.pathname,
        pathSegments,
        baseCategory,
        subCategorySlugFromUrl,
        slug,
        supportedBaseCategories,
        subcategorySlugs,
        validProductSlugs
      });
    }
  }, [location.pathname, isLoading, supportedBaseCategories, subcategorySlugs, validProductSlugs]);

  // Check if it's a base category path (e.g., /industrial-oils or /greases)
  const isBaseCategoryPath = 
    supportedBaseCategories.length > 0 &&
    supportedBaseCategories.includes(baseCategory) && 
    !subCategorySlugFromUrl &&
    !slug;
console.log('isBaseCategoryPath:', isBaseCategoryPath);
  // Check if it's a subcategory path (e.g., /industrial-oils/hydraulic-oils)
  const isSubCategoryPath = 
    supportedBaseCategories.length > 0 &&
    subcategorySlugs.length > 0 &&
    supportedBaseCategories.includes(baseCategory) && 
    subCategorySlugFromUrl &&
    subcategorySlugs.includes(subCategorySlugFromUrl);
console.log('isSubCategoryPath:', isSubCategoryPath);
  // Check if it's a product detail page (e.g., /subcategory-slug/product-slug)
  const isProductDetailPage = 
    validProductSlugs.length > 0 &&
    slug && 
    validProductSlugs.includes(slug.toLowerCase()) &&
    pathSegments.length === 2; // Product paths have 2 segments

  // Additional logging for route matching
  useEffect(() => {
    if (!isLoading) {
      console.log('Route Matching:', {
        isBaseCategoryPath,
        isSubCategoryPath,
        isProductDetailPage,
        willRender: isBaseCategoryPath || isSubCategoryPath ? 'SubCategoryProductList' : 
                    isProductDetailPage ? 'ProductDetailPage' : '404'
      });
    }
  }, [isBaseCategoryPath, isSubCategoryPath, isProductDetailPage, isLoading]);

  // Dynamic page title
  useEffect(() => {
    if (isLoading) {
      document.title = 'Loading...';
    } else if (isBaseCategoryPath || isSubCategoryPath) {
      document.title = 'Subcategory Products';
    } else if (isProductDetailPage) {
      document.title = 'Product Details';
    } else {
      document.title = '404 – Page Not Found';
    }
  }, [isLoading, isBaseCategoryPath, isSubCategoryPath, isProductDetailPage]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-lg">Error loading page data</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  // Render appropriate component
  if (isBaseCategoryPath || isSubCategoryPath) {
    return <SubCategoryProductList />;
  }
  
  if (isProductDetailPage) {
    return <ProductDetailPage />;
  }
  
  return <Simple404Page />;
}