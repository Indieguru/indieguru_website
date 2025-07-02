import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
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
import SessionDetailsModal from '../components/modals/SessionDetailsModal';
import useUserTypeStore from '../store/userTypeStore';
import checkAuth from '../utils/checkAuth';
import { Calendar, Clock, X, Plus, Check, AlertCircle } from 'lucide-react';
import ProtectedBooking from '../components/ProtectedBooking';
import ExpertApprovalCheck from '../components/ExpertApprovalCheck';
import { toast } from 'react-toastify';

function ExpertDashboard() {
  const { expertData, fetchExpertData, isLoading, error } = useExpertStore();
  const { courses, fetchExpertCourses } = useExpertCoursesStore();
  const { cohorts, fetchExpertCohorts } = useExpertCohortsStore();
  const navigate = useNavigate();
  const { userType, setUserType } = useUserTypeStore();
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [message, setMessage] = useState('');
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showCohortModal, setShowCohortModal] = useState(false);
  const [showSessionDetailsModal, setShowSessionDetailsModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authData, setAuthData] = useState(null);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const [availableSlots, setAvailableSlots] = useState([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [showAvailableSlotsModal, setShowAvailableSlotsModal] = useState(false);

  const [ratings, setRatings] = useState({
    overall: 0,
    count: 0
  });
  const [isLoadingRatings, setIsLoadingRatings] = useState(false);

  const [completedSessions, setCompletedSessions] = useState(0);
  const [isLoadingCompletedSessions, setIsLoadingCompletedSessions] = useState(false);

  const timeSlots = [
    "09:00-10:00",
    "10:00-11:00",
    "11:00-12:00",
    "12:00-13:00",
    "13:00-14:00",
    "14:00-15:00",
    "15:00-16:00",
    "16:00-17:00",
    "17:00-18:00",
    "18:00-19:00",
    "19:00-20:00",
    "20:00-21:00"
  ];

  const handleDateSelect = (date) => {
    const dateExists = selectedDates.some(
      selectedDate => selectedDate.toDateString() === date.toDateString()
    );

    if (dateExists) {
      setSelectedDates(selectedDates.filter(
        selectedDate => selectedDate.toDateString() !== date.toDateString()
      ));
    } else {
      setSelectedDates([...selectedDates, date]);
    }
  };

  const handleTimeSlotSelect = (slot) => {
    if (selectedTimeSlots.includes(slot)) {
      setSelectedTimeSlots(selectedTimeSlots.filter(timeSlot => timeSlot !== slot));
    } else {
      setSelectedTimeSlots([...selectedTimeSlots, slot]);
    }
  };

  const handleAddSlot = async () => {
    if (selectedDates.length === 0 || selectedTimeSlots.length === 0) {
      setMessage('Please select at least one date and one time slot');
      return;
    }

    setIsProcessing(true);
    setMessage('Processing slots...');

    try {
      const slotRequests = [];

      for (const date of selectedDates) {
        for (const timeSlot of selectedTimeSlots) {
          const [startTime, endTime] = timeSlot.split('-');
          const formattedDate = date.toISOString().split('T')[0];

          slotRequests.push({
            date: formattedDate,
            startTime,
            endTime,
            duration: 60
          });
        }
      }

      const response = await axiosInstance.post('/expert/addsession/batch', {
        slots: slotRequests
      });

      setMessage(`Successfully added ${response.data.addedCount} slots. ${response.data.duplicateCount || 0} duplicates were skipped.`);

      setSelectedDates([]);
      setSelectedTimeSlots([]);

      setTimeout(() => {
        setMessage('');
        setShowCalendarModal(false);
      }, 2000);
    } catch (error) {
      console.error('Error adding slots:', error);
      setMessage(error.response?.data?.message || 'Error adding slots. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrepare = (session) => {
    console.log(session);
    if (session.meetLink) {
      window.open(session.meetLink, '_blank');
    } else {
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

  const fetchExpertRatings = async () => {
    setIsLoadingRatings(true);
    try {
      const response = await axiosInstance.get('/expert/ratings');
      
      if (response.data && response.data.data) {
        const ratingData = response.data.data;
        setRatings({
          overall: ratingData.rating || 0,
          count: ratingData.totalFeedbacks || 0
        });
      } else {
        console.error('Unexpected rating response format:', response.data);
        setRatings({
          overall: 0,
          count: 0
        });
      }
    } catch (error) {
      console.error('Error fetching ratings:', error);
      setRatings({
        overall: 0,
        count: 0
      });
    } finally {
      setIsLoadingRatings(false);
    }
  };

  const fetchCompletedSessions = async () => {
    setIsLoadingCompletedSessions(true);
    try {
      const response = await axiosInstance.get('/expert/sessions/completed');
      
      if (response.data && response.data.count !== undefined) {
        setCompletedSessions(response.data.count);
      } else {
        console.error('Unexpected completed sessions response format:', response.data);
        setCompletedSessions(0);
      }
    } catch (error) {
      console.error('Error fetching completed sessions:', error);
      setCompletedSessions(0);
    } finally {
      setIsLoadingCompletedSessions(false);
    }
  };

  const handleAddBlog = () => {
    if (!isExpertApproved) {
      toast.warning('Your profile needs approval before you can create blog posts.', {
        position: "top-center",
        autoClose: 3000
      });
      return;
    }
    setShowBlogModal(true);
  };

  const handleBlogModalClose = () => {
    setShowBlogModal(false);
    fetchExpertBlogs();
  };

  const fetchAvailableSlots = async () => {
    setIsLoadingSlots(true);
    try {
      const response = await axiosInstance.get('/expert/sessions/available');
      setAvailableSlots(response.data);
    } catch (error) {
      console.error('Error fetching available slots:', error);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleViewAvailableSlots = () => {
    fetchAvailableSlots();
    setShowAvailableSlotsModal(true);
  };

  const handleDeleteSlot = async (slotId) => {
    try {
      await axiosInstance.delete(`/expert/sessions/${slotId}`);
      setAvailableSlots(availableSlots.filter(slot => slot._id !== slotId));
    } catch (error) {
      console.error('Error deleting slot:', error);
      alert('Failed to delete slot. ' + (error.response?.data?.message || 'Please try again.'));
    }
  };

  const handleManageCalendar = () => {
    setShowCalendarModal(true);
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
            fetchExpertBlogs(),
            fetchExpertRatings(),
            fetchCompletedSessions()
          ]);
        } catch (err) {
          console.error('Error initializing data:', err);
        }
      };
      initializeData();
    }
  }, [userType, navigate, fetchExpertData, fetchExpertCourses, fetchExpertCohorts, authData]);

  // Add effect to check expert approval status after data is loaded
  useEffect(() => {
    // Only redirect if data has been loaded (not loading) and expert status is not approved
    if (!isLoading && expertData && expertData.status && expertData.status !== 'approved') {
      navigate('/expert/profile');
    }
  }, [isLoading, expertData, navigate]);

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
    await fetchExpertCourses();
  };

  const handleAddCohort = () => {
    setShowCohortModal(true);
  };

  const handleCohortModalClose = async () => {
    setShowCohortModal(false);
    await fetchExpertCohorts();
  };

  const isExpertApproved = expertData && expertData.status === 'approved';

  return (
    // <ExpertApprovalCheck>
      <div className="min-h-screen bg-gray-50">
        <Header />

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
                      <path d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-indigo-900">₹{expertData.sessionPricing?.expertFee || 0}</div>
                    <div className="text-sm text-gray-600">Session Fee</div>
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
                    className={`w-full ${isExpertApproved 
                      ? "bg-blue-900 hover:bg-blue-800" 
                      : "bg-gray-400 cursor-not-allowed"} text-white text-xs py-2 px-4 rounded shadow-sm transition-colors duration-300 flex items-center justify-center`}
                  >
                    {!isExpertApproved && <AlertCircle className="w-3 h-3 mr-1" />}
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
                  <div className="text-2xl font-bold text-blue-900 mb-2">{expertData.analytics?.community?.posts || 0}</div>
                  <p className="text-xs text-blue-900">Total Posts</p>
                </div>
                <div className="flex-grow"></div>
                <div className="mt-4 pt-4 border-t border-blue-100">
                  <button 
                    onClick={() => navigate('/community')}
                    className="w-full bg-blue-900 hover:bg-blue-800 text-white text-xs py-2 px-4 rounded shadow-sm transition-colors duration-300">
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
                  <div className="text-2xl font-bold text-blue-900 mb-2">
                    {isLoadingCompletedSessions ? (
                      <div className="h-6 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-900"></div>
                      </div>
                    ) : (
                      completedSessions
                    )}
                  </div>
                  <p className="text-xs text-blue-900">Sessions Completed</p>
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

          {/* Section 3.5: Available Time Slots */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                <span className="mr-2 text-green-600">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 2V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 2V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M3 9H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M19 4H5C3.89543 4 3 4.89543 3 6V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 13L11 15L15 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                Your Available Time Slots
              </h2>
              <button 
                onClick={handleViewAvailableSlots}
                className="bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-4 rounded-lg flex items-center transition-colors duration-300"
              >
                <span className="mr-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M16 12L8 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </span>
                View All Available Slots
              </button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600">
                  These are your upcoming time slots that haven't been booked by students yet. 
                  Students can browse and book these slots based on your availability.
                </p>
                <button
                  onClick={handleManageCalendar}
                  className="text-blue-700 hover:text-blue-900 text-sm font-medium"
                >
                  + Add More Slots
                </button>
              </div>
              
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-green-50 p-4 rounded-lg border border-green-100 flex flex-col">
                  <div className="text-green-600 mb-1">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Manage Your Calendar</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Keep your calendar up to date to ensure students can find and book sessions with you.
                  </p>
                  <div className="mt-4 pt-4 border-t border-green-100">
                    <button 
                      onClick={handleViewAvailableSlots}
                      className="text-green-600 hover:text-green-800 text-sm font-medium"
                    >
                      View all available slots →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Available Slots Modal */}
          {showAvailableSlotsModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-white" />
                      </div>
                      <h2 className="text-xl font-semibold text-white">Your Available Time Slots</h2>
                    </div>
                    <button 
                      onClick={() => setShowAvailableSlotsModal(false)}
                      className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                  {isLoadingSlots ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
                        <Calendar className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">No Available Slots</h3>
                      <p className="text-gray-600 mb-6">You don't have any available time slots.</p>
                      <button
                        onClick={handleManageCalendar}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Add New Slots
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between mb-6">
                        <div>
                          <h3 className="text-lg font-medium text-gray-800">
                            {availableSlots.length} Available Slot{availableSlots.length !== 1 ? 's' : ''}
                          </h3>
                          <p className="text-sm text-gray-600">
                            These slots are visible to students and available for booking
                          </p>
                        </div>
                        <button
                          onClick={handleManageCalendar}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm flex items-center transition-colors"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add More Slots
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {availableSlots.map((slot) => {
                          const slotDate = new Date(slot.date);
                          return (
                            <div key={slot._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                              <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex items-center">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                      <span className="text-green-700 font-bold text-sm">
                                        {slotDate.getDate()}
                                      </span>
                                    </div>
                                    <div>
                                      <div className="font-medium text-gray-900">
                                        {slotDate.toLocaleDateString('en-US', { weekday: 'long' })}
                                      </div>
                                      <div className="text-sm text-gray-600">
                                        {slotDate.toLocaleDateString('en-US', { 
                                          month: 'long', 
                                          day: 'numeric',
                                          year: 'numeric'
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      Available
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="bg-gray-50 p-2 rounded-lg mt-3 flex items-center">
                                  <Clock className="w-4 h-4 text-gray-500 mr-2" />
                                  <span className="text-gray-700">{slot.startTime} - {slot.endTime}</span>
                                </div>
                                
                                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between">
                                  <div className="text-sm text-gray-500">
                                    ₹{slot.pricing?.expertFee || 0}
                                  </div>
                                  <button
                                    onClick={() => handleDeleteSlot(slot._id)}
                                    className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                                  >
                                    Delete Slot
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Protected Booking Component - Student Enrollment Statistics */}
            <div className="h-full">
              <ProtectedBooking />
            </div>
            
            {/* Total Earnings Card */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-[0.1px] border-[#00b6c4] cursor-pointer h-full" onClick={() => window.location.href='/expert/payments'}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Total Earnings</h3>
                <div className="bg-green-100 p-2 rounded-md">
                  <svg className="w-5 h-5 text-[#00b6c4]" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">₹{expertData.earnings?.total || 0}</div>
              <div className="mt-4 border-t border-gray-100 pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-xs text-gray-500">Courses</span>
                  <span className="text-xs font-medium">₹{expertData.analytics?.courses?.earnings || 0}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs text-gray-500">Sessions</span>
                  <span className="text-xs font-medium">₹{expertData.analytics?.sessions?.earnings || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Cohorts</span>
                  <span className="text-xs font-medium">₹{expertData.analytics?.cohorts?.earnings || 0}</span>
                </div>
              </div>
            </div>
            
            {/* Ratings Card */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-[0.1px] border-blue-800 h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Your Ratings</h3>
                <div className="bg-yellow-100 p-2 rounded-md">
                  <svg className="w-5 h-5 text-blue-800" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976-2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                  </svg>
                </div>
              </div>
              {isLoadingRatings ? (
                <div className="flex justify-center items-center h-24">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-800"></div>
                </div>
              ) : (
                <>
                  <div className="flex items-center mb-3">
                    <div className="text-3xl font-bold text-gray-900 mr-2">{ratings.overall}</div>
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, index) => (
                        <svg key={index} className={`w-4 h-4 ${index < Math.floor(ratings.overall) ? 'text-yellow-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8-2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-600">
                      <span className="text-gray-800 font-medium">{ratings.overall}</span> Your Rating
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="text-gray-800 font-medium">{ratings.count}</span> Total Reviews
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="w-full h-2 bg-gray-200 rounded-full mb-2">
                      <div className="h-2 bg-blue-900 rounded-full" style={{ width: `${(ratings.overall / 5) * 100}%` }}></div>
                    </div>
                    <Link to="/analytics/ratings" className="text-xs text-blue-800 hover:text-yellow-800 font-medium transition-colors duration-300">
                      View detailed ratings
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Admin Access Button - Only visible for admin users - Moved to lower position */}
        {expertData.isAdmin && (
          <section className="mb-8">
            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-white/20 p-2 rounded-lg mr-3">
                    <svg className="w-6 h-6 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">Admin Access</h3>
                    <p className="text-white/90 text-sm">You have administrative privileges</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/admin')}
                  className="bg-white text-red-600 hover:bg-red-50 font-semibold py-2 px-6 rounded-lg transition-colors duration-300 flex items-center shadow-md"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  Go to Admin Dashboard
                </button>
              </div>
            </div>
          </section>
        )}
        </main>

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

      {/* Session Details Modal */}
      <SessionDetailsModal 
        isOpen={showSessionDetailsModal}
        onClose={() => setShowSessionDetailsModal(false)}
        session={selectedSession}
      />

      {/* Footer */}
      <Footer />
    </div>
    // {/* </ExpertApprovalCheck> */}
  );
}

export default ExpertDashboard;