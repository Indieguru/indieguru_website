import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axios.config";
import { CalendarIcon, Star, Clock, FileText, Download, Eye, X } from "lucide-react";
import FeedbackModal from "../modals/FeedbackModal";

function PreviousSessionsSection() {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
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

  const handleFilePreview = (file) => {
    const fileType = file.name.split('.').pop().toLowerCase();
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(fileType);
    const isCloudinaryUrl = file.url.includes('cloudinary.com');
    
    if (isImage) {
      setPreviewFile(file);
    } else if (isCloudinaryUrl) {
      // For non-image files, open in Google Docs viewer
      const secureUrl = file.url.replace('http://', 'https://');
      window.open(`https://docs.google.com/gview?url=${encodeURIComponent(secureUrl)}&embedded=true`, '_blank');
    } else {
      window.open(file.url, '_blank');
    }
  };

  const handleClosePreview = () => {
    setPreviewFile(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-900"></div>
      </div>
    );
  }

  return (
    <>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

                  {session.notes && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2 text-blue-600">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm font-medium">Session Notes</span>
                      </div>
                      {session.notes.text && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-3">
                          {session.notes.text}
                        </p>
                      )}
                      {session.notes.files && session.notes.files.length > 0 && (
                        <div className="space-y-1">
                          {session.notes.files.map((file, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                              <span className="text-xs text-gray-600 truncate flex-1">
                                {file.name}
                              </span>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleFilePreview(file)}
                                  className="text-blue-600 hover:text-blue-800 transition-colors"
                                  title="Preview file"
                                >
                                  <Eye className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => window.open(file.url, '_blank')}
                                  className="text-blue-600 hover:text-blue-800 transition-colors"
                                  title="Download file"
                                >
                                  <Download className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
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

      {previewFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">{previewFile.name}</h3>
              <button 
                onClick={handleClosePreview}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="relative w-full" style={{ height: "80vh" }}>
              <img
                src={previewFile.url}
                alt={previewFile.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PreviousSessionsSection;
