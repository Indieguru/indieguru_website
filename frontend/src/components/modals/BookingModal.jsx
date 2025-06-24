"use client"

import React, { useEffect, useState } from 'react';
/* eslint-disable */
import { motion, AnimatePresence } from 'framer-motion';
/* eslint-enable */
import { X, Calendar, MapPin, Clock, CheckCircle, ArrowLeft, ArrowRight, Users, Phone } from 'lucide-react';
import { Button } from '../ui/button';
import './modal.css';
import { toast } from "react-toastify";
import axiosInstance from '../../config/axios.config';
import PhoneUpdateModal from './PhoneUpdateModal';
import useUserStore from '../../store/userStore';

export const BookingModal = ({ 
  isOpen, 
  onClose, 
  title, 
  className = "", 
  sessionData = {},
  isAuthenticated = false,
  onRedirectToSignup,
  children 
}) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState('dateSelection'); // dateSelection, titleInput, confirmation
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [showAuthConfirmation, setShowAuthConfirmation] = useState(false);
  const [sessionTitle, setSessionTitle] = useState("");
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const { user, fetchUser } = useUserStore();

  // Check for phone number immediately when modal opens
  useEffect(() => {
    if (isOpen && isAuthenticated && user && !user.phone) {
      setShowPhoneModal(true);
    }
  }, [isOpen, isAuthenticated, user]);
  useEffect(() => {
    if (!user.phone) {
      setShowPhoneModal(true);
    }
  }, [ user]);
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      setShowAuthConfirmation(true);
    } else {
      setShowAuthConfirmation(false);
    }
  }, [isOpen, isAuthenticated]);
  
  // Available dates (showing next 7 days)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };
  
  // Available time slots (1 hour each)
  const timeSlots = [
    { start: '09:00', end: '10:00' },
    { start: '10:00', end: '11:00' },
    { start: '11:00', end: '12:00' },
    { start: '13:00', end: '14:00' },
    { start: '14:00', end: '15:00' },
    { start: '15:00', end: '16:00' },
    { start: '16:00', end: '17:00' },
    { start: '17:00', end: '18:00' },
  ];
  
  // Reset state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setCurrentStep('dateSelection');
        setSelectedDate(null);
        setSelectedTimeSlot(null);
        setIsSubmitted(false);
        setSessionTitle("");
        setShowPhoneModal(false);
      }, 300); // Match the animation exit time
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const {
    sessionTitle: defaultSessionTitle = title || "Design Thinking Workshop",
    instructorName = sessionData.instructor || "Expert Instructor",
    instructorDetails = sessionData.instructorDetails || "Industry expert with years of experience",
    date = sessionData.date || "Flexible date",
    price = sessionData.price || 49,
    image = sessionData.image || "/placeholder.jpg",
    color = sessionData.color || "#66bcff"
  } = sessionData;

  // Format date for display
  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  // Check if time slot is available (for demo, all slots are available except for current date slots that are in the past)
  const isSlotAvailable = (date, timeSlot) => {
    if (!date) return false;
    
    // Current time validation
    const now = new Date();
    const slotDate = new Date(date);
    const isToday = slotDate.toDateString() === now.toDateString();
    
    if (isToday) {
      // Parse time slot
      const [hourStr, minuteStr] = timeSlot.start.split(':');
      const slotTime = new Date(slotDate);
      slotTime.setHours(parseInt(hourStr, 10), parseInt(minuteStr, 10), 0, 0);
      
      // If slot is in the past, it's not available
      return slotTime > now;
    }
    
    return true;
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };
  
  // Handle time slot selection
  const handleTimeSlotSelect = (slot) => {
    setSelectedTimeSlot(slot);
  };

  // Check if phone number exists
  const checkPhoneNumber = () => {
    if (!user || !user.phone) {
      setShowPhoneModal(true);
      return false;
    }
    return true;
  };

  // Handle back button 
  const handleBack = () => {
    if (currentStep === 'titleInput') {
      setCurrentStep('dateSelection');
    } else if (currentStep === 'confirmation') {
      setCurrentStep('titleInput');
    } else {
      onClose();
    }
  };
  
  // Continue to next step
  const handleContinue = () => {
    // Always check for phone number before proceeding to the next step
    if (!checkPhoneNumber()) {
      return;
    }
    
    if (currentStep === 'dateSelection') {
      setCurrentStep('titleInput');
    } else if (currentStep === 'titleInput' && sessionTitle.trim()) {
      setCurrentStep('confirmation');
    }
  };

  // Handle phone update success
  const handlePhoneUpdateSuccess = (phoneNumber) => {
    setShowPhoneModal(false);
    
    // Force refresh the user data
    fetchUser();
    
    toast.success("Phone number updated! Proceeding with session booking.", {
      position: "top-center",
      autoClose: 3000,
    });
  };
  
  // Handle booking confirmation
  const handleConfirm = async () => {
    // Check if phone number is missing before proceeding with payment
    if (!checkPhoneNumber()) {
      return;
    }
    
    try {
      const response = await axiosInstance.post(`/session/book/${sessionData.id}`, {
        sessionTitle: sessionTitle.trim()
      });

      if (response.data.paymentId) {
        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID,
          amount: sessionData.pricing.total * 100,
          currency: sessionData.pricing.currency || "INR",
          name: "IndieGuru",
          description: `Session: ${sessionTitle}`,
          order_id: response.data.paymentId,
          handler: function (response) {
            toast.success("🎉 Session booked successfully! Check your email for details.", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            setIsSubmitted(true);
            setTimeout(() => {
              onClose();
              // Optionally redirect to bookings page
              window.location.href = '/bookings';
            }, 2000);
          },
          prefill: {
            email: user.email,
            contact: user.phone
          },
          theme: {
            color: "#3B82F6"
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error.response?.data?.message || 'Failed to book session');
    }
  };

  // Conditionally render content based on whether phone info is available
  const renderContent = () => {
    // Check for phone number
    if (user && !user.phone) {
      return (
        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 p-6">
          <div className="rounded-full bg-yellow-50 p-2 w-20 h-20 flex items-center justify-center">
            <Phone className="h-12 w-12 text-yellow-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Phone Number Required</h2>
          <p className="text-gray-600 max-w-md">
            To proceed with booking, please add your phone number. This is required for communication regarding your session.
          </p>
          <Button
            onClick={() => setShowPhoneModal(true)}
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg font-medium"
          >
            Add Phone Number
          </Button>
        </div>
      );
    }

    // If we have a phone number, show the regular content
    return (
      <>
        <h2 className="text-2xl font-bold text-indigo-900 mb-4 text-center">
          {currentStep === 'dateSelection' ? 'Select Date & Time' : currentStep === 'titleInput' ? 'Add Session Title' : 'Confirm Your Booking'}
        </h2>
        
        {currentStep === 'dateSelection' ? (
          <div className="space-y-6 bg-white p-4 rounded-xl shadow-sm">
            {/* Date selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-indigo-800 mb-3">Choose a Date</h3>
              <div className="flex flex-wrap gap-2">
                {getAvailableDates().map((date, index) => (
                  <button
                    key={index}
                    onClick={() => handleDateSelect(date)}
                    className={`p-3 rounded-lg border transition-colors text-center min-w-[90px] ${
                      selectedDate && selectedDate.toDateString() === date.toDateString()
                        ? 'bg-indigo-100 border-indigo-500 text-indigo-700'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                    <div className="text-lg">{date.getDate()}</div>
                    <div className="text-xs text-gray-500">{date.toLocaleDateString('en-US', { month: 'short' })}</div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Time slot selection */}
            <div>
              <h3 className="text-lg font-semibold text-indigo-800 mb-3">Choose a Time Slot</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {timeSlots.map((slot, index) => {
                  const available = isSlotAvailable(selectedDate, slot);
                  return (
                    <button
                      key={index}
                      onClick={() => available && handleTimeSlotSelect(slot)}
                      disabled={!available || !selectedDate}
                      className={`p-2 rounded-lg border transition-colors text-center ${
                        !selectedDate
                          ? 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                          : !available
                          ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                          : selectedTimeSlot === slot
                          ? 'bg-indigo-100 border-indigo-500 text-indigo-700'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-medium">{slot.start} - {slot.end}</div>
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Continue button */}
            <div className="pt-6">
              <Button
                onClick={handleContinue}
                disabled={!selectedDate || !selectedTimeSlot}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : currentStep === 'titleInput' ? (
          <div className="space-y-6 bg-white p-4 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-indigo-800 mb-3">Add Session Title</h3>
            <div>
              <label htmlFor="sessionTitle" className="block text-sm font-medium text-gray-700 mb-2">
                What would you like to discuss in this session?
              </label>
              <input
                id="sessionTitle"
                type="text"
                value={sessionTitle}
                onChange={(e) => setSessionTitle(e.target.value)}
                placeholder="e.g., Career Guidance Session, Technical Discussion"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="pt-6">
              <Button
                onClick={handleContinue}
                disabled={!sessionTitle.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <span>Continue to Payment</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 bg-white p-4 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-indigo-800 mb-3">Booking Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-700">Session</span>
                <span className="font-medium text-indigo-800">{sessionTitle}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-700">Date</span>
                <span className="font-medium">{formatDate(selectedDate)}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-700">Time</span>
                <span className="font-medium">{selectedTimeSlot?.start} - {selectedTimeSlot?.end}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-700">Contact</span>
                <span className="font-medium">{user?.phone || "Not provided"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Price</span>
                <span className="font-bold text-indigo-800">₹{sessionData.pricing?.total || price}</span>
              </div>
            </div>
            
            {/* Confirm button */}
            <div className="pt-6">
              <Button
                onClick={handleConfirm}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium"
              >
                Pay Now
              </Button>
            </div>
          </div>
        )}
        
        <div className="mt-6 text-center text-sm text-indigo-700">
          <p>{currentStep === 'dateSelection' ? 'Select a convenient time for your session' : currentStep === 'titleInput' ? 'Provide a title for your session' : 'Review and confirm your booking details'}</p>
        </div>
      </>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4 bg-black/40 modal-wrapper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Phone Update Modal */}
          {showPhoneModal && (
            <PhoneUpdateModal 
              isOpen={showPhoneModal}
              onClose={() => setShowPhoneModal(false)}
              onSuccess={handlePhoneUpdateSuccess}
            />
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            className={`
              relative w-full max-w-5xl pointer-events-auto
              bg-white
              shadow-2xl
              rounded-2xl
              overflow-hidden
              modal-container
              ${className}
            `}
          >
            {/* Header with close button */}
            <div className="absolute right-4 top-4 z-20">
              <button
                onClick={onClose}
                className="p-2 rounded-full transition-colors
                  hover:bg-gray-100 active:bg-gray-200
                  text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Back button - always visible */}
            <div className="absolute left-4 top-4 z-20">
              <button
                onClick={handleBack}
                className="p-2 rounded-full transition-colors
                  hover:bg-gray-100 active:bg-gray-200
                  text-gray-500 flex items-center"
              >
                <ArrowLeft className="w-5 h-5 mr-1" />
                <span className="text-sm">Back</span>
              </button>
            </div>
            
            {/* Two column layout */}
            <div className="flex flex-col md:flex-row min-h-[500px] modal-content">
              {/* Left column - Booking form */}
              <div className="w-full md:w-1/2 p-6 bg-white border-r border-gray-100 modal-column overflow-y-auto">
                {/* Centered logo above heading */}
                <div className="flex justify-center mb-4">
                  <img src="/logo.svg" alt="Logo" className="h-16" />
                </div>
                
                {!isSubmitted ? renderContent() : (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="rounded-full bg-green-50 p-2 w-20 h-20 flex items-center justify-center">
                      <CheckCircle className="h-12 w-12 text-green-500" />
                    </div>
                    <h2 className="text-xl font-bold text-green-700">Booking Confirmed!</h2>
                    <p className="text-gray-700 max-w-xs">
                      Your booking has been confirmed. You'll receive a confirmation email with all the details and joining instructions.
                    </p>
                    <div className="flex space-x-4">
                      <button 
                        onClick={onClose}
                        className="mt-2 px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors text-sm"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Right column - Session details */}
              <div className="w-full md:w-1/2 bg-white modal-column">
                <div className="h-full flex flex-col">
                  {/* Session image */}
                  <div 
                    className="h-48 relative overflow-hidden"
                    style={{ backgroundColor: color }}
                  >
                    <img src={image} alt={defaultSessionTitle} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="p-6 flex-1 space-y-4">
                    {/* Session heading */}
                    <h2 className="text-xl font-bold text-indigo-900 mt-2">
                      {defaultSessionTitle}
                    </h2>
                    
                    {/* Expert details */}
                    <div className="flex items-start space-x-4">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-lg font-bold text-blue-800">
                        {instructorName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{instructorName}</h3>
                        <p className="text-sm text-gray-600">{instructorDetails}</p>
                      </div>
                    </div>
                    
                    {/* Session details */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3">
                      <h3 className="font-semibold text-indigo-900 mb-1 text-left">Session Details</h3>
                      
                      <div className="flex items-center text-gray-700">
                        <Calendar className="w-5 h-5 mr-3 text-indigo-500" /> 
                        <span>{date}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-700">
                        <MapPin className="w-5 h-5 mr-3 text-indigo-500" /> 
                        <span>Online Session</span>
                      </div>
                      
                      <div className="flex items-center text-gray-700">
                        <Users className="w-5 h-5 mr-3 text-indigo-500" /> 
                        <span>Limited spots available</span>
                      </div>
                      
                      <div className="flex items-center text-gray-700 mt-2 font-semibold">
                        <span className="text-indigo-600">Price: </span>
                        <span className="ml-2">₹{sessionData.pricing?.total || price}</span>
                      </div>
                    </div>
                    
                    {/* What you'll learn */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                      <h3 className="font-semibold text-indigo-900 mb-2 text-left">🚀 What You'll Learn</h3>
                      <ul className="space-y-2 text-gray-700 text-left text-sm">
                        <li className="flex items-start">
                          <span className="text-indigo-500 mr-2">•</span>
                          <span>Interactive session with hands-on exercises</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-indigo-500 mr-2">•</span>
                          <span>Industry-specific tips and techniques</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-indigo-500 mr-2">•</span>
                          <span>Real-world case studies and applications</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-indigo-500 mr-2">•</span>
                          <span>Personalized guidance from industry experts</span>
                        </li>
                      </ul>
                    </div>
                    
                    {/* Online session info */}
                    <div className="p-3 bg-white border border-indigo-100 rounded-xl text-xs text-indigo-700 mt-auto">
                      <p className="font-medium">Virtual Session</p>
                      <p>This session will be conducted online. Login details will be shared after booking confirmation.</p>
                    </div>
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
