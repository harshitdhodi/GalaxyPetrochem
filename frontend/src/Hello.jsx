import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useGetAllBlogsQuery } from '@/slice/blog/blog';
import SubCategoryProduct from './website/componets/parentProductCategory/subcategory/SubCategoryProduct';
import BlogDetailPage from './website/pages/BlogDetailPage';
import Simple404Page from './website/pages/404';

export default function Hello() {
  const location = useLocation();
  const { data: blogData, isLoading } = useGetAllBlogsQuery();

  const path = location.pathname;
  const validSubCategoryPaths = ['/industrial-oils', '/greases'];
  const isSubCategoryPath = validSubCategoryPaths.includes(path);

  const isBlogPath = blogData?.some(blog => path === `/${blog.slug}`);

  useEffect(() => {
    if (isLoading) {
      document.title = 'Loading...';
    } else if (isSubCategoryPath) {
      document.title = 'Subcategory Products';
    } else if (isBlogPath) {
      document.title = 'Blog Details';
    } else {
      document.title = '404'; // Set meta title to "404" for the 404 page
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