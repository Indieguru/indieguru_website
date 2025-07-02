import React from 'react';
import { X, Calendar, Clock, User, Mail, Phone, BookOpen } from 'lucide-react';

const SessionDetailsModal = ({ isOpen, onClose, session }) => {
  if (!isOpen || !session) return null;

  // Mapping objects to decode career flow answers
  const roleMapping = {
    'undergraduate': 'Undergraduate Student',
    'working': 'Working Professional', 
    'postgraduate': 'Postgraduate Student',
    'highschool': 'High School Student (Class 11-12)',
    'secondary': 'Secondary School Student (Class 9-10)'
  };

  const careerJourneyMapping = {
    'validate': "I just need to validate the career path I'm on",
    'clarity': "I need to get more clarity/depth regarding my career field",
    'explore': "I need to explore more fields and decide",
    'guidance': "I don't know how to move ahead"
  };

  const learningStyleMapping = {
    'oneOnOne': "I need regular 1:1 sessions for personalized guidance",
    'selfPaced': "I prefer to take things forward on my own after the session",
    'structured': "I need a structured course with a clear curriculum and action plan",
    'group': "I prefer group discussions and peer learning",
    'other': "Others(Please specify)"
  };

  const formatCareerFlow = (careerFlow) => {
    if (!careerFlow) return 'Not available';
    
    const details = [];
    
    // Decode and add current role
    if (careerFlow.currentRole) {
      const decodedRole = roleMapping[careerFlow.currentRole] || careerFlow.currentRole;
      details.push(`Current Role: ${decodedRole}`);
    }
    
    // Add degree if available
    if (careerFlow.degree) {
      details.push(`Degree: ${careerFlow.degree}`);
    }
    
    // Add stream if available
    if (careerFlow.stream) {
      details.push(`Stream: ${careerFlow.stream}`);
    }
    
    // Decode and add career journey
    if (careerFlow.careerJourney) {
      const decodedJourney = careerJourneyMapping[careerFlow.careerJourney] || careerFlow.careerJourney;
      details.push(`Career Journey: ${decodedJourney}`);
    }
    
    // Decode and add learning style
    if (careerFlow.learningStyle) {
      const decodedStyle = learningStyleMapping[careerFlow.learningStyle] || careerFlow.learningStyle;
      details.push(`Learning Style: ${decodedStyle}`);
    }
    
    // Add other learning style if specified
    if (careerFlow.otherLearningStyle) {
      details.push(`Other Learning Style: ${careerFlow.otherLearningStyle}`);
    }
    
    return details.length > 0 ? details.join('\n') : 'Not available';
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Student Details</h4>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <User className="w-5 h-5 mr-3 text-blue-600" />
                  <span>{session.studentName || session.userEmail || 'Anonymous Student'}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="w-5 h-5 mr-3 text-blue-600" />
                  <span>{session.userEmail || 'Not available'}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="w-5 h-5 mr-3 text-blue-600" />
                  <span>{session.userPhone || 'Not available'}</span>
                </div>
              </div>
            </div>

            {/* Career Flow */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Career Information</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="whitespace-pre-wrap font-sans text-gray-700 text-sm leading-relaxed">
                  {formatCareerFlow(session.userCareerFlow)}
                </pre>
              </div>
            </div>

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