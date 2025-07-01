import React from 'react';
import { X, Calendar, Clock, User, Mail, Phone, BookOpen } from 'lucide-react';

const SessionDetailsModal = ({ isOpen, onClose, session }) => {
  if (!isOpen || !session) return null;

  const formatCareerFlow = (careerFlow) => {
    if (!careerFlow) return 'Not available';
    
    const details = [];
    if (careerFlow.currentRole) details.push(`Current Role: ${careerFlow.currentRole}`);
    if (careerFlow.degree) details.push(`Degree: ${careerFlow.degree}`);
    if (careerFlow.stream) details.push(`Stream: ${careerFlow.stream}`);
    if (careerFlow.careerJourney) details.push(`Career Journey: ${careerFlow.careerJourney}`);
    
    return details.join('\n');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Session Details</h3>
            <button 
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {/* Session Info */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Session Information</h4>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-3 text-blue-600" />
                  <span>{new Date(session.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-5 h-5 mr-3 text-blue-600" />
                  <span>{session.startTime} - {session.endTime}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <BookOpen className="w-5 h-5 mr-3 text-blue-600" />
                  <span>{session.title || 'One-on-One Session'}</span>
                </div>
              </div>
            </div>

            {/* Student Details */}
            {session.bookedBy && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Student Details</h4>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <User className="w-5 h-5 mr-3 text-blue-600" />
                    <span>{session.studentName || 'Anonymous Student'}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-5 h-5 mr-3 text-blue-600" />
                    <span>{session.bookedBy.email || 'Not available'}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-5 h-5 mr-3 text-blue-600" />
                    <span>{session.bookedBy.phone || 'Not available'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Career Flow */}
            {session.bookedBy?.careerFlow && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Career Information</h4>
                <div className="bg-gray-50 rounded-lg p-4 text-gray-600">
                  <pre className="whitespace-pre-wrap font-sans">{formatCareerFlow(session.bookedBy.careerFlow)}</pre>
                </div>
              </div>
            )}

            {/* Meeting Link */}
            {session.meetLink && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Meeting Details</h4>
                <a 
                  href={session.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Join Google Meet
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionDetailsModal;