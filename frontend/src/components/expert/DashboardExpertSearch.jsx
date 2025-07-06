import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Star, ArrowRight, Filter, X } from 'lucide-react';
import { motion } from 'framer-motion';
import axiosInstance from '../../config/axios.config';
import useUserStore from '../../store/userStore';

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
  "Dietitian/Nutrition",
  "Fitness Training",
  "Career Discovery/Career Counselling",
  "Study Abroad Guidance",
  "Soft Skills & Interview Prep",
  "Resume Building & LinkedIn & Job search",
  "PHD admission mentorship",
  "Stream Selection"
];

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
            <h2 className="text-xl font-bold text-white">Filter Experts by Expertise</h2>
            <button 
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-blue-100 text-sm mt-1">
            Select expertise areas to find experts with matching specializations
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
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const ExpertCard = ({ expert }) => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate(`/booking/${expert._id}`);
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 overflow-hidden group hover:-translate-y-1 h-full flex flex-col">
      {/* Profile Image Section */}
      <div className="relative p-4 pb-0">
        <div className="flex justify-center">
          <div className="relative w-4/5">
            <img 
              src={expert.profilePicture || "/placeholder-user.jpg"} 
              alt={expert.name || `${expert.firstName} ${expert.lastName}`}
              className="w-full h-32 rounded-xl object-cover border-2 border-gray-100"
            />
            <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section - Flexible grow */}
      <div className="p-6 pt-4 text-center flex flex-col flex-grow">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {expert.name || `${expert.firstName} ${expert.lastName}`}
          </h3>
          <p className="text-sm text-gray-600 font-medium">{expert.title}</p>
        </div>
        
        {/* Rating Section */}
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                size={14}
                className={index < (expert.rating || 0) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600 font-medium">
            ({expert.totalFeedbacks || 0})
          </span>
        </div>

        {/* Price Section */}
        <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
          <div className="text-2xl font-bold text-gray-900">
            ₹{expert.sessionPricing?.total || 0}
          </div>
          <div className="text-xs text-gray-600 font-medium">per session</div>
        </div>

        {/* Skills Section - Flexible grow to push button down */}
        <div className="mb-6 flex-grow flex items-start justify-center">
          <div className="flex flex-wrap justify-center gap-2">
            {expert.expertise?.slice(0, 2).map((skill, index) => (
              <span 
                key={index}
                className="px-3 py-1 text-xs font-semibold bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full"
              >
                {skill}
              </span>
            ))}
            {expert.expertise?.length > 2 && (
              <span className="px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-600 rounded-full">
                +{expert.expertise.length - 2} more
              </span>
            )}
          </div>
        </div>

        {/* Book Now Button - Always at bottom */}
        <button
          onClick={handleBookNow}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 mt-auto"
        >
          Book Session
        </button>
      </div>
    </div>
  );
};

const DashboardExpertSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedExpertise, setSelectedExpertise] = useState([]);
  const [defaultFiltersApplied, setDefaultFiltersApplied] = useState(false);
  const navigate = useNavigate();
  const { user } = useUserStore();

  const handleSearch = async (query = '', expertise = []) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get("/expert/search", {
        params: { filter: query, expertise }
      });
      setExperts(response.data?.data || []);
    } catch (error) {
      console.error("Error searching experts:", error);
      setError("Failed to load experts. Please try again.");
      setExperts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAll = () => {
    navigate("/all-courses?tab=sessions");
  };

  // Set student's skills as default filters when user data is available
  useEffect(() => {
    if (user && user.interests && user.interests.length > 0 && !defaultFiltersApplied) {
      // Filter user interests to only include those that exist in EXPERTISE_OPTIONS
      const validUserInterests = user.interests.filter(interest => 
        EXPERTISE_OPTIONS.includes(interest)
      );
      
      if (validUserInterests.length > 0) {
        setSelectedExpertise(validUserInterests);
        setDefaultFiltersApplied(true);
        handleSearch('', validUserInterests);
        return;
      }
    }
    
    // If no valid user interests, do a general search
    if (!defaultFiltersApplied) {
      setDefaultFiltersApplied(true);
      handleSearch();
    }
  }, [user, defaultFiltersApplied]);

  // Show only first 4 experts for dashboard
  const displayExperts = experts.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Find Your Perfect Mentor</h2>
        <button
          onClick={handleViewAll}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 group"
        >
          <span className="border-b border-transparent group-hover:border-blue-600 transition-all duration-200">
            View all
          </span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
        </button>
      </div>
      
      <div className="space-y-4 mb-8">
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleSearch(e.target.value, selectedExpertise);
            }}
            placeholder="Search experts by name, expertise, or title..."
            className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm placeholder-gray-400 focus:outline-none"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl px-6 py-2 flex items-center gap-2 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filter by Expertise
            {selectedExpertise.length > 0 && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium ml-2">
                {selectedExpertise.length}
              </span>
            )}
          </button>

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
                    onClick={() => {
                      const newSelection = selectedExpertise.filter(item => item !== expertise);
                      setSelectedExpertise(newSelection);
                      handleSearch(searchQuery, newSelection);
                    }}
                    className="hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <button
                onClick={() => {
                  setSelectedExpertise([]);
                  handleSearch(searchQuery, []);
                }}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium px-2"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="text-center text-red-600 mb-4">{error}</div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
            {displayExperts.map((expert) => (
              <ExpertCard key={expert._id} expert={expert} />
            ))}
          </div>

          {experts.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No experts found</h3>
              <p className="text-gray-500">
                {searchQuery 
                  ? "Try adjusting your search terms"
                  : "Start typing to search for experts"}
              </p>
            </div>
          )}

          {experts.length > 4 && !searchQuery && (
            <div className="text-center mt-8">
              <button
                onClick={handleViewAll}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 group"
              >
                <span className="border-b border-transparent group-hover:border-blue-600 transition-all duration-200 text-lg">
                  View all {experts.length} experts
                </span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          )}
        </>
      )}

      <ExpertiseFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => {
          setIsFilterModalOpen(false);
          handleSearch(searchQuery, selectedExpertise);
        }}
        selectedExpertise={selectedExpertise}
        onExpertiseChange={setSelectedExpertise}
      />
    </div>
  );
};

export default DashboardExpertSearch;