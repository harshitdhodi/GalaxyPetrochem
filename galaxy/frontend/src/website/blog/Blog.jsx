import { CalendarIcon, ClockIcon, MailIcon, PhoneIcon } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function BlogPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [blogCard, setBlogCard] = useState(null);
  const [contactInfo, setContactInfo] = useState(null);
  const [blogs, setBlogs] = useState(null);
  const [latestBlogData, setLatestBlogData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch blog card
        const blogCardResponse = await axios.get('/api/blogCard/getCard');
        setBlogCard(blogCardResponse.data[0]);
        
        // Fetch contact info
        const contactInfoResponse = await axios.get('/api/contactInfo/get');
        setContactInfo(contactInfoResponse.data[0]);
        
        // Fetch latest blog
        const latestBlogResponse = await axios.get('/api/blog/getLatestBlog');
        setLatestBlogData(latestBlogResponse.data);
        
        // Fetch blogs based on slug
        if (slug) {
          const blogsByCategoryResponse = await axios.get(`/api/blog/getBlogsByCategory/${slug}`);
          setBlogs(blogsByCategoryResponse.data);
        } else {
          const allBlogsResponse = await axios.get('/api/blog/getAllBlogsExceptLatest');
          setBlogs(allBlogsResponse.data);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError(true);
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  // Handle loading and error states
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading blogs.</div>;
  }

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
                <h2 className="text-3xl text-main font-bold mt-8 mb-10 pb-2 border-b-2 border-secondary">
                  Latest from the Blog
                </h2>   

                {/* Featured Post - Latest Blog */}
                {latestBlogData && (
                  <div className="bg-white transform transition-transform duration-100 hover:scale-105 hover:shadow-md hover:shadow-main_light shadow-lg shadow-main_light/50 rounded-lg h-[60vh] border border-gray-200 mb-12 overflow-hidden">
                    <div className="md:flex ">
                      <div className="md:w-2/5 p-5 lg:w-[80%] h-[50vh]">
                        <img
                          src={`/api/image/download/${latestBlogData.image}`}
                          alt="Featured blog post img"
                          className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                        />
                      </div>
                      <div className="md:w-3/5 h-[50vh] p-4">
                        <h3 className="text-2xl font-bold mb-2 text-main">
                          <Link to="#" className="hover:underline text-[#052852]">
                            {latestBlogData.title}
                          </Link>
                        </h3>
                        <p
                          className="text-gray-600 mb-4"
                          dangerouslySetInnerHTML={{
                            __html: latestBlogData.details.slice(31, 107),
                          }}
                        />
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          <span>{new Date(latestBlogData.date).toLocaleDateString()}</span>
                          <ClockIcon className="ml-4 mr-2 h-4 w-4" />
                          <span>{latestBlogData.readTime} min read</span>
                        </div>
                        <Link to={`/blog/${latestBlogData.slug}`}>
                          <button className="btn bg-main text-white hover:bg-[#1299ca] px-8 py-2 rounded">
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
            <h3 className="text-2xl text-main font-bold mt-12 mb-8 pb-2 border-b-2 border-main_light">
              {slug ? `Blogs in "${slug}"` : 'Recent Posts'}
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              {blogs &&
                blogs.map((post, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-md hover:shadow-main_light shadow-main_light/50 rounded-lg border border-gray-200 overflow-hidden h-[450px]"
                  >
                    <img
                      src={`/api/image/download/${post.image}`}
                      alt={`${post.title} cover img`}
                      className="w-full h-[60%] object-contain px-6 rounded-t-lg transition-opacity duration-300 hover:opacity-90"
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
                        <button className="btn m-2 mb-3 bg-main text-white hover:bg-[#1299ca] px-8 py-2 rounded">
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
            <div className="sticky top-[30%] mb-8 xl:p-7">
              {/* Share Your Thoughts Card */}
              {blogCard && (
                <div
                  className="bg-main py-10 px-5 shadow-lg hover:shadow-md hover:shadow-main_light shadow-main/50 border "
                  dangerouslySetInnerHTML={{ __html: blogCard.blogCard }}
                />
              )}

              {/* Contact Card */}
              {contactInfo && (
                <div className="mt-5">
                  <div className="bg-main flex flex-col gap-4 shadow-lg hover:shadow-md hover:shadow-main shadow-main/50 border border-gray-200 p-10">
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