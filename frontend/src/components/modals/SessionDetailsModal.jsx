import React from 'react';
import { X, Calendar, Clock, User, Mail, Phone, BookOpen } from 'lucide-react';

const SessionDetailsModal = ({ isOpen, onClose, session }) => {
  if (!isOpen || !session) return null;

  // Mapping objects to decode career flow answers
  const roleMapping = {
    'undergraduate': 'I am doing my graduation',
    'working': 'I am working currently', 
    'postgraduate': 'I am pursuing masters',
    'highschool': 'I am in Class 9th or 10th',
    'secondary': 'I am in Class 11th or 12th'
  };

  const careerJourneyMapping = {
    'validate': "I’m on a path - just need to validate if it’s the right one",
    'clarity': "I kinda know the field - but need more clarity and direction",
    'explore': "I’m still exploring - open to discovering what fits me best",
    'guidance': "Honestly, I feel stuck - not sure how to move forward"
  };

  const learningStyleMapping = {
    'oneOnOne': "I thrive with regular 1:1 sessions and personal guidance",
    'selfPaced': "I’m good with a nudge - I prefer exploring on my own post-session",
    'structured': "I need a structured path - give me a clear curriculum and plan",
    'group': "I love learning with others - group discussions and shared ideas work best",
    'other': "Something else works better for me (Please specify)"
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
                  className="inline-flex items-center px-4 py-2 bg-blue-800 hover:bg-blue-700 text-white rounded-lg transition-colors"
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