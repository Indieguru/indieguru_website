// filepath: /Users/shouryagupta/Desktop/coding/Indieguru_final/IndieGuru_website/frontend/src/pages/AllCoursesPage.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/button";
import { Users, ArrowRight, Calendar } from "lucide-react";
import Header from "../components/layout/Header";
import { Modal } from "../components/modals/modal";
import { BookingModal } from "../components/modals/BookingModal";
import useAuthStore from "../store/authStore";
import useUserTypeStore from "../store/userTypeStore";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../config/axios.config";
import ExpertSearch from '../components/expert/ExpertSearch';

// Animation variants defined at the top level
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

const TabButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
      active
        ? "bg-blue-800 text-white shadow-lg"
        : "text-gray-700 hover:bg-gray-100"
    }`}
  >
    {label}
  </button>
);

const CourseCard = ({ item, onEnroll }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ y: -8, transition: { duration: 0.2 } }}
    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
  >
    <div className="relative h-48" style={{ backgroundColor: item.color }}>
      <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
    </div>
    <div className="p-6">
      <div className="flex items-center text-sm text-gray-500 mb-3">
        <Calendar className="w-4 h-4 mr-2" />
        {item.date}
      </div>
      <h3 className="text-xl font-bold text-[#003265] mb-3 group-hover:text-blue-600 transition-colors">
        {item.title}
      </h3>
      <p className="text-sm text-gray-600 mb-6">
        {item.instructor}
      </p>
      
      <div className="flex justify-between items-center">
        <div className="flex items-baseline">
          <span className="text-2xl font-bold text-[#003265]">₹{item.price}</span>
          {item.originalPrice && (
            <span className="ml-2 text-gray-400 line-through text-sm">₹{item.originalPrice}</span>
          )}
        </div>
        <Button 
          onClick={() => onEnroll(item)}
          className="bg-blue-700 hover:bg-blue-800 text-white rounded-full px-6 py-2.5 flex items-center gap-2 shadow-md font-medium transition-all duration-200"
        >
          <span>Enroll Now</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  </motion.div>
);

const CohortCard = ({ item, onJoin }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ y: -8, transition: { duration: 0.2 } }}
    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
  >
    <div className="relative h-48" style={{ backgroundColor: item.color }}>
      <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
    </div>
    <div className="p-6">
      <div className="flex items-center text-sm text-gray-500 mb-3">
        <Calendar className="w-4 h-4 mr-2" />
        {item.date}
      </div>
      <h3 className="text-xl font-bold text-[#003265] mb-3 group-hover:text-blue-600 transition-colors">
        {item.title}
      </h3>
      <p className="text-sm text-gray-600 mb-6">
        {item.instructor}
      </p>
      
      <div className="flex justify-between items-center">
        <div className="flex items-baseline">
          <span className="text-2xl font-bold text-[#003265]">₹{item.price}</span>
        </div>
        <Button 
          onClick={() => onJoin(item)}
          className="bg-indigo-900 hover:bg-indigo-800 text-white rounded-full px-6 py-2.5 flex items-center gap-2 shadow-md font-medium transition-all duration-200"
        >
          <span>Join Cohort</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  </motion.div>
);

const AllCoursesPage = () => {
  const navigate = useNavigate();
  const { fetchIsAuthenticated } = useAuthStore();
  const { userType } = useUserTypeStore();
  const isAuthenticated = userType !== "not_signed_in";
  const [activeTab, setActiveTab] = useState("courses");
  const [searchTerm, setSearchTerm] = useState(""); // Add search state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchIsAuthenticated();
  }, [fetchIsAuthenticated]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [coursesRes, cohortsRes] = await Promise.all([
          axiosInstance.get('/course'),
          axiosInstance.get('/cohort')
        ]);

        if (coursesRes.data && Array.isArray(coursesRes.data)) {
          const transformedCourses = coursesRes.data.map(course => ({
            id: course._id,
            title: course.title,
            instructor: course.expertName,
            date: new Date(course.publishingDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            price: course.pricing?.total || 0,
            originalPrice: course.pricing?.total ? course.pricing.total * 1.2 : 0,
            image: "/rectangle-2749.png",
            color: "#00b6c4",
            driveLink: course.driveLink
          }));
          setCourses(transformedCourses);
        }

        if (cohortsRes.data && Array.isArray(cohortsRes.data)) {
          const transformedCohorts = cohortsRes.data
            .filter(cohort => cohort.activityStatus === 'live')
            .map(cohort => ({
              id: cohort._id,
              title: cohort.title,
              instructor: cohort.expertName,
              date: `${new Date(cohort.startDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })} - ${new Date(cohort.endDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}`,
              price: cohort.pricing?.total || 0,
              originalPrice: cohort.pricing?.total ? Math.floor(cohort.pricing.total * 1.2) : 0,
              image: "/rectangle-2749.png",
              color: "#ffffff",
              meetLink: cohort.meetLink,
              expertName: cohort.expertName,
              expertTitle: cohort.expertTitle,
              pricing: cohort.pricing // Pass full pricing object for future use
            }));
          setCohorts(transformedCohorts);
        }

        setSessions([]); // Sessions are handled by ExpertSearch
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEnrollClick = (item, type = "course") => {
    if (type === "course") {
      navigate(`/course/${item.id}`);
    } else if (type === "cohort") {
      navigate(`/cohort/${item.id}`);
    } else if (type === "session") {
      setSelectedCourse(item);
      setIsBookingModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsBookingModalOpen(false);
  };

  const filterCourses = (items, search) => {
    if (!search) return items;
    return items.filter(item => 
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.instructor?.toLowerCase().includes(search.toLowerCase())
    );
  };

  const CategorySection = ({ title, items, type = "course" }) => {
    if (!items || items.length === 0) return null;
    
    if (type === "session") {
      return <ExpertSearch />;
    }

    const filteredItems = filterCourses(items, searchTerm);

    return (
      <div className="mb-16">
        {type === "course" && (
          <div className="mb-8">
            <div className="relative max-w-md mx-auto">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search courses by title or instructor..."
                className="w-full px-4 py-3 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-2xl font-bold text-[#003265] relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-1 after:bg-blue-500 after:rounded-full pb-2">
            {title}
          </h2>
          <div className="h-0.5 flex-grow bg-gradient-to-r from-blue-200 to-transparent rounded-full"></div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-500">
              Try adjusting your search terms
            </p>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredItems.map((item) => (
              type === "course" ? (
                <CourseCard 
                  key={item.id} 
                  item={item} 
                  onEnroll={() => handleEnrollClick(item, "course")} 
                />
              ) : (
                <CohortCard 
                  key={item.id} 
                  item={item} 
                  onJoin={() => handleEnrollClick(item, "cohort")} 
                />
              )
            ))}
          </motion.div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </>
    );
  }

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
            <h1 className="text-4xl sm:text-5xl font-bold text-[#0a2540] mb-4">
              Explore Learning Opportunities
            </h1>
            <p className="text-gray-600 text-lg">
              Discover courses, sessions, and cohorts tailored to your learning journey
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-3 mb-16 flex gap-2 w-full max-w-sm mx-auto">
          <TabButton 
            active={activeTab === "courses"} 
            label="Courses" 
            onClick={() => setActiveTab("courses")}
          />
          <TabButton 
            active={activeTab === "sessions"} 
            label="Sessions" 
            onClick={() => setActiveTab("sessions")}
          />
          <TabButton 
            active={activeTab === "cohorts"} 
            label="Cohorts" 
            onClick={() => setActiveTab("cohorts")}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "courses" && (
              <CategorySection title="All Courses" items={courses} />
            )}
            {activeTab === "sessions" && <ExpertSearch />}
            {activeTab === "cohorts" && (
              <CategorySection title="All Cohorts" items={cohorts} type="cohort" />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AllCoursesPage;
