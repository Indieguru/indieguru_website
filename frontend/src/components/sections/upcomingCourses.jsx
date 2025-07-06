import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import axiosInstance from "../../config/axios.config";
import { useNavigate } from "react-router-dom";

// Animation variants for cohort cards
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

// Cohort Card Component
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

function UpcomingCohorts() {
  const [cohorts, setCohorts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCohorts = async () => {
      try {
        // console.log('Fetching cohorts...');
        const response = await axiosInstance.get('/cohort');
        // console.log('Cohorts response:', response.data);
        
        // Filter for approved cohorts with live activity status and sort by start date
        const approvedLiveCohorts = response.data
          .filter(cohort => cohort.status === 'approved' && cohort.activityStatus === 'live')
          .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
          .slice(0, 4); // Take only first 4 cohorts
          
        setCohorts(approvedLiveCohorts.map(cohort => ({
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
        })));
      } catch (error) {
        console.error('Error fetching cohorts:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCohorts();
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

  const handleJoinCohort = (cohort) => {
    navigate(`/cohort/${cohort.id}`);
  };

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
          <h2 className="text-2xl font-semibold text-[#003265]">Upcoming Cohorts</h2>
        </div>
        <button
          onClick={() => navigate('/all-courses?tab=cohorts')}
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
        Join upcoming cohorts and learn with peers. Collaborate and grow together in structured learning groups.
      </p>

      {cohorts.length === 0 ? (
        <div className="text-center text-gray-600">
          No upcoming cohorts available at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cohorts.map((cohort) => (
            <CohortCard 
              key={cohort.id}
              item={cohort}
              onJoin={handleJoinCohort}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default UpcomingCohorts;
