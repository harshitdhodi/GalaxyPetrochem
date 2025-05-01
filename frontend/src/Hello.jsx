import React from 'react';
import { useLocation } from 'react-router-dom';
import { useGetAllBlogsQuery } from '@/slice/blog/blog';
import SubCategoryProduct from './website/componets/parentProductCategory/subcategory/SubCategoryProduct';
import BlogDetailPage from './website/pages/BlogDetailPage';

export default function Hello() {
  const location = useLocation();
  const { data: blogData, isLoading } = useGetAllBlogsQuery();
console.log(blogData);
  const isBlogPath = blogData?.some(blog => location.pathname.includes(blog.slug));

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : isBlogPath ? (
        <BlogDetailPage />
      ) : (
        <SubCategoryProduct />
      )}
    </div>
  );
}
