import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axiosInstance from "../../config/axios.config";
import { useNavigate } from "react-router-dom";

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

function ExpertsCarousel() {
  const [experts, setExperts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleSearch = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const params = {};
        const response = await axiosInstance.get("/expert/search", { params });
        let expertsData = response.data?.data || [];
        setExperts(expertsData);
      } catch (error) {
        console.error("Error in advanced expert search:", error);
        setError(`Failed to load experts: ${error.response?.data?.message || error.message}`);
        setExperts([]);
      } finally {
        setIsLoading(false);
      }
    };
    handleSearch();
  }, []);

  if (error) {
    return (
      <section className="mb-12 p-6 bg-gradient-to-br from-[#cceeed] to-[#e8f7f7] rounded-xl">
        <div className="text-center text-red-600">
          Error loading cohorts: {error}
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="mb-12 p-6 bg-gradient-to-br from-[#cceeed] to-[#e8f7f7] rounded-xl">
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12 p-6 bg-gradient-to-br from-[#cceeed] to-[#e8f7f7] rounded-xl">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center">
          <span className="mr-2 bg-amber-100 p-2 rounded-full text-amber-500">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" />
            </svg>
          </span>
          <h2 className="text-2xl font-semibold text-[#003265]">Your Gurus</h2>
        </div>
        <button
          onClick={() => navigate('/all-courses?tab=sessions')}
          className="flex items-center text-[#003265] hover:text-blue-700 transition-colors duration-200 group"
        >
          <span className="underline text-sm font-medium mr-1">View All</span>
          <svg 
            className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      <p className="text-sm text-[#6d6e76] mb-8 ml-8">
        Book Your Session and Learn From Industry Experts Now!
      </p>

      {experts.length === 0 ? (
        <div className="text-center text-gray-600">
          No experts available at the moment.
        </div>
      ) : (
      <div className="relative overflow-hidden">
        <div
          className="flex gap-6 snap-x snap-mandatory pb-4 px-2 overflow-x-scroll no-scrollbar"
          style={{
            scrollSnapType: "x mandatory",
            scrollBehavior: "smooth",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {experts.map((expert) => (
            <motion.div
              key={expert._id}
              className="flex-none w-80 snap-center"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <ExpertCard expert={expert} />
            </motion.div>
          ))}
        </div>
      </div>
      )}
    </section>
  );
}

export default ExpertsCarousel;