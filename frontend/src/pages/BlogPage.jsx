import React, { useState, useEffect } from "react";
import { ArrowUp, ArrowDown, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header"; // Import Header

export default function IndieGuru() {
  const navigate = useNavigate();
  // State for animation
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Set loaded state after a small delay to trigger animations
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // State for blog posts with vote counts and comments
  const [posts, setPosts] = useState([
    {
      id: 1,
      category: "STARTUP",
      title: "Design tips for designers that cover everything you need",
      content: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.",
      image: "/rectangle-2749.png",
      upvotes: 0,
      downvotes: 0,
      userVote: null, // 'up' or 'down'
      comments: [],
      showCommentForm: false,
      author: "John Doe",
      date: "May 23, 2022"
    },
    {
      id: 2,
      category: "BUSINESS",
      title: "How to use whitespace in UI design effectively",
      content: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.",
      image: "/rectangle-2749.png",
      upvotes: 0,
      downvotes: 0,
      userVote: null,
      comments: [],
      showCommentForm: false,
      author: "Sarah Smith",
      date: "May 24, 2022"
    },
    {
      id: 3,
      category: "TECHNOLOGY",
      title: "The future of web development with React and AI",
      content: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.",
      image: "/rectangle-2749-1.png",
      upvotes: 0,
      downvotes: 0,
      userVote: null,
      comments: [],
      showCommentForm: false
    }
  ]);

  // State for categories with active state
  const [categories, setCategories] = useState([
    { name: "Business", icon: "📊", color: "bg-white", active: false },
    { name: "Startup", icon: "🚀", color: "bg-[#ffd050]", active: true },
    { name: "Economy", icon: "📈", color: "bg-white", active: false },
    { name: "Technology", icon: "🔧", color: "bg-white", active: false }
  ]);

  // State for new comment input
  const [commentInputs, setCommentInputs] = useState({});

  // Handle upvote/downvote
  const handleVote = (postId, direction) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        let { upvotes, downvotes, userVote } = post;

        if (direction === 'up') {
          if (userVote === 'up') {
            upvotes -= 1;
            userVote = null;
          } else {
            upvotes += 1;
            if (userVote === 'down') downvotes -= 1;
            userVote = 'up';
          }
        } else if (direction === 'down') {
          if (userVote === 'down') {
            downvotes -= 1;
            userVote = null;
          } else {
            downvotes += 1;
            if (userVote === 'up') upvotes -= 1;
            userVote = 'down';
          }
        }

        return { ...post, upvotes, downvotes, userVote };
      }
      return post;
    }));
  };

  // Toggle comment form visibility
  const toggleCommentForm = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          showCommentForm: !post.showCommentForm
        };
      }
      return post;
    }));
  };

  // Handle comment input change
  const handleCommentChange = (postId, value) => {
    setCommentInputs({
      ...commentInputs,
      [postId]: value
    });
  };

  // Add a new comment
  const addComment = (postId) => {
    if (commentInputs[postId]?.trim()) {
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, {
              id: Date.now(),
              text: commentInputs[postId],
              author: "You",
              date: new Date().toLocaleDateString()
            }],
            showCommentForm: false
          };
        }
        return post;
      }));
      
      // Clear the input
      setCommentInputs({
        ...commentInputs,
        [postId]: ""
      });
    }
  };

  // Toggle category selection
  const toggleCategory = (index) => {
    setCategories(categories.map((category, i) => ({
      ...category,
      active: i === index,
      color: i === index ? "bg-[#ffd050]" : "bg-white"
    })));
  };

  // Handle join now button
  const handleJoinNow = () => {
    alert("Thank you for your interest in joining our team!");
  };

  // Handle blog click
  const handleBlogClick = (postId) => {
    navigate(`/blog/${postId}`);
  };

  return (
    <div className="min-h-screen bg-[#fffaea] overflow-x-hidden">
      <Header /> {/* Keep Header as is */}
      
      {/* Featured Post with animation */}
      <section className={`transform transition-all duration-1000 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} ml-[50px] mr-20 mx-auto px-4 py-12 mt-20`}>
        <div className="grid md:grid-cols-2 gap-12 md:gap-40 items-center">
          <div className="space-y-6">
            <p className="text-[#232536] font-semibold uppercase tracking-wider text-sm">FEATURED POST</p>
            <h1 className="text-[#232536] text-3xl md:text-4xl font-bold leading-tight">
              Step-by-step guide to choosing great font pairs
            </h1>
            <div className="flex items-center gap-2 text-[#6d6e76] text-sm">
              <span>By John Doe</span>
              <span>|</span>
              <span>May 23, 2022</span>
            </div>
            <p className="text-[#4c4c4c] leading-relaxed">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident.
            </p>
            <button 
              className="bg-[#ffd050] text-[#232536] px-6 py-3 font-medium inline-flex hover:bg-[#f5c43e] transition-colors transform hover:scale-105 duration-200"
              onClick={() => handleBlogClick(1)}
            >
              Read More &gt;
            </button>
          </div>
          <div className="overflow-hidden rounded-xl shadow-lg cursor-pointer" onClick={() => handleBlogClick(1)}>
            <img 
              src="/rectangle-2749-1.png" 
              alt="Featured post image" 
              className="rounded-lg object-cover w-full h-full transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
      </section>
      
      {/* All Posts with staggered animation */}
      <section className={`transform transition-all duration-1000 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} max-w-7xl mx-auto px-4 py-12`} style={{ transitionDelay: '200ms' }}>
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
          {posts.map((post, idx) => (
            <div 
              key={post.id} 
              className={`transform transition-all duration-700 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} grid md:grid-cols-[300px_1fr] gap-6 mb-8 pb-8 border-b border-[#6d6e76]/10 hover:shadow-md p-4 rounded-lg transition-shadow duration-300 cursor-pointer`}
              style={{ transitionDelay: `${300 + idx * 100}ms` }}
              onClick={() => handleBlogClick(post.id)}
            >
              <div className="overflow-hidden rounded-lg shadow-md">
                <img 
                  src="/rectangle-2749-3.png" 
                  alt="Blog post image" 
                  className="rounded-lg object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="space-y-3">
                <div className="inline-block bg-[#f9f3dd] text-[#00a9a5] font-semibold uppercase tracking-wider text-xs px-2 py-1 rounded-md">{post.category}</div>
                <h3 className="text-[#232536] text-2xl font-bold hover:text-[#00a9a5] transition-colors duration-300">
                  {post.title}
                </h3>
                <p className="text-[#4c4c4c] leading-relaxed">
                  {post.content}
                </p>
                
                {/* Interaction buttons */}
                <div className="flex items-center gap-4 pt-2">
                  <button 
                    className="bg-white border border-[#6d6e76]/30 text-[#6d6e76] px-4 py-2 rounded-md text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm hover:shadow"
                    onClick={(e) => { e.stopPropagation(); toggleCommentForm(post.id); }}
                  >
                    <MessageSquare className="w-4 h-4" />
                    {post.comments.length > 0 ? `Comments (${post.comments.length})` : "Add a Comment"}
                  </button>
                  <div className="flex items-center gap-2">
                    <button 
                      className={`border ${post.userVote === 'up' ? 'bg-green-50 border-green-200' : 'bg-white'} border-[#6d6e76]/30 p-2 rounded-md hover:bg-gray-50 transition-colors shadow-sm hover:shadow`}
                      onClick={(e) => { e.stopPropagation(); handleVote(post.id, 'up'); }}
                    >
                      <ArrowUp className={`w-4 h-4 ${post.userVote === 'up' ? 'text-green-600' : 'text-[#6d6e76]'}`} />
                    </button>
                    <span className="font-medium">{post.upvotes}</span>
                    <button 
                      className={`border ${post.userVote === 'down' ? 'bg-red-50 border-red-200' : 'bg-white'} border-[#6d6e76]/30 p-2 rounded-md hover:bg-gray-50 transition-colors shadow-sm hover:shadow`}
                      onClick={(e) => { e.stopPropagation(); handleVote(post.id, 'down'); }}
                    >
                      <ArrowDown className={`w-4 h-4 ${post.userVote === 'down' ? 'text-red-600' : 'text-[#6d6e76]'}`} />
                    </button>
                    <span className="font-medium">{post.downvotes}</span>
                  </div>
                </div>
                
                {/* Comment form */}
                {post.showCommentForm && (
                  <div className="mt-4 bg-white p-4 rounded-lg border border-[#6d6e76]/20 shadow-md transform transition-all duration-300 ease-in-out">
                    <textarea
                      className="w-full border border-[#6d6e76]/30 rounded-md p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-[#ffd050]/50 focus:border-[#ffd050] transition-all"
                      rows="2"
                      placeholder="Write your comment..."
                      value={commentInputs[post.id] || ""}
                      onChange={(e) => handleCommentChange(post.id, e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                      <button 
                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-300 transition-colors"
                        onClick={() => toggleCommentForm(post.id)}
                      >
                        Cancel
                      </button>
                      <button 
                        className="bg-[#ffd050] text-[#232536] px-3 py-1 rounded-md text-sm hover:bg-[#f5c43e] transition-colors"
                        onClick={() => addComment(post.id)}
                      >
                        Post Comment
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Comments list */}
                {post.comments.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <h4 className="text-sm font-medium text-[#232536]">Comments</h4>
                    {post.comments.map((comment, commentIdx) => (
                      <div 
                        key={comment.id} 
                        className="bg-white p-3 rounded-md border border-[#6d6e76]/10 shadow-sm hover:shadow-md transition-shadow duration-300"
                      >
                        <p className="text-sm text-[#4c4c4c]">{comment.text}</p>
                        <div className="text-xs text-[#6d6e76] mt-1">
                          {comment.author} · {comment.date}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Categories with animation */}
      <section className={`transform transition-all duration-1000 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} max-w-7xl mx-auto px-4 py-12`} style={{ transitionDelay: '400ms' }}>
        <h2 className="text-[#232536] text-3xl font-bold mb-8 relative before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-16 before:h-1 before:bg-[#ffd050] before:-bottom-2">All Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div 
              key={index} 
              className={`${category.color} border border-[#6d6e76]/10 p-6 rounded-lg cursor-pointer transition-all hover:shadow-md ${category.active ? 'ring-2 ring-[#ffd050]' : ''} transform hover:translate-y-[-4px] duration-300 ease-out`}
              onClick={() => toggleCategory(index)}
            >
              <div className="mb-4 text-3xl transition-transform duration-300 ease-in-out transform group-hover:scale-110">{category.icon}</div>
              <h3 className="text-[#232536] text-xl font-bold mb-2">{category.name}</h3>
              <p className="text-[#6d6e76] text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
              {category.active && (
                <div className="mt-3 inline-block bg-[#232536] text-white px-2 py-1 rounded text-xs">Active</div>
              )}
            </div>
          ))}
        </div>
      </section>
      
      {/* Join Team with animation */}
      <section className={`transform transition-all duration-1000 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} max-w-7xl mx-auto px-4 py-16 text-center`} style={{ transitionDelay: '600ms' }}>
        <div className="bg-[#ffefc7] rounded-xl p-8 shadow-lg">
          <h2 className="text-[#232536] text-3xl font-bold mb-4">Join our team to be a part<br />of our story</h2>
          <p className="text-[#6d6e76] max-w-xl mx-auto mb-8">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
          </p>
          <button 
            className="bg-[#ffd050] text-[#232536] px-8 py-3 font-medium hover:bg-[#f5c43e] transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-md"
            onClick={handleJoinNow}
          >
            Join Now
          </button>
        </div>
      </section>
      <Footer />
    </div>
  );
}