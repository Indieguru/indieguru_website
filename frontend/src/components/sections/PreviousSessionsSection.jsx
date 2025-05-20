import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axios.config";
import { CalendarIcon, Star, Clock } from "lucide-react";
import FeedbackModal from "../modals/FeedbackModal";

function PreviousSessionsSection() {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPastSessions = async () => {
      try {
        const response = await axiosInstance.get('/session/past');
        if (response.data.success) {
          setSessions(response.data.sessions);
        }
      } catch (error) {
        console.error('Error fetching past sessions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPastSessions();
  }, []);

  const handleBookAgain = (expertId) => {
    navigate(`/booking/${expertId}`);
  };

  const handleFeedback = (session) => {
    setSelectedSession(session);
    setShowFeedbackModal(true);
  };

  const handleCloseFeedbackModal = () => {
    setShowFeedbackModal(false);
    setSelectedSession(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-900"></div>
      </div>
    );
  }

  return (
    <motion.section
      className="mb-12 p-6 bg-gradient-to-br from-indigo-50 to-white rounded-xl shadow-md"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="flex items-center mb-1"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.span 
          className="mr-2 text-amber-500"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <Clock className="w-6 h-6" />
        </motion.span>
        <h2 className="text-2xl font-semibold text-[#003265]">Previous Sessions</h2>
      </motion.div>
      
      <motion.p 
        className="text-sm text-[#6d6e76] mb-8 ml-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Review and continue your learning from past sessions. Book again or provide feedback for completed sessions.
      </motion.p>

      {sessions.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No past sessions found. Book your first session to get started!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session, index) => (
            <motion.div
              key={session._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 p-6"
              >
                <div className="text-sm text-gray-500 mb-2 flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  {new Date(session.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <h3 className="text-lg font-bold text-[#003265] mb-3">
                  {session.title}
                </h3>
                <div className="text-sm text-gray-600 mb-4">
                  <div className="font-medium">{session.expertName}</div>
                  <div className="text-gray-500">{session.expertTitle}</div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {session.expertExpertise?.slice(0, 2).map((exp, i) => (
                      <span key={i} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                        {exp}
                      </span>
                    ))}
                    {session.expertExpertise?.length > 2 && (
                      <span className="text-xs text-gray-500">+{session.expertExpertise.length - 2} more</span>
                    )}
                  </div>
                </div>
                <div className="text-xs text-gray-500 mb-4">
                  <Clock className="w-4 h-4 inline mr-1" />
                  {session.startTime} - {session.endTime}
                </div>

                {session.feedback && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= session.feedback.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <h4 className="text-sm font-medium text-gray-900 mb-1">
                      {session.feedback.detail.heading}
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {session.feedback.detail.description}
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center gap-2">
                  <Button 
                    onClick={() => handleFeedback(session)}
                    className={`flex-1 ${
                      session.feedback 
                        ? 'bg-amber-100 hover:bg-amber-200 text-amber-700' 
                        : 'bg-amber-500 hover:bg-amber-600 text-white'
                    } text-xs px-3 py-2 h-8 rounded-md transform hover:scale-105 transition-all duration-300`}
                  >
                    {session.feedback ? 'View Feedback' : 'Add Feedback'}
                  </Button>
                  <Button 
                    onClick={() => handleBookAgain(session.expertId)}
                    className="flex-1 bg-blue-800 hover:bg-[#0a2540] text-white text-xs px-3 py-2 h-8 rounded-md transform hover:scale-105 transition-all duration-300"
                  >
                    Book Again
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      )}

      <FeedbackModal 
        isOpen={showFeedbackModal}
        onClose={handleCloseFeedbackModal}
        session={selectedSession}
      />
    </motion.section>
  );
}

export default PreviousSessionsSection;
