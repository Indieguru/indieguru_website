import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/button";
import { Calendar, Clock, Users, Award, ArrowRight, Link as LinkIcon, Video, Book, GraduationCap, MessageSquare, X, Star, AlertTriangle, CheckCircle2, Download, Eye, XCircle } from "lucide-react";
import Header from "../components/layout/Header";
import useExpertSessionsStore from '../store/expertSessionsStore';
import useExpertCohortsStore from '../store/expertCohortsStore';
import useExpertCoursesStore from '../store/expertCoursesStore';
import useExpertStore from '../store/expertStore';
import { toast } from "react-toastify";
import FeedbackModal from "../components/modals/FeedbackModal";
import RejectionReasonModal from "../components/modals/RejectionReasonModal";
import SessionNotesModal from '../components/modals/SessionNotesModal';
import axiosInstance from "../config/axios.config";

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

const BookingsPage = () => {
  const [activeTab, setActiveTab] = useState("sessions");
  const [sessionType, setSessionType] = useState("upcoming");
  const [cohortType, setCohortType] = useState("live");
  const [courseType, setCourseType] = useState("live");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [selectedCohort, setSelectedCohort] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedSessionForNotes, setSelectedSessionForNotes] = useState(null);
  const [showFilePreviewModal, setShowFilePreviewModal] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const { sessions, fetchExpertSessions, isLoading: isLoadingSessions } = useExpertSessionsStore();
  const { cohorts, fetchExpertCohorts, isLoading: isLoadingCohorts } = useExpertCohortsStore();
  const { courses, fetchExpertCourses, isLoading: isLoadingCourses } = useExpertCoursesStore();
  const { expertData, fetchExpertData, isLoading: isLoadingExpert } = useExpertStore();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        await Promise.all([
          fetchExpertSessions(),
          fetchExpertCohorts(),
          fetchExpertCourses(),
          fetchExpertData()
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchAllData();
  }, [fetchExpertSessions, fetchExpertCohorts, fetchExpertCourses, fetchExpertData]);

  if (isLoadingSessions || isLoadingCohorts || isLoadingCourses || isLoadingExpert) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const filterSessions = (type) => {
    const currentDate = new Date();
    return sessions.filter(session => {
      const sessionDate = new Date(session.date);
      switch(type) {
        case 'upcoming':
          return sessionDate > currentDate && session.status !== 'cancelled' && session.bookedStatus === true;
        case 'completed':
          return session.status === 'completed';
        case 'past':
          return sessionDate <= currentDate && session.status !== 'completed' && session.status !== 'cancelled';
        case 'cancelled':
          return session.status === 'cancelled';
        default:
          return true;
      }
    });
  };

  const filterCohorts = (type) => {
    const currentDate = new Date();
    return cohorts.filter(cohort => {
      const startDate = new Date(cohort.startDate);
      const endDate = new Date(cohort.endDate);
      
      switch(type) {
        case 'upcoming':
          return startDate > currentDate;
        case 'live':
          return startDate <= currentDate && endDate >= currentDate ;
        case 'past':
          return endDate < currentDate ;
        default:
          return true;
      }
    });
  };

  const filterCourses = (type) => {
    return courses.filter(course => course.activityStatus === type);
  };

  const handleViewFeedback = (session) => {
    setSelectedSession({
      _id: session._id,
      feedback: session.feedback,
      type: 'sessions',
      studentName: session.studentName
    });
    setShowFeedbackModal(true);
  };

  const handleCloseFeedbackModal = () => {
    setShowFeedbackModal(false);
    setSelectedSession(null);
    fetchExpertSessions();
  };

  const handleCompleteSession = async (formData) => {
    try {
      await axiosInstance.post(`/session/${selectedSessionForNotes._id}/complete`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Session completed successfully');
      fetchExpertSessions();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to complete session');
    }
  };

  const CourseCard = ({ course }) => {
    const handleLinkClick = (url) => {
      if (!url) {
        toast.error('Course link not available');
        return;
      }
      window.open(url, '_blank');
    };

    const handleMarkCompleted = async () => {
      try {
        await axiosInstance.post(`/course/${course._id}/complete`);
        toast.success('Course marked as completed');
        window.location.reload();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to mark course as completed');
      }
    };

    const handleViewRejection = () => {
      setSelectedCourse(course);
      setShowRejectionModal(true);
    };

    const getStatusColor = (status) => {
      switch(status) {
        case 'approved': return 'bg-green-100 text-green-700';
        case 'rejected': return 'bg-red-100 text-red-700';
        default: return 'bg-yellow-100 text-yellow-700';
      }
    };

    const averageRating = course.feedback?.length > 0 
      ? (course.feedback.reduce((acc, curr) => acc + curr.rating, 0) / course.feedback.length).toFixed(1)
      : null;

    return (
      <motion.div
        variants={itemVariants}
        whileHover={{ y: -8, transition: { duration: 0.2 } }}
        className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
      >
        <div className="relative h-48" style={{ backgroundColor: course.color || "#00b6c4" }}>
          <img src={course.image || "/rectangle-2749.png"} alt={course.title} className="w-full h-full object-contain" />
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(course.status)}`}>
              {course.status}
            </span>
            {averageRating && (
              <div className="bg-white/90 backdrop-blur-sm text-amber-500 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <Star className="w-4 h-4 fill-current" />
                <span>{averageRating}</span>
              </div>
            )}
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-[#003265] mb-3 group-hover:text-blue-600 transition-colors">
            {course.title}
          </h3>
          <p className="text-sm text-gray-600 flex items-center mb-2">
            <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
              {(expertData?.name || "E").charAt(0)}
            </span>
            {expertData?.name || "Expert Instructor"}
          </p>
          
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <Users className="w-4 h-4 mr-2" />
            <span>{(course.purchasedBy || []).length} students enrolled</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-[#003265]">
                ₹{ course.pricing?.expertFee || 0}
              </span>
            </div>
            <div className="flex gap-2">
              {course.status === 'rejected' ? (
                <Button 
                  onClick={handleViewRejection}
                  className="bg-red-100 hover:bg-red-200 text-red-700 rounded-full px-6 flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>View Reason</span>
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={() => handleLinkClick(course.driveLink)}
                    className="bg-blue-800 hover:bg-[#0a2540] text-white rounded-full px-6 flex items-center gap-2"
                  >
                    <LinkIcon className="w-4 h-4" />
                    <span>Access Course</span>
                  </Button>
                  {courseType === 'live' && (
                    <Button
                      onClick={handleMarkCompleted}
                      className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6 flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mark Completed</span>
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const SessionCard = ({ session }) => {
    const isPastSession = new Date(session.date) <= new Date();
    const isCompleted = session.status === 'completed';
    const isCancelled = session.status === 'cancelled';

    const handleCancel = async () => {
      try {
        await axiosInstance.post(`/session/${session._id}/cancel`);
        toast.success('Session cancelled successfully');
        // Refresh sessions
        fetchExpertSessions();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to cancel session');
      }
    };

    return (
      <motion.div
        variants={itemVariants}
        whileHover={{ y: -8, transition: { duration: 0.2 } }}
        className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
      >
        <div className="h-2 bg-gradient-to-r from-blue-900 to-indigo-900"></div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-[#003265] mb-3">{session.title}</h3>
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{new Date(session.date).toLocaleDateString()}</span>
            <Clock className="w-4 h-4 ml-4 mr-2" />
            <span>{session.startTime} - {session.endTime}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <Users className="w-4 h-4 mr-2" />
            <span>{session.studentName || "Student"}</span>
          </div>
          
          <div className="mt-auto space-y-3">
            {isCompleted && session.notes && (
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                {session.notes.text && (
                  <p className="text-sm text-gray-700 mb-2">{session.notes.text}</p>
                )}
                {session.notes.files && session.notes.files.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Uploaded Files:</h4>
                    {session.notes.files.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white p-2 rounded">
                        <span className="text-xs text-gray-600 truncate flex-1">
                          {file.name}
                        </span>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => {
                              setPreviewFile(file);
                              setShowFilePreviewModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 transition-colors p-1"
                            title="View file"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => window.open(file.url, '_blank')}
                            className="text-blue-600 hover:text-blue-800 transition-colors p-1"
                            title="Download file"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {isPastSession ? (
              <div className="space-y-3">
                {session.status !== 'completed' && session.status !== 'cancelled' ? (
                  <Button 
                    onClick={() => {
                      setSelectedSessionForNotes(session);
                      setShowNotesModal(true);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-3 flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Complete Session</span>
                  </Button>
                ) : null}
                <Button 
                  onClick={() => handleViewFeedback(session)}
                  className={`w-full ${
                    session.feedback?.rating > 0
                      ? 'bg-amber-500 hover:bg-amber-600' 
                      : 'bg-gray-400 hover:bg-gray-500'
                  } text-white rounded-full px-6 py-3 flex items-center justify-center gap-2`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{session.feedback?.rating > 0 ? 'View Feedback' : 'No Feedback'}</span>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Button 
                  onClick={() => window.open(session.meetLink, '_blank')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-3 flex items-center justify-center gap-2"
                >
                  <Video className="w-4 h-4" />
                  <span>Join Session</span>
                </Button>
                {!isCancelled && (
                  <Button 
                    onClick={handleCancel}
                    className="w-full bg-red-600 hover:bg-red-700 text-white rounded-full px-6 py-3 flex items-center justify-center gap-2 mt-3"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Cancel Session</span>
                  </Button>
                )}
                {isCancelled && (
                  <div className="mt-3 text-red-600 flex items-center justify-center gap-2">
                    <XCircle className="w-4 h-4" />
                    <span>Session Cancelled</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  const CohortCard = ({ cohort }) => {
    const handleLinkClick = (url) => {
      window.open(url, '_blank');
    };

    const handleViewRejection = () => {
      setSelectedCohort(cohort);
      setShowRejectionModal(true);
    };

    const getApprovalStatus = () => {
      switch(cohort.status) {
        case 'approved':
          return {
            bgColor: 'bg-emerald-100',
            textColor: 'text-emerald-700',
            label: 'Approved'
          };
        case 'pending':
          return {
            bgColor: 'bg-yellow-100',
            textColor: 'text-yellow-700',
            label: 'Pending'
          };
        case 'rejected':
          return {
            bgColor: 'bg-red-100',
            textColor: 'text-red-700',
            label: 'Rejected'
          };
        default:
          return null;
      }
    };

    const calculateAverageRating = () => {
      if (!cohort.feedback || cohort.feedback.length === 0) return null;
      const totalRating = cohort.feedback.reduce((sum, feedback) => sum + feedback.rating, 0);
      return (totalRating / cohort.feedback.length).toFixed(1);
    };

    const shouldShowRating = () => {
      const currentDate = new Date();
      const startDate = new Date(cohort.startDate);
      const endDate = new Date(cohort.endDate);
      return startDate <= currentDate;
    };

    const approvalStatus = getApprovalStatus();
    const averageRating = calculateAverageRating();

    return (
      <motion.div
        variants={itemVariants}
        whileHover={{ y: -8, transition: { duration: 0.2 } }}
        className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
      >
        <div className="relative h-48" style={{ backgroundColor: cohort.color || "#00b6c4" }}>
          <img src={cohort.image || "/rectangle-2749.png"} alt={cohort.title} className="w-full h-full object-contain" />
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            {approvalStatus && (
              <div className={`${approvalStatus.bgColor} ${approvalStatus.textColor} px-3 py-1 rounded-full text-sm font-medium`}>
                {approvalStatus.label}
              </div>
            )}
            {shouldShowRating() && averageRating && (
              <div className="bg-white/90 backdrop-blur-sm text-amber-500 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <Star className="w-4 h-4 fill-current" />
                <span>{averageRating}</span>
              </div>
            )}
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-[#003265] mb-3 group-hover:text-blue-600 transition-colors">
            {cohort.title}
          </h3>
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Starts: {new Date(cohort.startDate).toLocaleDateString()}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <Users className="w-4 h-4 mr-2" />
            <span>{(cohort.purchasedBy || []).length} students enrolled</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-[#003265]">
                ₹{cohort.pricing?.expertFee || 0}
              </span>
            </div>
            {cohort.status === 'rejected' ? (
              <Button 
                onClick={handleViewRejection}
                className="bg-red-100 hover:bg-red-200 text-red-700 rounded-full px-6 flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>View Reason</span>
              </Button>
            ) : (
              <Button 
                onClick={() => handleLinkClick(cohort.meetLink)}
                className="bg-blue-800 hover:bg-[#0a2540] text-white rounded-full px-6 flex items-center gap-2"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Join Cohort</span>
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  const CategorySection = ({ items, type }) => {
    if (!items || items.length === 0) return null;
    
    const filteredSessions = type === 'sessions' ? filterSessions(sessionType) : items;
    
    return (
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {type === 'sessions' ? (
          filteredSessions.map(session => (
            <SessionCard key={session._id} session={session} />
          ))
        ) : (
          items.map(item => {
            switch(type) {
              case "courses":
                return <CourseCard key={item._id} course={item} />;
              case "cohorts":
                return <CohortCard key={item._id} cohort={item} />;
              default:
                return null;
            }
          })
        )}
      </motion.div>
    );
  };

  const FilePreviewModal = ({ isOpen, onClose, file }) => {
    if (!isOpen) return null;

    const fileType = file?.name?.split('.').pop()?.toLowerCase();
    const isImage = fileType && ['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(fileType);
    const isCloudinaryUrl = file?.url?.includes('cloudinary.com');
    
    // Create embedded Google Docs viewer URL for non-image files
    const getEmbedUrl = (fileUrl) => {
      if (!isImage && isCloudinaryUrl) {
        // Ensure we're using HTTPS
        const secureUrl = fileUrl.replace('http://', 'https://');
        return `https://docs.google.com/gview?url=${encodeURIComponent(secureUrl)}&embedded=true`;
      }
      return null;
    };

    const embedUrl = getEmbedUrl(file?.url);

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">{file?.name}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4">
            {isImage ? (
              <img
                src={file?.url}
                alt={file?.name}
                className="max-w-full max-h-[600px] mx-auto object-contain"
              />
            ) : embedUrl ? (
              <iframe
                src={embedUrl}
                width="100%"
                height="600px"
                className="border-0"
                title={file?.name}
              />
            ) : (
              <div className="flex items-center justify-center min-h-[400px] bg-gray-50 rounded-lg">
                <a 
                  href={file?.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Open file in new tab
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto p-6 pt-[120px]"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between mb-12">
          <div className="mb-6 sm:mb-0">
            <span className="text-blue-600 font-semibold mb-2 block">My Dashboard</span>
            <h1 className="text-4xl sm:text-4xl font-bold text-[#0a2540] relative">
              My Bookings
            </h1>
          </div>
          <div className="w-32 h-32 relative">
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
            <img 
              src={expertData?.avatar || "/hello--users-people-hello.png"}
              alt="Expert"
              className="object-contain w-full h-full relative z-10" 
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-2 mb-8 flex w-full max-w-md mx-auto">
          <TabIndicator 
            active={activeTab === "sessions"} 
            label="Sessions" 
            icon={<Video className="w-5 h-5" />}
            onClick={() => setActiveTab("sessions")}
          />
          <TabIndicator 
            active={activeTab === "cohorts"} 
            label="Cohorts" 
            icon={<GraduationCap className="w-5 h-5" />}
            onClick={() => setActiveTab("cohorts")}
          />
          <TabIndicator 
            active={activeTab === "courses"} 
            label="Courses" 
            icon={<Book className="w-5 h-5" />}
            onClick={() => setActiveTab("courses")}
          />
        </div>

        {activeTab === "sessions" && (
          <div className="bg-white rounded-xl p-2 mb-8 flex w-full max-w-[500px] mx-auto">
            <TabIndicator 
              active={sessionType === "upcoming"} 
              label="Upcoming" 
              icon={<Calendar className="w-4 h-4" />}
              onClick={() => setSessionType("upcoming")}
            />
            <TabIndicator 
              active={sessionType === "completed"} 
              label="Completed" 
              icon={<CheckCircle2 className="w-4 h-4" />}
              onClick={() => setSessionType("completed")}
            />
            <TabIndicator 
              active={sessionType === "past"} 
              label="Past" 
              icon={<Clock className="w-4 h-4" />}
              onClick={() => setSessionType("past")}
            />
            <TabIndicator 
              active={sessionType === "cancelled"} 
              label="Cancelled" 
              icon={<XCircle className="w-4 h-4" />}
              onClick={() => setSessionType("cancelled")}
            />
          </div>
        )}

        {activeTab === "cohorts" && (
          <div className="bg-white rounded-xl p-2 mb-8 flex w-full max-w-[400px] mx-auto">
            <TabIndicator 
              active={cohortType === "upcoming"} 
              label="Upcoming" 
              icon={<Calendar className="w-4 h-4" />}
              onClick={() => setCohortType("upcoming")}
            />
            <TabIndicator 
              active={cohortType === "live"} 
              label="Live" 
              icon={<Video className="w-4 h-4" />}
              onClick={() => setCohortType("live")}
            />
            <TabIndicator 
              active={cohortType === "past"} 
              label="Past" 
              icon={<Clock className="w-4 h-4" />}
              onClick={() => setCohortType("past")}
            />
          </div>
        )}

        {activeTab === "courses" && (
          <div className="bg-white rounded-xl p-2 mb-8 flex w-full max-w-[300px] mx-auto">
            <TabIndicator 
              active={courseType === "live"} 
              label="Live"
              icon={<Book className="w-4 h-4" />}
              onClick={() => setCourseType("live")}
            />
            <TabIndicator 
              active={courseType === "completed"} 
              label="Completed"
              icon={<Clock className="w-4 h-4" />}
              onClick={() => setCourseType("completed")}
            />
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${sessionType}-${cohortType}-${courseType}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CategorySection 
              items={activeTab === "courses" ? filterCourses(courseType) :
                     activeTab === "cohorts" ? filterCohorts(cohortType) : 
                     filterSessions(sessionType)}
              type={activeTab}
            />

            {((activeTab === "sessions" && (!filterSessions(sessionType) || filterSessions(sessionType).length === 0)) ||
              (activeTab === "cohorts" && (!filterCohorts(cohortType) || filterCohorts(cohortType).length === 0)) ||
              (activeTab === "courses" && (!filterCourses(courseType) || filterCourses(courseType).length === 0))) && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 bg-white rounded-3xl shadow-lg p-12"
              >
                <div className="text-gray-400 text-8xl mb-6 animate-bounce">🔍</div>
                <h3 className="text-3xl font-bold text-gray-700 mb-4">
                  No {activeTab === "cohorts" ? cohortType : activeTab === "courses" ? courseType : sessionType} {activeTab} found
                </h3>
                <p className="text-gray-500 text-lg mb-8">
                  You don't have any {activeTab === "cohorts" ? cohortType : activeTab === "courses" ? courseType : sessionType} {activeTab} at the moment.
                </p>
                <Button className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-full px-8 py-6 text-lg hover:shadow-lg hover:shadow-blue-200 transition-all">
                  Create New {activeTab.slice(0, -1)}
                </Button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <FeedbackModal 
        isOpen={showFeedbackModal}
        onClose={handleCloseFeedbackModal}
        session={selectedSession}
      />

      <RejectionReasonModal
        isOpen={showRejectionModal}
        onClose={() => {
          setShowRejectionModal(false);
          setSelectedCohort(null);
          setSelectedCourse(null);
        }}
        reason={selectedCohort?.rejectionReason || selectedCourse?.rejectionReason}
      />

      <SessionNotesModal 
        isOpen={showNotesModal}
        onClose={() => {
          setShowNotesModal(false);
          setSelectedSessionForNotes(null);
        }}
        onSubmit={handleCompleteSession}
      />

      <FilePreviewModal
        isOpen={showFilePreviewModal}
        onClose={() => {
          setShowFilePreviewModal(false);
          setPreviewFile(null);
        }}
        file={previewFile}
      />
    </div>
  );
};

export default BookingsPage;