import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import axiosInstance from '../config/axios.config';
import useUserTypeStore from '../store/userTypeStore';

export default function BlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userType } = useUserTypeStore();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await axiosInstance.get(`/blog/${id}`);
      setBlog(response.data.blog);
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching blog post');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Blog post not found'}</p>
          <button 
            onClick={() => navigate('/blog')}
            className="text-blue-600 hover:underline"
          >
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8 mt-20">
        {/* Author info */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <img
              src={blog.expertProfilePicture || "/placeholder-user.jpg"}
              alt={blog.expertName}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-[#232536] font-medium">{blog.expertName}</h3>
            <div className="flex items-center gap-2 text-[#6d6e76] text-sm">
              <span>{blog.expertTitle || 'Expert'}</span>
              <span>•</span>
              <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Title and Category */}
        <h1 className="text-[#232536] text-4xl font-bold mb-4">{blog.title}</h1>
        <div className="mb-8">
          <span className="inline-flex items-center px-3 py-1 bg-[#ffd050] text-[#232536] text-sm font-medium rounded-full">
            {blog.category}
          </span>
        </div>

        {/* Featured image */}
        {blog.images && blog.images.length > 0 && (
          <div className="mb-8">
            <img
              src={blog.images[0].url}
              alt="Blog featured image"
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Content */}
        <div className="prose max-w-none mb-12">
          <p className="text-[#6d6e76] leading-relaxed whitespace-pre-wrap">
            {blog.content}
          </p>
        </div>

        {/* Additional images */}
        {blog.images && blog.images.length > 1 && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            {blog.images.slice(1).map((image, index) => (
              <div key={index} className="overflow-hidden rounded-lg shadow-md">
                <img
                  src={image.url}
                  alt={`Blog image ${index + 2}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center border-t border-gray-200 pt-8">
          <button
            onClick={() => navigate('/blog')}
            className="text-[#6d6e76] hover:text-[#232536] transition-colors"
          >
            &larr; Back to Blogs
          </button>
          {userType === 'expert' && blog.createdBy === blog.expertId && (
            <button
              onClick={() => navigate(`/blog/${id}/edit`)}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Edit Blog
            </button>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
