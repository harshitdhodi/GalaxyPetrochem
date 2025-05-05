import PropTypes from 'prop-types';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  useGetBlogBySlugQuery,
  useGetAllBlogsExceptLatestQuery
} from '@/slice/blog/blog';
import { Calendar, Eye } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios
import { Banner } from './Banner';

const RecentPostCard = ({ title, image, date, slug, visits }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/blog/${slug}`);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md shadow-[#995f99] overflow-hidden mb-4 group relative cursor-pointer"
      onClick={handleClick}
    >
      <div className="overflow-hidden relative">
        <img
          src={`/api/image/download/${image?.[0]}`}
          alt={title}
          name={title}
          className="w-full h-40 object-cover transform transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-primary/40 bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold hover:border-b text-lg mb-2 group relative">
          {title}
        </h3>
        <div className="flex items-center justify-between text-gray-600 text-sm">
          {/* Date */}
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <p>{date}</p>
          </div>
          {/* Views */}
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <p>{visits}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

RecentPostCard.propTypes = {
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired
};

const BlogDetailPage = () => {
  const { slug } = useParams();
  const { data: blog, error, isLoading } = useGetBlogBySlugQuery(slug);
  const {
    data: recentBlogs = [],
    isLoading: isRecentBlogsLoading
  } = useGetAllBlogsExceptLatestQuery(slug);
  const [banners, setBanners] = useState([]);
  const [isBannerLoading, setIsBannerLoading] = useState(true);
  const path = location.pathname.replace(/^\//, "") || "introduction";

    useEffect(() => {
      const fetchBanner = async () => {
        try {
          const response = await axios.get(`/api/banner/getByPageSlug?pageSlug=blogs`);
          console.log(response.data);
          setBanners(response.data || []);
        } catch (error) {
          console.error("Failed to fetch banner:", error);
        } finally {
          setIsBannerLoading(false);
        }
      };
  
      fetchBanner();
    }, [path]);
  

  useEffect(() => {
    const incrementVisitWithIP = async () => {
      if (isLoading || !blog?._id) {
        console.log('Skipping API call: isLoading=', isLoading, 'blog._id=', blog?._id);
        return;
      }

      try {
        console.log('Fetching IP...');
        const ipResponse = await axios.get('https://api.ipify.org?format=json');
        const clientIP = ipResponse.data.ip;
        console.log('Client IP:', clientIP);

        console.log('Calling incrementBlogVisits API...');
        const response = await axios.put(
          `/api/blog/incrementBlogVisits?id=${blog._id}&clientIP=${clientIP}`
        );
        console.log('API call successful:', response.data);
      } catch (err) {
        console.error('Failed to get IP or increment visit:', err.response?.data || err.message);
      }
    };

    incrementVisitWithIP();
  }, [blog, isLoading]);

  if (isLoading) return <div>Loading blog...</div>;
  if (error) return <div>Something went wrong...</div>;
  if (isRecentBlogsLoading) return <div>Loading recent posts...</div>;

  return (
    <>
     <div className="relative">
        {/* Banner */}
        {banners && banners.length > 0 ? (
          <Banner imageUrl={`/api/image/download/${banners[0].image}`} title={banners[0].title} />
        ) : (
         "no banner"
        )}

        {/* Breadcrumb - centered horizontally, below the title */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 mt-5 z-10">
          <nav className=" px-4 py-2 rounded-md text-white text-sm sm:text-md font-semibold">
            <Link to="/">
              <span className="    text-[12px] sm:text-[15px]">Home</span>
            </Link>
            <span className="mx-2">/</span>
            <Link to="/blogs">
              <span className=" text-[12px] sm:text-[15px]">Blogs</span>
            </Link>
            <span className="mx-2">/</span>
            <Link to={`/blog/${slug}`}>
              <span className=" text-[12px] sm:text-[15px]">{blog?.title}</span>
            </Link>
          </nav>
        </div>
      </div>
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-wrap gap-5">
        <div className="w-full lg:w-[65%] px-4 mb-8 lg:mb-0">
          <h1 className="text-4xl text-[#2d60d6] font-bold mb-4">{blog?.title}</h1>
          <p className="text-gray-600 mb-4">
            Published on {blog?.date} | By {blog?.postedBy}
          </p>
          <img
            src={`/api/image/download/${blog?.image}`}
            alt={blog?.title}
            className="w-full h-[400px] object-cover rounded-lg mb-6"
          />
          <div className="prose max-w-none">
            <div
              className="text-gray-600 text-lg text-justify mb-4"
              dangerouslySetInnerHTML={{ __html: blog?.details }}
            />
          </div>
        </div>

        <div className="w-full lg:w-[30%] h-fit shadow-md shadow-[#2d60d6]/70 ml-8 py-5 rounded-md px-8">
          <h2 className="text-2xl font-bold mb-4 text-blue-900">Recent Posts</h2>
          {recentBlogs?.map((post, index) => (
            <RecentPostCard
              key={index}
              title={post?.title}
              image={post?.image}
              date={post?.date}
              slug={post?.slug}
              visits={post?.visits}
            />
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default BlogDetailPage;