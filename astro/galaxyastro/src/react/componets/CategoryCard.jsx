import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect, Component } from 'react';

// Error Boundary Component
class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}

// Skeleton Loader Component
const SkeletonCard = () => (
  <div className="animate-pulse bg-gray-200 rounded-md aspect-[4/3] w-full sm:w-auto">
    <div className="w-full h-44 bg-gray-300"></div>
    <div className="p-3 bg-gray-400 mt-2 h-6 w-3/4 rounded"></div>
  </div>
);

// Capitalize utility with safe fallback
function capitalizeWords(str) {
  return str ? str.replace(/\b\w/g, char => char.toUpperCase()) : '';
}

export default function CategoryCards({ categories = [] }) {
  const [visibleCategories, setVisibleCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Use categories directly since it's an array
  const categoryArray = Array.isArray(categories) ? categories : [];

  console.log('Received Categories:', categories); // Debugging data

  // Optimize initial render by limiting visible cards
  useEffect(() => {
    if (categoryArray.length) {
      setVisibleCategories(categoryArray.slice(0, 4));

      const timer = setTimeout(() => {
        setVisibleCategories(categoryArray);
        setLoading(false);
      }, 100);

      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, [categoryArray]);

  // Preload the first few category images
  useEffect(() => {
    if (typeof document !== 'undefined' && categoryArray.length) {
      categoryArray.slice(0, 3).forEach(category => {
        if (category.photo) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = `http://localhost:3028/api/logo/download/${category.photo}`;
          document.head.appendChild(link);
        }
      });
    }
  }, [categoryArray]);
  return (
    <ErrorBoundary>
      <div className="w-[76rem] mx-auto flex flex-col justify-start">
        <h2 className="text-4xl md:text-5xl font-bold pb-4 bg-gradient-to-r from-[#f18061] via-[#2860da] to-[#9e5d94] bg-clip-text text-transparent">
          Our Products Category
        </h2>
        <div className="h-2 mt-1 w-[20%] bg-[#e84c20]"></div>
      </div>

      <div className="w-full mt-7 flex flex-col justify-center items-center overflow-x-auto pb-6">
        <div className="grid gap-6 lg:max-w-[80rem] h-auto w-full px-4 md:px-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-center">
          {loading
            ? [...Array(8)].map((_, i) => <SkeletonCard key={i} />)
            : categoryArray.map((category, index) => (
                <div
                  key={category._id}
                  className="group relative aspect-[3/3] overflow-hidden w-full sm:w-auto rounded-md"
                >
                  {/* Image Container */}
                  <img
                    src={
                      category.photo
                        ? `http://localhost:3028/api/logo/download/${category.photo}`
                        : '/placeholder.jpg'
                    }
                    alt={category.alt || 'Category Image'}
                    className="object-fill sm:object-fill min-w-[200px] max-w-[400px] pt-[20%] min-h-[250px] max-h-[200px] w-full h-auto transition-transform duration-300 group-hover:scale-105"
                    fetchPriority={index < 2 ? 'high' : 'auto'}
                    loading={index < 4 ? 'lazy' : 'eager'}
                    decoding="async"
                    title={category.alt || 'Category'}
                  />

                  {/* Overlay */}
                  <div className="absolute bg-blue-500/10 hover:bg-amber-700/10 inset-0"></div>

                  {/* Hover Button */}
                  <Link
                    to={`/${category.slug}`}
                    className="absolute bottom-0 left-0 transform -translate-y-1/2 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out bg-[#e84c20] py-2 px-4 rounded-r-md text-white font-medium flex items-center"
                  >
                    {category.category}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              ))}
        </div>
      </div>
    </ErrorBoundary>
  );
}