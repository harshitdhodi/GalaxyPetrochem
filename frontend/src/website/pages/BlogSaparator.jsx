import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import BlogDetailPage from './BlogDetailPage';
import BlogPage from './BlogPage';

const BlogSaparator = () => {
    const location = useLocation();
    const [categories, setCategories] = useState([]);
    const [isProductsPath, setIsProductsPath] = useState(false);

    useEffect(() => {
        // Fetch categories from the API
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/blogCategory/get');
                const data = await response.json();
                console.log(data);
                setCategories(data);

                // Check if the current pathname matches any category slug
                const match = data.some(category => 
                    location.pathname.startsWith(`/blog/${category.slug}`)
                );
                setIsProductsPath(match);
            } catch (error) {
                console.error('Error fetching blog categories:', error);
            }
        };

        fetchCategories();
    }, [location.pathname]);

    return (
        <div>
            {isProductsPath ? (
                <BlogPage />
            ) : (
                <BlogDetailPage />
            )}
        </div>
    );
};

export default BlogSaparator;