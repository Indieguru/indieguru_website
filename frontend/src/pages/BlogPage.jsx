import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import BlogModal from "../components/modals/BlogModal";
import LoadingScreen from "../components/common/LoadingScreen";
import axiosInstance from '../config/axios.config';
import useUserTypeStore from '../store/userTypeStore';
import { Plus } from 'lucide-react';

export default function BlogPage() {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const { userType } = useUserTypeStore();
  const [allPosts, setAllPosts] = useState([]); // Store all blogs
  const [posts, setPosts] = useState([]);
  const [showMyBlogs, setShowMyBlogs] = useState(false);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [categories, setCategories] = useState([
    { name: "All", icon: "📚", color: "bg-white", active: true },
    { name: "Startup", icon: "🚀", color: "bg-white", active: false },
    { name: "Economy", icon: "📈", color: "bg-white", active: false },
    { name: "Technology", icon: "🔧", color: "bg-white", active: false },
    { name: "Business", icon: "💼", color: "bg-white", active: false }
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    fetchBlogs();
    return () => clearTimeout(timer);
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      console.log('Fetching blogs...');
      const response = await axiosInstance.get('/blog');
      console.log('Blog response:', response.data);
      if (response.data.blogs && Array.isArray(response.data.blogs)) {
        setAllPosts(response.data.blogs); // Store all blogs
        setPosts(response.data.blogs);
      } else {
        console.error('Invalid blog data format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error.response || error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (index) => {
    const updatedCategories = categories.map((category, i) => ({
      ...category,
      active: i === index,
      color: i === index ? "bg-[#ffd050]" : "bg-white"
    }));
    setCategories(updatedCategories);

    const selectedCategory = updatedCategories[index].name;
    
    if (selectedCategory.toLowerCase() === "all") {
      setPosts(allPosts);
    } else {
      const filteredPosts = allPosts.filter(
        post => post.category.toLowerCase() === selectedCategory.toLowerCase()
      );
      setPosts(filteredPosts);
    }
  };

  const toggleMyBlogs = async () => {
    setShowMyBlogs(!showMyBlogs);
    try {
      setLoading(true);
      if (!showMyBlogs) {
        // Fetch only expert's blogs using the API endpoint
        const response = await axiosInstance.get('/blog/expert/blogs');
        setPosts(response.data.blogs);
      } else {
        // Show all blogs again
        setPosts(allPosts);
      }
    } catch (error) {
      console.error('Error toggling blogs:', error);
      // Handle error appropriately
    } finally {
      setLoading(false);
    }
  };

  const handleBlogClick = (postId) => {
    navigate(`/blog/${postId}`);
  };

  const handleCreateBlog = () => {
    setShowBlogModal(true);
  };

  const handleBlogModalClose = () => {
    setShowBlogModal(false);
    // Refresh blogs after modal closes
    fetchBlogs();
    if (showMyBlogs) {
      // If showing only expert blogs, refresh that view
      toggleMyBlogs();
      toggleMyBlogs();
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-[#fffaea] overflow-x-hidden">
      <Header />
      

      
      {/* Featured Post Section */}
      <section className={`transform transition-all duration-1000 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} ml-[50px] mr-20 mx-auto px-4 py-12 mt-20`}>
        {posts.length > 0 && (
          <div className="grid md:grid-cols-2 gap-12 md:gap-40 items-center">
            <div className="space-y-6">
              <p className="text-[#232536] font-semibold uppercase tracking-wider text-sm">FEATURED POST</p>
              <h1 className="text-[#232536] text-3xl md:text-4xl font-bold leading-tight">
                {posts[0].title}
              </h1>
              <div className="flex items-center gap-2 text-[#6d6e76] text-sm">
                <span>By {posts[0].expertName}</span>
                <span>|</span>
                <span>{new Date(posts[0].createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-[#4c4c4c] leading-relaxed">
                {posts[0].content.substring(0, 200)}...
              </p>
              <button 
                className="bg-[#ffd050] text-[#232536] px-6 py-3 font-medium inline-flex hover:bg-[#f5c43e] transition-colors transform hover:scale-105 duration-200"
                onClick={() => handleBlogClick(posts[0]._id)}
              >
                Read More &gt;
              </button>
            </div>
            <div className="overflow-hidden rounded-xl shadow-lg cursor-pointer" onClick={() => handleBlogClick(posts[0]._id)}>
              {posts[0].images && posts[0].images.length > 0 ? (
                <img 
                  src={posts[0].images[0].url} 
                  alt="Featured post" 
                  className="rounded-lg object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                />
              ) : (
                <img 
                  src="/rectangle-2749-1.png" 
                  alt="Default featured post" 
                  className="rounded-lg object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                />
              )}
            </div>
          </div>
        )}
      </section>
      
      {/* Categories Section - Moved above All Posts */}
      <section className={`transform transition-all duration-1000 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} max-w-7xl mx-auto px-4 py-12`} style={{ transitionDelay: '200ms' }}>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-[#232536] text-3xl font-bold relative before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-16 before:h-1 before:bg-[#ffd050] before:-bottom-2">
            All Categories
          </h2>
          
          {/* Expert Controls - Show My Blogs and Create Blog */}
          {userType === 'expert' && (
            <div className="flex gap-4 items-center">
              <button 
                onClick={toggleMyBlogs}
                className={`${
                  showMyBlogs ? 'bg-[#232536] text-white' : 'bg-[#ffd050] text-[#232536]'
                } px-6 py-3 rounded-lg font-medium inline-flex items-center hover:opacity-90 transition-all duration-200`}
              >
                {showMyBlogs ? 'Show All Blogs' : 'Show My Blogs Only'}
              </button>
              
              <button 
                onClick={handleCreateBlog}
                className="bg-[#003265] hover:bg-[#004080] text-white px-6 py-3 rounded-lg font-medium inline-flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Blog</span>
              </button>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((category, index) => (
            <div 
              key={index} 
              onClick={() => toggleCategory(index)}
              className={`${category.color} border border-[#6d6e76]/10 p-4 rounded-lg cursor-pointer transition-all hover:shadow-md ${category.active ? 'ring-2 ring-[#ffd050]' : ''} transform hover:translate-y-[-2px] duration-300 ease-out flex items-center space-x-2 min-w-fit`}
            >
              <div className="text-xl transition-transform duration-300 ease-in-out transform group-hover:scale-110">
                {category.icon}
              </div>
              <h3 className="text-[#232536] text-sm font-bold">{category.name}</h3>
              {/* {category.active && (
                <div className="inline-block bg-[#232536] text-white px-2 py-1 rounded text-xs">Active</div>
              )} */}
            </div>
          ))}
        </div>
      </section>
      
      {/* All Posts Section */}
      <section className={`transform transition-all duration-1000 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} max-w-7xl mx-auto px-4 py-12`} style={{ transitionDelay: '300ms' }}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[#232536] text-3xl font-bold relative before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-16 before:h-1 before:bg-[#ffd050] before:-bottom-2">All posts</h2>
          <div className="flex gap-2">
            {categories.filter(cat => cat.active).map((category, index) => (
              <span key={index} className="bg-[#ffd050] px-3 py-1 rounded-full text-sm shadow-sm">
                {category.name}
              </span>
            ))}
          </div>
        </div>
        
        <div className="border-t border-[#6d6e76]/20 pt-6">
          {posts.slice(1).map((post, idx) => (
            <div 
              key={post._id} 
              className={`transform transition-all duration-700 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} grid md:grid-cols-[300px_1fr] gap-6 mb-8 pb-8 border-b border-[#6d6e76]/10 hover:shadow-md p-4 rounded-lg transition-shadow duration-300 cursor-pointer`}
              style={{ transitionDelay: `${300 + idx * 100}ms` }}
              onClick={() => handleBlogClick(post._id)}
            >
              <div className="overflow-hidden rounded-lg shadow-md">
                {post.images && post.images.length > 0 ? (
                  <img 
                    src={post.images[0].url} 
                    alt="Blog post" 
                    className="rounded-lg object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <img 
                    src="/rectangle-2749-3.png" 
                    alt="Default blog post" 
                    className="rounded-lg object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                  />
                )}
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="inline-block bg-[#f9f3dd] text-[#00a9a5] font-semibold uppercase tracking-wider text-xs px-2 py-1 rounded-md">
                    {post.category}
                  </div>
                  {userType === 'expert' && showMyBlogs && (
                    <div className={`inline-block font-semibold uppercase tracking-wider text-xs px-2 py-1 rounded-md ${
                      post.status === 'published' ? 'bg-green-100 text-green-600' :
                      post.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                      post.status === 'draft' ? 'bg-gray-100 text-gray-600' :
                      post.status === 'rejected' ? 'bg-red-100 text-red-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {post.status}
                    </div>
                  )}
                </div>
                <h3 className="text-[#232536] text-2xl font-bold hover:text-[#00a9a5] transition-colors duration-300">
                  {post.title}
                </h3>
                <p className="text-[#4c4c4c] leading-relaxed">
                  {post.content.substring(0, 150)}...
                </p>
                <div className="text-sm text-[#6d6e76]">
                  By {post.expertName} | {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Enhanced Call-to-Action for Experts */}
      {userType === 'expert' && (
        <section className={`transform transition-all duration-1000 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} max-w-7xl mx-auto px-4 py-16 text-center`} style={{ transitionDelay: '500ms' }}>
          <div className="bg-gradient-to-br from-[#003265] to-[#004080] rounded-2xl p-8 shadow-xl text-white">
            <h2 className="text-3xl font-bold mb-4">Share Your Expertise<br />Write a Blog</h2>
            <p className="text-white/90 max-w-xl mx-auto mb-8">
              Share your knowledge and insights with the community. Help others learn from your experience and build your thought leadership.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleCreateBlog}
                className="bg-[#ffd050] text-[#232536] px-8 py-3 font-semibold hover:bg-[#f5c43e] transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-lg inline-flex items-center justify-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Create Blog Post</span>
              </button>
              <button 
                onClick={() => setShowMyBlogs(true)}
                className="bg-white/20 hover:bg-white/30 text-white px-8 py-3 font-medium transition-all duration-300 rounded-lg"
              >
                View My Blogs
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Blog Modal */}
      <BlogModal 
        isOpen={showBlogModal} 
        onClose={handleBlogModalClose}
      />
      
      <Footer />
    </div>
  );
}