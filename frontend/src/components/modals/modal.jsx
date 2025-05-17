"use client"

import React, { useEffect, useState } from 'react';
/* eslint-disable */
import { motion, AnimatePresence } from 'framer-motion';
/* eslint-enable */
import { X, Calendar, MapPin, Clock, CheckCircle, ArrowLeft } from 'lucide-react';
import './modal.css';

export const Modal = ({ isOpen, onClose, title, children, className = "", workshopData = {} }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(true);
  
  // Expose setIsSubmitted to children via React cloneElement
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { setIsSubmitted });
    }
    return child;
  });

  // Reset form state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setTimeout(() => {
        setShowForm(true);
        setIsSubmitted(false);
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
    workshopTitle = title || "Craft a Resume That Says 'Hire Me' Without Saying a Word",
    expertName = "Indieguru",
    expertDetails = "Career coach specializing in resume optimization and job search strategies",
    date = "May 10, 2025",
    time = "10:00 AM - 12:00 PM",
    venue = "Online"
  } = workshopData;

  // Handle back button click
  const handleBack = () => {
    if (!showForm) {
      setShowForm(true);
    } else if (isSubmitted) {
      setIsSubmitted(false);
    } else {
      onClose(); // If we're already at the first step, close the modal
    }
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
            <div className="flex flex-col md:flex-row min-h-[350px] modal-content">
              {/* Left column - Registration form */}
              <div className="w-full md:w-1/2 p-6 bg-white border-r border-gray-100 modal-column">
                {/* Centered logo above heading */}
                <div className="flex justify-center mb-4">
                  <img src="/logo.svg" alt="Logo" className="h-16" />
                </div>
                
                {!isSubmitted ? (
                  <>
                    <h2 className="text-xl font-bold text-indigo-900 mb-4 text-center">
                      Reserve Your Spot
                    </h2>
                    
                    {/* Form content - Left aligned labels */}
                    <div className="space-y-3 bg-white p-4 rounded-xl shadow-sm">
                      {/* Apply left alignment to form children */}
                      <div className="text-left">
                        {childrenWithProps}
                      </div>
                    </div>
                    
                    <div className="mt-6 text-center text-sm text-indigo-700">
                      <p>Complete the form to secure your participation</p>
                    </div>
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="rounded-full bg-green-50 p-2 w-20 h-20 flex items-center justify-center">
                      <CheckCircle className="h-12 w-12 text-green-500" />
                    </div>
                    <h2 className="text-xl font-bold text-green-700">Registration Successful!</h2>
                    <p className="text-gray-700 max-w-xs">
                      Thank you for registering for this workshop. You'll receive a confirmation email with all the details.
                    </p>
                    <div className="flex space-x-4">
                      <button 
                        onClick={handleBack}
                        className="mt-2 px-6 py-2 bg-white border border-indigo-600 text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors text-sm"
                      >
                        Back to Form
                      </button>
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
              
              {/* Right column - Workshop details */}
              <div className="w-full md:w-1/2 p-6 bg-white modal-column">
                <div className="space-y-4">
                  {/* A) Workshop heading */}
                  <h2 className="text-xl font-bold text-indigo-900 mt-2">
                    {workshopTitle}
                  </h2>
                  
                  {/* B) Expert details */}
                  {/* <div className="flex items-start space-x-4">
                    <div className="h-14 w-14 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
                      <img src="/logo.svg" alt="Indiegury Logo" className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{expertName}</h3>
                      <p className="text-sm text-gray-600">{expertDetails}</p>
                    </div>
                  </div> */}
                  
                  {/* C) What you'll learn */}
                  <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-indigo-900 mb-2 text-left">🚀 What You'll Learn</h3>
                    <ul className="space-y-2 text-gray-700 text-left text-sm">
                      <li className="flex items-start">
                        <span className="text-indigo-500 mr-2">•</span>
                        <span>How to land interview calls using simple, proven resume hacks</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-indigo-500 mr-2">•</span>
                        <span>Ways to make your resume match job roles — without faking anything</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-indigo-500 mr-2">•</span>
                        <span>What recruiters actually look for (and how to highlight it in 5 lines or less)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-indigo-500 mr-2">•</span>
                        <span>How to turn "no experience" into strong, relevant resume content</span>
                      </li>
                    </ul>
                  </div>
                  
                  {/* D) Date, time and venue */}
                  <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 space-y-2">
                    <h3 className="font-semibold text-indigo-900 mb-1 text-left">Workshop Details</h3>
                    <div className="flex items-center text-gray-700">
                      <Calendar className="w-5 h-5 mr-3 text-indigo-500" /> 
                      <span>{date}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Clock className="w-5 h-5 mr-3 text-indigo-500" /> 
                      <span>{time}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <MapPin className="w-5 h-5 mr-3 text-indigo-500" /> 
                      <span>{venue}</span>
                    </div>
                    <div className="flex items-center text-gray-700 mt-2 font-semibold">
                      <span className="text-indigo-600">Fee: </span>
                      <span className="ml-2">₹49</span>
                    </div>
                  </div>
                  
                  {/* Google Meet statement */}
                  <div className="p-3 bg-white border border-indigo-100 rounded-xl text-xs text-indigo-700">
                    <p className="font-medium">Virtual Workshop</p>
                    <p>This workshop will be conducted via Google Meet. Login details will be shared after registration.</p>
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

