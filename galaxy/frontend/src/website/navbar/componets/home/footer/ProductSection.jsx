import { useState, useEffect } from 'react';
import ScrollLink from './ScrollLink';

export default function ProductsSection({ navigate }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/chemicalCategory/getAll');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Group categories by type (based on naming convention)
  const getGroupedCategories = () => {
    const chemicals = categories.filter(cat => 
      !cat.category.toLowerCase().includes('culture') && 
      !cat.category.toLowerCase().includes('media') &&
      !cat.category.toLowerCase().includes('microbiology')
    );
    
    const microbiology = categories.filter(cat => 
      cat.category.toLowerCase().includes('culture') || 
      cat.category.toLowerCase().includes('media') ||
      cat.category.toLowerCase().includes('microbiology')
    );

    return { chemicals, microbiology };
  };

  const { chemicals, microbiology } = getGroupedCategories();

  if (loading) return <div>Loading categories...</div>;
  if (error) return <div>Error loading categories: {error}</div>;

  return (
    <div className="col-span-2 md:col-span-2">
      <h2 className="text-xl font-medium mb-6">Categories</h2>
      <div > 
        <CategorySection 
         
          categories={chemicals.slice(0, 5)}
          viewMoreLink="/chemicals"
          navigate={navigate}
        />
       
      </div>
    </div>
  );
}

function CategorySection({  categories, viewMoreLink, navigate }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2">
      <ul className="space-y-2 text-sm grid grid-cols-1 ">
        {categories.map((category) => (
          <li key={category._id}>
            <ScrollLink 
              to={`/${category.slug}`} 
              navigate={navigate}
            >
              {category.category}
            </ScrollLink>
          </li>
        ))}
      
      </ul>
    </div>
  );
}