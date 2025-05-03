import { ArrowRight, CalendarIcon, ClockIcon, MailIcon, PhoneIcon } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useGetAllBlogsExceptLatestQuery, useGetBlogsByCategoryQuery, useGetLatestBlogQuery } from '@/slice/blog/blog';
import { useEffect, useState } from 'react';
import axios from 'axios';
import RecentBlogs from './HomeBlogs';

export default function HomeBlogCom() {
  const { slug } = useParams();

  const [blogCard, setBlogCard] = useState(null);

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

  // Fetch blogs based on the presence of slug
  const { data: blogsByCategory, isLoading: loadingBlogsByCategory, error: errorBlogsByCategory } =
    slug ? useGetBlogsByCategoryQuery(slug) : { data: null, isLoading: false, error: null };
  
  const { data: latestBlog, isLoading: loadingLatestBlog, error: errorLatestBlog } = useGetLatestBlogQuery();
 
  const { data: allBlogs, isLoading: loadingAllBlogs, error: errorAllBlogs } =
    !slug ? useGetAllBlogsExceptLatestQuery() : { data: null, isLoading: false, error: null };

  // Handle loading and error states
  if (loadingLatestBlog || loadingAllBlogs || loadingBlogsByCategory) {
    return <div>Loading...</div>;
  }

  if (errorLatestBlog || errorAllBlogs || errorBlogsByCategory) {
    return <div>Error loading blogs.</div>;
  }

  // Use appropriate blogs data
  const blogsToShow = slug ? blogsByCategory : allBlogs;

  return (
    <>
     <div className="max-w-[80rem] py-5 mx-auto">
        <div className='pt-4 ml-4 md:ml-7 xl:ml-0 lg:flex lg:items-center lg:justify-between gap-2 '>
          <div>
            <p className='text-3xl md:text-4xl font-bold  text-[#9c5d95] font-daysOne text-left  md:text-left'>Our Latest Blogs</p>
            <div className="h-1 w-[25%] mt-1 bg-[#9c5d95]"></div>

          </div> 
          <p className='py-3 text-gray-400 font-semibold flex lg:pr-3 flex-wrap gap-2'>
          Explore Fresh Perspectives on Products and Industry Innovations.
            <Link to="/blogs" className='flex items-center gap-2 text-[#9c5d95] font-semibold'>
              View All <ArrowRight className="" />
            </Link>
          </p>
        </div>
      </div>
    <div className="px-4 md:px-6 mb-10 bg-white lg:px-8 relative">
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 50m-40 0a40,40 0 1,0 80,0a40,40 0 1,0 -80,0' fill='none' stroke='%23333' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px',
        }}
      />
      <div className="max-w-7xl mx-auto">
        <div className="lg:flex lg:gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
         

            {/* Recent Posts */}
            <RecentBlogs slug={slug} blogs={blogsToShow} />
          </div>

        </div>
      </div>
    </div>
    </>
  );
}