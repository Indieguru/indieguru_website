import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ExpertRecommendation from '../common/ExpertRecommendation';
import axiosInstance from '../../config/axios.config';
import { toast } from 'react-toastify';
import useUserStore from '../../store/userStore';
import useUserTypeStore from '../../store/userTypeStore';

const AssessmentModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    role: null,
    degree: '',
    linkedinUrl: '',
    stream: null,
    fullName: '',
    phoneNumber: '',
    email: '',
    cityOfResidence: '',
    confusion: 5,
    careerJourney: null,
    learningStyle: null,
    guidanceFor: null,
    otherLearningStyle: '',
    expertisePreference: null
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(0);
  const [resendActive, setResendActive] = useState(false);
  const { setUserType } = useUserTypeStore();
  const { fetchUser } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && showOtpInput) {
      setResendActive(true);
    }
    return () => clearInterval(interval);
  }, [timer, showOtpInput]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSendOtp = async () => {
    if (!validateEmail(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      const response = await axiosInstance.post('/user/auth/send-email-otp', {
        email: formData.email
      });
      
      if (response.status === 200) {
        setShowOtpInput(true);
        setTimer(30);
        toast.success("OTP sent successfully!");
        
        if (response.data.otp) {
          setOtp(response.data.otp);
          toast.info(`Dev mode: OTP auto-filled (${response.data.otp})`);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      // Map the career journey values to match database enum values
      const careerJourneyMapping = {
        "I just need to validate the career path I'm on": 'validate',
        "I need to get more clarity/depth regarding my career field": 'clarity',
        "I need to explore more fields and decide": 'explore',
        "I don't know how to move ahead": 'guidance'
      };

      const cleanedData = {
        role: formData.role,
        stream: formData.stream,
        degree: formData.degree,
        learningStyle: formData.learningStyle,
        otherLearningStyle: formData.otherLearningStyle,
        confusion: parseInt(formData.confusion),
        careerJourney: careerJourneyMapping[formData.careerJourney],
        guidanceFor: formData.guidanceFor,
        linkedinUrl: formData.linkedinUrl || '',
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        city: formData.cityOfResidence,
        expertise: formData.expertisePreference
      };

      const response = await axiosInstance.post("/user/auth/verify-email-otp", {
        email: formData.email,
        otp: otp,
        role: 'student',
        assessmentData: cleanedData
      });

      if (response.status === 200) {
        setUserType("student");
        await fetchUser();
        toast.success("Verified successfully!");
        setStep(4); // Move to next assessment step
      }
    } catch (error) {
      toast.error("Invalid OTP. Please try again.");
    }
  };

  const handleResendOtp = () => {
    setTimer(30);
    setResendActive(false);
    handleSendOtp();
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (formData.role === 'High School Student (Class 11-12)') {
        if (!formData.stream) {
          return;
        }
        setStep(3);
      } else if (formData.role === 'Secondary School Student (Class 9-10)') {
        setStep(3);
      } else {
        setStep(2);
      }
      return;
    }

    if (step === 3 && !isAuthenticated) {
      return;
    }

    if (step === 2 && !isAuthenticated) {
      setIsAuthenticated(true);
    }

    // Skip step 6 (guidance question) and go directly to expertise selection
    if (step === 5) {
      setStep(7);
      return;
    }

    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleExpertSelect = (expert) => {
    navigate(`/book-session/${expert._id}`, {
      state: {
        expert,
        assessmentData: formData
      }
    });
    onClose();
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return !!formData.role;
      case 2:
        if (formData.role === 'High School Student (Class 11-12)') {
          return !!formData.stream;
        }
        if (['Undergraduate Student', 'Postgraduate Student'].includes(formData.role)) {
          return !!formData.degree;
        }
        return true;
      case 3:
        return !!(formData.fullName && formData.phoneNumber && formData.email);
      case 4:
        return !!(formData.confusion && formData.careerJourney);
      case 5:
        return !!formData.learningStyle;
      case 7:
        return !!formData.expertisePreference;
      default:
        return true;
    }
  };

  if (!isOpen) return null;

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Tell us a bit about yourself</h3>
            <p className="text-gray-600 text-sm mb-6">Help us understand your background.</p>
            <div className="space-y-4">
              {[
                { role: 'Undergraduate Student' },
                { role: 'Working Professional' },
                { role: 'Postgraduate Student' },
                { role: 'High School Student (Class 11-12)' },
                { role: 'Secondary School Student (Class 9-10)' }
              ].map(({ role }) => (
                <button
                  key={role}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, role }));
                    handleNextStep();
                  }}
                  className="w-full p-4 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-900 text-left transition-all duration-300 border border-gray-200 hover:border-gray-300"
                >
                  <div className="font-medium">{role}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        switch (formData.role) {
          case 'Undergraduate Student':
          case 'Postgraduate Student': {
            return (
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">What's your degree?</h3>
                <p className="text-gray-600 text-sm mb-6">This helps us match you with relevant mentors.</p>
                <input
                  type="text"
                  name="degree"
                  value={formData.degree}
                  onChange={handleInputChange}
                  placeholder="Enter your degree (e.g., B.Tech, MBA)"
                  className="w-full p-4 rounded-xl glass-input text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-300"
                />
              </div>
            );
          }

          case 'Working Professional':
            return (
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Your Professional Profile</h3>
                <p className="text-gray-600 text-sm mb-6">Share your LinkedIn profile to help us understand your professional journey better.</p>
                <input
                  type="url"
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleInputChange}
                  placeholder="LinkedIn Profile URL (Optional)"
                  className="w-full p-4 rounded-xl glass-input text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-300"
                />
              </div>
            );

          case 'High School Student (Class 11-12)':
            return (
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">What's your stream?</h3>
                <p className="text-gray-600 text-sm mb-6">Select your current stream of study.</p>
                <div className="space-y-4">
                  {['Science (PCM)', 'Science (PCB)', 'Commerce', 'Arts/Humanities'].map((stream) => (
                    <button
                      key={stream}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, stream }));
                        handleNextStep();
                      }}
                      className="w-full p-4 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-900 text-left transition-all duration-300 border border-gray-200 hover:border-gray-300"
                    >
                      {stream}
                    </button>
                  ))}
                </div>
              </div>
            );

          default:
            return null;
        }

      case 3:
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
                disabled={showOtpInput}
              />
              <input
                type="text"
                name="cityOfResidence"
                value={formData.cityOfResidence}
                onChange={handleInputChange}
                placeholder="City of Residence"
                className="w-full p-4 rounded-xl glass-input text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-300"
              />

              {!showOtpInput ? (
                <button
                  onClick={handleSendOtp}
                  className="w-full p-4 bg-blue-800 text-white rounded-xl hover:bg-blue-700 transition-colors"
                  disabled={!formData.email || !formData.fullName}
                >
                  Continue with Email
                </button>
              ) : (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    className="w-full p-4 rounded-xl glass-input text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-300"
                  />
                  
                  <div className="flex justify-between items-center">
                    {timer > 0 && (
                      <p className="text-sm text-gray-500">
                        Resend OTP in {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
                      </p>
                    )}
                    {resendActive && (
                      <button
                        onClick={handleResendOtp}
                        className="text-blue-600 hover:underline"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>

                  <button
                    onClick={handleVerifyOtp}
                    className="w-full p-4 bg-blue-800 text-white rounded-xl hover:bg-blue-700 transition-colors"
                    disabled={otp.length !== 6}
                  >
                    Verify & Continue
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case 4:
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
                        ? 'bg-blue-800 text-white'
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

      case 5: {
        const learningStyleOptions = [
          { value: 'oneOnOne', label: 'I need regular 1:1 sessions for personalized guidance' },
          { value: 'selfPaced', label: 'I prefer to take things forward on my own after the session' },
          { value: 'structured', label: 'I need a structured course with a clear curriculum and action plan' },
          { value: 'group', label: 'I prefer group discussions and peer learning' },
          { value: 'other', label: 'Others(Please specify)' }
        ];

        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">My learning style is correctly described as -</h3>
            <p className="text-gray-600 text-sm mb-6">Select the option that best fits how you learn.</p>
            <div className="space-y-4">
              {learningStyleOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFormData(prev => ({ 
                    ...prev, 
                    learningStyle: option.value,
                    otherLearningStyle: option.value === 'other' ? '' : prev.otherLearningStyle 
                  }))}
                  className={`w-full p-4 rounded-lg text-left transition-all duration-300 ${
                    formData.learningStyle === option.value
                      ? 'bg-blue-800 text-white'
                      : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                  } border border-gray-200`}
                >
                  {option.label}
                </button>
              ))}
              {formData.learningStyle === 'other' && (
                <input
                  type="text"
                  name="otherLearningStyle"
                  value={formData.otherLearningStyle || ''}
                  onChange={handleInputChange}
                  placeholder="Please specify your learning style"
                  className="w-full p-4 rounded-xl glass-input text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-300"
                />
              )}
            </div>
          </div>
        );
      }

      case 7:
        const expertiseOptions = [
          'Software Development',
          'AI/ML',
          'Data Science',
          'Cybersecurity',
          'Cloud Computing & DevOps',
          'Product Management',
          'Psychology & Therapy',
          'Business Analysis',
          'Strategy & Operations',
          'Data Analysis',
          'Chartered Accountancy (CA)',
          'CFA',
          'Investment Banking',
          'Financial Planning & Analysis',
          'FinTech Roles',
          'Corporate & Criminal Law',
          'Company Secretary',
          'Digital Marketing',
          'SEO',
          'Graphic Designing',
          'PR & Corporate Communication',
          'Content Writing & Copywriting',
          'Growth Marketing',
          'Industrial Design',
          'Robotics & Mechatronics',
          'UI/UX & Interaction Design',
          'Fashion Design',
          'Interior & Spatial Design',
          'Animation & Illustration',
          'Fine Arts & Applied Arts',
          'Architecture',
          'Public Policy & Governance',
          'Exam Prep Mentorship - UPSC',
          'Exam Prep Mentorship - CUET',
          'Exam Prep Mentorship - NET',
          'Exam Prep Mentorship - JEE',
          'Exam Prep Mentorship - GMAT/GRE',
          'Exam Prep Mentorship - Banking',
          'Exam Prep Mentorship - NET/JRF',
          'Journalism (Print & Digital)',
          'Content Creation',
          'Film & Video Production',
          'Advertising & Copywriting',
          'OTT & New Media',
          'Business Growth',
          'Program Management',
          'Hotel Management',
          'Culinary Arts & Bakery',
          'Tourism & Travel',
          'Aviation & Cabin Crew',
          'Event Management',
          'Make Up Artist',
          'Dietitian/Nutrition',
          'Fitness Training',
          'Career Discovery/Career Counselling',
          'Study Abroad Guidance',
          'Soft Skills & Interview Prep',
          'Resume Building & Job Search',
          'PhD Admission Mentorship',
          'Stream Selection'
        ];
        
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">What are you seeking guidance for?</h3>
            <p className="text-gray-600 mb-8">Select the area you need expert guidance in:</p>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
              {expertiseOptions.map((expertise) => (
                <button
                  key={expertise}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, expertisePreference: expertise }));
                    setStep(8);
                  }}
                  className="w-full p-4 rounded-lg text-left transition-all duration-300 
                    bg-gray-50 text-gray-900 hover:bg-gray-100 border border-gray-200"
                >
                  {expertise}
                </button>
              ))}
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Expert Recommendations</h3>
            <p className="text-gray-600 mb-8">Based on your assessment and selected expertise, here are the experts who can help you:</p>
            <ExpertRecommendation
              formData={formData}
              onExpertSelect={handleExpertSelect}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
              <div className="relative z-10 px-16 py-10">
                <div className="max-w-4xl mx-auto">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-2">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            i + 1 === step ? 'bg-blue-800 scale-125' : 'bg-gray-200'
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
                    {step < 8 && step !== 3 && (
                      <motion.button
                        onClick={handleNextStep}
                        className={`px-6 py-2 rounded-full ml-auto transition-all ${
                          isStepValid()
                            ? 'bg-blue-800 text-white hover:bg-blue-700'
                            : 'bg-gray-200 text-gray-400 pointer-events-none opacity-60'
                        }`}
                        whileHover={isStepValid() ? { scale: 1.05 } : {}}
                        whileTap={isStepValid() ? { scale: 0.95 } : {}}
                        disabled={!isStepValid()}
                      >
                        Next
                        <svg className="w-5 h-5 ml-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      )}
    </AnimatePresence>
  );
};

export default AssessmentModal;