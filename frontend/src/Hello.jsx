import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useGetAllBlogsQuery } from '@/slice/blog/blog';
import SubCategoryProduct from './website/componets/parentProductCategory/subcategory/SubCategoryProduct';
import BlogDetailPage from './website/pages/BlogDetailPage';
import Simple404Page from './website/pages/404';

export default function Hello() {
  const location = useLocation();
  const { data: blogData, isLoading: isBlogsLoading } = useGetAllBlogsQuery();
  const [validSubCategoryPaths, setValidSubCategoryPaths] = useState([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

  const path = location.pathname;

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/chemicalCategory/getAll');
        const data = await response.json();
        
        console.log('API Response:', data); // Debug: Check the structure
        
        // Handle different possible response structures
        let categories = [];
        
        if (Array.isArray(data)) {
          categories = data;
        } else if (data.data && Array.isArray(data.data)) {
          categories = data.data;
        } else if (data.categories && Array.isArray(data.categories)) {
          categories = data.categories;
        } else if (data.results && Array.isArray(data.results)) {
          categories = data.results;
        }
        
        // Transform the categories to paths
        const paths = categories.map(category => `/${category.slug || category.path || category.name?.toLowerCase().replace(/\s+/g, '-')}`);
        setValidSubCategoryPaths(paths);
        
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to hardcoded paths if API fails
        setValidSubCategoryPaths(['/industrial-oils', '/greases', '/aerosol']);
      } finally {
        setIsCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const isSubCategoryPath = validSubCategoryPaths.includes(path);
  const isBlogPath = blogData?.some(blog => path === `/${blog.slug}`);
  const isLoading = isBlogsLoading || isCategoriesLoading;

  useEffect(() => {
    if (isLoading) {
      document.title = 'Loading...';
    } else if (isSubCategoryPath) {
      document.title = 'Subcategory Products';
    } else if (isBlogPath) {
      document.title = 'Blog Details';
    } else {
      document.title = '404';
    }
  }, [isLoading, isSubCategoryPath, isBlogPath]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {isSubCategoryPath ? (
        <SubCategoryProduct />
      ) : isBlogPath ? (
        <BlogDetailPage />
      ) : (
        <Simple404Page />
      )}
    </div>
  );
}