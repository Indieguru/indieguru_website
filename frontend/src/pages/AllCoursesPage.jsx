// filepath: /Users/shouryagupta/Desktop/coding/Indieguru_final/IndieGuru_website/frontend/src/pages/AllCoursesPage.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/button";
import { Users, ArrowRight, Calendar, X, Filter } from "lucide-react";
import Header from "../components/layout/Header";
import LoadingScreen from "../components/common/LoadingScreen";
import { Modal } from "../components/modals/modal";
import { BookingModal } from "../components/modals/BookingModal";
import useAuthStore from "../store/authStore";
import useUserTypeStore from "../store/userTypeStore";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "../config/axios.config";
import ExpertSearch from '../components/expert/ExpertSearch';
import AdvancedExpertiseSearch from '../components/expert/AdvancedExpertiseSearch';

// Expertise options list
const EXPERTISE_OPTIONS = [
  "Software Development",
  "AI/ML",
  "Data Science",
  "Cybersecurity",
  "Cloud Computing & DevOps",
  "Product Management",
  "Psychology & Therapy",
  "Business Analysis",
  "Strategy & Operations",
  "Data Analysis",
  "Chartered Accountancy (CA)",
  "CFA",
  "Investment Banking",
  "Financial Planning & Analysis",
  "FinTech Roles",
  "Corporate & Criminal Law",
  "Company Secretary",
  "Digital Marketing",
  "SEO",
  "Graphic Designing",
  "PR & Corporate Communication",
  "Content Writing & Copywriting",
  "Growth Marketing",
  "Industrial Design",
  "Robotics & Mechatronics",
  "UI/UX & Interaction Design",
  "Fashion Design",
  "Interior & Spatial Design",
  "Animation & Illustration",
  "Fine Arts & Applied Arts",
  "Architecture",
  "Public Policy & Governance",
  "Exam Prep Mentorship -UPSC",
  "Exam Prep Mentorship- CUET",
  "Exam Prep Mentorship - NET",
  "Exam Prep Mentorship - JEE",
  "Exam Prep Mentorship - GMAT/GRE",
  "Exam Prep Mentorship - Banking and other govt exams",
  "Exam Prep Mentorship - NET/JRF",
  "Journalism (Print & Digital)",
  "Content Creation (YouTube, Podcasting)",
  "Film & Video Production",
  "Advertising & Copywriting",
  "OTT & New Media",
  "Business Growth",
  "Program Management",
  "Hotel Management",
  "Culinary Arts & Bakery",
  "Tourism & Travel",
  "Aviation & Cabin Crew",
  "Event Management",
  "Make Up Artist",
  "Dietitian/ Nutrition",
  "Fitness Training",
  "Career Discovery/ Career Councelling",
  "Study Abroad Guidance",
  "Soft Skills & Interview Prep",
  "Resume Building & LinkedIn & Job search",
  "PHD admission mentorship",
  "Stream Selection"
];

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

const ExpertiseFilterModal = ({ isOpen, onClose, selectedExpertise, onExpertiseChange }) => {
  if (!isOpen) return null;

  const handleExpertiseToggle = (expertise) => {
    const newSelection = selectedExpertise.includes(expertise)
      ? selectedExpertise.filter(item => item !== expertise)
      : [...selectedExpertise, expertise];
    onExpertiseChange(newSelection);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Filter by Expertise</h2>
            <button 
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-blue-100 text-sm mt-1">
            Select expertise areas to filter content by expert specializations
          </p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Selected count */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-blue-800 font-medium">
                {selectedExpertise.length} expertise area(s) selected
              </span>
              {selectedExpertise.length > 0 && (
                <button
                  onClick={() => onExpertiseChange([])}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Clear all
                </button>
              )}
            </div>
            {selectedExpertise.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedExpertise.map((expertise) => (
                  <span
                    key={expertise}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {expertise}
                    <button
                      onClick={() => handleExpertiseToggle(expertise)}
                      className="hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Expertise grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {EXPERTISE_OPTIONS.map((expertise) => {
              const isSelected = selectedExpertise.includes(expertise);
              return (
                <label
                  key={expertise}
                  className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleExpertiseToggle(expertise)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center mr-3 ${
                    isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                  }`}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm font-medium">{expertise}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-end gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="px-6 py-2"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

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
  const [searchParams] = useSearchParams();
  const { fetchIsAuthenticated } = useAuthStore();
  const { userType } = useUserTypeStore();
  const isAuthenticated = userType !== "not_signed_in";
  const [activeTab, setActiveTab] = useState("sessions");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExpertise, setSelectedExpertise] = useState([]);
  const [showExpertiseModal, setShowExpertiseModal] = useState(false);
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

  // Handle URL parameters to set active tab
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['courses', 'sessions', 'cohorts'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

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
          // Filter for approved courses only
          const approvedCourses = coursesRes.data.filter(course => course.status === 'approved');
          const transformedCourses = approvedCourses.map(course => ({
            id: course._id,
            title: course.title,
            instructor: course.expertName,
            expertExpertise: course.expertExpertise || [],
            date: new Date(course.publishingDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            price: course.pricing?.total || 0,
            originalPrice: course.pricing?.total ? course.pricing.total * 1.2 : 0,
            image: "/rectangle-2749.png",
            color: "#00b6c4",
            driveLink: course.driveLink,
            status: course.status
          }));
          console.log('Transformed approved courses:', transformedCourses.length, 'out of', coursesRes.data.length, 'total courses');
          setCourses(transformedCourses);
        }

        if (cohortsRes.data && Array.isArray(cohortsRes.data)) {
          // Filter for approved cohorts with live activity status
          const approvedLiveCohorts = cohortsRes.data.filter(cohort => 
            cohort.status === 'approved' && cohort.activityStatus === 'live'
          );
          const transformedCohorts = approvedLiveCohorts.map(cohort => ({
            id: cohort._id,
            title: cohort.title,
            instructor: cohort.expertName,
            expertExpertise: cohort.expertExpertise || [],
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
            pricing: cohort.pricing,
            status: cohort.status
          }));
          console.log('Transformed approved cohorts:', transformedCohorts.length, 'out of', cohortsRes.data.length, 'total cohorts');
          setCohorts(transformedCohorts);
        }

        setSessions([]);
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

  const filterItems = (items, search, expertiseFilter) => {
    let filtered = items;

    console.log('Filtering items:', {
      totalItems: items.length,
      searchTerm: search,
      expertiseFilter: expertiseFilter,
      sampleItemExpertise: items[0]?.expertExpertise
    });

    // Apply search filter
    if (search) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.instructor?.toLowerCase().includes(search.toLowerCase())
      );
      console.log(`After search filter: ${filtered.length} items`);
    }

    // Apply expertise filter with enhanced matching
    if (expertiseFilter.length > 0) {
      console.log('Applying expertise filter...');
      filtered = filtered.filter(item => {
        if (!item.expertExpertise || item.expertExpertise.length === 0) {
          console.log(`Item "${item.title}" has no expertise data`);
          return false;
        }
        
        // Enhanced matching logic
        const matches = expertiseFilter.some(selectedExpertise => 
          item.expertExpertise.some(itemExpertise => {
            const normalizedSelected = selectedExpertise.toLowerCase().trim();
            const normalizedItem = itemExpertise.toLowerCase().trim();
            
            // Multiple matching strategies
            const exactMatch = normalizedItem === normalizedSelected;
            const containsMatch = normalizedItem.includes(normalizedSelected) || normalizedSelected.includes(normalizedItem);
            const wordMatch = normalizedSelected.split(' ').some(word => 
              word.length > 2 && normalizedItem.includes(word)
            ) || normalizedItem.split(' ').some(word => 
              word.length > 2 && normalizedSelected.includes(word)
            );
            
            const isMatch = exactMatch || containsMatch || wordMatch;
            
            if (isMatch) {
              console.log(`Match found: "${itemExpertise}" matches "${selectedExpertise}" for item "${item.title}"`);
            }
            
            return isMatch;
          })
        );
        
        return matches;
      });
      
      console.log(`After expertise filter: ${filtered.length} items`);
      console.log('Filtered items:', filtered.map(item => ({ title: item.title, expertise: item.expertExpertise })));
    }

    return filtered;
  };

  const CategorySection = ({ title, items, type = "course" }) => {
    if (!items || items.length === 0) return null;
    
    if (type === "session") {
      return <ExpertSearch selectedExpertise={selectedExpertise} />;
    }

    const filteredItems = filterItems(items, searchTerm, selectedExpertise);

    return (
      <div className="mb-16">
        {/* Search and Filter Controls */}
        <div className="mb-8 space-y-4">
          {/* Search bar */}
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search ${type}s by title or instructor...`}
              className="w-full px-4 py-3 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Filter button and selected expertise tags */}
          <div className="flex flex-col items-center gap-4">
            <Button
              onClick={() => setShowExpertiseModal(true)}
              className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl px-6 py-2 flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filter by Expertise
              {selectedExpertise.length > 0 && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium ml-2">
                  {selectedExpertise.length}
                </span>
              )}
            </Button>

            {/* Selected expertise tags */}
            {selectedExpertise.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center max-w-4xl">
                {selectedExpertise.map((expertise) => (
                  <span
                    key={expertise}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {expertise}
                    <button
                      onClick={() => setSelectedExpertise(prev => prev.filter(item => item !== expertise))}
                      className="hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <button
                  onClick={() => setSelectedExpertise([])}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium px-2"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-2xl font-bold text-[#003265] relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-1 after:bg-blue-500 after:rounded-full pb-2">
            {title}
            {filteredItems.length < items.length && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({filteredItems.length} of {items.length})
              </span>
            )}
          </h2>
          <div className="h-0.5 flex-grow bg-gradient-to-r from-blue-200 to-transparent rounded-full"></div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-500">
              {selectedExpertise.length > 0 || searchTerm 
                ? "Try adjusting your search terms or filters" 
                : `No ${type}s available at the moment`}
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
    return <LoadingScreen />;
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
            active={activeTab === "sessions"} 
            label="Sessions" 
            onClick={() => setActiveTab("sessions")}
          />
          <TabButton 
            active={activeTab === "cohorts"} 
            label="Cohorts" 
            onClick={() => setActiveTab("cohorts")}
          />
          <TabButton 
            active={activeTab === "courses"} 
            label="Courses" 
            onClick={() => setActiveTab("courses")}
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
            {activeTab === "sessions" && <AdvancedExpertiseSearch />}
            {activeTab === "cohorts" && (
              <CategorySection title="All Cohorts" items={cohorts} type="cohort" />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Expertise Filter Modal */}
      <ExpertiseFilterModal
        isOpen={showExpertiseModal}
        onClose={() => setShowExpertiseModal(false)}
        selectedExpertise={selectedExpertise}
        onExpertiseChange={setSelectedExpertise}
      />
    </div>
  );
};

export default AllCoursesPage;
