import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Star } from 'lucide-react';
import axiosInstance from '../../config/axios.config';

const ExpertCard = ({ expert }) => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate(`/booking/${expert._id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <img 
            src={expert.profilePicture || "/placeholder-user.jpg"} 
            alt={expert.name || `${expert.firstName} ${expert.lastName}`}
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
          />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {expert.name || `${expert.firstName} ${expert.lastName}`}
            </h3>
            <p className="text-sm text-gray-600">{expert.title}</p>
            
            <div className="flex items-center mt-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    size={16}
                    className={index < (expert.rating || 0) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                ({expert.totalFeedbacks || 0} reviews)
              </span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">
              ₹{expert.sessionPricing?.expertFee || 0}
            </div>
            <div className="text-xs text-gray-500">per session</div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {expert.expertise?.slice(0, 3).map((skill, index) => (
            <span 
              key={index}
              className="px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="mt-6">
          <button
            onClick={handleBookNow}
            className="w-full bg-blue-900 text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors duration-300"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

const ExpertSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white rounded-xl shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Find Your Perfect Mentor</h2>
      
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experts.map((expert) => (
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
        </>
      )}
    </div>
  );
};

export default ExpertSearch;