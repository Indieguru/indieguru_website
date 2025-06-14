import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Star, ArrowRight } from 'lucide-react';
import axiosInstance from '../../config/axios.config';

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
            ₹{expert.sessionPricing?.expertFee || 0}
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
  const navigate = useNavigate();

  const handleSearch = async (query = '') => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get("/expert/search", {
        params: { filter: query }
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

  useEffect(() => {
    handleSearch();
  }, []);

  // Show only first 4 experts for dashboard
  const displayExperts = experts.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Find Your Perfect Mentor</h2>
        {experts.length > 4 && (
          <button
            onClick={handleViewAll}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 group"
          >
            <span className="border-b border-transparent group-hover:border-blue-600 transition-all duration-200">
              View all
            </span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        )}
      </div>
      
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            handleSearch(e.target.value);
          }}
          placeholder="Search experts by name, expertise, or title..."
          className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm placeholder-gray-400 focus:outline-none"
        />
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
    </div>
  );
};

export default DashboardExpertSearch;