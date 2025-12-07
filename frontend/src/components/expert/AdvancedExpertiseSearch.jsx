import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Star, Filter, X, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../../config/axios.config';

// Complete list of 60 expertise areas
const EXPERTISE_CATEGORIES = {
  "Technology & Development": [
    "Software Development",
    "AI/ML",
    "Data Science",
    "Cybersecurity",
    "Cloud Computing & DevOps",
    "Product Management"
  ],
  "Business & Finance": [
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
    "Company Secretary"
  ],
  "Marketing & Communication": [
    "Digital Marketing",
    "SEO",
    "Graphic Designing",
    "PR & Corporate Communication",
    "Content Writing & Copywriting",
    "Growth Marketing"
  ],
  "Design & Creative": [
    "Industrial Design",
    "Robotics & Mechatronics",
    "UI/UX & Interaction Design",
    "Fashion Design",
    "Interior & Spatial Design",
    "Animation & Illustration",
    "Fine Arts & Applied Arts",
    "Architecture"
  ],
  "Exam Preparation": [
    "Exam Prep Mentorship -UPSC",
    "Exam Prep Mentorship- CUET",
    "Exam Prep Mentorship - NET",
    "Exam Prep Mentorship - JEE",
    "Exam Prep Mentorship - GMAT/GRE",
    "Exam Prep Mentorship - Banking and other govt exams",
    "Exam Prep Mentorship - NET/JRF"
  ],
  "Media & Entertainment": [
    "Journalism (Print & Digital)",
    "Content Creation (YouTube, Podcasting)",
    "Film & Video Production",
    "Advertising & Copywriting",
    "OTT & New Media"
  ],
  "Management & Operations": [
    "Business Growth",
    "Program Management",
    "Public Policy & Governance"
  ],
  "Hospitality & Services": [
    "Hotel Management",
    "Culinary Arts & Bakery",
    "Tourism & Travel",
    "Aviation & Cabin Crew",
    "Event Management",
    "Make Up Artist"
  ],
  "Health & Wellness": [
    "Dietitian/ Nutrition",
    "Fitness Training"
  ],
  "Career Development": [
    "Career Discovery/ Career Councelling",
    "Study Abroad Guidance",
    "Soft Skills & Interview Prep",
    "Resume & LinkedIn Profile Building and Job Search",
    "PHD admission mentorship",
    "Stream Selection"
  ]
};

const ExpertCard = ({ expert }) => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate(`/booking/${expert._id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 overflow-hidden group hover:-translate-y-1 h-full flex flex-col"
    >
      {/* Profile Image Section */}
      <div className="relative p-4 pb-0">
        <div className="flex justify-center">
          <div className="relative w-4/5">
            <img 
              src={expert.profilePicture || "/placeholder-user.jpg"} 
              alt={expert.name || `${expert.firstName} ${expert.lastName}`}
              className="w-full h-32 rounded-xl object-contain border-2 border-gray-100 bg-white"
            />
            <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
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

        {/* Skills Section */}
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

        {/* Book Now Button */}
        <button
          onClick={handleBookNow}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 mt-auto"
        >
          Book Session
        </button>
      </div>
    </motion.div>
  );
};

const CategoryFilter = ({ category, expertiseList, selectedExpertise, onToggle, isExpanded, onToggleExpanded }) => {
  const categoryCount = expertiseList.filter(exp => selectedExpertise.includes(exp)).length;
  
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={onToggleExpanded}
        className="w-full p-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <span className="font-medium text-gray-900">{category}</span>
          {categoryCount > 0 && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
              {categoryCount} selected
            </span>
          )}
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-3 bg-white">
              {expertiseList.map((expertise) => {
                const isSelected = selectedExpertise.includes(expertise);
                return (
                  <label
                    key={expertise}
                    className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-sm ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggle(expertise)}
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AdvancedExpertiseSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState([]);
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});

  const handleExpertiseToggle = (expertise) => {
    setSelectedExpertise(prev => 
      prev.includes(expertise)
        ? prev.filter(item => item !== expertise)
        : [...prev, expertise]
    );
  };

  const handleSearch = async (query = '', expertiseFilter = []) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Advanced search with query:', query, 'expertise filter:', expertiseFilter);
      
      const params = {};
      if (query) {
        params.filter = query;
      }
      
      if (expertiseFilter.length > 0) {
        params.expertise = expertiseFilter.map(expertise => 
          expertise.toLowerCase().replace(/[^a-z0-9]/g, '-')
        ).join(',');
      }

      const response = await axiosInstance.get("/expert/search", { params });
      let expertsData = response.data?.data || [];

      // Enhanced client-side filtering
      if (expertiseFilter.length > 0) {
        expertsData = expertsData.filter(expert => {
          if (!expert.expertise || expert.expertise.length === 0) {
            return false;
          }
          
          return expertiseFilter.some(selectedExp => 
            expert.expertise.some(expertExp => {
              const normalizedSelected = selectedExp.toLowerCase().trim();
              const normalizedExpert = expertExp.toLowerCase().trim();
              
              return (
                normalizedExpert.includes(normalizedSelected) ||
                normalizedSelected.includes(normalizedExpert) ||
                normalizedSelected.split(' ').some(word => 
                  word.length > 2 && normalizedExpert.includes(word)
                ) ||
                normalizedExpert.split(' ').some(word => 
                  word.length > 2 && normalizedSelected.includes(word)
                )
              );
            })
          );
        });
      }

      setExperts(expertsData);
    } catch (error) {
      console.error("Error in advanced expert search:", error);
      setError(`Failed to load experts: ${error.response?.data?.message || error.message}`);
      setExperts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch(searchQuery, selectedExpertise);
  }, [selectedExpertise]);

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query, selectedExpertise);
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const clearAllFilters = () => {
    setSelectedExpertise([]);
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Find Expert Mentors</h2>
            <p className="text-gray-600 mt-2">
              Search and filter from our pool of expert mentors across 60+ specializations
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Filter className="w-4 h-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
            {selectedExpertise.length > 0 && (
              <span className="bg-blue-500 px-2 py-1 rounded-full text-xs">
                {selectedExpertise.length}
              </span>
            )}
          </button>
        </div>

        {/* Results summary */}
        <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{experts.length} expert{experts.length !== 1 ? 's' : ''} found</span>
          </div>
          {selectedExpertise.length > 0 && (
            <div className="flex items-center gap-2">
              <span>Filtering by {selectedExpertise.length} expertise area{selectedExpertise.length !== 1 ? 's' : ''}</span>
              <button
                onClick={clearAllFilters}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="lg:col-span-1"
            >
              <div className="bg-gray-50 rounded-xl p-6 sticky top-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Filter by Expertise</h3>
                  {selectedExpertise.length > 0 && (
                    <button
                      onClick={() => setSelectedExpertise([])}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Selected expertise tags */}
                {selectedExpertise.length > 0 && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-sm font-medium text-blue-800 mb-2">
                      {selectedExpertise.length} selected:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedExpertise.map((expertise) => (
                        <span
                          key={expertise}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
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
                  </div>
                )}

                {/* Category filters */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {Object.entries(EXPERTISE_CATEGORIES).map(([category, expertiseList]) => (
                    <CategoryFilter
                      key={category}
                      category={category}
                      expertiseList={expertiseList}
                      selectedExpertise={selectedExpertise}
                      onToggle={handleExpertiseToggle}
                      isExpanded={expandedCategories[category]}
                      onToggleExpanded={() => toggleCategory(category)}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
          {/* Search Bar */}
          <div className="relative mb-8">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchInputChange}
              placeholder="Search experts by name, title, or expertise..."
              className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm placeholder-gray-400 focus:outline-none"
            />
          </div>

          {/* Error State */}
          {error && (
            <div className="text-center text-red-600 mb-8 p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="font-medium">Error loading experts</p>
              <p className="text-sm mt-1">{error}</p>
              <button 
                onClick={() => handleSearch(searchQuery, selectedExpertise)}
                className="mt-2 text-sm bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
            </div>
          ) : (
            <>
              {/* Expert Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {experts.map((expert) => (
                  <ExpertCard key={expert._id} expert={expert} />
                ))}
              </div>
              
              {/* No Results State */}
              {experts.length === 0 && !loading && !error && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🔍</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No experts found</h3>
                  <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
                    {selectedExpertise.length > 0 || searchQuery
                      ? "Try adjusting your search criteria or selecting different expertise areas"
                      : "No experts are currently available. Please check back soon!"}
                  </p>
                  {(selectedExpertise.length > 0 || searchQuery) && (
                    <button
                      onClick={clearAllFilters}
                      className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedExpertiseSearch;