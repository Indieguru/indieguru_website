import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUp, Heart, MessageCircle, Share2, TrendingUp, Users, Briefcase, HelpCircle, MessageSquare } from 'lucide-react';
import { Footer } from "../components/layout/Footer";
import { Switch } from "@headlessui/react";
import LoadingScreen from "../components/common/LoadingScreen";
import Header from "../components/layout/Header";
import axiosInstance from "../config/axios.config";
import { toast } from "react-toastify";
import useUserTypeStore from "../store/userTypeStore";
import useUserStore from "../store/userStore";
import checkAuth from "../utils/checkAuth";
import useRedirectStore from '../store/redirectStore';

export default function CommunityPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("threads");
  const [showPostForm, setShowPostForm] = useState(false);
  const [showInlinePostForm, setShowInlinePostForm] = useState(false);
  const [newPost, setNewPost] = useState({ category: "", content: "", image: null });
  const [postAnonymously, setPostAnonymously] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [showMyPosts, setShowMyPosts] = useState(false);
  const { setRedirectUrl } = useRedirectStore();
  // Animation states for page elements
  const [pageLoaded, setPageLoaded] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [tabsVisible, setTabsVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [podcastsVisible, setPodcastsVisible] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  // Ref for the feed section
  const feedRef = useRef(null);

  // State for active banner
  const [activeBanner, setActiveBanner] = useState(0);

  // Banners data
  const banners = [
    {
      id: 1,
      image: "/rectangle-2749-1.png",
      text: "Explore opportunities to connect with students and grow your network.",
    },
    {
      id: 2,
      image: "/rectangle-2749-2.png",
      text: "Learn from industry experts and enhance your skills.",
    },
    {
      id: 3,
      image: "/rectangle-2749-3.png",
      text: "Discover freelance projects and collaborate with professionals.",
    },
    {
      id: 4,
      image: "/rectangle-2749.png",
      text: "Engage in discussions and share your knowledge with the community.",
    },
  ];

  // Automatically change banners
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % banners.length);
    }, 5000); // Change banner every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Sequential animation for page elements
  useEffect(() => {
    // Set page as loaded
    setPageLoaded(true);
    
    // Staggered animations with timing
    const timers = [
      setTimeout(() => setHeaderVisible(true), 100),
      setTimeout(() => setBannerVisible(true), 300),
      setTimeout(() => setPodcastsVisible(true), 600),
      setTimeout(() => setTabsVisible(true), 800),
      setTimeout(() => setContentVisible(true), 1000),
      setTimeout(() => setSidebarVisible(true), 1200),
    ];
    
    // Cleanup timers
    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);

  const tabs = [
    { id: "referrals", name: "Referrals by community", icon: <Users className="w-5 h-5" /> },
    { id: "freelance", name: "Freelance projects", icon: <Briefcase className="w-5 h-5" /> },
    { id: "ama", name: "Ask Me Anything", icon: <HelpCircle className="w-5 h-5" /> },
    { id: "threads", name: "Threads", icon: <MessageSquare className="w-5 h-5" /> },
  ];

  const [posts, setPosts] = useState({
    threads: [],
    referrals: [],
    freelance: [],
    ama: []
  });

  const randomFeeds = [
    {
      id: 1,
      title: "How to build a successful startup",
      image: "/rectangle-2749.png",
      description: "Learn the key steps to building a successful startup from scratch.",
    },
    {
      id: 2,
      title: "Top 10 UI/UX design trends in 2023",
      image: "/rectangle-2749-1.png",
      description: "Explore the latest trends in UI/UX design that are shaping the industry.",
    },
    {
      id: 3,
      title: "Mastering React in 30 days",
      image: "/rectangle-2749-2.png",
      description: "A comprehensive guide to becoming proficient in React development.",
    },
    {
      id: 4,
      title: "The future of AI and machine learning",
      image: "/rectangle-2749-3.png",
      description: "Discover how AI and machine learning are transforming industries.",
    },
    {
      id: 5,
      title: "Effective marketing strategies for startups",
      image: "/rectangle-2749.png",
      description: "Learn how to market your startup effectively and reach your target audience.",
    },
  ];

  const handleShare = (postId) => {
    alert(`Post ${postId} shared!`);
  };

  const handleCreatePost = async () => {
    if (!newPost.content) {
      toast.error("Please write some content for your post");
      return;
    }

    try {
      setIsPosting(true);
      const categoryMap = {
        'referrals': 'Referrals by community',
        'freelance': 'Freelance projects',
        'ama': 'Ask Me Anything',
        'threads': 'Threads'
      };

      const formData = new FormData();
      formData.append('content', newPost.content);
      formData.append('category', categoryMap[activeTab]);
      formData.append('isAnonymous', postAnonymously);

      if (newPost.image instanceof File) {
        formData.append('images', newPost.image);
      }

      await axiosInstance.post('/community/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-user-type': userType
        }
      });

      toast.success('Post created successfully!');
      setNewPost({ category: "", content: "", image: null });
      setShowPostForm(false);
      setShowInlinePostForm(false);
      fetchPosts(); // Fetch posts instead of reloading the page
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating post');
    } finally {
      setIsPosting(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewPost(prev => ({
        ...prev,
        image: file  // Store the File object instead of URL
      }));
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/community');
      if (response.data.success && Array.isArray(response.data.posts)) {
        const categoryMap = {
          'threads': 'Threads',
          'referrals': 'Referrals by community',
          'freelance': 'Freelance projects',
          'ama': 'Ask Me Anything'
        };
        
        // Filter posts based on active tab category using the mapping
        const filteredPosts = response.data.posts.filter(post => 
          post.category === categoryMap[activeTab]
        );
        
        setPosts(prevPosts => ({
          ...prevPosts,
          [activeTab]: filteredPosts
        }));
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handleShowMyPosts = async () => {
    if (userType === "not_signed_in") {
      navigate("/signup");
      return;
    }
    setShowMyPosts(!showMyPosts);
    try {
      setLoading(true);
      if (!showMyPosts) {
        // Fetch user's posts using the new endpoint
        const response = await axiosInstance.get('/community/user/posts', {
          headers: {
            'x-user-type': userType
          }
        });
        if (response.data.success && Array.isArray(response.data.posts)) {
          // Group posts by category
          const userPosts = {
            threads: [],
            referrals: [],
            freelance: [],
            ama: []
          };
          
          // Sort posts into their respective categories
          response.data.posts.forEach(post => {
            const categoryMap = {
              'Threads': 'threads',
              'Referrals by community': 'referrals',
              'Freelance projects': 'freelance',
              'Ask Me Anything': 'ama'
            };
            const category = categoryMap[post.category];
            if (category) {
              userPosts[category].push(post);
            }
          });
          
          setPosts(userPosts);
        }
      } else {
        fetchPosts(); // Reset to show all posts
      }
    } catch (error) {
      console.error('Error fetching user posts:', error);
      toast.error('Failed to fetch your posts');
    } finally {
      setLoading(false);
    }
  };

  const { userType, setUserType } = useUserTypeStore();
  const { user } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [authData, setAuthData] = useState(null);
  
  useEffect(() => {
    const handleAuth = async () => {
      const data = await checkAuth(setUserType, setLoading);
      setAuthData(data);
    };
    handleAuth();
    fetchPosts(); // Fetch posts immediately, don't wait for auth
  }, [setUserType]);

  useEffect(() => {
    fetchPosts();
  }, [activeTab]);

  // CSS for hiding scrollbar but allowing scroll functionality
  const scrollbarStyles = `
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    @keyframes scroll {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(calc(-280px * 2.5));
      }
    }
    .animate-scroll-infinite {
      animation: scroll 10s linear infinite;
    }
    .hover-shadow:hover {
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      transform: translateY(-2px);
      transition: all 0.3s ease-in-out;
    }
    .hover-bg:hover {
      background-color: #ffd050;
      color: #232536;
      transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
    }
    
    /* Animation classes for page elements */
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    
    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    
    @keyframes slideInLeft {
      from {
        opacity: 0;
        transform: translateX(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    .fade-in {
      opacity: 0;
      animation: fadeIn 0.8s ease-out forwards;
    }
    
    .fade-in-up {
      opacity: 0;
      animation: fadeInUp 0.8s ease-out forwards;
    }
    
    .scale-in {
      opacity: 0;
      animation: scaleIn 0.6s ease-out forwards;
    }
    
    .slide-in-left {
      opacity: 0;
      animation: slideInLeft 0.8s ease-out forwards;
    }
    
    .slide-in-right {
      opacity: 0;
      animation: slideInRight 0.8s ease-out forwards;
    }
    
    /* Staggered animation for post items */
    .post-item {
      opacity: 0;
      transform: translateY(15px);
      transition: opacity 0.5s ease, transform 0.5s ease;
    }
    
    .post-item.visible {
      opacity: 1;
      transform: translateY(0);
    }
  `;

  // Function to handle post item visibility
  const [visiblePosts, setVisiblePosts] = useState(new Set());

  useEffect(() => {
    if (contentVisible) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const postId = entry.target.dataset.postId;
              if (postId) {
                setVisiblePosts(prev => new Set([...prev, postId]));
              }
            }
          });
        },
        { threshold: 0.1 }
      );
      
      // Observe all post items
      document.querySelectorAll('.post-item').forEach(post => {
        observer.observe(post);
      });
      
      return () => observer.disconnect();
    }
  }, [contentVisible, activeTab]);

  if (loading && !authData) {
    return <LoadingScreen />;
  }

  return (
    <div className={`w-screen mx-auto min-h-screen bg-[#fffaea] ${pageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
      {/* Add styles for animations */}
      <style>{scrollbarStyles}</style>
      
      <div className="">
        <Header />
      </div>
      
      {/* Welcome Header with Single Banner */}
      <section className={`relative w-full h-[450px] overflow-hidden mt-[120px] ${bannerVisible ? 'scale-in' : ''}`}>
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              activeBanner === index ? "opacity-100 z-10" : "opacity-0 z-0"
            } hover-shadow`}
            style={{
              backgroundImage: `url(${banner.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Improved Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70"></div>
            {/* Center-Aligned Content */}
            <div className="absolute inset-0 flex flex-col justify-center items-start text-white px-10">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
                Welcome to the<br></br>IndieGuru Community
              </h1>
              <p className="text-lg md:text-xl font-medium drop-shadow-md mb-6">{banner.text}</p>
              <button
                className="bg-[#ffd050] text-[#232536] px-6 py-3 rounded-md font-medium hover-shadow"
                onClick={() =>{
                if (userType === "not_signed_in") {
                  setRedirectUrl(window.location.pathname);
                  navigate("/signup");
                  return;
                }
                setShowPostForm(true)
              }}
              >
                Create Post
              </button>
            </div>
          </div>
        ))}
        {/* Dots for Banner Navigation */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
          {banners.map((_, index) => (
            <div
              key={index}
              className={`w-4 h-4 rounded-full ${
                activeBanner === index ? "bg-white" : "bg-gray-400"
              }`}
            ></div>
          ))}
        </div>
      </section>

      {/* Create Post Form */}
      {showPostForm && (
        <section className={`max-w-7xl mx-auto px-4 mt-6 scale-in`}>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-[#232536] mb-4">Create a New Post</h3>
            <div className="mb-4 flex items-center justify-between">
              <label className="text-sm font-medium text-[#232536]">
                Post Anonymously
              </label>
              <Switch
                checked={postAnonymously}
                onChange={setPostAnonymously}
                className={`${
                  postAnonymously ? "bg-[#ffd050]" : "bg-gray-200"
                } relative inline-flex h-6 w-11 items-center rounded-full`}
              >
                <span
                  className={`${
                    postAnonymously ? "translate-x-6" : "translate-x-1"
                  } inline-block h-4 w-4 transform bg-white rounded-full transition`}
                />
              </Switch>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#232536] mb-2">Select Category</label>
              <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setNewPost({ ...newPost, category: tab.id })}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      newPost.category === tab.id
                        ? "bg-[#ffd050] text-[#232536]"
                        : "bg-gray-100 text-[#6d6e76]"
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#232536] mb-2">Post Content</label>
              <textarea
                className="w-full bg-white border border-gray-300 rounded-md p-2"
                rows="4"
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                placeholder="Write your post..."
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#232536] mb-2">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
              />
            </div>
            <div className="flex gap-4">
              <button
                className={`${
                  isPosting ? 'bg-[#e6bb48]' : 'bg-[#ffd050]'
                } text-[#232536] px-6 py-2 rounded-md font-medium flex items-center gap-2`}
                onClick={handleCreatePost}
                disabled={isPosting}
              >
                {isPosting && (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#232536] border-t-transparent"></div>
                )}
                {isPosting ? 'Posting...' : 'Post'}
              </button>
              <button
                className="bg-gray-100 text-[#6d6e76] px-6 py-2 rounded-md font-medium"
                onClick={() => setShowPostForm(false)}
                disabled={isPosting}
              >
                Cancel
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Podcast Series Section */}
      <section className={`max-w-7xl mx-auto px-4 mt-16 mb-8 ${podcastsVisible ? 'fade-in-up' : ''}`}>
        <h2 className="text-2xl font-bold text-[#232536] mb-4">Podcast Series</h2>
        <div className="overflow-hidden">
          <div
            ref={feedRef}
            className="flex gap-6 no-scrollbar animate-scroll-infinite"
            style={{
              paddingBottom: "12px",
              width: "fit-content"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.animationPlayState = 'paused';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.animationPlayState = 'running';
            }}
          >
            {[...randomFeeds, ...randomFeeds].map((podcast, index) => (
              <div 
                key={`${podcast.id}-${index}`} 
                className={`flex-none w-80 bg-white rounded-lg shadow-md overflow-hidden hover-shadow transition-all`}
                style={{
                  animationDelay: `${index * 150}ms`,
                  opacity: podcastsVisible ? 1 : 0,
                  transform: podcastsVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'opacity 0.5s ease, transform 0.5s ease'
                }}
              >
                <div className="relative">
                  <img src={podcast.image} alt={podcast.title} className="w-full h-48 object-cover" />
                  {/* Play button overlay */}
                  <button className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-2xl font-bold opacity-0 hover:opacity-100 transition-opacity">
                    ▶️
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-[#232536] mb-2">{podcast.title}</h3>
                  <p className="text-sm text-gray-600">{podcast.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Tabs */}
      <section className={`max-w-7xl mx-auto px-4 ${tabsVisible ? 'slide-in-left' : ''}`}>
        <div className="bg-white rounded-lg p-4 mb-8 shadow-sm flex justify-between items-center">
          <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md whitespace-nowrap hover-bg ${
                  activeTab === tab.id
                    ? "bg-[#ffd050] text-[#232536] font-medium"
                    : "bg-gray-100 text-[#6d6e76]"
                }`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  opacity: tabsVisible ? 1 : 0,
                  transform: tabsVisible ? 'translateX(0)' : 'translateX(-10px)',
                  transition: 'opacity 0.5s ease, transform 0.5s ease'
                }}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </div>
          {userType !== "not_signed_in" && (
            <button
              onClick={handleShowMyPosts}
              className={`ml-4 px-4 py-2 rounded-md text-sm font-medium ${
                showMyPosts 
                  ? "bg-[#232536] text-white"
                  : "bg-[#ffd050] text-[#232536]"
              } transition-colors duration-300`}
            >
              {showMyPosts ? "Show All Posts" : "Show My Posts"}
            </button>
          )}
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Feed */}
        <div className={`lg:col-span-2 ${contentVisible ? 'fade-in' : ''}`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[#232536] text-2xl font-bold">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
            <button
              className="bg-[#ffd050] text-[#232536] px-6 py-2 rounded-md font-medium hover-shadow"
              onClick={() => {
              if (userType === "not_signed_in") {
                setRedirectUrl(window.location.pathname);
                navigate("/signup");
                return;
              }
              setShowInlinePostForm(true)
            }}
            >
              Create Post
            </button>
          </div>
          {showInlinePostForm && (
            <section className="mb-6 scale-in">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-[#232536] mb-4">Create a New Post</h3>
                <div className="mb-4 flex items-center justify-between">
                  <label className="text-sm font-medium text-[#232536]">
                    Post Anonymously
                  </label>
                  <Switch
                    checked={postAnonymously}
                    onChange={setPostAnonymously}
                    className={`${
                      postAnonymously ? "bg-[#ffd050]" : "bg-gray-200"
                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                  >
                    <span
                      className={`${
                        postAnonymously ? "translate-x-6" : "translate-x-1"
                      } inline-block h-4 w-4 transform bg-white rounded-full transition`}
                    />
                  </Switch>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#232536] mb-2">Post Content</label>
                  <textarea
                    className="w-full bg-white border border-gray-300 rounded-md p-2"
                    rows="4"
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, category: activeTab, content: e.target.value })}
                    placeholder={`Write your post in the ${activeTab} category...`}
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#232536] mb-2">Upload Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    className={`${
                      isPosting ? 'bg-[#e6bb48]' : 'bg-[#ffd050]'
                    } text-[#232536] px-6 py-2 rounded-md font-medium flex items-center gap-2`}
                    onClick={handleCreatePost}
                    disabled={isPosting}
                  >
                    {isPosting && (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#232536] border-t-transparent"></div>
                    )}
                    {isPosting ? 'Posting...' : 'Post'}
                  </button>
                  <button
                    className="bg-gray-100 text-[#6d6e76] px-6 py-2 rounded-md font-medium"
                    onClick={() => setShowInlinePostForm(false)}
                    disabled={isPosting}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </section>
          )}
          {posts[activeTab]?.map((post, index) => (
            <div 
              key={post._id} 
              className={`post-item bg-white rounded-lg shadow-sm mb-6 overflow-hidden ${visiblePosts.has(post._id?.toString()) ? 'visible' : ''}`}
              data-post-id={post._id}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src={post.isAnonymous ? "/placeholder-user.jpg" : (post.authorPicture || "/placeholder-user.jpg")} 
                    alt={post.isAnonymous ? "Anonymous User" : post.authorName} 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-medium text-[#232536]">
                      {post.isAnonymous ? "Anonymous User" : post.authorName}
                    </h3>
                    <div className="text-sm text-[#6d6e76]">
                      {new Date(post.date).toLocaleString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
                <p className="text-[#4c4c4c] mb-4">{post.content}</p>
                {post.images && post.images.length > 0 && (
                  <div className="space-y-4">
                    {post.images.map((image, idx) => (
                      <div key={idx} className="flex justify-center">
                        <img 
                          src={image} 
                          alt={`Post image ${idx + 1}`} 
                          className="w-1/2 rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-4 pt-2 border-t mt-4">
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className={`lg:col-span-1 ${sidebarVisible ? 'slide-in-right' : ''}`}>
          {/* Invite Friends */}
          <div 
            className="bg-[#ffd050] rounded-lg p-6 hover-shadow transform transition-all duration-500"
            style={{ 
              opacity: sidebarVisible ? 1 : 0, 
              transform: sidebarVisible ? 'translateX(0)' : 'translateX(20px)'
            }}
          >
            <h3 className="text-[#232536] font-bold mb-2">Grow Your Network</h3>
            <p className="text-[#232536] mb-4">Invite friends to join the IndieGuru community and grow together!</p>
            <button
              className="bg-[#232536] text-white w-full py-2 rounded-md font-medium hover-bg"
              onClick={() => window.location.href = "/referral"}
            >
              Invite Friends
            </button>
          </div>
        </div>
      </div>

      {/* Page Entrance Animation */}
      <div 
        className={`fixed inset-0 bg-[#232536] z-50 pointer-events-none transition-opacity duration-1000 ${
          pageLoaded ? 'opacity-0' : 'opacity-100'
        }`}
      ></div>

      {/* Footer */}
      <div className="mt-12 opacity-0 animate-fadeIn" style={{ animation: 'fadeIn 1s ease-out 1.5s forwards' }}>
        <Footer />
      </div>
    </div>
  );
}