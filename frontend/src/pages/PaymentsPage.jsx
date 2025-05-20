import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Footer from '../components/layout/Footer';

// Mock data for the payments page
const paymentsData = {
  balance: 3450,
  lifetimeEarnings: 12450,
  pendingPayments: 750,
  inWithdrawal: 0,
  currentPlan: "Premium",
  planRate: "10%",
  planCharges: "+txn charges",
  monthlyEarnings: [
    { month: "Jan", amount: 850 },
    { month: "Feb", amount: 920 },
    { month: "Mar", amount: 780 },
    { month: "Apr", amount: 1050 },
    { month: "May", amount: 1200 },
    { month: "Jun", amount: 950 },
    { month: "Jul", amount: 850 },
    { month: "Aug", amount: 920 },
    { month: "Sep", amount: 1180 },
    { month: "Oct", amount: 1350 },
    { month: "Nov", amount: 1420 },
    { month: "Dec", amount: 980 },
  ],
  weeklyEarnings: [
    { week: "Week 1", amount: 320 },
    { week: "Week 2", amount: 480 },
    { week: "Week 3", amount: 290 },
    { week: "Week 4", amount: 360 },
  ],
  transactions: [
    { 
      id: 1, 
      name: "Introduction to UI Design", 
      type: "Course", 
      date: "April 15, 2025", 
      amount: 450, 
      status: "Completed",
      utrNumber: "UTR8459762310"
    },
    { 
      id: 2, 
      name: "Portfolio Review Session with Maya", 
      type: "1:1 Session", 
      date: "April 12, 2025", 
      amount: 120, 
      status: "Completed",
      utrNumber: "UTR7126548903"
    },
    { 
      id: 3, 
      name: "Design Sprint Basics", 
      type: "Cohort", 
      date: "April 8, 2025", 
      amount: 750, 
      status: "Completed",
      utrNumber: "UTR9087123465"
    },
    { 
      id: 4, 
      name: "Advanced UX Research Methods", 
      type: "Course", 
      date: "April 3, 2025", 
      amount: 680, 
      status: "Completed",
      utrNumber: "UTR6543219870"
    },
    { 
      id: 5, 
      name: "Career Guidance Session with James", 
      type: "1:1 Session", 
      date: "March 29, 2025", 
      amount: 150, 
      status: "Completed",
      utrNumber: "UTR2109876543"
    },
  ],
  withdrawals: [
    { 
      id: 1, 
      date: "March 25, 2025", 
      amount: 1200, 
      status: "Completed", 
      accountNumber: "XXXX4567",
      utrNumber: "UTR1234567890"
    },
    { 
      id: 2, 
      date: "February 28, 2025", 
      amount: 980, 
      status: "Completed", 
      accountNumber: "XXXX4567",
      utrNumber: "UTR9876543210"
    },
    { 
      id: 3, 
      date: "January 30, 2025", 
      amount: 1450, 
      status: "Completed", 
      accountNumber: "XXXX4567",
      utrNumber: "UTR5678901234"
    },
  ],
  sourceEarnings: {
    courses: 5200,
    sessions: 2400,
    cohorts: 4850
  },
  incentives: [
    { 
      id: 1, 
      name: "First Course Launch Bonus", 
      amount: 200, 
      date: "February 15, 2025", 
      status: "Credited"
    },
    { 
      id: 2, 
      name: "100 Students Milestone", 
      amount: 300, 
      date: "March 10, 2025", 
      status: "Credited"
    },
    { 
      id: 3, 
      name: "5-Star Rating Bonus", 
      amount: 150, 
      date: "April 5, 2025", 
      status: "Pending"
    },
  ]
};

function ExpertPayments() {
  const [activeTab, setActiveTab] = useState("summary");
  const [activeTimeFrame, setActiveTimeFrame] = useState("monthly");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: {
        ease: "easeOut",
        duration: 0.5
      }
    }
  };

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
                <span className="text-2xl font-bold text-indigo-800">IndieGuru</span>
                <span className="ml-2 px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded-full">Expert</span>
              </div>
              <nav className="ml-8 flex space-x-8">
                <Link 
                  to="/dashboard"
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/blogpage"
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                >
                  Blogs
                </Link>
                <Link 
                  to="/communitypage"
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                >
                  Community
                </Link>
                <Link 
                  to="/bookings"
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                >
                  Bookings
                </Link>
                <Link 
                  to="/payments"
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-indigo-700 text-sm font-medium text-gray-900"
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
                  <span className="ml-2 text-sm text-gray-700">Dr. Sarah Johnson</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mt-20 mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div 
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
          {/* <motion.button 
            className="bg-indigo-700 hover:bg-indigo-800 text-white px-4 py-2 rounded-lg shadow-sm transition-colors duration-300 flex items-center"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Connect Payout
            <svg className="ml-2 w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </motion.button> */}
        </motion.div>

        {/* Section 1: Payment Cards Overview - Now with 4 cards */}
        <motion.section 
          className="mb-8"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Lifetime Earnings Card */}
            <motion.div 
              className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-[0.1px] border-green-200 flex flex-col items-center justify-center"
              variants={item}
            >
              <div className="flex flex-col items-center">
                <div className="bg-green-100 p-3 rounded-full mb-3">
                  <svg className="w-8 h-8 text-green-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-gray-500">Lifetime Earnings</h3>
                <div className="text-2xl font-bold text-gray-900">${paymentsData.lifetimeEarnings}</div>
              </div>
            </motion.div>
            
            {/* Courses Card */}
            <motion.div 
              className="bg-blue-50 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-blue-100"
              variants={item}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-blue-800">Courses</h4>
                <div className="bg-blue-100 p-2 rounded-full">
                  <svg className="w-5 h-5 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">${paymentsData.sourceEarnings.courses}</div>
              <div className="flex items-center text-sm">
                <span className="text-green-600 font-medium">+22% </span>
                <span className="text-gray-600 ml-1">vs. last month</span>
              </div>
              <div className="mt-3 text-xs">
                <span className="font-medium">Enrolled students: </span>
                <span>150</span>
              </div>
            </motion.div>

            {/* 1:1 Sessions Card */}
            <motion.div 
              className="bg-purple-50 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-purple-100"
              variants={item}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-purple-800">1:1 Sessions</h4>
                <div className="bg-purple-100 p-2 rounded-full">
                  <svg className="w-5 h-5 text-purple-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">${paymentsData.sourceEarnings.sessions}</div>
              <div className="flex items-center text-sm">
                <span className="text-green-600 font-medium">+15% </span>
                <span className="text-gray-600 ml-1">vs. last month</span>
              </div>
              <div className="mt-3 text-xs">
                <span className="font-medium">Total sessions: </span>
                <span>45</span>
              </div>
            </motion.div>

            {/* Cohorts Card */}
            <motion.div 
              className="bg-green-50 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-green-100"
              variants={item}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-green-800">Cohorts</h4>
                <div className="bg-green-100 p-2 rounded-full">
                  <svg className="w-5 h-5 text-green-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
                  </svg>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">${paymentsData.sourceEarnings.cohorts}</div>
              <div className="flex items-center text-sm">
                <span className="text-green-600 font-medium">+28% </span>
                <span className="text-gray-600 ml-1">vs. last month</span>
              </div>
              <div className="mt-3 text-xs">
                <span className="font-medium">Active cohorts: </span>
                <span>3</span>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Section 2: Earnings Graph with improved UI */}
<motion.section 
  className="mb-8"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.3, duration: 0.5 }}
>
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold text-gray-800">Earnings Overview</h2>
      <div className="flex space-x-2">
        <button 
          onClick={() => setActiveTimeFrame("week")}
          className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 ${
            activeTimeFrame === "week" 
            ? "bg-indigo-700 text-white shadow-sm" 
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          This Week
        </button>
        <button 
          onClick={() => setActiveTimeFrame("month")}
          className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 ${
            activeTimeFrame === "month" 
            ? "bg-indigo-700 text-white shadow-sm" 
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          This Month
        </button>
        <button 
          onClick={() => setActiveTimeFrame("quarter")}
          className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 ${
            activeTimeFrame === "quarter" 
            ? "bg-indigo-700 text-white shadow-sm" 
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Last 3 Months
        </button>
      </div>
    </div>
    
    {/* Earnings Graph Section with Animation */}
    <div className="h-80">
      {/* This Week View */}
      {activeTimeFrame === "week" && (
        <div className="h-full">
          <div className="flex h-full">
            {/* Left side - Bar Chart */}
            <div className="w-2/3 pr-4 border-r border-gray-100">
              <div className="text-sm font-medium mb-4 text-gray-700">Daily Earnings Breakdown</div>
              <div className="h-64 flex items-end space-x-4">
                {[
                  { day: "Mon", amount: 120, courses: 70, sessions: 30, cohorts: 20 },
                  { day: "Tue", amount: 85, courses: 40, sessions: 25, cohorts: 20 },
                  { day: "Wed", amount: 165, courses: 80, sessions: 35, cohorts: 50 },
                  { day: "Thu", amount: 140, courses: 60, sessions: 50, cohorts: 30 },
                  { day: "Fri", amount: 190, courses: 100, sessions: 40, cohorts: 50 },
                  { day: "Sat", amount: 75, courses: 30, sessions: 30, cohorts: 15 },
                  { day: "Sun", amount: 45, courses: 20, sessions: 15, cohorts: 10 }
                ].map((day, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="relative w-full h-full flex flex-col-reverse">
                      <motion.div 
                        className="w-full bg-indigo-300 rounded-t"
                        initial={{ height: 0 }}
                        animate={{ height: `${(day.cohorts / 190) * 100}%` }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                      ></motion.div>
                      <motion.div 
                        className="w-full bg-purple-400 rounded-t"
                        initial={{ height: 0 }}
                        animate={{ height: `${(day.sessions / 190) * 100}%` }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                      ></motion.div>
                      <motion.div 
                        className="w-full bg-blue-500 rounded-t"
                        initial={{ height: 0 }}
                        animate={{ height: `${(day.courses / 190) * 100}%` }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                      ></motion.div>
                    </div>
                    <div className="mt-2 text-xs font-medium text-gray-600">{day.day}</div>
                    <div className="text-xs font-semibold">${day.amount}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right side - Stats */}
            <div className="w-1/3 pl-4">
              <div className="text-sm font-medium mb-4 text-gray-700">Weekly Stats</div>
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Total Earnings</span>
                    <span className="text-lg font-bold text-gray-900">$820</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-600">
                    <span>vs last week</span>
                    <span className="flex items-center text-green-600">
                      <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                      12%
                    </span>
                  </div>
                </div>
                
                {/* Source breakdown for the week */}
                <div>
                  <div className="text-sm font-medium mb-3 text-gray-700">Source Breakdown</div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium">Courses</span>
                      <span>$400 (49%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div 
                        className="bg-blue-500 h-2 rounded-full" 
                        initial={{ width: 0 }}
                        animate={{ width: '49%' }}
                        transition={{ duration: 0.8 }}
                      ></motion.div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium">1:1 Sessions</span>
                      <span>$225 (27%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div 
                        className="bg-purple-400 h-2 rounded-full" 
                        initial={{ width: 0 }}
                        animate={{ width: '27%' }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                      ></motion.div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium">Cohorts</span>
                      <span>$195 (24%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div 
                        className="bg-indigo-300 h-2 rounded-full" 
                        initial={{ width: 0 }}
                        animate={{ width: '24%' }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                      ></motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* This Month View */}
      {activeTimeFrame === "month" && (
        <div className="h-full">
          <div className="flex h-full">
            {/* Left side - Line Chart */}
            <div className="w-2/3 pr-4 border-r border-gray-100">
              <div className="text-sm font-medium mb-4 text-gray-700">Daily Earnings (April 2025)</div>
              <div className="relative h-64">
                {/* SVG Line Chart */}
                <svg className="w-full h-full" viewBox="0 0 1000 300">
                  {/* Grid lines */}
                  <line x1="0" y1="250" x2="1000" y2="250" stroke="#e5e7eb" strokeWidth="1" />
                  <line x1="0" y1="200" x2="1000" y2="200" stroke="#e5e7eb" strokeWidth="1" />
                  <line x1="0" y1="150" x2="1000" y2="150" stroke="#e5e7eb" strokeWidth="1" />
                  <line x1="0" y1="100" x2="1000" y2="100" stroke="#e5e7eb" strokeWidth="1" />
                  <line x1="0" y1="50" x2="1000" y2="50" stroke="#e5e7eb" strokeWidth="1" />
                  
                  {/* Y-axis labels */}
                  <text x="10" y="250" fontSize="12" fill="#6b7280">$0</text>
                  <text x="10" y="200" fontSize="12" fill="#6b7280">$50</text>
                  <text x="10" y="150" fontSize="12" fill="#6b7280">$100</text>
                  <text x="10" y="100" fontSize="12" fill="#6b7280">$150</text>
                  <text x="10" y="50" fontSize="12" fill="#6b7280">$200</text>
                  
                  {/* Line for Courses */}
                  <motion.path
                    d="M50,200 L130,180 L210,150 L290,160 L370,100 L450,120 L530,90 L610,70 L690,110 L770,80 L850,50 L930,70"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5 }}
                  />
                  
                  {/* Line for 1:1 Sessions */}
                  <motion.path
                    d="M50,210 L130,220 L210,190 L290,200 L370,180 L450,170 L530,190 L610,170 L690,180 L770,160 L850,150 L930,140"
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 0.2 }}
                  />
                  
                  {/* Line for Cohorts */}
                  <motion.path
                    d="M50,230 L130,220 L210,230 L290,210 L370,220 L450,180 L530,200 L610,190 L690,170 L770,180 L850,170 L930,160"
                    fill="none"
                    stroke="#818cf8"
                    strokeWidth="3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 0.4 }}
                  />
                  
                  {/* Dots for Courses */}
                  {[
                    {x: 50, y: 200}, {x: 130, y: 180}, {x: 210, y: 150}, {x: 290, y: 160},
                    {x: 370, y: 100}, {x: 450, y: 120}, {x: 530, y: 90}, {x: 610, y: 70},
                    {x: 690, y: 110}, {x: 770, y: 80}, {x: 850, y: 50}, {x: 930, y: 70}
                  ].map((point, i) => (
                    <motion.circle
                      key={`course-${i}`}
                      cx={point.x}
                      cy={point.y}
                      r="4"
                      fill="#3b82f6"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8 + i * 0.05 }}
                    />
                  ))}
                  
                  {/* X-axis labels */}
                  <text x="50" y="270" fontSize="10" textAnchor="middle" fill="#6b7280">1</text>
                  <text x="290" y="270" fontSize="10" textAnchor="middle" fill="#6b7280">5</text>
                  <text x="530" y="270" fontSize="10" textAnchor="middle" fill="#6b7280">10</text>
                  <text x="770" y="270" fontSize="10" textAnchor="middle" fill="#6b7280">15</text>
                  <text x="930" y="270" fontSize="10" textAnchor="middle" fill="#6b7280">17</text>
                </svg>
              </div>
            </div>
            
            {/* Right side - Stats */}
            <div className="w-1/3 pl-4">
              <div className="text-sm font-medium mb-4 text-gray-700">Monthly Summary</div>
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Total Earnings</span>
                    <span className="text-lg font-bold text-gray-900">$3,450</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-600">
                    <span>vs last month</span>
                    <span className="flex items-center text-green-600">
                      <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                      15%
                    </span>
                  </div>
                </div>
                
                {/* Source breakdown for the month */}
                <div>
                  <div className="text-sm font-medium mb-3 text-gray-700">Source Breakdown</div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium">Courses</span>
                      <span>$1,680 (49%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div 
                        className="bg-blue-500 h-2 rounded-full" 
                        initial={{ width: 0 }}
                        animate={{ width: '49%' }}
                        transition={{ duration: 0.8 }}
                      ></motion.div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium">1:1 Sessions</span>
                      <span>$970 (28%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div 
                        className="bg-purple-400 h-2 rounded-full" 
                        initial={{ width: 0 }}
                        animate={{ width: '28%' }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                      ></motion.div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium">Cohorts</span>
                      <span>$800 (23%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div 
                        className="bg-indigo-300 h-2 rounded-full" 
                        initial={{ width: 0 }}
                        animate={{ width: '23%' }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                      ></motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Last 3 Months View */}
      {activeTimeFrame === "quarter" && (
        <div className="h-full">
          <div className="flex h-full">
            {/* Left side - Area Chart */}
            <div className="w-2/3 pr-4 border-r border-gray-100">
              <div className="text-sm font-medium mb-4 text-gray-700">3 Month Trend (Feb-Apr 2025)</div>
              <div className="relative h-64">
                {/* SVG Area Chart */}
                <svg className="w-full h-full" viewBox="0 0 1000 300">
                  {/* Grid lines */}
                  <line x1="0" y1="250" x2="1000" y2="250" stroke="#e5e7eb" strokeWidth="1" />
                  <line x1="0" y1="200" x2="1000" y2="200" stroke="#e5e7eb" strokeWidth="1" />
                  <line x1="0" y1="150" x2="1000" y2="150" stroke="#e5e7eb" strokeWidth="1" />
                  <line x1="0" y1="100" x2="1000" y2="100" stroke="#e5e7eb" strokeWidth="1" />
                  <line x1="0" y1="50" x2="1000" y2="50" stroke="#e5e7eb" strokeWidth="1" />
                  
                  {/* Y-axis labels */}
                  <text x="10" y="250" fontSize="12" fill="#6b7280">$0</text>
                  <text x="10" y="200" fontSize="12" fill="#6b7280">$2500</text>
                  <text x="10" y="150" fontSize="12" fill="#6b7280">$5000</text>
                  <text x="10" y="100" fontSize="12" fill="#6b7280">$7500</text>
                  <text x="10" y="50" fontSize="12" fill="#6b7280">$10000</text>
                  
                  {/* Area for Total Earnings */}
                  <motion.path
                    d="M100,170 L500,130 L900,120 L900,250 L100,250 Z"
                    fill="url(#totalGradient)"
                    fillOpacity="0.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                  />
                  
                  {/* Line for Total Earnings */}
                  <motion.path
                    d="M100,170 L500,130 L900,120"
                    fill="none"
                    stroke="#4f46e5"
                    strokeWidth="3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5 }}
                  />
                  
                  {/* Dots for each month */}
                  <motion.circle
                    cx="100"
                    cy="170"
                    r="6"
                    fill="#4f46e5"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1 }}
                  />
                  <motion.circle
                    cx="500"
                    cy="130"
                    r="6"
                    fill="#4f46e5"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.2 }}
                  />
                  <motion.circle
                    cx="900"
                    cy="120"
                    r="6"
                    fill="#4f46e5"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.4 }}
                  />
                  
                  {/* Month labels */}
                  <text x="100" y="270" fontSize="12" textAnchor="middle" fill="#6b7280">February</text>
                  <text x="500" y="270" fontSize="12" textAnchor="middle" fill="#6b7280">March</text>
                  <text x="900" y="270" fontSize="12" textAnchor="middle" fill="#6b7280">April</text>
                  
                  {/* Revenue amount labels */}
                  <text x="100" y="160" fontSize="12" textAnchor="middle" fill="#4f46e5" fontWeight="bold">$2,850</text>
                  <text x="500" y="120" fontSize="12" textAnchor="middle" fill="#4f46e5" fontWeight="bold">$3,150</text>
                  <text x="900" y="110" fontSize="12" textAnchor="middle" fill="#4f46e5" fontWeight="bold">$3,450</text>
                  
                  {/* Gradient definition */}
                  <defs>
                    <linearGradient id="totalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            
            {/* Right side - Stats */}
            <div className="w-1/3 pl-4">
              <div className="text-sm font-medium mb-4 text-gray-700">Quarterly Summary</div>
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Total Earnings</span>
                    <span className="text-lg font-bold text-gray-900">$9,450</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-600">
                    <span>vs previous quarter</span>
                    <span className="flex items-center text-green-600">
                      <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                      21%
                    </span>
                  </div>
                </div>
                
                {/* Donut chart for quarter breakdown */}
                <div className="relative">
                  <div className="text-sm font-medium mb-3 text-gray-700">Source Breakdown</div>
                  
                  <div className="flex justify-center mb-4">
                    <div className="relative w-32 h-32">
                      <svg viewBox="0 0 100 100">
                        {/* Courses segment (46%) */}
                        <motion.circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="20"
                          strokeDasharray="251.2"
                          strokeDashoffset="135.65"
                          transform="rotate(-90 50 50)"
                          initial={{ strokeDashoffset: 251.2 }}
                          animate={{ strokeDashoffset: 135.65 }}
                          transition={{ duration: 1 }}
                        />
                        
                        {/* 1:1 Sessions segment (30%) */}
                        <motion.circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#a855f7"
                          strokeWidth="20"
                          strokeDasharray="251.2"
                          strokeDashoffset="176.84"
                          transform="rotate(75.6 50 50)"
                          initial={{ strokeDashoffset: 251.2 }}
                          animate={{ strokeDashoffset: 176.84 }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                        
                        {/* Cohorts segment (24%) */}
                        <motion.circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#818cf8"
                          strokeWidth="20"
                          strokeDasharray="251.2"
                          strokeDashoffset="191.91"
                          transform="rotate(183.6 50 50)"
                          initial={{ strokeDashoffset: 251.2 }}
                          animate={{ strokeDashoffset: 191.91 }}
                          transition={{ duration: 1, delay: 1 }}
                        />
                        
                        {/* Center hole */}
                        <circle cx="50" cy="50" r="30" fill="white" />
                      </svg>
                      
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-xs text-gray-600">Total</div>
                          <div className="text-lg font-bold text-indigo-700">$9,450</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Legend */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="flex justify-center mb-1">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      </div>
                      <div className="text-xs font-medium">Courses</div>
                      <div className="text-xs text-gray-600">$4,350</div>
                    </div>
                    <div>
                      <div className="flex justify-center mb-1">
                        <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                      </div>
                      <div className="text-xs font-medium">Sessions</div>
                      <div className="text-xs text-gray-600">$2,835</div>
                    </div>
                    <div>
                      <div className="flex justify-center mb-1">
                        <div className="w-3 h-3 rounded-full bg-indigo-300"></div>
                      </div>
                      <div className="text-xs font-medium">Cohorts</div>
                      <div className="text-xs text-gray-600">$2,265</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    
    <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center">
              <div className="flex space-x-6 mb-4 md:mb-0">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-indigo-600 mr-2"></div>
                  <span className="text-sm text-gray-600">Earnings</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-600 mr-2"></div>
                  <span className="text-sm text-gray-600">Growth</span>
                </div>
              </div>
              {/* <div className="flex space-x-4">
                <button className="text-sm text-indigo-700 hover:text-indigo-900 font-medium transition-colors duration-300">
                  Download CSV
                </button>
                <button className="text-sm text-indigo-700 hover:text-indigo-900 font-medium transition-colors duration-300">
                  Download Report
                </button>
              </div> */}
            </div>
  </div>
</motion.section>
        {/* Section 3: Tabs for Different Transaction Types */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="mb-6 flex space-x-4">
            <button 
              onClick={() => setActiveTab("summary")}
              className={`px-6 py-3 text-sm font-medium rounded-full transition-colors duration-300 ${
                activeTab === "summary" 
                ? "bg-indigo-700 text-white shadow-md" 
                : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Summary
            </button>
            <button 
              onClick={() => setActiveTab("transactions")}
              className={`px-6 py-3 text-sm font-medium rounded-full transition-colors duration-300 ${
                activeTab === "transactions" 
                ? "bg-indigo-700 text-white shadow-md" 
                : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Transactions
            </button>
            <button 
              onClick={() => setActiveTab("withdrawals")}
              className={`px-6 py-3 text-sm font-medium rounded-full transition-colors duration-300 ${
                activeTab === "withdrawals" 
                ? "bg-indigo-700 text-white shadow-md" 
                : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Withdrawals
            </button>
            {/* <button 
              onClick={() => setActiveTab("incentives")}
              className={`px-6 py-3 text-sm font-medium rounded-full transition-colors duration-300 ${
                activeTab === "incentives" 
                ? "bg-indigo-700 text-white shadow-md" 
                : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Incentives
            </button> */}
          </div>

          {/* Summary Tab Content - Removed Earnings by Source cards */}
          {activeTab === "summary" && (
            <motion.div 
              className="bg-white rounded-lg shadow-md overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paymentsData.transactions.slice(0, 3).map((transaction) => (
                        <motion.tr 
                          key={transaction.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          whileHover={{ backgroundColor: "#f9fafb" }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {transaction.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                            ${transaction.amount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {transaction.status}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 text-center">
                  <button className="text-indigo-700 hover:text-indigo-900 text-sm font-medium">
                    View All Transactions
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Transactions Tab Content */}
          {activeTab === "transactions" && (
            <motion.div 
              className="bg-white rounded-lg shadow-md overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">All Transactions</h3>
                  <div className="flex space-x-2">
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Search transactions..."
                        className="pl-8 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <svg className="w-4 h-4 absolute left-2.5 top-2.5 text-gray-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                      </svg>
                    </div>
                    <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                      </svg>
                      Filter
                    </button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          UTR Number
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paymentsData.transactions.map((transaction) => (
                        <motion.tr 
                          key={transaction.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          whileHover={{ backgroundColor: "#f9fafb" }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {transaction.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                            ${transaction.amount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {transaction.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.utrNumber}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of <span className="font-medium">25</span> results
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white text-gray-700 hover:bg-gray-50">
                      Previous
                    </button>
                    <button className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-indigo-700 text-white hover:bg-indigo-800">
                      1
                    </button>
                    <button className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white text-gray-700 hover:bg-gray-50">
                      2
                    </button>
                    <button className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white text-gray-700 hover:bg-gray-50">
                      3
                    </button>
                    <button className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white text-gray-700 hover:bg-gray-50">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Withdrawals Tab Content */}
          {activeTab === "withdrawals" && (
            <motion.div 
              className="bg-white rounded-lg shadow-md overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Withdrawal History</h3>
                  <motion.button 
                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm flex items-center shadow-sm"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    New Withdrawal
                  </motion.button>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">Withdrawal Information</h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>Withdrawals are processed within 3-5 business days. Minimum withdrawal amount is $100.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Account
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          UTR Number
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paymentsData.withdrawals.map((withdrawal) => (
                        <motion.tr 
                          key={withdrawal.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          whileHover={{ backgroundColor: "#f9fafb" }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {withdrawal.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ${withdrawal.amount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {withdrawal.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {withdrawal.accountNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {withdrawal.utrNumber}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Bank Account Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Account Name</p>
                      <p className="text-sm font-medium">Dr. Sarah Johnson</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Account Number</p>
                      <p className="text-sm font-medium">XXXX4567</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Bank Name</p>
                      <p className="text-sm font-medium">National Bank</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">IFSC Code</p>
                      <p className="text-sm font-medium">NATL0001234</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <button className="text-indigo-700 hover:text-indigo-900 text-sm font-medium">
                      Update Bank Details
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Incentives Tab Content */}
          {activeTab === "incentives" && (
            <motion.div 
              className="bg-white rounded-lg shadow-md overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Incentives & Bonuses</h3>
                  <div className="text-sm text-green-600 font-medium flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                    New incentive available
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <motion.div 
                    className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200 hover:shadow-lg transition-all duration-300"
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <div className="flex items-center mb-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <svg className="w-5 h-5 text-green-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <h4 className="text-sm font-medium text-gray-800 ml-2">Course Creation</h4>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">Create a new course and earn bonus</p>
                    <div className="text-lg font-bold text-green-700">+$200</div>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200 hover:shadow-lg transition-all duration-300"
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <div className="flex items-center mb-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <svg className="w-5 h-5 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                      </div>
                      <h4 className="text-sm font-medium text-gray-800 ml-2">Student Milestone</h4>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">Reach 250 students</p>
                    <div className="text-lg font-bold text-blue-700">+$350</div>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200 hover:shadow-lg transition-all duration-300"
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <div className="flex items-center mb-3">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <svg className="w-5 h-5 text-purple-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                        </svg>
                      </div>
                      <h4 className="text-sm font-medium text-gray-800 ml-2">Rating Bonus</h4>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">Maintain 4.8+ rating</p>
                    <div className="text-lg font-bold text-purple-700">+$150</div>
                  </motion.div>
                </div>
                
                <h4 className="text-md font-medium text-gray-800 mb-4">Incentive History</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paymentsData.incentives.map((incentive) => (
                        <motion.tr 
                          key={incentive.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          whileHover={{ backgroundColor: "#f9fafb" }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {incentive.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                            ${incentive.amount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {incentive.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              incentive.status === "Credited" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {incentive.status}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6 bg-indigo-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-indigo-800 mb-3">Upcoming Incentives</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-indigo-700 mb-1">Join Expert Panel</p>
                      <p className="text-xs text-gray-600">Participate in our expert panel for additional bonus</p>
                    </div>
                    <div className="text-lg font-semibold text-indigo-700">+$250</div>
                  </div>
                  <div className="mt-3">
                    <div className="w-full bg-indigo-200 rounded-full h-1.5">
                      <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                    <p className="text-xs text-indigo-700 mt-1">70% completed - 3 more sessions needed</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default ExpertPayments;