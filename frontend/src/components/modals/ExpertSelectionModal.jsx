import { useState, useRef } from "react";
import { Modal } from "../ui/modal";
import { Input } from "../ui/input";
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Code, 
  Brain, 
  Database, 
  Shield, 
  Cloud, 
  Target, 
  Heart, 
  BarChart3, 
  TrendingUp, 
  Calculator, 
  IndianRupee, 
  Scale, 
  FileText, 
  Megaphone, 
  Palette, 
  PenTool, 
  Lightbulb, 
  Settings, 
  Camera, 
  Building, 
  GraduationCap, 
  BookOpen, 
  Newspaper, 
  Video, 
  Briefcase, 
  Utensils, 
  Plane, 
  Calendar, 
  Sparkles, 
  Apple, 
  Dumbbell,
  Star,
  MapPin,
  Users
} from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import axiosInstance from "../../config/axios.config";
import { useNavigate } from "react-router-dom";
import useUserTypeStore from "../../store/userTypeStore";
import useUserStore from "../../store/userStore";
import LoadingScreen from "../common/LoadingScreen";
import * as Motion from "framer-motion";

const industries = [
  'Software Development',
  'AI/ML',
  'Data Science',
  'Cybersecurity',
  'Cloud Computing & DevOps',
  'Product Management',
  'Psychology & Therapy',
  'Business Analysis',
  'Strategy & Operations',
  'Data Analysis',
  'Chartered Accountancy (CA)',
  'CFA',
  'Investment Banking',
  'Financial Planning & Analysis',
  'FinTech Roles',
  'Corporate & Criminal Law',
  'Company Secretary',
  'Digital Marketing',
  'SEO',
  'Graphic Designing',
  'PR & Corporate Communication',
  'Content Writing & Copywriting',
  'Growth Marketing',
  'Industrial Design',
  'Robotics & Mechatronics',
  'UI/UX & Interaction Design',
  'Fashion Design',
  'Interior & Spatial Design',
  'Animation & Illustration',
  'Fine Arts & Applied Arts',
  'Architecture',
  'Public Policy & Governance',
  'Exam Prep Mentorship - UPSC',
  'Exam Prep Mentorship - CUET',
  'Exam Prep Mentorship - NET',
  'Exam Prep Mentorship - JEE',
  'Exam Prep Mentorship - GMAT/GRE',
  'Exam Prep Mentorship - Banking and other govt exams',
  'Exam Prep Mentorship - NET/JRF',
  'Journalism (Print & Digital)',
  'Content Creation (YouTube, Podcasting)',
  'Film & Video Production',
  'Advertising & Copywriting',
  'OTT & New Media',
  'Business Growth',
  'Program Management',
  'Hotel Management',
  'Culinary Arts & Bakery',
  'Tourism & Travel',
  'Aviation & Cabin Crew',
  'Event Management',
  'Make Up Artist',
  'Dietitian/ Nutrition',
  'Fitness Training',
  'Career Discovery/ Career Councelling',
  'Study Abroad Guidance',
  'Soft Skills & Interview Prep',
  'Resume & LinkedIn Profile Building and Job Search',
  'PHD admission mentorship',
  'Stream Selection'
];

// Icon mapping for industries
const industryIcons = {
  'Software Development': Code,
  'AI/ML': Brain,
  'Data Science': Database,
  'Cybersecurity': Shield,
  'Cloud Computing & DevOps': Cloud,
  'Product Management': Target,
  'Psychology & Therapy': Heart,
  'Business Analysis': BarChart3,
  'Strategy & Operations': TrendingUp,
  'Data Analysis': BarChart3,
  'Chartered Accountancy (CA)': Calculator,
  'CFA': IndianRupee,
  'Investment Banking': IndianRupee,
  'Financial Planning & Analysis': Calculator,
  'FinTech Roles': IndianRupee,
  'Corporate & Criminal Law': Scale,
  'Company Secretary': FileText,
  'Digital Marketing': Megaphone,
  'SEO': Search,
  'Graphic Designing': Palette,
  'PR & Corporate Communication': Megaphone,
  'Content Writing & Copywriting': PenTool,
  'Growth Marketing': TrendingUp,
  'Industrial Design': Lightbulb,
  'Robotics & Mechatronics': Settings,
  'UI/UX & Interaction Design': Palette,
  'Fashion Design': Sparkles,
  'Interior & Spatial Design': Building,
  'Animation & Illustration': Camera,
  'Fine Arts & Applied Arts': Palette,
  'Architecture': Building,
  'Public Policy & Governance': Scale,
  'Exam Prep Mentorship - UPSC': GraduationCap,
  'Exam Prep Mentorship - CUET': BookOpen,
  'Exam Prep Mentorship - NET': GraduationCap,
  'Exam Prep Mentorship - JEE': GraduationCap,
  'Exam Prep Mentorship - GMAT/GRE': BookOpen,
  'Exam Prep Mentorship - Banking and other govt exams': GraduationCap,
  'Exam Prep Mentorship - NET/JRF': BookOpen,
  'Journalism (Print & Digital)': Newspaper,
  'Content Creation (YouTube, Podcasting)': Video,
  'Film & Video Production': Camera,
  'Advertising & Copywriting': Megaphone,
  'OTT & New Media': Video,
  'Business Growth': TrendingUp,
  'Program Management': Briefcase,
  'Hotel Management': Building,
  'Culinary Arts & Bakery': Utensils,
  'Tourism & Travel': MapPin,
  'Aviation & Cabin Crew': Plane,
  'Event Management': Calendar,
  'Make Up Artist': Sparkles,
  'Dietitian/ Nutrition': Apple,
  'Fitness Training': Dumbbell,
  'Career Discovery/ Career Councelling': Target,
  'Study Abroad Guidance': GraduationCap,
  'Soft Skills & Interview Prep': Users,
  'Resume & LinkedIn Profile Building and Job Search': FileText,
  'PHD admission mentorship': GraduationCap,
  'Stream Selection': Target
};

const ExpertSelectionModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(false);
  const sliderRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { userType } = useUserTypeStore();

  const isAuthenticated = !!user?.firstName;

  const filteredIndustries = categorySearch 
    ? industries.filter(industry =>
        industry.toLowerCase().includes(categorySearch.toLowerCase())
      ).sort()
    : [...industries].sort();

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const handleIndustrySelect = (industry) => {
    setSelectedIndustry({ name: industry });
    setStep(2);
    fetchExperts(industry);
  };

  const fetchExperts = async (industry) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/expert/search", {
        params: { filter: industry }
      });
      setExperts(response.data.data);
    } catch (error) {
      console.error("Error fetching experts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExpertSelect = (expert) => {
    navigate(`/booking/${expert._id}`);
    onClose();
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    fetchExperts(e.target.value);
  };

  return (
    <Motion.AnimatePresence>
      {isOpen && (
        <Motion.motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0"
        >
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
          <Motion.motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-6xl"
          >
            <div className="relative rounded-xl overflow-hidden shadow-2xl bg-white/30 backdrop-blur-2xl border border-white/40">
              {/* Vector Decorations */}
              <Motion.motion.img
                src="/vector1.png"
                alt="Vector decoration"
                className="absolute -top-12 -right-12 w-32 h-32 opacity-10 z-0"
                animate={{ 
                  rotate: 360,
                }}
                transition={{ 
                  rotate: { duration: 30, repeat: Infinity, ease: "linear" }
                }}
              />
              <Motion.motion.img
                src="/vector2.png"
                alt="Vector decoration"
                className="absolute -bottom-12 -left-12 w-32 h-32 opacity-10 z-0 rotate-45"
                animate={{ 
                  rotate: [45, 405],
                }}
                transition={{ 
                  rotate: { duration: 35, repeat: Infinity, ease: "linear" }
                }}
              />

              {/* Content Container */}
              <div className="relative z-10 px-12 py-8 bg-gradient-to-br from-white/40 via-white/30 to-white/20 backdrop-blur-xl">
                <div className="max-w-4xl mx-auto">
                  {/* Header */}
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {step === 1 ? "Pick an Industry to Match with the Right Guru" : "Select an Expert"}
                      </h2>
                      {step === 2 && (
                        <p className="text-blue-700 mt-1 font-medium">From {selectedIndustry.name}</p>
                      )}
                    </div>
                    <button 
                      onClick={onClose} 
                      className="text-gray-700 hover:text-gray-900 transition-colors duration-200 p-2 rounded-lg hover:bg-white/30 backdrop-blur-sm"
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Progress Steps */}
                  <div className="flex justify-center mb-6">
                    <div className="flex items-center space-x-3">
                      <Motion.motion.div
                        animate={{
                          backgroundColor: step === 1 ? "#1E3A8A" : "#D1D5DB"
                        }}
                        className="w-3 h-3 rounded-full"
                        transition={{ duration: 0.2 }}
                      />
                      <div className="w-12 h-0.5 bg-gray-300 rounded" />
                      <Motion.motion.div
                        animate={{
                          backgroundColor: step === 2 ? "#1E3A8A" : "#D1D5DB"
                        }}
                        className="w-3 h-3 rounded-full"
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <Motion.AnimatePresence mode="wait">
                    <Motion.motion.div
                      key={step}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -20, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {step === 1 ? (
                        <>
                          <div className="relative mb-6">
                            <Input
                              type="text"
                              placeholder="Search industries..."
                              value={categorySearch}
                              onChange={(e) => setCategorySearch(e.target.value)}
                              onFocus={() => setShowDropdown(true)}
                              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                              className="w-full pl-10 pr-4 py-3 border-white/50 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 bg-white/40 backdrop-blur-md text-gray-900 placeholder-gray-700"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 w-5 h-5" />
                            
                            {/* Search Dropdown */}
                            {showDropdown && filteredIndustries.length > 0 && (
                              <div className="absolute top-full left-0 right-0 mt-1 bg-white/90 backdrop-blur-md border border-white/50 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                                {filteredIndustries.map((industry) => {
                                  const IconComponent = industryIcons[industry] || Target;
                                  return (
                                    <button
                                      key={industry}
                                      onClick={() => {
                                        handleIndustrySelect(industry);
                                        setCategorySearch("");
                                        setShowDropdown(false);
                                      }}
                                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-50/70 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg"
                                    >
                                      <IconComponent className="w-5 h-5 text-blue-700 flex-shrink-0" />
                                      <span className="text-gray-900 font-medium">{industry}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                          
                          <div className="relative mb-8">
                            {/* Slider Navigation Buttons */}
                            <button 
                              onClick={scrollLeft}
                              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-white/40 backdrop-blur-md border border-white/50 rounded-full p-2 shadow-lg hover:bg-white/60 transition-all duration-300"
                              aria-label="Scroll left"
                            >
                              <ChevronLeft className="w-5 h-5 text-gray-800" />
                            </button>
                            
                            <button 
                              onClick={scrollRight}
                              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-white/40 backdrop-blur-md border border-white/50 rounded-full p-2 shadow-lg hover:bg-white/60 transition-all duration-300"
                              aria-label="Scroll right"
                            >
                              <ChevronRight className="w-5 h-5 text-gray-800" />
                            </button>
                            
                            {/* Grid Layout - 2 rows, 3 cards per row */}
                            <div 
                              ref={sliderRef}
                              className="grid grid-rows-2 grid-flow-col gap-4 overflow-x-auto hide-scrollbar pb-6 snap-x snap-mandatory auto-cols-max"
                              style={{
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none',
                                WebkitOverflowScrolling: 'touch',
                                gridTemplateColumns: 'repeat(3, 1fr)'
                              }}
                            >
                              {filteredIndustries.map((industry) => {
                                const IconComponent = industryIcons[industry] || Target;
                                return (
                                  <Motion.motion.button
                                    key={industry}
                                    onClick={() => handleIndustrySelect(industry)}
                                    className="group relative p-4 rounded-lg text-left transition-all duration-300 overflow-hidden bg-white/30 hover:bg-white/50 flex-shrink-0 w-[200px] h-[120px] snap-start border border-white/40 backdrop-blur-lg hover:border-white/60 hover:shadow-xl"
                                    whileHover={{ 
                                      y: -2,
                                    }}
                                    whileTap={{ scale: 0.99 }}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ 
                                      duration: 0.2,
                                      ease: "easeOut"
                                    }}
                                  >
                                    <div className="relative z-10 h-full flex flex-col">
                                      {/* Icon */}
                                      <div className="flex items-center justify-center w-10 h-10 mb-3">
                                        <IconComponent className="w-6 h-6 text-blue-800 group-hover:text-blue-900 transition-colors duration-300" />
                                      </div>
                                      
                                      {/* Industry Name */}
                                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-900 transition-colors duration-300 text-sm leading-tight mb-1 flex-1">
                                        {industry}
                                      </h3>
                                      
                                      {/* Arrow indicator */}
                                      <div className="flex items-center text-blue-700 group-hover:translate-x-1 transition-transform duration-300 mt-auto">
                                        <span className="text-xs font-medium mr-1">Explore</span>
                                        <ChevronRight className="w-3 h-3" />
                                      </div>
                                    </div>
                                    
                                    {/* White glassmorphism hover overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-blue-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm" />
                                    
                                    {/* Glass border effect */}
                                    <div className="absolute inset-0 rounded-lg border border-white/0 group-hover:border-white/50 transition-colors duration-300" />
                                  </Motion.motion.button>
                                );
                              })}
                            </div>
                          </div>
                          
                          {/* Pagination Indicator */}
                          <div className="flex justify-center space-x-1">
                            {Array.from({ length: Math.min(5, Math.ceil(filteredIndustries.length / 10)) }).map((_, i) => (
                              <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                            ))}
                          </div>
                        </>
                      ) : (
                        <div>
                          <div className="relative mb-6">
                            <Input
                              type="text"
                              placeholder="Search experts by name or expertise..."
                              value={searchQuery}
                              onChange={handleSearch}
                              className="w-full pl-10 pr-4 py-3 border-white/50 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 bg-white/40 backdrop-blur-md text-gray-900 placeholder-gray-700"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 w-5 h-5" />
                          </div>

                          <div className="relative">
                            {loading ? (
                              <div className="py-12 flex justify-center items-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto pr-2 scrollbar-hidden">
                                {experts.map((expert) => (
                                  <Motion.motion.div
                                    key={expert._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    whileHover={{ 
                                      y: -2
                                    }}
                                    whileTap={{ scale: 0.99 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                  >
                                    <Card
                                      className="p-6 cursor-pointer hover:shadow-xl transition-all duration-300 bg-white/30 backdrop-blur-lg border border-white/40 hover:border-white/60 group hover:bg-white/50"
                                      onClick={() => handleExpertSelect(expert)}
                                    >
                                      <div className="flex gap-4">
                                        {/* Avatar with status indicator */}
                                        <div className="relative">
                                          <img
                                            src={expert.avatar || "/placeholder-user.jpg"}
                                            alt={expert.name}
                                            className="w-16 h-16 rounded-full object-cover border-2 border-white/70 shadow-lg backdrop-blur-sm"
                                          />
                                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 backdrop-blur-sm rounded-full border-2 border-white">
                                            <div className="w-1.5 h-1.5 bg-white rounded-full mx-auto mt-1"></div>
                                          </div>
                                        </div>
                                        
                                        <div className="flex-1">
                                          {/* Expert Name */}
                                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-900 transition-colors duration-300">
                                            {expert.name}
                                          </h3>
                                          
                                          {/* Domain with icon */}
                                          <div className="flex items-center mt-1">
                                            <Briefcase className="w-4 h-4 text-gray-600 mr-2" />
                                            <p className="text-sm text-gray-700 group-hover:text-blue-700 transition-colors duration-300">
                                              {expert.domain}
                                            </p>
                                          </div>
                                          
                                          {/* Rating and sessions */}
                                          <div className="flex items-center mt-3 space-x-4">
                                            <div className="flex items-center">
                                              <div className="flex text-yellow-500 mr-2">
                                                {[...Array(5)].map((_, i) => (
                                                  <Star key={i} className="w-4 h-4 fill-current" />
                                                ))}
                                              </div>
                                              <span className="text-sm font-medium text-gray-800">
                                                {expert.ratings?.toFixed(1) || "4.5"}
                                              </span>
                                            </div>
                                            
                                            <div className="flex items-center text-gray-600">
                                              <Users className="w-4 h-4 mr-1" />
                                              <span className="text-sm">
                                                {expert.sessionCount || "0"} sessions
                                              </span>
                                            </div>
                                          </div>
                                          
                                          {/* Call to action */}
                                          <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-center text-blue-700 group-hover:text-blue-800 group-hover:translate-x-1 transition-all duration-300">
                                              <span className="text-sm font-medium mr-2">Book Session</span>
                                              <ChevronRight className="w-4 h-4" />
                                            </div>
                                            
                                            {/* Price indicator if available */}
                                            {expert.price && (
                                              <div className="text-right">
                                                <span className="text-lg font-bold text-green-600">
                                                  ₹{expert.price}
                                                </span>
                                                <span className="text-sm text-gray-600">/session</span>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </Card>
                                  </Motion.motion.div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </Motion.motion.div>
                  </Motion.AnimatePresence>

                  {/* Navigation */}
                  <div className="flex justify-between items-center mt-8">
                    {step === 2 && (
                      <Button
                        onClick={() => setStep(1)}
                        className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2 hover:bg-gray-100/50"
                        variant="ghost"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Motion.motion.div>
        </Motion.motion.div>
      )}
    </Motion.AnimatePresence>
  );
};

export default ExpertSelectionModal;