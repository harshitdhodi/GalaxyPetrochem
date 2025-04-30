import { CalendarIcon, ClockIcon, MailIcon, PhoneIcon } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useGetAllBlogsExceptLatestQuery, useGetBlogsByCategoryQuery, useGetLatestBlogQuery } from '@/slice/blog/blog';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function BlogPage() {
  const { slug } = useParams();

  const [blogCard, setBlogCard] = useState(null);
  const [contactInfo, setContactInfo] = useState(null);

  useEffect(() => {
    const fetchBlogCard = async () => {
      try {
        const response = await axios.get('/api/blogCard/getCard');
        setBlogCard(response.data[0]);
      } catch (error) {
        console.error('Failed to fetch blog card:', error);
      }
    };

    const fetchContactInfo = async () => {
      try {
        const response = await axios.get('/api/contactInfo/get');
        setContactInfo(response.data[0]);
      } catch (error) {
        console.error('Failed to fetch contact info:', error);
      }
    };

    fetchBlogCard();
    fetchContactInfo();
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
          {!slug && (
              <>
            <div className='py-10'>
            <h2 className="text-4xl md:text-4xl  font-bold  text-[#985d97] pb-2 bg-clip-text ">
                  Latest from the Blog
                </h2>   
                <div className="h-1 mt-1 w-[20%]  bg-[#e84c20]"></div>
            </div>
                {/* Featured Post - Latest Blog */}
                {latestBlog && (
                  <div className="bg-white transform transition-transform duration-100 hover:scale-105 hover:shadow-md hover:shadow-main_light shadow-lg shadow-main_light/50 rounded-lg h-[60vh] border border-gray-200 mb-12 overflow-hidden">
                    <div className="md:flex gap-6">
                      <div className="md:w-2/5  lg:w-[70%] h-[40vh] lg:h-[60vh]">
                        <img
                          src={`/api/image/download/${latestBlog.image}`}
                          alt="Featured blog post img"
                          className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                        />
                      </div>
                      <div className="md:w-3/5 h-[50vh] p-4">
                        <h3 className="text-2xl font-bold mb-2 text-main">
                          <Link to="#" className="hover:underline text-[#052852]">
                            {latestBlog.title}
                          </Link>
                        </h3>
                        <p
                          className="text-gray-600 mb-4"
                          dangerouslySetInnerHTML={{
                            __html: latestBlog.details.slice(31, 107),
                          }}
                        />
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          <span>{new Date(latestBlog.date).toLocaleDateString()}</span>
                          <ClockIcon className="ml-4 mr-2 h-4 w-4" />
                          <span>{latestBlog.readTime} min read</span>
                        </div>
                        <Link to={`/blog/${latestBlog.slug}`}>
                          <button className="btn bg-primary shadow-md shadow-black/40 text-white  px-8 py-2 rounded">
                            Read More
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Recent Posts */}
            <div className='py-10'>
            <h2 className="text-2xl md:text-3xl  font-bold   pb-2 bg-clip-text text-[#985d97]">
            {slug ? `Blogs in "${slug}"` : 'Recent Posts'}
                </h2>   
                <div className="h-1 mt-1 w-[20%]  bg-[#e84c20]"></div>
            </div>
           
            <div className="grid gap-6 md:grid-cols-2">
              {blogsToShow &&
                blogsToShow.map((post, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-md hover:shadow-main_light shadow-main_light/50 rounded-lg border border-gray-200 overflow-hidden h-[450px]"
                  >
                    <img
                      src={`/api/image/download/${post.image}`}
                      alt={`${post.title} cover img`}
                      className="w-full h-[60%] object-contain px-6
                       rounded-t-lg transition-opacity duration-300 hover:opacity-90"
                    />
                    <div className="card-header px-4 mt-3">
                      <h3 className="text-xl font-bold text-gray-800">
                        <Link to="#" className="hover:underline hover:text-main_light transition-colors duration-300">
                          {post.title}
                        </Link>
                      </h3>
                    </div>
                    <div className="card-content px-4 flex justify-between items-center">
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                      <Link to={`/blog/${post.slug}`}>
                        <button className="btn m-2 mb-3 bg-primary shadow-md shadow-black/60 text-white  px-8 py-2 rounded">
                          Read More
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 mt-8 lg:mt-10">
            <div className="sticky top-[28%] mb-8 xl:p-7">
              {/* Share Your Thoughts Card */}
              {blogCard && (
                <div
                  className="bg-custom-gradient py-10 px-5 shadow-lg hover:shadow-md hover:shadow-main_light shadow-main/50 border "
                  dangerouslySetInnerHTML={{ __html: blogCard.blogCard }}
                />
              )}

              {/* Contact Card */}
              {contactInfo && (
                <div className="mt-5">
                  <div className="bg-custom-gradient flex flex-col gap-4 shadow-lg hover:shadow-md hover:shadow-main shadow-main/50 border border-gray-200 p-10">
                    <div className="card-header">
                      <h3 className="card-title text-2xl font-bold text-[#ffffff]">Get in Touch</h3>
                    </div>
                    <div className="card-content flex flex-col gap-2">
                      {contactInfo.mobiles.map((mobile, index) => (
                        <div className="flex items-center" key={index}>
                          <PhoneIcon className="h-6 w-6 mr-2 text-[#ffffff]" />
                          <span className="text-lg text-[#ffffff]">{mobile}</span>
                        </div>
                      ))}
                      {contactInfo.emails.map((email, index) => (
                        <div className="flex items-center" key={index}>
                          <MailIcon className="h-6 text-[#ffffff] w-6 mr-2" />
                          <Link to={`mailto:${email}`} className="text-lg text-[#ffffff] hover:underline">
                            {email}
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}