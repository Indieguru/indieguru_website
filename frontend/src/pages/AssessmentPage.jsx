import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';

const AssessmentPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    role: '',
    personalDetails: {
      fullName: '',
      phoneNumber: '',
      email: '',
      cityOfResidence: ''
    },
    confusion: 5,
    careerJourney: '',
    learningStyle: '',
    guidanceType: ''
  });

  const handleInputChange = (section, field, value) => {
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: { ...prev[section], [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const validatePersonalDetails = () => {
    const newErrors = {};
    const { fullName, email, phoneNumber, cityOfResidence } = formData.personalDetails;

    if (!fullName) newErrors.fullName = 'Full name is required';
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    if (!cityOfResidence) newErrors.cityOfResidence = 'City is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 2) {
      if (!validatePersonalDetails()) {
        return;
      }
    }
    
    if (step === 5) {
      // Navigate to experts page with assessment data
      navigate('/browse-experts', { 
        state: { 
          assessmentData: formData 
        }
      });
      return;
    }
    
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const roleOptions = [
    { value: 'undergraduate', label: 'I am doing my graduation' },
    { value: 'working', label: 'I am working currently' },
    { value: 'postgraduate', label: 'I am pursuing masters' },
    { value: 'highSchool', label: 'I am in Class 9th or 10th' },
    { value: 'secondary', label: 'I am in Class 11th or 12th' }
  ];

  const careerJourneyOptions = [
    { value: 'validate', label: 'I just need to validate the career path I\'m on' },
    { value: 'clarity', label: 'I kinda know the field - but need more clarity and direction' },
    { value: 'explore', label: 'I’m still exploring - open to discovering what fits me best' },
    { value: 'unsure', label: 'I don\'t know how to move ahead' }
  ];

  const learningStyleOptions = [
    { value: 'oneOnOne', label: 'I thrive with regular 1:1 sessions and personal guidance' },
    { value: 'selfPaced', label: 'I prefer to take things forward on my own, using the material after the session' },
    { value: 'structured', label: 'I need a structured path - give me a clear curriculum and plan' },
    { value: 'group', label: 'I love learning with others - group discussions and shared ideas work best' },
    { value: 'other', label: 'Something else works better for me (Please specify)' }
  ];

  const renderPersonalDetailsInputs = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
        <input
          type="text"
          value={formData.personalDetails.fullName}
          onChange={(e) => {
            handleInputChange('personalDetails', 'fullName', e.target.value);
            setErrors(prev => ({ ...prev, fullName: '' }));
          }}
          className={`w-full p-3 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
          placeholder="Enter your full name"
        />
        {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
        <input
          type="tel"
          value={formData.personalDetails.phoneNumber}
          onChange={(e) => {
            handleInputChange('personalDetails', 'phoneNumber', e.target.value);
            setErrors(prev => ({ ...prev, phoneNumber: '' }));
          }}
          className={`w-full p-3 border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
          placeholder="Enter your phone number"
        />
        {errors.phoneNumber && <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
        <input
          type="email"
          value={formData.personalDetails.email}
          onChange={(e) => {
            handleInputChange('personalDetails', 'email', e.target.value);
            setErrors(prev => ({ ...prev, email: '' }));
          }}
          className={`w-full p-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
          placeholder="Enter your email address"
        />
        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">City of Residence</label>
        <input
          type="text"
          value={formData.personalDetails.cityOfResidence}
          onChange={(e) => {
            handleInputChange('personalDetails', 'cityOfResidence', e.target.value);
            setErrors(prev => ({ ...prev, cityOfResidence: '' }));
          }}
          className={`w-full p-3 border ${errors.cityOfResidence ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
          placeholder="Enter your city"
        />
        {errors.cityOfResidence && <p className="mt-1 text-sm text-red-500">{errors.cityOfResidence}</p>}
      </div>
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-[#003265] mb-6">Tell us a bit about yourself</h2>
            <p className="text-gray-600 mb-8">Help us understand your background.</p>
            <div className="space-y-4">
              {roleOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    handleInputChange(null, 'role', option.value);
                    handleNext();
                  }}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    formData.role === option.value
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-[#003265] mb-6">Personal Details</h2>
            <p className="text-gray-600 mb-8">Your details will remain confidential and are only used to personalize your experience.</p>
            {renderPersonalDetailsInputs()}
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-[#003265] mb-6">How confused do you feel about your next steps?</h2>
            <p className="text-gray-600 mb-8">On a scale of 1-10 (1 = Not confused at all, 10 = Completely confused)</p>
            <div className="space-y-6">
              <input
                type="range"
                min="1"
                max="10"
                value={formData.confusion}
                onChange={(e) => handleInputChange(null, 'confusion', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>Not confused at all</span>
                <span>Completely confused</span>
              </div>
              <div className="text-center text-2xl font-bold text-blue-600">
                {formData.confusion}
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-[#003265] mb-6">What defines you the best when it comes to your career journey?</h2>
            <p className="text-gray-600 mb-8">Choose the option that resonates most with you.</p>
            <div className="space-y-4">
              {careerJourneyOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    handleInputChange(null, 'careerJourney', option.value);
                    handleNext();
                  }}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    formData.careerJourney === option.value
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-[#003265] mb-6">My learning style is correctly described as</h2>
            <p className="text-gray-600 mb-8">Select the option that best fits how you learn.</p>
            <div className="space-y-4">
              {learningStyleOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    handleInputChange(null, 'learningStyle', option.value);
                    handleNext();
                  }}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    formData.learningStyle === option.value
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-[#0a2540]">Career Assessment</h1>
              <div className="text-sm text-gray-600">
                Step {step} of 5
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-800 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>

          <div className="mt-8 flex justify-between max-w-2xl mx-auto">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Back
              </button>
            )}
            {(step < 5 || step === 5) && step !== 1 && step !== 4 && (
              <button
                onClick={handleNext}
                className="ml-auto px-6 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {step === 5 ? 'Find Experts' : 'Next'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentPage;