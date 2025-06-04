import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import useExpertStore from '../store/expertStore';
import useExpertCoursesStore from '../store/expertCoursesStore';
import useExpertCohortsStore from '../store/expertCohortsStore';
import axiosInstance from '../config/axios.config';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import AddCourseModal from '../components/modals/AddCourseModal';
import AddCohortModal from '../components/modals/AddCohortModal';
import BlogModal from '../components/modals/BlogModal';
import useUserTypeStore from '../store/userTypeStore';
import checkAuth from '../utils/checkAuth';

function ExpertDashboard() {
  const [activeTab] = useState("dashboard");
  const { expertData, fetchExpertData, isLoading, error } = useExpertStore();
  const { courses, fetchExpertCourses } = useExpertCoursesStore();
  const { cohorts, fetchExpertCohorts } = useExpertCohortsStore();
  const navigate = useNavigate();
  const { userType, setUserType } = useUserTypeStore();
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [message, setMessage] = useState('');
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showCohortModal, setShowCohortModal] = useState(false);
  const [showSessionDetailsModal, setShowSessionDetailsModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authData, setAuthData] = useState(null);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [blogs, setBlogs] = useState([]);

  const timeSlots = [
    "09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00",
    "13:00-14:00", "14:00-15:00", "15:00-16:00", "16:00-17:00",
    "17:00-18:00", "18:00-19:00", "19:00-20:00", "20:00-21:00"
  ];

  const handleManageCalendar = () => {
    setShowCalendarModal(true);
  };

  const handleTimeSlotSelect = (slot) => {
    console.log('Selecting time slot:', slot); // Debug log
    setSelectedTimeSlot(slot);
  };

  const handleAddSlot = async () => {
    if (!selectedDate || !selectedTimeSlot) {
      setMessage('Please select both date and time slot');
      return;
    }

    const [startTime, endTime] = selectedTimeSlot.split('-');
    
    try {
      const formattedDate = selectedDate.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
      await axiosInstance.post('/expert/addsession', {
        date: formattedDate,
        startTime,
        endTime,
        duration: 60
      });

      setMessage('Slot added successfully');
      setSelectedDate(null);
      setSelectedTimeSlot('');
      setTimeout(() => {
        setMessage('');
        setShowCalendarModal(false);
      }, 1500);
    } catch (error) {
      console.error('Error adding slot:', error);
      setMessage(error.response?.data?.message || 'Error adding slot. Please try again.');
    }
  };

  const handlePrepare = (session) => {
    console.log(session);
    if (session.meetLink) {
      window.open(session.meetLink, '_blank');
    } else {
      // If no meet link is available yet
      alert('Meeting link is not available yet. It will be generated closer to the session time.');
    }
  };

  const handleViewDetails = (session) => {
    setSelectedSession(session);
    setShowSessionDetailsModal(true);
  };

  const fetchExpertBlogs = async () => {
    try {
      const response = await axiosInstance.get('/blog/expert/blogs');
      setBlogs(response.data.blogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const handleAddBlog = () => {
    setShowBlogModal(true);
  };

  const handleBlogModalClose = () => {
    setShowBlogModal(false);
    fetchExpertBlogs(); // Refresh blogs after modal closes
  };

  useEffect(() => {
    const handleAuth = async () => {
      const data = await checkAuth(setUserType, setAuthLoading);
      setAuthData(data);
    };
    handleAuth();
  }, [setUserType]);

  useEffect(() => {
    if (authData) {
      if (userType === "student") {
        navigate("/dashboard");
        return;
      } else if (userType === "not_signed_in") {
        navigate("/signup");
        return;
      }
      const initializeData = async () => {
        try {
          await Promise.all([
            fetchExpertData(),
            fetchExpertCourses(),
            fetchExpertCohorts(),
            fetchExpertBlogs()
          ]);
        } catch (err) {
          console.error('Error initializing data:', err);
        }
      };
      initializeData();
    }
  }, [userType, navigate, fetchExpertData, fetchExpertCourses, fetchExpertCohorts, authData]);

  if (authLoading || !authData || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-600">
          {error}
          <button 
            onClick={fetchExpertData} 
            className="ml-4 text-blue-600 hover:underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Navigation handlers
  const handleCreateResource = () => {
    navigate('/create-resource', { 
      state: { type: 'resource', returnPath: '/expert' }
    });
  };

  const handleHostWebinar = () => {
    navigate('/create-webinar', { 
      state: { type: 'webinar', returnPath: '/expert' }
    });
  };

  const handleUpdateGoals = () => {
    navigate('/expert/profile#goals');
  };

  const handleViewProgress = () => {
    navigate('/expert/profile#progress');
  };

  const handleProfileEdit = () => {
    navigate('/expert/profile#basic-info');
  };

  const handleExpertiseEdit = () => {
    navigate('/expert/profile#expertise');
  };

  const handleEducationEdit = () => {
    navigate('/blogs');
  };

  const handleAddCourse = () => {
    setShowCourseModal(true);
  };

  const handleCourseModalClose = async () => {
    setShowCourseModal(false);
    // Refresh courses list
    await fetchExpertCourses();
  };

  const handleAddCohort = () => {
    setShowCohortModal(true);
  };

  const handleCohortModalClose = async () => {
    setShowCohortModal(false);
    // Refresh cohorts data
    await fetchExpertCohorts();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navigation */}
      <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-blue-900">IndieGuru</span>
                <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-900 rounded-full">Expert</span>
              </div>
              <nav className="ml-8 flex space-x-8">
                <Link 
                  to="/expert"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ₹{
                    activeTab === "dashboard" ? "border-indigo-900 text-gray-900" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/blog"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    activeTab === "blogs" ? "border-blue-700 text-gray-900" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Blogs
                </Link>
                <Link 
                  to="/communitypage"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ₹{
                    activeTab === "community" ? "border-blue-700 text-gray-900" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Community
                </Link>
                <Link 
                  to="/bookings"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ₹{
                    activeTab === "bookings" ? "border-blue-700 text-gray-900" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Bookings
                </Link>
                <Link 
                  to="/expert/payments"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    activeTab === "payments" ? "border-blue-700 text-gray-900" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Payments
                </Link>
              </nav>
            </div>
            <div className="flex items-center">
              <Link to="/expert/profile" className="flex items-center">
                <img
                  className="h-8 w-8 rounded-full object-cover"
                  src={expertData.profilePicture || "/placeholder-user.jpg"}
                  alt="Expert profile"
                />
                <span className="ml-2 text-sm text-gray-700">{expertData.name}</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mt-20 mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Section 1: Profile Information */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Profile Completion Card */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-[0.1px] border-gray-300 flex flex-col">
              <h2 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center">
                <span className="mr-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12Z" stroke="currentColor" strokeWidth="2" />
                    <path d="M20 21C20 16.5 16.42 13 12 13C7.58 13 4 16.5 4 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                My Expert Profile
              </h2>
              <div className="flex items-center gap-3 mb-4 bg-gray-50 p-3 rounded-lg">
                <div className="text-green-500">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 17L9 11L13 15L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M17 7H21V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <div className="text-xl font-bold text-indigo-900">{expertData.profileCompletion}%</div>
                  <div className="text-sm text-gray-600">Profile Completed</div>
                </div>
              </div>
              <div className="flex items-center gap-3 mb-4 bg-gray-50 p-3 rounded-lg">
                <div className="text-yellow-500">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
                    <path d="M12 8V12L15 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <div className="text-xl font-bold text-indigo-900">{expertData.activeStreak} Days</div>
                  <div className="text-sm text-gray-600">Active Streak</div>
                </div>
              </div>
              <div className="flex-grow"></div>
              <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between items-center">
                  <button 
                    onClick={handleProfileEdit}
                    className="bg-indigo-900 hover:bg-indigo-800 text-white text-xs py-2 px-4 rounded flex items-center justify-center shadow-sm transition-colors duration-300">
                    Edit Profile
                  </button>
                  <Link to="/expert/profile" className="text-xs text-indigo-900 hover:text-indigo-800 transition-colors duration-300">
                    View Profile
                  </Link>
                </div>
              </div>
            </div>

            {/* Key Expertise Areas Card */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-[0.1px] border-gray-300 flex flex-col">
              <h2 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center">
                <span className="mr-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 7V12L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </span>
                Key Expertise Areas
              </h2>
              <p className="text-xs text-gray-600 mb-4">
                Highlight your expertise to attract students interested in these areas. Your profile will appear in relevant searches.
              </p>
              <div className="flex flex-wrap gap-2">
                {expertData.expertise.map((skill, index) => (
                  <span key={index} className="text-xs bg-white border border-indigo-200 text-indigo-900 px-3 py-1 rounded-full hover:bg-indigo-50 transition-colors duration-300">
                    {skill}
                  </span>
                ))}
              </div>
              <div className="flex-grow"></div>
              <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between items-center">
                  <button 
                    onClick={handleExpertiseEdit}
                    className="bg-indigo-900 hover:bg-indigo-900 text-white text-xs py-2 px-4 rounded shadow-sm transition-colors duration-300">
                    Edit Expertise
                  </button>
                  <button onClick={handleEducationEdit} className="text-xs text-indigo-900 hover:text-indigo-800 transition-colors duration-300">
                    Add Education
                  </button>
                </div>
              </div>
            </div>

            {/* Expert Goals Card */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-[0.1px] border-gray-300 flex flex-col">
              <h2 className="text-lg font-semibold text-[#00b6c4] mb-4 flex items-center">
                <span className="mr-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                Expert Goals
              </h2>
              <p className="text-xs text-gray-600 mb-4">
                Set your teaching objectives to help us suggest opportunities that align with your expertise and preferences.
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">One-on-One Sessions</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-[#00b6c4]">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Design & Upload Courses</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Planned
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Conduct Cohorts</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-[#00b6c4]">
                    Active
                  </span>
                </div>
              </div>
              <div className="flex-grow"></div>
              <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between items-center">
                  <button 
                    onClick={handleUpdateGoals}
                    className="bg-[#00b6c4] hover:bg-[#00b6c4] text-white text-xs py-2 px-4 rounded shadow-sm transition-colors duration-300">
                    Update Goals
                  </button>
                  <button 
                    onClick={handleViewProgress}
                    className="text-xs text-[#00b6c4] hover:text-[#00b6c4] transition-colors duration-300">
                    View Progress
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: CTA & Status of Actionables */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2 text-blue-900">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.8571 16.2857L12 14L9.14286 16.2857V4.57143H14.8571V16.2857Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5.71429 16.2857H9.14286" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M14.8571 16.2857H18.2857" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M5.71429 19.4286H18.2857" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </span>
            Expert Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Upload Course */}
            <div className="bg-blue-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-[0.5px] border-gray-300 flex flex-col h-full">
              <div className="flex flex-col items-center">
                <div className="bg-blue-100 p-3 rounded-full mb-3">
                  <svg className="w-8 h-8 text-blue-900" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-blue-900 mb-1">Upload Course</h3>
                <p className="text-xs text-center text-blue-900 mb-3">Create and publish your own course</p>
                <div className="text-2xl font-bold text-blue-900 mb-2">{courses.length}</div>
                <p className="text-xs text-blue-900">Courses Published</p>
              </div>
              <div className="flex-grow"></div>
              <div className="mt-4 pt-4 border-t border-blue-100">
                <button 
                  onClick={handleAddCourse}
                  className="w-full bg-blue-900 hover:bg-blue-800 text-white text-xs py-2 px-4 rounded shadow-sm transition-colors duration-300">
                  Add Course
                </button>
              </div>
            </div>

            {/* Conduct Cohort */}
            <div className="bg-blue-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-[0.5px] border-gray-300 flex flex-col h-full">
              <div className="flex flex-col items-center">
                <div className="bg-blue-100 p-3 rounded-full mb-3">
                  <svg className="w-8 h-8 text-blue-900" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-blue-900 mb-1">Conduct Cohort</h3>
                <p className="text-xs text-center text-blue-900 mb-3">Lead a group learning experience</p>
                <div className="text-2xl font-bold text-blue-900 mb-2">{cohorts.length}</div>
                <p className="text-xs text-blue-900">Active Cohorts</p>
              </div>
              <div className="flex-grow"></div>
              <div className="mt-4 pt-4 border-t border-blue-100">
                <button 
                  onClick={handleAddCohort}
                  className="w-full bg-blue-900 hover:bg-blue-800 text-white text-xs py-2 px-4 rounded shadow-sm transition-colors duration-300">
                  Add Cohort
                </button>
              </div>
            </div>

            {/* Write Blog */}
            <div className="bg-blue-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-[0.5px] border-gray-300 flex flex-col h-full">
              <div className="flex flex-col items-center">
                <div className="bg-blue-100 p-3 rounded-full mb-3">
                  <svg className="w-8 h-8 text-blue-900" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-blue-900 mb-1">Write Blog</h3>
                <p className="text-xs text-center text-blue-900 mb-3">Share your knowledge and insights</p>
                <div className="text-2xl font-bold text-blue-900 mb-2">{blogs.length}</div>
                <p className="text-xs text-blue-900">Blogs Published</p>
              </div>
              <div className="flex-grow"></div>
              <div className="mt-4 pt-4 border-t border-blue-100">
                <button 
                  onClick={handleAddBlog}
                  className="w-full bg-blue-900 hover:bg-blue-800 text-white text-xs py-2 px-4 rounded shadow-sm transition-colors duration-300">
                  Add Blog
                </button>
              </div>
            </div>

            {/* Community Discussion */}
            <div className="bg-blue-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-[0.5px] border-gray-300 flex flex-col h-full">
              <div className="flex flex-col items-center">
                <div className="bg-blue-100 p-3 rounded-full mb-3">
                  <svg className="w-8 h-8 text-blue-900" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-blue-900 mb-1">Discuss</h3>
                <p className="text-xs text-center text-blue-900 mb-3">Engage with the community</p>
                <div className="text-2xl font-bold text-blue-900 mb-2">18</div>
                <p className="text-xs text-blue-900">Discussions Started</p>
              </div>
              <div className="flex-grow"></div>
              <div className="mt-4 pt-4 border-t border-blue-100">
                <button className="w-full bg-blue-900 hover:bg-blue-800 text-white text-xs py-2 px-4 rounded shadow-sm transition-colors duration-300">
                  Start Thread
                </button>
              </div>
            </div>

            {/* 1-on-1 Sessions */}
            <div className="bg-blue-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-[0.5px] border-gray-300 flex flex-col h-full">
              <div className="flex flex-col items-center">
                <div className="bg-blue-100 p-3 rounded-full mb-3">
                  <svg className="w-8 h-8 text-blue-900" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-blue-900 mb-1">1-on-1 Sessions</h3>
                <p className="text-xs text-center text-blue-900 mb-3">Personalized mentoring</p>
                <div className="text-2xl font-bold text-blue-900 mb-2">{expertData.analytics.sessions.delivered}</div>
                <p className="text-xs text-blue-900">Sessions Conducted</p>
              </div>
              <div className="flex-grow"></div>
              <div className="mt-4 pt-4 border-t border-blue-100">
                <button 
                  onClick={handleManageCalendar}
                  className="w-full bg-blue-900 hover:bg-blue-800 text-white text-xs py-2 px-4 rounded shadow-sm transition-colors duration-300">
                  Manage Calendar
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Upcoming Sessions */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2 text-blue-900">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" />
              </svg>
            </span>
            Upcoming Sessions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {expertData.upcomingSessions.map((session, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-transform transform hover:scale-[1.02] duration-300"
              >
                <div className="h-2 bg-gradient-to-r from-blue-900 to-indigo-900"></div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        session.type === "1-on-1" ? "bg-red-100 text-red-600" : 
                        session.type === "Cohort" ? "bg-purple-100 text-indigo-900" : 
                        "bg-blue-100 text-blue-900"
                      }`}>
                        {session.type}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <svg className="w-4 h-4 mr-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                      </svg>
                      <span className="text-xs">{session.students}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{session.title}</h3>
                  <div className="flex items-center mb-4 text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-1 text-purple-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    {new Date(session.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                    {session.time && (
                      <span className="ml-2 text-xs py-1 px-2 bg-gray-100 rounded-full">{session.time}</span>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <button 
                      onClick={() => handleViewDetails(session)}
                      className="text-sm text-indigo-900 hover:text-purple-800 font-medium transition-colors duration-300"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => handlePrepare(session)}
                      className={`text-sm ${
                        session.type === "1-on-1" ? "text-red-600 hover:text-red-800" : 
                        session.type === "Cohort" ? "text-indigo-900 hover:text-purple-800" : 
                        "text-blue-900 hover:text-blue-900"
                      } font-medium transition-colors duration-300`}
                    >
                      {session.type === "Course" ? "Edit Course" : "Prepare"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Session Details Modal */}
        {showSessionDetailsModal && selectedSession && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Session Details</h2>
                <button 
                  onClick={() => setShowSessionDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-indigo-900 mb-2">{selectedSession.title}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Student Name</p>
                      <p className="font-medium">{selectedSession.studentName || 'Not assigned'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Session Type</p>
                      <p className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${
                        selectedSession.type === "1-on-1" ? "bg-red-100 text-red-600" : 
                        selectedSession.type === "Cohort" ? "bg-purple-100 text-indigo-900" : 
                        "bg-blue-100 text-blue-900"
                      }`}>
                        {selectedSession.type}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Date</p>
                      <p className="font-medium">
                        {new Date(selectedSession.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Time</p>
                      <p className="font-medium">{selectedSession.time}</p>
                    </div>
                  </div>
                  
                  {selectedSession.meetLink && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-1">Meeting Link</p>
                      <a 
                        href={selectedSession.meetLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline break-all"
                      >
                        {selectedSession.meetLink}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowSessionDetailsModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Section 4: Analytics and Insights */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2 text-[#00b6c4]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21H4.6C4.03995 21 3.75992 21 3.54601 20.891C3.35785 20.7951 3.20487 20.6422 3.10899 20.454C3 20.2401 3 19.9601 3 19.4V3.6C3 3.03995 3 2.75992 3.10899 2.54601C3.20487 2.35785 3.35785 2.20487 3.54601 2.10899C3.75992 2 4.03995 2 4.6 2H19.4C19.9601 2 20.2401 2 20.454 2.10899C20.6422 2.20487 20.7951 2.35785 20.891 2.54601C21 2.75992 21 3.03995 21 3.6V21Z" stroke="currentColor" strokeWidth="2" />
                <path d="M8 17L8 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 17L12 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 17L16 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            Analytics & Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Earnings Card */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-[0.1px] border-[#00b6c4] cursor-pointer" onClick={() => window.location.href='/expert/payments'}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Total Earnings</h3>
                <div className="bg-green-100 p-2 rounded-md">
                  <svg className="w-5 h-5 text-[#00b6c4]" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">₹{expertData.earnings.total}</div>
              <div className="flex items-center text-sm">
                <span className="text-[#00b6c4] font-medium">+12% </span>
                <span className="text-gray-600 ml-1">vs. last month</span>
              </div>
              <div className="mt-4 border-t border-gray-100 pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-xs text-gray-500">Courses</span>
                  <span className="text-xs font-medium">₹{expertData.analytics.courses.earnings}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs text-gray-500">Sessions</span>
                  <span className="text-xs font-medium">₹{expertData.analytics.sessions.earnings}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Cohorts</span>
                  <span className="text-xs font-medium">₹{expertData.analytics.cohorts.earnings}</span>
                </div>
              </div>
            </div>

            {/* Ratings Card */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-[0.1px] border-blue-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Your Ratings</h3>
                <div className="bg-yellow-100 p-2 rounded-md">
                  <svg className="w-5 h-5 text-blue-800" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                  </svg>
                </div>
              </div>
              <div className="flex items-center mb-3">
                <div className="text-3xl font-bold text-gray-900 mr-2">{expertData.ratings.overall}</div>
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, index) => (
                    <svg key={index} className={`w-4 h-4 ₹{index < Math.floor(expertData.ratings.overall) ? 'text-yellow-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-600">
                  <span className="text-gray-800 font-medium">{expertData.ratings.overall}</span> Your Average
                </div>
                <div className="text-sm text-gray-600">
                  <span className="text-gray-800 font-medium">{expertData.avgCategoryRating}</span> Category Average
                </div>
              </div>
              <div className="mt-2">
                <div className="w-full h-2 bg-gray-200 rounded-full mb-2">
                  <div className="h-2 bg-blue-900 rounded-full" style={{ width: `₹{(expertData.ratings.overall / 5) * 100}%` }}></div>
                </div>
                <Link to="/analytics/ratings" className="text-xs text-blue-800 hover:text-yellow-800 font-medium transition-colors duration-300">
                  View detailed ratings
                </Link>
              </div>
            </div>

            {/* Student Enrollment Card */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-[0.1px] border-blue-900">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Students Enrolled</h3>
                <div className="bg-blue-100 p-2 rounded-md">
                  <svg className="w-5 h-5 text-blue-900" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{expertData.studentsEnrolled}</div>
              <div className="flex items-center text-sm">
                <span className="text-blue-900 font-medium">+24 </span>
                <span className="text-gray-600 ml-1">new this month</span>
              </div>
              <div className="mt-4 border-t border-gray-100 pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-xs text-gray-500">Courses</span>
                  <span className="text-xs font-medium">{expertData.analytics.courses.delivered} delivered</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs text-gray-500">Sessions</span>
                  <span className="text-xs font-medium">{expertData.analytics.sessions.delivered} completed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Cohorts</span>
                  <span className="text-xs font-medium">{expertData.analytics.cohorts.delivered} conducted</span>
                </div>
              </div>
            </div>

            {/* Activity Card */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-[0.1px] border-indigo-900">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Activity Stats</h3>
                <div className="bg-purple-100 p-2 rounded-md">
                  <svg className="w-5 h-5 text-indigo-900" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Response Rate</span>
                      <span className="text-sm font-medium text-indigo-900">94%</span>
                    </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-indigo-900 rounded-full" style={{ width: '94%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Engagement</span>
                    <span className="text-sm font-medium text-indigo-900">78%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-indigo-900 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Content Created</span>
                    <span className="text-sm font-medium text-indigo-900">86%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-indigo-900 rounded-full" style={{ width: '86%' }}></div>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link to="/analytics/detailed" className="text-xs text-indigo-900 hover:text-purple-800 font-medium transition-colors duration-300">
                  View full analytics
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {showCalendarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Add Time Slot</h2>
              <button 
                onClick={() => setShowCalendarModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {message && (
              <div className={`mb-4 p-2 rounded ₹{
                message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
              }`}>
                {message}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
              <DatePicker
                selected={selectedDate}
                onChange={date => setSelectedDate(date)}
                minDate={new Date()}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                dateFormat="MMMM d, yyyy"
                placeholderText="Click to select a date"
              />
            </div>

            {selectedDate && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Time Slot</label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleTimeSlotSelect(slot);
                      }}
                      className={`p-2 text-sm border rounded-md transition-all duration-200 ${
                        selectedTimeSlot === slot
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6">
              <button
                onClick={handleAddSlot}
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Add Slot
              </button>
            </div>
          </div>
        </div>
      )}

      <AddCourseModal 
        isOpen={showCourseModal} 
        onClose={handleCourseModalClose} 
      />

      <AddCohortModal 
        isOpen={showCohortModal} 
        onClose={handleCohortModalClose} 
      />

      <BlogModal 
        isOpen={showBlogModal} 
        onClose={handleBlogModalClose}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default ExpertDashboard;