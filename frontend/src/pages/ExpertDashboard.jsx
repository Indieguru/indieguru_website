import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/layout/Footer';

// Mock data for the dashboard
const expertData = {
  name: "Dr. Sarah Johnson",
  profileCompletion: 75,
  earnings: 3450,
  activeStreak: 42,
  ratings: 4.8,
  avgCategoryRating: 4.3,
  studentsEnrolled: 378,
  expertise: ["UI/UX Design", "Product Design", "Visual Design", "Graphic Design"],
  upcomingSessions: [
    { id: 1, type: "1-on-1", title: "UX Strategy Session", date: "April 15, 2025", time: "10:00 AM - 11:30 AM", students: 1 },
    { id: 2, type: "Cohort", title: "Advanced UI Design Masterclass", date: "April 17-24, 2025", students: 24 },
    { id: 3, type: "Course", title: "Figma for Beginners", date: "Self-paced", students: 156 },
  ],
  analytics: {
    courses: { delivered: 12, earnings: 1800 },
    sessions: { delivered: 45, earnings: 900 },
    cohorts: { delivered: 3, earnings: 750 },
  }
};

function ExpertDashboard() {
  const [activeTab] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-700"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navigation */}
      <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-purple-800">IndieGuru</span>
                <span className="ml-2 px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">Expert</span>
              </div>
              <nav className="ml-8 flex space-x-8">
                <Link 
                  to="/dashboard"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    activeTab === "dashboard" ? "border-purple-700 text-gray-900" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/blogpage"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    activeTab === "blogs" ? "border-purple-700 text-gray-900" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Blogs
                </Link>
                <Link 
                  to="/communitypage"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    activeTab === "community" ? "border-purple-700 text-gray-900" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Community
                </Link>
                <Link 
                  to="/bookings"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    activeTab === "bookings" ? "border-purple-700 text-gray-900" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Bookings
                </Link>
                <Link 
                  to="/payments"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    activeTab === "payments" ? "border-purple-700 text-gray-900" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Payments
                </Link>
              </nav>
            </div>
            <div className="flex items-center">
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <img
                    className="h-8 w-8 rounded-full"
                    src="https://randomuser.me/api/portraits/women/48.jpg"
                    alt="Expert profile"
                  />
                  <span className="ml-2 text-sm text-gray-700">{expertData.name}</span>
                </div>
              </div>
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
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-[0.1px] border-gray-300">
              <h2 className="text-lg font-semibold text-indigo-700 mb-4 flex items-center">
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
                  <div className="text-xl font-bold text-indigo-700">{expertData.profileCompletion}%</div>
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
                  <div className="text-xl font-bold text-indigo-700">{expertData.activeStreak} Days</div>
                  <div className="text-sm text-gray-600">Active Streak</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <Link to="/profile" className="bg-indigo-700 hover:bg-indigo-700 text-white text-xs py-2 px-4 rounded flex items-center justify-center shadow-sm transition-colors duration-300">
                  Edit Profile
                </Link>
                <Link to="/profile/settings" className="text-xs text-indigo-700 hover:text-purple-800 transition-colors duration-300">
                  Share Profile
                </Link>
              </div>
            </div>

            {/* Key Expertise Areas Card */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-[0.1px] border-gray-300">
              <h2 className="text-lg font-semibold text-indigo-700 mb-4 flex items-center">
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
              <div className="flex flex-wrap gap-2 mb-4">
                {expertData.expertise.map((skill, index) => (
                  <span key={index} className="text-xs bg-white border border-indigo-200 text-indigo-700 px-3 py-1 rounded-full hover:bg-indigo-50 transition-colors duration-300">
                    {skill}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs py-2 px-4 rounded shadow-sm transition-colors duration-300">
                  Edit Expertise
                </button>
                <Link to="#" className="text-xs text-indigo-600 hover:text-indigo-800 transition-colors duration-300">
                  Add New
                </Link>
              </div>
            </div>

            {/* Expert Goals Card */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-[0.1px] border-gray-300">
              <h2 className="text-lg font-semibold text-green-600 mb-4 flex items-center">
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
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">One-on-One Sessions</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
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
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <button className="bg-green-600 hover:bg-green-700 text-white text-xs py-2 px-4 rounded shadow-sm transition-colors duration-300">
                  Update Goals
                </button>
                <Link to="#" className="text-xs text-green-600 hover:text-green-800 transition-colors duration-300">
                  View Progress
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: CTA & Status of Actionables */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2 text-blue-600">
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
            <div className="bg-blue-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-[0.5px] border-gray-300">
              <div className="flex flex-col items-center">
                <div className="bg-blue-100 p-3 rounded-full mb-3">
                  <svg className="w-8 h-8 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-blue-800 mb-1">Upload Course</h3>
                <p className="text-xs text-center text-blue-600 mb-3">Create and publish your own course</p>
                <div className="text-2xl font-bold text-blue-600 mb-2">3</div>
                <p className="text-xs text-blue-500 mb-4">Courses Published</p>
                <button className="w-full bg-blue-800 hover:bg-yellow-600 text-white text-xs py-2 px-4 rounded shadow-sm transition-colors duration-300">
                  Create New
                </button>
              </div>
            </div>

            {/* Conduct Cohort */}
            <div className="bg-blue-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-[0.5px] border-gray-300">
              <div className="flex flex-col items-center">
                <div className="bg-blue-100 p-3 rounded-full mb-3">
                  <svg className="w-8 h-8 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-blue-800 mb-1">Conduct Cohort</h3>
                <p className="text-xs text-center text-blue-600 mb-3">Lead a group learning experience</p>
                <div className="text-2xl font-bold text-blue-600 mb-2">1</div>
                <p className="text-xs text-blue-500 mb-4">Active Cohorts</p>
                <button className="w-full bg-blue-800 hover:bg-yellow-600 text-white text-xs py-2 px-4 rounded shadow-sm transition-colors duration-300">
                  Plan Cohort
                </button>
              </div>
            </div>

            {/* Write Blog */}
            <div className="bg-blue-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-[0.5px] border-gray-300">
              <div className="flex flex-col items-center">
                <div className="bg-blue-100 p-3 rounded-full mb-3">
                  <svg className="w-8 h-8 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-blue-800 mb-1">Write Blog</h3>
                <p className="text-xs text-center text-blue-600 mb-3">Share your knowledge and insights</p>
                <div className="text-2xl font-bold text-blue-600 mb-2">7</div>
                <p className="text-xs text-blue-500 mb-4">Blogs Published</p>
                <button className="w-full bg-blue-800 hover:bg-yellow-600 text-white text-xs py-2 px-4 rounded shadow-sm transition-colors duration-300">
                  New Article
                </button>
              </div>
            </div>

            {/* Community Discussion */}
            <div className="bg-blue-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-[0.5px] border-gray-300">
              <div className="flex flex-col items-center">
                <div className="bg-blue-100 p-3 rounded-full mb-3">
                  <svg className="w-8 h-8 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-blue-800 mb-1">Discuss</h3>
                <p className="text-xs text-center text-blue-600 mb-3">Engage with the community</p>
                <div className="text-2xl font-bold text-blue-600 mb-2">18</div>
                <p className="text-xs text-blue-500 mb-4">Discussions Started</p>
                <button className="w-full bg-blue-800 hover:bg-yellow-600 text-white text-xs py-2 px-4 rounded shadow-sm transition-colors duration-300">
                  Start Thread
                </button>
              </div>
            </div>

            {/* 1-on-1 Sessions */}
            <div className="bg-blue-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-[0.5px] border-gray-300">
              <div className="flex flex-col items-center">
                <div className="bg-blue-100 p-3 rounded-full mb-3">
                  <svg className="w-8 h-8 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-blue-800 mb-1">1-on-1 Sessions</h3>
                <p className="text-xs text-center text-blue-600 mb-3">Personalized mentoring</p>
                <div className="text-2xl font-bold text-blue-600 mb-2">24</div>
                <p className="text-xs text-blue-500 mb-4">Sessions Conducted</p>
                <button className="w-full bg-blue-800 hover:bg-yellow-600 text-white text-xs py-2 px-4 rounded shadow-sm transition-colors duration-300">
                  Manage Calendar
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Upcoming Sessions */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2 text-blue-600">
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
                <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-700"></div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        session.type === "1-on-1" ? "bg-red-100 text-red-600" : 
                        session.type === "Cohort" ? "bg-purple-100 text-indigo-700" : 
                        "bg-blue-100 text-blue-600"
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
                    {session.date}
                    {session.time && (
                      <span className="ml-2 text-xs py-1 px-2 bg-gray-100 rounded-full">{session.time}</span>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <button className="text-sm text-indigo-700 hover:text-purple-800 font-medium transition-colors duration-300">
                      View Details
                    </button>
                    <button className={`text-sm ${
                      session.type === "1-on-1" ? "text-red-600 hover:text-red-800" : 
                      session.type === "Cohort" ? "text-indigo-700 hover:text-purple-800" : 
                      "text-blue-600 hover:text-blue-800"
                    } font-medium transition-colors duration-300`}>
                      {session.type === "Course" ? "Edit Course" : "Prepare"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Analytics and Insights */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2 text-green-600">
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
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-[0.1px] border-green-600 cursor-pointer" onClick={() => window.location.href='/payments'}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Total Earnings</h3>
                <div className="bg-green-100 p-2 rounded-md">
                  <svg className="w-5 h-5 text-green-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">${expertData.earnings}</div>
              <div className="flex items-center text-sm">
                <span className="text-green-600 font-medium">+12% </span>
                <span className="text-gray-600 ml-1">vs. last month</span>
              </div>
              <div className="mt-4 border-t border-gray-100 pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-xs text-gray-500">Courses</span>
                  <span className="text-xs font-medium">${expertData.analytics.courses.earnings}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs text-gray-500">Sessions</span>
                  <span className="text-xs font-medium">${expertData.analytics.sessions.earnings}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Cohorts</span>
                  <span className="text-xs font-medium">${expertData.analytics.cohorts.earnings}</span>
                </div>
              </div>
            </div>

            {/* Ratings Card */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-[0.1px] border-yellow-600">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Your Ratings</h3>
                <div className="bg-yellow-100 p-2 rounded-md">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                  </svg>
                </div>
              </div>
              <div className="flex items-center mb-3">
                <div className="text-3xl font-bold text-gray-900 mr-2">{expertData.ratings}</div>
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, index) => (
                    <svg key={index} className={`w-4 h-4 ${index < Math.floor(expertData.ratings) ? 'text-yellow-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-600">
                  <span className="text-gray-800 font-medium">{expertData.ratings}</span> Your Average
                </div>
                <div className="text-sm text-gray-600">
                  <span className="text-gray-800 font-medium">{expertData.avgCategoryRating}</span> Category Average
                </div>
              </div>
              <div className="mt-2">
                <div className="w-full h-2 bg-gray-200 rounded-full mb-2">
                  <div className="h-2 bg-blue-800 rounded-full" style={{ width: `${(expertData.ratings / 5) * 100}%` }}></div>
                </div>
                <Link to="/analytics/ratings" className="text-xs text-yellow-600 hover:text-yellow-800 font-medium transition-colors duration-300">
                  View detailed ratings
                </Link>
              </div>
            </div>

            {/* Student Enrollment Card */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-[0.1px] border-blue-600">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Students Enrolled</h3>
                <div className="bg-blue-100 p-2 rounded-md">
                  <svg className="w-5 h-5 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{expertData.studentsEnrolled}</div>
              <div className="flex items-center text-sm">
                <span className="text-blue-600 font-medium">+24 </span>
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
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-[0.1px] border-indigo-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Activity Stats</h3>
                <div className="bg-purple-100 p-2 rounded-md">
                  <svg className="w-5 h-5 text-indigo-700" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Response Rate</span>
                      <span className="text-sm font-medium text-indigo-700">94%</span>
                    </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-indigo-700 rounded-full" style={{ width: '94%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Engagement</span>
                    <span className="text-sm font-medium text-indigo-700">78%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-indigo-700 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Content Created</span>
                    <span className="text-sm font-medium text-indigo-700">86%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-indigo-700 rounded-full" style={{ width: '86%' }}></div>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link to="/analytics/detailed" className="text-xs text-indigo-700 hover:text-purple-800 font-medium transition-colors duration-300">
                  View full analytics
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Testimonials and Reviews */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
              <span className="mr-2 text-indigo-600">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.5 6.5C7.5 8.981 5.5 11 3 11V13C6.866 13 10 9.866 10 6V3H3.5C2.67157 3 2 3.67157 2 4.5V6.5C2 7.32843 2.67157 8 3.5 8C4.32843 8 7.5 7.32843 7.5 6.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21.5 6.5C21.5 8.981 19.5 11 17 11V13C20.866 13 24 9.866 24 6V3H17.5C16.6716 3 16 3.67157 16 4.5V6.5C16 7.32843 16.6716 8 17.5 8C18.3284 8 21.5 7.32843 21.5 6.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              Student Testimonials
            </h2>
            <Link to="/testimonials" className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors duration-300">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-start mb-4">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Student" className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <h4 className="font-bold text-gray-800">Alex Thompson</h4>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, index) => (
                      <svg key={index} className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-xs text-gray-500 ml-2">2 weeks ago</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "Dr. Johnson's UX Design course transformed my approach to problem-solving. Her practical insights and real-world examples made complex concepts accessible. I landed a new job within a month of completing her cohort!"
              </p>
              <div className="text-xs text-gray-500 italic">
                From: Advanced UI Design Masterclass
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-start mb-4">
                <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Student" className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <h4 className="font-bold text-gray-800">Maya Rodriguez</h4>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, index) => (
                      <svg key={index} className={`w-4 h-4 ${index < 5 ? 'text-yellow-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-xs text-gray-500 ml-2">1 month ago</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "The 1-on-1 sessions with Sarah were incredibly valuable. She provided personalized feedback on my portfolio that helped me identify and fix critical issues. Her mentorship has been instrumental in my career growth."
              </p>
              <div className="text-xs text-gray-500 italic">
                From: Portfolio Review Session
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-start mb-4">
                <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="Student" className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <h4 className="font-bold text-gray-800">James Wilson</h4>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, index) => (
                      <svg key={index} className={`w-4 h-4 ${index < 4 ? 'text-yellow-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-xs text-gray-500 ml-2">3 months ago</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "Figma for Beginners is by far the most comprehensive yet accessible course I've taken. Dr. Johnson breaks down complex tools into manageable chunks. I went from zero knowledge to designing my first app in just two weeks!"
              </p>
              <div className="text-xs text-gray-500 italic">
                From: Figma for Beginners Course
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Platform Updates and Tips */}
        <section>
          <div className="bg-gradient-to-r from-indigo-700 to-indigo-700 rounded-lg p-6 shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h2 className="text-xl font-bold text-white mb-2">Amplify Your Expert Reach</h2>
                <p className="text-purple-100 max-w-xl">
                  Share your expertise with a wider audience by creating downloadable resources or hosting a webinar. Experts who offer free content increase their paid bookings by an average of 37%.
                </p>
              </div>
              <div className="flex space-x-4">
                <button className="bg-white text-indigo-700 px-4 py-2 rounded-lg shadow-sm hover:bg-purple-50 transition-colors duration-300 text-sm font-medium">
                  Create Resource
                </button>
                <button className="bg-transparent text-white border border-white px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors duration-300 text-sm font-medium">
                  Host Webinar
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default ExpertDashboard;