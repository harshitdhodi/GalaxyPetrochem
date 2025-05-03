import PropTypes from 'prop-types'; // Import PropTypes
import { useParams, useNavigate } from 'react-router-dom'; // To get the slug from the URL and navigate
import { useGetBlogBySlugQuery, useGetAllBlogsExceptLatestQuery } from '@/slice/blog/blog';
import { Calendar, Calendar1 } from 'lucide-react';

const RecentPostCard = ({ title, image, date, slug }) => {
    const navigate = useNavigate(); // Initialize the navigate function

    const handleClick = () => {
        navigate(`/blog/${slug}`); // Redirect to the blog detail page with the slug
    };

    return (
        <div
            className="bg-white rounded-lg shadow-md shadow-[#995f99] overflow-hidden mb-4 group relative cursor-pointer"
            onClick={handleClick} // Add click handler
        >
            {/* Image with hover effect */}
            <div className="overflow-hidden relative">
                <img
                    src={`/api/image/download/${image?.[0]}`}
                    alt={title}
                    name={title}
                    className="w-full h-40 object-cover transform transition-transform duration-300 group-hover:scale-105"
                />
                {/* Transparent blue overlay */}
                <div className="absolute inset-0 bg-primary/40 bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            {/* Text content */}
            <div className="p-4">
                <h3 className="font-semibold hover:border-b text-lg mb-2 group relative">
                    {title}
                </h3>
              <div className='flex items-center gap-2'>
              <Calendar className='text-gray-600 w-4 h-4'/>
              <p className="text-gray-600 text-sm">{date}</p>
              </div>
            </div>
        </div>
    );
};

// Add PropTypes validation for RecentPostCard
RecentPostCard.propTypes = {
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired, // Add slug as a required prop
};

const BlogDetailPage = () => {
    const { slug } = useParams(); // Get the slug from the URL
    const { data: blog, error, isLoading } = useGetBlogBySlugQuery(slug); // Fetch the current blog

    const { data: recentBlogs=[], isLoading: isRecentBlogsLoading } = useGetAllBlogsExceptLatestQuery(slug); // Pass slug to exclude it
    console.log(recentBlogs, 'recentBlogs');
    if (isLoading) return <div>Loading blog...</div>;
    if (error) return <div>Something went wrong...</div>;
    if (isRecentBlogsLoading) return <div>Loading recent posts...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-wrap gap-5">
                {/* Main blog content */}
                <div className="w-full lg:w-[65%] px-4 mb-8 lg:mb-0">
                    <h1 className="text-4xl text-[#2d60d6] font-bold mb-4">{blog?.title}</h1>
                    <p className="text-gray-600 mb-4">Published on {blog?.date} | By {blog?.postedBy}</p>
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

                {/* Sidebar with recent posts */}
                <div className="w-full lg:w-[30%] h-fit shadow-md shadow-[#2d60d6]/70 ml-8 py-5 rounded-md px-8">
                    <h2 className="text-2xl font-bold mb-4 text-blue-900">Recent Posts</h2>
                    {recentBlogs?.map((post, index) => (
                        <RecentPostCard
                            key={index}
                            title={post?.title}
                            image={post?.image}
                            date={post?.date}
                            slug={post?.slug}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};


export default BlogDetailPage;