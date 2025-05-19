import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/button";
import { Calendar, Clock, Users, Award, ArrowRight, Link as LinkIcon, Video } from "lucide-react";
import Header from "../components/layout/Header";
import useExpertSessionsStore from '../store/expertSessionsStore';
import useExpertCohortsStore from '../store/expertCohortsStore';
import useExpertCoursesStore from '../store/expertCoursesStore';
import useExpertStore from '../store/expertStore';
import { useNavigate } from "react-router-dom";

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

const BookingsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upcoming");
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

  // Sort and filter data based on active tab
  const sortedData = {
    upcoming: {
      courses: courses.filter(course => {
        // For courses, consider them "upcoming" if they were published within the last 30 days
        const publishDate = new Date(course.publishingDate);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return publishDate >= thirtyDaysAgo;
      }),
      sessions: sessions.filter(session => new Date(session.date) > new Date()),
      cohorts: cohorts.filter(cohort => new Date(cohort.startDate) > new Date())
    },
    past: {
      courses: courses.filter(course => {
        const publishDate = new Date(course.publishingDate);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return publishDate < thirtyDaysAgo;
      }),
      sessions: sessions.filter(session => new Date(session.date) <= new Date()),
      cohorts: cohorts.filter(cohort => new Date(cohort.startDate) <= new Date())
    }
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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Course card component
  const CourseCard = ({ course }) => {
    const handleLinkClick = (url) => {
      window.open(url, '_blank');
    };

    return (
      <motion.div
        variants={itemVariants}
        whileHover={{ y: -8, transition: { duration: 0.2 } }}
        className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
      >
        <div className="relative h-48" style={{ backgroundColor: course.color || "#00b6c4" }}>
          <img src={course.image || "/rectangle-2749.png"} alt={course.title} className="w-full h-full object-contain" />
        </div>
        <div className="p-6">
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <Calendar className="w-4 h-4 mr-2" />
            {new Date(course.publishingDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
          <h3 className="text-xl font-bold text-[#003265] mb-3 group-hover:text-blue-600 transition-colors">
            {course.title}
          </h3>
          <p className="text-sm text-gray-600 mb-4 flex items-center">
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
                ₹{typeof course.pricing === 'object' ? course.pricing.total : course.pricing || 0}
              </span>
            </div>
            {new Date(course.publishingDate) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) ? (
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6 flex items-center gap-2 transform transition-transform group-hover:scale-105">
                <Award className="w-4 h-4" />
                <span>Certificate</span>
              </Button>
            ) : (
              <Button 
                onClick={() => handleLinkClick(course.driveLink)}
                className="bg-blue-800 hover:bg-[#0a2540] text-white rounded-full px-6 flex items-center gap-2 transform transition-transform group-hover:scale-105"
              >
                <LinkIcon className="w-4 h-4" />
                <span>Access Course</span>
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  // Cohort card component
  const CohortCard = ({ cohort }) => {
    const handleLinkClick = (url) => {
      window.open(url, '_blank');
    };

    return (
      <motion.div
        variants={itemVariants}
        whileHover={{ y: -8, transition: { duration: 0.2 } }}
        className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
      >
        <div className="relative h-48" style={{ backgroundColor: cohort.color || "#00b6c4" }}>
          <img src={cohort.image || "/rectangle-2749.png"} alt={cohort.title} className="w-full h-full object-contain" />
        </div>
        <div className="p-6">
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <Calendar className="w-4 h-4 mr-2" />
            {new Date(cohort.startDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
          <h3 className="text-xl font-bold text-[#003265] mb-3 group-hover:text-blue-600 transition-colors">
            {cohort.title}
          </h3>
          <p className="text-sm text-gray-600 mb-4 flex items-center">
            <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
              {(expertData?.name || "E").charAt(0)}
            </span>
            {expertData?.name || "Expert Instructor"}
          </p>
          
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <Users className="w-4 h-4 mr-2" />
            <span>{(cohort.purchasedBy || []).length} students enrolled</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-[#003265]">
                ₹{cohort.pricing || 0}
              </span>
            </div>
            <Button 
              onClick={() => handleLinkClick(cohort.meetLink)}
              className="bg-blue-800 hover:bg-[#0a2540] text-white rounded-full px-6 flex items-center gap-2 transform transition-transform group-hover:scale-105"
            >
              <Video className="w-4 h-4" />
              <span>Join Meeting</span>
            </Button>
          </div>
        </div>
      </motion.div>
    );
  };

  // CategorySection component with type-specific card rendering
  const CategorySection = ({ title, items, type = "course" }) => {
    if (!items || items.length === 0) return null;
    
    return (
      <div className="mb-16">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-2xl font-bold text-[#003265] relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-1 after:bg-blue-500 after:rounded-full pb-2">
            {title}
          </h2>
          <div className="h-0.5 flex-grow bg-gradient-to-r from-blue-200 to-transparent rounded-full"></div>
        </div>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {items.map((item) => (
            type === "cohort" ? 
              <CohortCard key={item._id || item.id} cohort={item} /> :
              <CourseCard key={item._id || item.id} course={item} />
          ))}
        </motion.div>
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
            <span className="text-blue-600 font-semibold mb-2 block">My Learning Journey</span>
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

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-xl p-2 mb-16 flex w-full max-w-md mx-auto">
          <TabIndicator 
            active={activeTab === "upcoming"} 
            label="Upcoming" 
            icon={<Calendar className="w-5 h-5" />}
            onClick={() => handleTabChange("upcoming")}
          />
          <TabIndicator 
            active={activeTab === "past"} 
            label="Past" 
            icon={<Clock className="w-5 h-5" />}
            onClick={() => handleTabChange("past")}
          />
        </div>

        {/* Content Sections */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CategorySection 
              title="Courses" 
              items={sortedData[activeTab].courses}
              type="course"
            />
            
            <CategorySection 
              title="Sessions" 
              items={sortedData[activeTab].sessions}
              type="session"
            />
            
            <CategorySection 
              title="Cohorts" 
              items={sortedData[activeTab].cohorts}
              type="cohort"
            />

            {/* Empty state if no content */}
            {Object.values(sortedData[activeTab]).every(arr => !arr || arr.length === 0) && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 bg-white rounded-3xl shadow-lg p-12"
              >
                <div className="text-gray-400 text-8xl mb-6 animate-bounce">🔍</div>
                <h3 className="text-3xl font-bold text-gray-700 mb-4">No bookings found</h3>
                <p className="text-gray-500 text-lg mb-8">You don't have any {activeTab} bookings at the moment.</p>
                <div className="flex justify-center">
                  <Button 
                    onClick={() => navigate('/all-courses')}
                    className="bg-blue-800 text-white rounded-md px-8 py-3 text-lg font-medium hover:bg-blue-900 flex items-center gap-3"
                  >
                    <span>Explore Courses</span>
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default BookingsPage;