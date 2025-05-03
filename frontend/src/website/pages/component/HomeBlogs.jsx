import { ArrowRight, CalendarIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RecentBlogs({ blogs }) {
  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        {blogs &&
          blogs.map((post, index) => (
            <Link
              key={index}
              to={`/${post.slug}`} // Redirect to /:slug
              className="bg-white shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-md hover:shadow-main_light shadow-main_light/50 rounded-lg border border-gray-200 overflow-hidden h-[350px]"
            >
              <img
                src={`/api/image/download/${post.image}`}
                alt={`${post.title} cover img`}
                className="w-full h-[60%] object-cover p-6 rounded-t-lg transition-opacity duration-300 hover:opacity-90"
              />
              <div className="card-header px-4 mt-3">
                <h3 className="text-xl font-bold text-gray-800">
                  {post.title}
                </h3>
              </div>
              <div className="card-content px-4 flex justify-between items-center">
                <div className="flex items-center text-sm mt-5 text-gray-500">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </>
  );
}