import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGetBlogsByCategoryQuery, useGetAllBlogsQuery } from '@/slice/blog/blog';
import { useGetAllCategoriesQuery } from '@/slice/blog/blogCategory';
import { Banner } from './Banner';
import banner from "../.././assets/petrochemical.webp";
import axios from 'axios';
import { Eye } from 'lucide-react';

export default function BlogPage() {
  const { slug } = useParams(); // Get slug from URL
  const { data: categories } = useGetAllCategoriesQuery();

  const [selectedCategory, setSelectedCategory] = useState(slug || null);
  const [categoryName, setCategoryName] = useState('');
  const [banners, setBanners] = useState([]);
  const [isBannerLoading, setIsBannerLoading] = useState(true);

  const path = location.pathname.replace(/^\//, "") || "introduction";
  console.log(path);

  // Fetch blogs based on category or fetch all blogs if no category is selected
  const { data: categoryBlogs, isLoading: loadingCategory } = useGetBlogsByCategoryQuery(selectedCategory, {
    skip: !selectedCategory,
  });
  const { data: allBlogs, isLoading: loadingAllBlogs } = useGetAllBlogsQuery(undefined, {
    skip: !!selectedCategory, // Skip fetching all blogs if a category is selected
  });

  // Update selected category when slug changes
  useEffect(() => {
    setSelectedCategory(slug || null);
  }, [slug]);

  // Get category name from slug
  useEffect(() => {
    if (slug && categories) {
      const matched = categories.find((cat) => cat.slug === slug);
      if (matched) {
        setCategoryName(matched.category);
      }
    }
  }, [slug, categories]);

  // Fetch banner
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const pageSlug = slug || path; // Use slug if present, otherwise path
        const response = await axios.get(`/api/banner/getByPageSlug?pageSlug=${pageSlug}`);
        setBanners(response.data || []);
      } catch (error) {
        console.error("Failed to fetch banner:", error);
      } finally {
        setIsBannerLoading(false);
      }
    };

    fetchBanner();
  }, [slug, path]); // Add both as dependencies

  const blogs = selectedCategory
    ? Array.isArray(categoryBlogs) ? categoryBlogs : []
    : Array.isArray(allBlogs) ? allBlogs : [];

  const isLoading = loadingCategory || loadingAllBlogs;

  return (
    <>
      <div className="relative">
        {banners && banners.length > 0 ? (
          <Banner imageUrl={`/api/image/download/${banners[0].image}`} title={banners[0].title} />
        ) : (
          <Banner imageUrl={banner} />
        )}

        {/* Breadcrumb */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 mt-5 z-10">
          <nav className="px-4 py-2 rounded-md text-white text-sm sm:text-md font-semibold">
            <Link to="/">
              <span className="text-[12px] sm:text-[15px]">Home</span>
            </Link>
            <span className="mx-2">/</span>
            <Link to="/blogs">
              <span className="text-[12px] sm:text-[15px]">Blogs</span>
            </Link>
            {slug && (
              <>
                <span className="mx-2">/</span>
                <span className="text-[12px] sm:text-[15px]">{categoryName}</span>
              </>
            )}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Conditionally show filter or title */}
        {!slug ? (
          <div className="flex flex-wrap gap-4 justify-start mb-10">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-8 py-2 rounded-full border ${!selectedCategory ? 'bg-[#e84c20] text-white' : 'bg-white text-gray-700'} hover:bg-[#e84c20] hover:text-white transition`}
            >
              All
            </button>
            {categories?.map((category) => (
              <button
                key={category._id}
                onClick={() => setSelectedCategory(category.slug)}
                className={`px-8 py-2 rounded-full border ${selectedCategory === category.slug ? 'bg-[#e84c20] text-white' : 'bg-white text-gray-700'} hover:bg-[#e84c20] hover:text-white transition`}
              >
                {category.category}
              </button>
            ))}
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-[#995d96] pb-2">Blogs in: "{categoryName}"</h2>
            <div className="h-1 w-[5%] bg-[#9c5d95]  mb-6"></div>
          </>
        )}

        {/* Blog Cards */}
        {isLoading ? (
          <div className="text-center text-gray-500">Loading blogs...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs?.map((blog) => (
              <Link to={`/${blog.slug}`} key={blog._id}>
                <div className="bg-white border rounded-lg shadow hover:shadow-lg transform hover:scale-105 transition-transform duration-300 p-4">
                  <img
                    src={`/api/image/download/${blog.image}`}
                    alt={blog.title}
                    className="h-48 w-full object-cover rounded mb-4"
                  />
                  <h3 className="text-xl font-semibold text-[#052852] mb-2">{blog.title}</h3>
                  <div className="flex items-center justify-between ">
                    <p className="text-sm text-gray-600 ">{new Date(blog.date).toLocaleDateString()}</p>
                    <div className="flex text-gray-600 items-center gap-1">
                      <Eye className="w-4 h-4 " />
                      <p>{blog.visits}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 my-4 line-clamp-3">
                    {blog.details.replace(/<[^>]*>/g, '').slice(0, 120)}...
                  </p>

                  <a
                    href={`/${blog.slug}`}
                    className="inline-block bg-[#e84c20] text-white px-4 py-2 rounded hover:bg-[#c83e1b] transition"
                  >
                    Read More
                  </a>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}