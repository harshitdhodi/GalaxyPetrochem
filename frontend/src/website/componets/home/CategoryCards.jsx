import { useGetAllChemicalCategoriesQuery } from '@/slice/chemicalSlice/chemicalCategory';
import { ArrowRight } from 'lucide-react';
import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';

// Skeleton Loader Component
const SkeletonCard = () => (
  <div className="animate-pulse bg-gray-200 rounded-md aspect-[4/3] w-full sm:w-auto">
    <div className="w-full h-44 bg-gray-300"></div>
    <div className="p-3 bg-gray-400 mt-2 h-6 w-3/4 rounded"></div>
  </div>
);

// Capitalize utility with safe fallback
function capitalizeWords(str) {
  return str ? str.replace(/\b\w/g, char => char.toUpperCase()) : "";
}

export default function CategoryCards() {
  const { data: categories, isLoading } = useGetAllChemicalCategoriesQuery();
  const [visibleCategories, setVisibleCategories] = useState([]);

  console.log(categories); // Debugging data

  // Optimize initial render by limiting visible cards
  useEffect(() => {
    if (categories?.length) {
      setVisibleCategories(categories.slice(0, 4));

      // Show all categories after a slight delay
      const timer = setTimeout(() => {
        setVisibleCategories(categories);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [categories]);

  // Preload the first few category images
  useEffect(() => {
    if (categories?.length) {
      categories.slice(0, 3).forEach(category => {
        if (category.photo) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = `/api/logo/download/${category.photo}`;
          document.head.appendChild(link);
        }
      });
    }
  }, [categories]);

  return (
    <div className="w-full mt-7 flex flex-col justify-center items-center overflow-x-auto pb-6">
      <div className="grid gap-6 lg:max-w-[75rem] h-auto w-full px-4 md:px-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-center">
        {isLoading
          ? [...Array(8)].map((_, i) => <SkeletonCard key={i} />)
          : visibleCategories?.map((category, index) => (
            <Link
              key={category._id}
              to={`/${category.slug}`}
              className="group relative aspect-[3/3] overflow-hidden w-full sm:w-auto"
            >
              <img
                src={category.photo ? `/api/logo/download/${category.photo}` : "/placeholder.jpg"}
                alt={category.alt || "Category Image"}
                className="object-fill sm:object-fill w-full h-full transition-transform group-hover:scale-105"
                width={300}
                height={300}
                fetchPriority={index < 2 ? "high" : "auto"}
                loading={index < 4 ? "lazy" : "eager"}
                decoding="async"
                title={category.alt || "Category"}
                style={{
                  backgroundImage: `url('/low-quality-placeholder.jpg')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />


              <div className="absolute bg-main/10 inset-0"></div>
              <div className="absolute bg-main bottom-0 left-0 right-0 p-3 flex items-center justify-between text-white">
                <h3 className="font-semibold text-md">{capitalizeWords(category.category || "Unknown")}</h3>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))
        }
      </div>
    </div>
  );
}
