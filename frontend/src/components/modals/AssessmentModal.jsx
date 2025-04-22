import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AssessmentModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    role: '',
    degree: '',
    linkedinUrl: '',
    stream: '',
    fullName: '',
    phoneNumber: '',
    email: '',
    city: '',
    confusion: 5,
    careerJourney: '',
    learningStyle: '',
    guidanceFor: ''
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    if (step === 2 && !isAuthenticated) {
      // Show sign in prompt
      // For now, just simulating authentication
      setIsAuthenticated(true);
    }
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setStep(prev => prev - 1);
  };

  if (!isOpen) return null;

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Tell us a bit about yourself</h3>
            <p className="text-gray-600 text-sm mb-6">Helps us understand your current role to tailor our guidance.</p>
            <div className="space-y-4">
              {['Undergraduate Student', 'Working Professional', 'Postgraduate Student', 'High School Student (Class 11-12)', 'Secondary School Student (Class 9-10)'].map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, role }));
                    handleNextStep();
                  }}
                  className="w-full p-4 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-900 text-left transition-all duration-300 border border-gray-200 hover:border-gray-300"
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Personal Details</h3>
            <p className="text-gray-600 text-sm mb-6">Your details will remain confidential and are only used to personalize your experience.</p>
            <div className="space-y-4">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Full Name"
                className="w-full p-4 rounded-xl glass-input text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-300"
              />
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Phone Number"
                className="w-full p-4 rounded-xl glass-input text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-300"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                className="w-full p-4 rounded-xl glass-input text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-300"
              />
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="City of Residence"
                className="w-full p-4 rounded-xl glass-input text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-300"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Career Confusion Assessment</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-gray-900 mb-2">On a scale of 1-10, how confused do you feel about your next steps?</label>
                <input
                  type="range"
                  name="confusion"
                  min="1"
                  max="10"
                  value={formData.confusion}
                  onChange={handleInputChange}
                  className="w-full accent-blue-600 glass-input p-2 rounded-xl"
                />
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Not confused at all</span>
                  <span>Completely confused</span>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-gray-900 mb-2">What defines you the best when it comes to your career journey?</label>
                {[
                  "I just need to validate the career path I'm on",
                  "I need to get more clarity/depth regarding my career field",
                  "I need to explore more fields and decide",
                  "I don't know how to move ahead"
                ].map((option) => (
                  <button
                    key={option}
                    onClick={() => setFormData(prev => ({ ...prev, careerJourney: option }))}
                    className={`w-full p-4 rounded-lg text-left transition-all duration-300 ${
                      formData.careerJourney === option
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                    } border border-gray-200`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Learning Style</h3>
            <div className="space-y-4">
              {[
                'I need regular 1:1 sessions for personalized guidance',
                'I prefer to take things forward on my own, using the material after the session',
                'I need a structured course with a clear curriculum and action plan',
                'I prefer group discussions and peer learning',
                'Others (Please specify)'
              ].map((style) => (
                <button
                  key={style}
                  onClick={() => setFormData(prev => ({ ...prev, learningStyle: style }))}
                  className={`w-full p-4 rounded-lg text-left transition-all duration-300 ${
                    formData.learningStyle === style
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                  } border border-gray-200`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        );

      case 5: {
        // Render specific guidance options based on the user's role
        const guidanceOptions = {
          'High School Student': [
            'To know about my stream selection',
            'To know about a particular profession',
            'Career counseling for next steps',
            'To know about competitive exams',
            'Assistance with applying for study abroad opportunities'
          ],
          'Secondary School Student (Class 9-10)': [
            'Career counseling for next steps',
            'To know about competitive exams',
            'To know about stream selection',
            'To know about a particular profession'
          ],
          'Undergraduate Student': [
            'One-on-one expert mentorship to advance my career path',
            'Resume building, interview preparation, and job search support',
            'Entrepreneurship guidance or business mentoring',
            'Learn about Masters in INDIA and oversees'
          ],
          'Postgraduate Student': [
            'One-on-one expert mentorship to advance my career path',
            'Resume building, interview preparation, and job search support',
            'Entrepreneurship guidance or business mentoring',
            'Learn about doctorate procedures in INDIA and oversees'
          ],
          'Working Professional': [
            'One-on-one expert mentorship to advance my career path',
            'Resume building, interview preparation, and job search support',
            'Entrepreneurship guidance or business mentoring',
            'How to pivot to a different career/Industry'
          ]
        };

        const options = guidanceOptions[formData.role] || [];

        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">What are you seeking guidance for?</h3>
            <div className="space-y-4">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => setFormData(prev => ({ ...prev, guidanceFor: option }))}
                  className={`w-full p-4 rounded-lg text-left transition-all duration-300 ${
                    formData.guidanceFor === option
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                  } border border-gray-200`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0"
      >
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" onClick={onClose} />

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-6xl"
        >
          <div className="relative rounded-2xl overflow-hidden glass-white shadow-xl">
            {/* Vector Decorations */}
            <motion.img
              src="/vector1.png"
              alt="Vector decoration"
              className="absolute -top-16 -right-16 w-40 h-40 opacity-25 z-0"
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
            />
            <motion.img
              src="/vector2.png"
              alt="Vector decoration"
              className="absolute -bottom-16 -left-16 w-40 h-40 opacity-25 z-0"
              animate={{ 
                rotate: -360,
                scale: [1, 1.2, 1],
              }}
              transition={{ 
                rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
              }}
            />
            <motion.img
              src="/vector1.png"
              alt="Vector decoration"
              className="absolute top-1/3 -left-20 w-32 h-32 opacity-20 z-0"
              animate={{ 
                rotate: 180,
                scale: [1, 1.15, 1],
              }}
              transition={{ 
                rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
            />
            <motion.img
              src="/vector2.png"
              alt="Vector decoration"
              className="absolute top-1/2 -right-20 w-32 h-32 opacity-20 z-0"
              animate={{ 
                rotate: -180,
                scale: [1, 1.25, 1],
              }}
              transition={{ 
                rotate: { duration: 18, repeat: Infinity, ease: "linear" },
                scale: { duration: 6, repeat: Infinity, ease: "easeInOut" }
              }}
            />
            <motion.img
              src="/vector1.png"
              alt="Vector decoration"
              className="absolute bottom-1/4 left-1/3 w-24 h-24 opacity-20 z-0"
              animate={{ 
                rotate: 90,
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                rotate: { duration: 12, repeat: Infinity, ease: "linear" },
                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
            />
            <motion.img
              src="/vector2.png"
              alt="Vector decoration"
              className="absolute top-1/4 right-1/3 w-24 h-24 opacity-20 z-0"
              animate={{ 
                rotate: -90,
                scale: [1, 1.15, 1],
              }}
              transition={{ 
                rotate: { duration: 14, repeat: Infinity, ease: "linear" },
                scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
              }}
            />
            
            {/* Additional Small Vector Instances */}
            <motion.img
              src="/vector1.png"
              alt="Vector decoration"
              className="absolute top-1/4 left-1/4 w-16 h-16 opacity-15 z-0"
              animate={{ 
                rotate: 45,
                scale: [1, 1.2, 1],
              }}
              transition={{ 
                rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
            />
            <motion.img
              src="/vector2.png"
              alt="Vector decoration"
              className="absolute bottom-1/4 right-1/4 w-16 h-16 opacity-15 z-0"
              animate={{ 
                rotate: -45,
                scale: [1, 1.25, 1],
              }}
              transition={{ 
                rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
            />
            <motion.img
              src="/vector1.png"
              alt="Vector decoration"
              className="absolute top-1/2 left-1/2 w-12 h-12 opacity-10 z-0"
              animate={{ 
                rotate: 135,
                scale: [1, 1.3, 1],
              }}
              transition={{ 
                rotate: { duration: 16, repeat: Infinity, ease: "linear" },
                scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
              }}
            />
            <motion.img
              src="/vector2.png"
              alt="Vector decoration"
              className="absolute bottom-1/3 right-1/3 w-12 h-12 opacity-10 z-0"
              animate={{ 
                rotate: -135,
                scale: [1, 1.35, 1],
              }}
              transition={{ 
                rotate: { duration: 22, repeat: Infinity, ease: "linear" },
                scale: { duration: 6, repeat: Infinity, ease: "easeInOut" }
              }}
            />

            {/* Content Container */}
            <div className="relative z-10 px-16 py-10">
              <div className="max-w-4xl mx-auto">
                {/* Progress indicator */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-2">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          i + 1 === step ? 'bg-blue-600 scale-125' : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <button 
                    onClick={onClose}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                  >
                    {renderStepContent()}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex justify-between items-center mt-8">
                  {step > 1 && (
                    <motion.button
                      onClick={handlePrevStep}
                      className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
                      whileHover={{ x: -3 }}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Back
                    </motion.button>
                  )}
                  {step < 5 && (
                    <motion.button
                      onClick={handleNextStep}
                      className={`px-6 py-2 rounded-full ml-auto transition-all ${
                        formData[Object.keys(formData)[step - 1]]
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                      whileHover={formData[Object.keys(formData)[step - 1]] ? { scale: 1.05 } : {}}
                      whileTap={formData[Object.keys(formData)[step - 1]] ? { scale: 0.95 } : {}}
                    >
                      Next
                      <svg className="w-5 h-5 ml-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.button>
                  )}
                  {step === 5 && (
                    <motion.button
                      onClick={() => {
                        console.log('Form submitted:', formData);
                        onClose();
                      }}
                      className="px-6 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 ml-auto flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Complete Assessment
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AssessmentModal;