import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Users, Video, Book, GraduationCap, Clock } from "lucide-react";
import axiosInstance from '../config/axios.config';
import useUserStore from '../store/userStore';
import useUserTypeStore from '../store/userTypeStore';
import Header from '../components/layout/Header';
import { Button } from "../components/ui/button";
import FeedbackModal from "../components/modals/FeedbackModal";
import checkAuth from '../utils/checkAuth';

// TabIndicator component
const TabIndicator = ({ active, label, icon, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl transition-all duration-300 ${
      active
        ? "bg-blue-800 text-white shadow-md"
        : "text-gray-600 hover:bg-gray-100"
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </motion.button>
);

function StudentBookingsPage() {
  const [activeTab, setActiveTab] = useState('cohorts');
  const [cohorts, setCohorts] = useState([]);
  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sessionType, setSessionType] = useState('upcoming');
  const [courseType, setCourseType] = useState('live');
  const [cohortType, setCohortType] = useState('live');
  const [selectedSession, setSelectedSession] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const { user } = useUserStore();
  const { userType, setUserType } = useUserTypeStore();
  const navigate = useNavigate();
  const [authData, setAuthData] = useState(null);

  useEffect(() => {
    const handleAuth = async () => {
      const data = await checkAuth(setUserType, setLoading);
      setAuthData(data);
    };
    handleAuth();
  }, [setUserType]);

  useEffect(() => {
    if (authData) {
      if (userType === "not_signed_in") {
        navigate("/signup");
        return;
      } else if (userType !== "student") {
        navigate("/dashboard");
        return;
      }
      fetchBookings();
    }
  }, [userType, navigate, authData]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const [cohortsRes, coursesRes, sessionsRes] = await Promise.all([
        axiosInstance.get('/user/cohorts'),
        axiosInstance.get('/user/courses'),
        axiosInstance.get('/user/sessions')
      ]);

      setCohorts(cohortsRes.data || []);
      setCourses(coursesRes.data || []);
      setSessions(sessionsRes.data || []);
      console.log(sessions)
      
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter sessions based on date
  const filterSessions = (type) => {
    const currentDate = new Date();
    return sessions.filter(session => {
      // Parse date properly from ISO format
      const sessionDate = new Date(session.date);
      // Extract hours and minutes from time string (assuming format like "14:30")
      const [hours, minutes] = session.startTime.split(':').map(Number);
      // Set the time on the date object
      sessionDate.setHours(hours, minutes, 0, 0);
      
      return type === 'upcoming' 
        ? sessionDate > currentDate 
        : sessionDate <= currentDate;
    });
  };

  // Filter courses based on activityStatus
  const filterCourses = (type) => {
    return courses.filter(course => course.activityStatus === type);
  };

  // Filter cohorts based on type
  const filterCohorts = (type) => {
    const currentDate = new Date();
    return cohorts.filter(cohort => {
      const startDate = new Date(cohort.startDate);
      const endDate = new Date(cohort.endDate);
      
      switch(type) {
        case 'upcoming':
          return startDate > currentDate;
        case 'live':
          return startDate <= currentDate && endDate >= currentDate;
        case 'past':
          return endDate < currentDate;
        default:
          return true;
      }
    });
  };

  const handleFeedback = (item) => {
    if (!item._id) return;
    
    let feedback = null;
    if (activeTab === 'courses') {
      feedback = item.feedback;
    } else if (activeTab === 'cohorts') {
      // For cohorts, get the feedback object directly since it's already filtered for the user
      feedback = item.feedback;
    } else {
      feedback = item.feedback || null;
    }

    setSelectedSession({
      _id: item._id,
      feedback,
      type: activeTab,
      studentName: item.studentName
    });
    setShowFeedbackModal(true);
  };

  const handleCloseFeedbackModal = () => {
    setShowFeedbackModal(false);
    setSelectedSession(null);
    // Refresh data after feedback submission
    fetchBookings();
  };

  const hasUserGivenFeedback = (item) => {
    if (!item) return false;

    if (activeTab === 'sessions') {
      return Boolean(item.feedback && item.feedback.rating > 0);
    } else if (activeTab === 'courses' || activeTab === 'cohorts') {
      return Array.isArray(item.feedback) && item.feedback.length > 0;
    }
    return false;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  if (loading || !authData) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </>
    );
  }

  const renderContent = () => {
    const currentItems = {
      cohorts: filterCohorts(cohortType),
      courses: filterCourses(courseType),
      sessions: filterSessions(sessionType)
    }[activeTab];

    if (!currentItems || currentItems.length === 0) {
      return (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 bg-white rounded-3xl shadow-lg p-12"
        >
          <div className="text-gray-400 text-8xl mb-6 animate-bounce">🔍</div>
          <h3 className="text-3xl font-bold text-gray-700 mb-4">No {activeTab === 'sessions' ? `${sessionType} sessions` : activeTab} found</h3>
          <p className="text-gray-500 text-lg mb-8">You haven't enrolled in any {activeTab === 'sessions' ? `${sessionType} sessions` : activeTab} yet.</p>
          <Button 
            onClick={() => navigate('/all-courses')}
            className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-full px-8 py-6 text-lg hover:shadow-lg hover:shadow-blue-200 transition-all"
          >
            Explore {activeTab}
          </Button>
        </motion.div>
      );
    }

    return (
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {currentItems.map(item => (
          <motion.div
            key={item._id}
            variants={itemVariants}
            className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
              <img 
                src={item.image || "/placeholder.jpg"} 
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-[#003265] mb-3">{item.title}</h3>
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                {activeTab === 'sessions' ? (
                  <>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>
                        {new Date(item.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{item.startTime} - {item.endTime}</span>
                    </div>
                  </>
                ) : activeTab === 'cohorts' ? (
                  <>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="flex gap-2">
                        <span>Start: {new Date(item.startDate).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>End: {new Date(item.endDate).toLocaleDateString()}</span>
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>
                      {new Date(item.publishingDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
              {activeTab === 'sessions' ? (
                <div className="flex flex-col text-sm text-gray-600 mb-6">
                  <div className="font-medium">{item.expertName}</div>
                  <div className="text-gray-500">{item.expertTitle}</div>
                </div>
              ) : activeTab === 'courses' ? (
                <div className="flex flex-col text-sm text-gray-600 mb-6">
                  <div className="font-medium">{item.expertName}</div>
                  <div className="text-gray-500">{item.expertTitle}</div>
                </div>
              ) : activeTab === 'cohorts' ? (
                <div className="flex flex-col text-sm text-gray-600 mb-6">
                  <div className="font-medium">{item.expertName}</div>
                  <div className="text-gray-500">{item.expertTitle}</div>
                </div>
              ) : (
                <div className="flex items-center text-sm text-gray-600 mb-6">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{item.enrolledCount || '0'} students enrolled</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                {activeTab === 'sessions' ? (
                  sessionType === 'upcoming' ? (
                    <Button 
                      onClick={() => window.open(item.meetLink, '_blank')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 py-2"
                    >
                      <Video className="w-4 h-4" />
                      Join Session
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handleFeedback(item)}
                      className={`w-full ${
                        hasUserGivenFeedback(item) 
                          ? 'bg-amber-100 hover:bg-amber-200 text-amber-700' 
                          : 'bg-amber-500 hover:bg-amber-600 text-white'
                      } rounded-lg flex items-center justify-center gap-2 py-2`}
                    >
                      {hasUserGivenFeedback(item) ? 'View Feedback' : 'Give Feedback'}
                    </Button>
                  )
                ) : activeTab === 'courses' ? (
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => window.open(item.driveLink, '_blank')}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 py-2"
                    >
                      <Book className="w-4 h-4" />
                      Access Course
                    </Button>
                    {item._id && (
                      <Button 
                        onClick={() => handleFeedback(item)}
                        className={`flex-1 ${
                          hasUserGivenFeedback(item)
                            ? 'bg-amber-100 hover:bg-amber-200 text-amber-700' 
                            : 'bg-amber-500 hover:bg-amber-600 text-white'
                        } rounded-lg flex items-center justify-center gap-2 py-2`}
                      >
                        {hasUserGivenFeedback(item) ? 'View Feedback' : 'Add Feedback'}
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => window.open(item.meetLink, '_blank')}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 py-2"
                    >
                      <GraduationCap className="w-4 h-4" />
                      Join Cohort
                    </Button>
                    {(cohortType === 'live' || cohortType === 'past') && (
                      <Button 
                        onClick={() => handleFeedback(item)}
                        className={`flex-1 ${
                          hasUserGivenFeedback(item)
                            ? 'bg-amber-100 hover:bg-amber-200 text-amber-700' 
                            : 'bg-amber-500 hover:bg-amber-600 text-white'
                        } rounded-lg flex items-center justify-center gap-2 py-2`}
                      >
                        {hasUserGivenFeedback(item) ? 'View Feedback' : 'Add Feedback'}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    );
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto p-6 pt-[120px]">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-12">
            <div className="mb-6 sm:mb-0">
              <span className="text-blue-600 font-semibold mb-2 block">My Learning Journey</span>
              <h1 className="text-4xl font-bold text-[#0a2540]">My Bookings</h1>
            </div>
            <div className="w-32 h-32 relative">
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
              <img 
                src={user?.avatar || "/hello--users-people-hello.png"}
                alt="Profile"
                className="object-contain w-full h-full relative z-10" 
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-2 mb-16 flex w-full max-w-md mx-auto">
            <TabIndicator 
              active={activeTab === 'cohorts'} 
              label="Cohorts"
              icon={<GraduationCap className="w-5 h-5" />}
              onClick={() => setActiveTab('cohorts')}
            />
            <TabIndicator 
              active={activeTab === 'courses'} 
              label="Courses"
              icon={<Book className="w-5 h-5" />}
              onClick={() => setActiveTab('courses')}
            />
            <TabIndicator 
              active={activeTab === 'sessions'} 
              label="Sessions"
              icon={<Video className="w-5 h-5" />}
              onClick={() => setActiveTab('sessions')}
            />
          </div>

          {activeTab === 'sessions' && (
            <div className="bg-white rounded-xl p-2 mb-8 flex w-full max-w-[300px] mx-auto">
              <TabIndicator 
                active={sessionType === 'upcoming'} 
                label="Upcoming"
                icon={<Calendar className="w-4 h-4" />}
                onClick={() => setSessionType('upcoming')}
              />
              <TabIndicator 
                active={sessionType === 'past'} 
                label="Past"
                icon={<Clock className="w-4 h-4" />}
                onClick={() => setSessionType('past')}
              />
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="bg-white rounded-xl p-2 mb-8 flex w-full max-w-[300px] mx-auto">
              <TabIndicator 
                active={courseType === 'live'} 
                label="Live"
                icon={<Book className="w-4 h-4" />}
                onClick={() => setCourseType('live')}
              />
              <TabIndicator 
                active={courseType === 'completed'} 
                label="Past"
                icon={<Clock className="w-4 h-4" />}
                onClick={() => setCourseType('completed')}
              />
            </div>
          )}

          {activeTab === 'cohorts' && (
            <div className="bg-white rounded-xl p-2 mb-8 flex w-full max-w-[400px] mx-auto">
              <TabIndicator 
                active={cohortType === 'upcoming'} 
                label="Upcoming"
                icon={<Calendar className="w-4 h-4" />}
                onClick={() => setCohortType('upcoming')}
              />
              <TabIndicator 
                active={cohortType === 'live'} 
                label="Live"
                icon={<Book className="w-4 h-4" />}
                onClick={() => setCohortType('live')}
              />
              <TabIndicator 
                active={cohortType === 'past'} 
                label="Past"
                icon={<Clock className="w-4 h-4" />}
                onClick={() => setCohortType('past')}
              />
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTab}-${sessionType}-${courseType}-${cohortType}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>

          <FeedbackModal 
            isOpen={showFeedbackModal}
            onClose={handleCloseFeedbackModal}
            session={selectedSession}
          />
        </div>
      </div>
    </>
  );
};

export default StudentBookingsPage;