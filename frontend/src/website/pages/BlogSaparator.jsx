import React from 'react'
import { useLocation, useParams } from 'react-router-dom';
import BlogDetailPage from './BlogDetailPage';
import BlogPage from './BlogPage';

const BlogSaparator = () => {
    const location = useLocation();
    const { slug } = useParams();
  
    // Check if the URL contains '/chemicals' or '/microbiology'
    const isProductsPath =
      location.pathname.startsWith('/blog/pipes') || location.pathname.startsWith('/blog/chemical2') || location.pathname.startsWith('/blog/chemical1')
  
    return (
      <div>
        {isProductsPath ? (
          <BlogPage />
        ) : (
          <BlogDetailPage />
        )}
      </div>
    );
  }
  
export default BlogSaparator
