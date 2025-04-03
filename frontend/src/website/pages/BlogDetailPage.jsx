import React from 'react';
import { useParams } from 'react-router-dom'; // To get the slug from the URL

import { useGetBlogBySlugQuery ,useGetAllBlogsExceptLatestQuery

} from '@/slice/blog/blog';
import Footer from '../componets/home/Footer';

const RecentPostCard = ({ title, image, date }) => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-4 group relative">
        {/* Image with hover effect */}
        <div className="overflow-hidden relative">
            <img
                src={`/api/image/download/${image}`}
                alt={title}   
                name={title}
                className="w-full h-40 object-cover transform transition-transform duration-300 group-hover:scale-105"
            />
            {/* Transparent blue overlay */}
            <div className="absolute inset-0 bg-main_light bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        {/* Text content */}
        <div className="p-4">
            <h3 className="font-semibold text-lg mb-2 group relative cursor-pointer">
                {title}
                <span className="absolute left-0 bottom-0 block w-0 h-0.5 bg-black transition-all duration-1000 group-hover:w-full"></span>
            </h3>
            <p className="text-gray-600 text-sm">{date}</p>
        </div>
    </div>
);

const BlogDetailPage = () => {
    const { slug } = useParams(); // Get the slug from the URL
    const { data: blog, error, isLoading } = useGetBlogBySlugQuery(slug);  // Fetch the blog by slug
    console.log(blog)
    const { data: recentBlogs, isLoading: isRecentBlogsLoading } = useGetAllBlogsExceptLatestQuery(); // Fetch recent blogs

    if (isLoading) return <div>Loading blog...</div>;
    if (error) return <div>Something went wrong...</div>;

    if (isRecentBlogsLoading) return <div>Loading recent posts...</div>;

    return (
        <>
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-wrap gap-5">
                {/* Main blog content (70% width) */}
                <div className="w-full lg:w-[65%] px-4 mb-8 lg:mb-0">
                    <h1 className="text-4xl text-main font-bold mb-4">{blog?.title}</h1>
                    <p className="text-gray-600 mb-4">Published on {blog?.date} | By {blog?.postedBy}</p>
                    <img
                        src={`/api/image/download/${blog?.image}`}
                        
                        alt={blog?.title}
                        className="w-full h-[400px] object-cover rounded-lg mb-6"
                    />
                    <div className="prose max-w-none">
                    <h2
                        className="text-gray-600 text-md mb-4"
                        dangerouslySetInnerHTML={{
                          __html: blog?.details
                        }}
                      ></h2>
                   
                        {/* Add other content or sections dynamically if needed */}
                    </div>
                </div>

                {/* Sidebar with recent posts (30% width) */}
                <div className="w-full lg:w-[30%] h-fit shadow-md ml-8 py-5 rounded-md px-8">
                    <h2 className="text-2xl font-bold mb-4 ">Recent Posts</h2>
                    {recentBlogs?.map((post, index) => (
                        <RecentPostCard
                            key={index}
                            title={post?.title}
                            image={post?.image}
                            date={post?.publishedDate}
                        />
                    ))}
                </div>
            </div>
        </div>
       
    </>
    );
};

export default BlogDetailPage;
