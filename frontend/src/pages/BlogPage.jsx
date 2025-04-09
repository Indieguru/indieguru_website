import React, { useState } from "react";
import { ArrowUp, ArrowDown, MessageSquare } from 'lucide-react';
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header"; // Import Header

export default function IndieGuru() {
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
      showCommentForm: false
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
      showCommentForm: false
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

  return (
    <div className="mt-20 min-h-screen bg-[#fffaea]">
      <Header /> {/* Add Header */}
      {/* Featured Post */}
      <section className="ml-[50px] mr-20 mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-40 items-center">
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
              className="bg-[#ffd050] text-[#232536] px-6 py-3 font-medium inline-flex hover:bg-[#f5c43e] transition-colors"
              onClick={() => alert("Loading full article...")}
            >
              Read More &gt;
            </button>
          </div>
          <div>
            <img 
              src="/rectangle-2749-1.png" 
              alt="Featured post image" 
              className="rounded-lg object-cover w-full h-full"
            />
          </div>
        </div>
      </section>
      
      {/* All Posts */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[#232536] text-3xl font-bold">All posts</h2>
          <div className="flex gap-2">
            {categories.filter(cat => cat.active).map((category, index) => (
              <span key={index} className="bg-[#ffd050] px-3 py-1 rounded-full text-sm">
                {category.name}
              </span>
            ))}
          </div>
        </div>
        <div className="border-t border-[#6d6e76]/20 pt-6">
          {posts.map((post) => (
            <div key={post.id} className="grid md:grid-cols-[300px_1fr] gap-6 mb-8 pb-8 border-b border-[#6d6e76]/10">
              <div>
                <img 
                  src="/rectangle-2749-3.png" 
                  alt="Blog post image" 
                  className="rounded-lg object-cover w-full h-full"
                />
              </div>
              <div className="space-y-3">
                <div className="text-[#00a9a5] font-semibold uppercase tracking-wider text-xs">{post.category}</div>
                <h3 className="text-[#232536] text-2xl font-bold">
                  {post.title}
                </h3>
                <p className="text-[#4c4c4c] leading-relaxed">
                  {post.content}
                </p>
                
                {/* Interaction buttons */}
                <div className="flex items-center gap-4 pt-2">
                  <button 
                    className="bg-white border border-[#6d6e76]/30 text-[#6d6e76] px-4 py-2 rounded-md text-sm flex items-center gap-2 hover:bg-gray-50"
                    onClick={() => toggleCommentForm(post.id)}
                  >
                    <MessageSquare className="w-4 h-4" />
                    {post.comments.length > 0 ? `Comments (${post.comments.length})` : "Add a Comment"}
                  </button>
                  <div className="flex items-center gap-2">
                    <button 
                      className={`border ${post.userVote === 'up' ? 'bg-green-50 border-green-200' : 'bg-white'} border-[#6d6e76]/30 p-2 rounded-md hover:bg-gray-50`}
                      onClick={() => handleVote(post.id, 'up')}
                    >
                      <ArrowUp className={`w-4 h-4 ${post.userVote === 'up' ? 'text-green-600' : 'text-[#6d6e76]'}`} />
                    </button>
                    <span className="font-medium">{post.upvotes}</span>
                    <button 
                      className={`border ${post.userVote === 'down' ? 'bg-red-50 border-red-200' : 'bg-white'} border-[#6d6e76]/30 p-2 rounded-md hover:bg-gray-50`}
                      onClick={() => handleVote(post.id, 'down')}
                    >
                      <ArrowDown className={`w-4 h-4 ${post.userVote === 'down' ? 'text-red-600' : 'text-[#6d6e76]'}`} />
                    </button>
                    <span className="font-medium">{post.downvotes}</span>
                  </div>
                </div>
                
                {/* Comment form */}
                {post.showCommentForm && (
                  <div className="mt-4 bg-white p-4 rounded-lg border border-[#6d6e76]/20">
                    <textarea
                      className="w-full border border-[#6d6e76]/30 rounded-md p-2 mb-2"
                      rows="2"
                      placeholder="Write your comment..."
                      value={commentInputs[post.id] || ""}
                      onChange={(e) => handleCommentChange(post.id, e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                      <button 
                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm"
                        onClick={() => toggleCommentForm(post.id)}
                      >
                        Cancel
                      </button>
                      <button 
                        className="bg-[#ffd050] text-[#232536] px-3 py-1 rounded-md text-sm"
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
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="bg-white p-3 rounded-md border border-[#6d6e76]/10">
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
      
      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-[#232536] text-3xl font-bold mb-8">All Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div 
              key={index} 
              className={`${category.color} border border-[#6d6e76]/10 p-6 rounded-lg cursor-pointer transition-all hover:shadow-md ${category.active ? 'ring-2 ring-[#ffd050]' : ''}`}
              onClick={() => toggleCategory(index)}
            >
              <div className="mb-4 text-2xl">{category.icon}</div>
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
      
      {/* Join Team */}
      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-[#232536] text-3xl font-bold mb-4">Join our team to be a part<br />of our story</h2>
        <p className="text-[#6d6e76] max-w-xl mx-auto mb-8">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
        </p>
        <button 
          className="bg-[#ffd050] text-[#232536] px-8 py-3 font-medium hover:bg-[#f5c43e] transition-colors"
          onClick={handleJoinNow}
        >
          Join Now
        </button>
      </section>
      <Footer />
    </div>
  );
}