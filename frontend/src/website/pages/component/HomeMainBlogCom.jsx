import { ArrowRight, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGetAllBlogsQuery } from '@/slice/blog/blog';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function HomeBlogCom() {
  const [blogCard, setBlogCard] = useState(null);

  // Fetch blog card content
  useEffect(() => {
    const fetchBlogCard = async () => {
      try {
        const response = await axios.get('/api/blogCard/getCard');
        setBlogCard(response.data[0]);
      } catch (error) {
        console.error('Failed to fetch blog card:', error);
      }
    };

    fetchBlogCard();
  }, []);

  // Fetch all blogs
  const { data: allBlogs, isLoading, error } = useGetAllBlogsQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading blogs.</div>;

  return (
    <>
      <div className="max-w-[80rem] py-5 mx-auto">
        <div className="pt-4 ml-4 md:ml-7  xl:ml-0 md:flex md:items-center md:justify-between gap-2">
          <div>
            <p className="text-3xl md:text-4xl font-bold text-[#9c5d95] font-daysOne text-left">
              Our Latest Blogs
            </p>
            <div className="h-1 w-[25%] mt-1 bg-[#9c5d95]"></div>
          </div>
          <p className="py-3 text-gray-400 font-semibold flex lg:pr-3 flex-wrap gap-2">
            <Link to="/blogs" className="flex pr-5 items-center gap-2 text-[#9c5d95] font-semibold">
              View All <ArrowRight />
            </Link>
          </p>
        </div>
      </div>

      <div className="px-4 md:px-6 mb-10 bg-white lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allBlogs?.slice(0, 6).map((blog) => (
            <Link to={`/${blog.slug}`} key={blog._id}>
              <div className="bg-white border rounded-lg shadow hover:shadow-lg transform hover:scale-105 transition-transform duration-300 p-4">
                <img
                  src={`/api/image/download/${blog.image}`}
                  alt={blog.title}
                  className="h-48 w-full object-cover rounded mb-4"
                />
                <h3 className="text-xl font-semibold text-[#052852] mb-2">{blog.title}</h3>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <p>{new Date(blog.date).toLocaleDateString()}</p>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{blog.visits}</span>
                  </div>
                </div>
                <p className="text-gray-700 my-4 line-clamp-3">
                  {blog.details.replace(/<[^>]*>/g, '').slice(0, 120)}...
                </p>
                <Link
                  to={`/${blog.slug}`}
                  className="inline-block bg-[#e84c20] text-white px-4 py-2 rounded hover:bg-[#c83e1b] transition"
                >
                  Read More
                </Link>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
