import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useGetAllBlogsQuery } from '@/slice/blog/blog';
import SubCategoryProduct from './website/componets/parentProductCategory/subcategory/SubCategoryProduct';
import BlogDetailPage from './website/pages/BlogDetailPage';
import Simple404Page from './website/pages/404';

export default function Hello() {
  const location = useLocation();
  const { slug } = useParams();
  const { data: blogData, isLoading: isLoadingBlogs } = useGetAllBlogsQuery();
  
  const [validSubCategorySlugs, setValidSubCategorySlugs] = useState([]);
  const [isLoadingSubcategories, setIsLoadingSubcategories] = useState(true);

  // Fetch subcategories from API
  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        setIsLoadingSubcategories(true);
        const response = await fetch('/api/chemicalCategory/getAllCategories');
        const result = await response.json();
        
        console.log('result---', result.data); // 👈 For debugging
        
        if (result.success && result.data) {
          // Extract slugs from the new response format
          const slugs = result.data.map(item => item.slug); // 👈 Changed from subcategorySlug to slug
          setValidSubCategorySlugs(slugs);
          console.log('Valid slugs:', slugs); // 👈 For debugging
        }
      } catch (error) {
        console.error('Error fetching subcategories:', error);
        setValidSubCategorySlugs([]);
      } finally {
        setIsLoadingSubcategories(false);
      }
    };

    fetchSubcategories();
  }, []);

  const isSubCategoryPath = validSubCategorySlugs.includes(slug);
  const isBlogPath = blogData?.some(blog => slug === blog.slug);
  
  const isLoading = isLoadingSubcategories || isLoadingBlogs;

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