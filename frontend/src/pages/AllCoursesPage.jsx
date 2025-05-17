// filepath: /Users/shouryagupta/Desktop/coding/Indieguru_final/IndieGuru_website/frontend/src/pages/AllCoursesPage.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/button";
<<<<<<< HEAD
import { Users, ArrowRight, Calendar } from "lucide-react";
import Header from "../components/layout/Header";
import { Modal } from "../components/modals/modal";
import { BookingModal } from "../components/modals/BookingModal";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";
=======
import { Users, ArrowRight } from "lucide-react";
// import Header from "../components/layout/Header";
>>>>>>> 4809dc6 (nc1)

const AllCoursesPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, fetchIsAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Check authentication status when component mounts
  useEffect(() => {
    fetchIsAuthenticated();
  }, [fetchIsAuthenticated]);

  // Function to open modal with course data
  const handleEnrollClick = (item, type = "course") => {
    setSelectedCourse(item);
    
    // Always store the item data first
    setSelectedCourse(item);
    
    // For authenticated users, show the appropriate modal
    if (type === "session") {
      setIsBookingModalOpen(true);
    } else {
      // For courses, if authenticated then show confirmation, otherwise the form will redirect
      if (isAuthenticated) {
        setShowConfirmation(true); // Show confirmation modal instead of enrollment form
      }
      setIsModalOpen(true);
    }
    
    // Note: We're not redirecting here anymore because the modals will handle authentication
    // checks internally and redirect if needed
  };
  
  // Function to close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsBookingModalOpen(false);
  };

  // Registration confirmation component for authenticated users
  const RegistrationConfirmation = ({ courseData, setIsSubmitted }) => {
    const [isLoading, setIsLoading] = useState(false);
    
    const handleConfirmRegistration = async () => {
      setIsLoading(true);
      
      try {
        // Here you would call your API to register the user for the course
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
        
        // On successful registration
        setIsSubmitted(true);
        
        // Log the registration (replace with actual API call)
        console.log('Course registration confirmed:', {
          courseId: courseData?.id,
          courseTitle: courseData?.title,
        });
      } catch (error) {
        console.error('Registration error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    return (
      <div className="space-y-6 py-4">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-indigo-700 mb-2">Confirm Your Registration</h3>
          <p className="text-gray-600">You're about to register for this course. Click the button below to confirm.</p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">You'll join {courseData?.students || 0} other students in this course</p>
              <p className="text-xs text-gray-500">Classes start on {courseData?.date || "the scheduled date"}</p>
            </div>
          </div>
        </div>
        
        <Button
          onClick={handleConfirmRegistration}
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-800 text-white py-2 px-4 rounded-lg transition-all duration-200 flex justify-center items-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              <span>Processing...</span>
            </>
          ) : (
            'Confirm Registration'
          )}
        </Button>
      </div>
    );
  };
  
  // Session booking confirmation component for authenticated users
  const SessionBookingConfirmation = ({ sessionData, setIsSubmitted }) => {
    const [isLoading, setIsLoading] = useState(false);
    
    const handleConfirmBooking = async () => {
      setIsLoading(true);
      
      try {
        // Here you would call your API to book the session
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
        
        // On successful booking
        setIsSubmitted(true);
        
        // Log the booking (replace with actual API call)
        console.log('Session booking confirmed:', {
          sessionId: sessionData?.id,
          sessionTitle: sessionData?.title,
        });
      } catch (error) {
        console.error('Booking error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    return (
      <div className="space-y-6 py-4">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-indigo-700 mb-2">Confirm Your Session Booking</h3>
          <p className="text-gray-600">You're about to book this session. Click the button below to confirm.</p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">{sessionData?.date || "Session date"}</p>
              <p className="text-xs text-gray-500">With {sessionData?.instructor || "expert instructor"}</p>
            </div>
          </div>
        </div>
        
        <Button
          onClick={handleConfirmBooking}
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-800 text-white py-2 px-4 rounded-lg transition-all duration-200 flex justify-center items-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              <span>Processing...</span>
            </>
          ) : (
            'Confirm Booking'
          )}
        </Button>
      </div>
    );
  };

  // Create a simple enrollment form component for the modal
  const EnrollmentForm = ({ setIsSubmitted, courseData }) => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
    });
    
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Clear error when user types
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    };

    const validate = () => {
      const newErrors = {};
      
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }
      
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
      
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^[0-9]{10}$/.test(formData.phone)) {
        newErrors.phone = 'Phone number must be 10 digits';
      }
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (!validate()) {
        return;
      }
      
      setIsLoading(true);
      
      try {
        // Simulating API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // On successful enrollment
        setIsSubmitted(true);
        
        // Could send data to backend here
        console.log('Form submitted:', {
          ...formData,
          courseId: courseData?.id,
          courseTitle: courseData?.title,
        });
      } catch (error) {
        console.error('Enrollment error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            placeholder="Enter your full name"
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            placeholder="Enter your email address"
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            placeholder="Enter your 10-digit phone number"
          />
          {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
        </div>
        
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-800 text-white py-2 px-4 rounded-lg transition-all duration-200 flex justify-center items-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              <span>Processing...</span>
            </>
          ) : (
            'Register Now'
          )}
        </Button>
      </form>
    );
  };
  
  // Sample data structure similar to bookings page
  const contentData = {
    courses: [
      {
        id: 1,
        title: "Product Management Basic - Course",
        instructor: "Sarah Johnson - Head of Product Customer Platform Gojek Indonesia",
        date: "1 - 28 July 2025",
        students: 40,
        price: 380,
        originalPrice: 500,
        image: "/rectangle-2749.png",
        color: "#00b6c4",
      },
      {
        id: 2,
        title: "BM Data Science Professional Certificate",
        instructor: "David Lee - AI Research Lead at Microsoft",
        date: "15 July - 10 August 2025",
        students: 11,
        price: 678,
        originalPrice: 850,
        image: "/rectangle-2749-1.png",
        color: "#ffc619",
      },
    ],
    sessions: [
      {
        id: 1,
        title: "Design Thinking Workshop",
        instructor: "Lisa Wong - UX/UI Director at Google",
        date: "25 April 2025 • 2:00 PM - 4:00 PM",
        students: 18,
        price: 120,
        originalPrice: 200,
        image: "/rectangle-2749-2.png",
        color: "#66bcff",
      },
    ],
    cohorts: [
      {
        id: 1,
        title: "Data Science Spring 2025 Cohort",
        instructor: "Team of 5 Industry Experts",
        date: "15 May - 30 July 2025",
        students: 32,
        price: 1200,
        originalPrice: 1500,
        image: "/rectangle-2749.png",
        color: "#ffc619",
      },
    ],
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  const CourseCard = ({ course }) => {
    const discountPercentage = Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100);
    
    return (
      <motion.div
        variants={itemVariants}
        whileHover={{ y: -8, transition: { duration: 0.2 } }}
        className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
      >
        <div className="relative h-48" style={{ backgroundColor: course.color }}>
          <img src={course.image} alt={course.title} className="w-full h-full object-contain" />
          {discountPercentage > 0 && (
            <div className="absolute top-4 right-4 bg-red-500 text-white font-bold py-1 px-3 rounded-full text-sm">
              {discountPercentage}% OFF
            </div>
          )}
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-[#003265] mb-3 group-hover:text-blue-600 transition-colors">
            {course.title}
          </h3>
          <p className="text-sm text-gray-600 mb-4 flex items-center">
            <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
              {course.instructor.charAt(0)}
            </span>
            {course.instructor}
          </p>
          
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <Users className="w-4 h-4 mr-2" />
            <span>{course.students} students enrolled</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-[#003265]">${course.price}</span>
              <span className="ml-2 text-gray-400 line-through text-sm">${course.originalPrice}</span>
            </div>
            <Button 
              onClick={() => handleEnrollClick(course)} 
              className="bg-blue-800 hover:bg-[#0a2540] text-white rounded-full px-6 flex items-center gap-2 transform transition-transform group-hover:scale-105"
            >
              <span>Enroll Now</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    );
  };

  // Simplified session card component with only expert info, price and enroll button
  const SessionCard = ({ session }) => {
    const discountPercentage = Math.round(((session.originalPrice - session.price) / session.originalPrice) * 100);
    
    return (
      <motion.div
        variants={itemVariants}
        whileHover={{ y: -8, transition: { duration: 0.2 } }}
      >
        <div className="border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 bg-white h-full flex flex-col">
          <motion.div 
            className="aspect-square relative overflow-hidden group"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            style={{ backgroundColor: session.color }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <img
              src={session.image}
              alt={session.title}
              className="w-full h-full object-cover transform transition-transform group-hover:scale-105 duration-500"
            />
            {discountPercentage > 0 && (
              <div className="absolute top-4 right-4 bg-red-500 text-white font-bold py-1 px-3 rounded-full text-sm">
                {discountPercentage}% OFF
              </div>
            )}
          </motion.div>
          <div className="p-4 flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <div>
                {/* <h3 className="font-semibold text-gray-800 hover:text-indigo-600 transition-colors duration-300">{session.title}</h3> */}
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-800">
                    {session.instructor.charAt(0)}
                  </div>
                  <p className="text-xs text-[#003265] font-medium">{session.instructor}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-auto flex justify-between items-center pt-3 border-t border-gray-100">
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-[#003265]">${session.price}</span>
                <span className="ml-2 text-gray-400 line-through text-sm">${session.originalPrice}</span>
              </div>
              <Button 
                onClick={() => handleEnrollClick(session, "session")} 
                className="bg-blue-800 hover:bg-[#0a2540] text-white rounded-full px-4 py-1 h-8 flex items-center gap-2 transform transition-transform hover:scale-105"
              >
                <span className="text-sm">Book</span>
                <ArrowRight className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const CategorySection = ({ title, items, isSession = false }) => {
    if (!items || items.length === 0) return null;
    
    return (
      <div className="mb-16">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-2xl font-bold text-[#003265] relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-1 after:bg-blue-500 after:rounded-full pb-2">
            {title}
          </h2>
          <div className="h-0.5 flex-grow bg-gradient-to-r from-blue-200 to-transparent rounded-full"></div>
        </div>
        
        {isSession ? (
          <div className="overflow-x-auto whitespace-nowrap pb-4 scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-transparent">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="inline-flex gap-6 pr-8 pl-1 pb-4"
              style={{ minWidth: "100%" }}
            >
              {items.map((item) => (
                <div key={item.id} className="w-72">
                  <SessionCard session={item} />
                </div>
              ))}
            </motion.div>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {items.map((item) => (
              <CourseCard key={item.id} course={item} />
            ))}
          </motion.div>
        )}
      </div>
    );
  };

  const TabButton = ({ label, active }) => (
    <button
      onClick={() => setActiveTab(label.toLowerCase())}
      className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
        active
          ? "bg-blue-800 text-white shadow-lg"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto p-6 pt-[120px]"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between mb-12">
          <div className="mb-6 sm:mb-0">
            <h1 className="text-4xl sm:text-5xl font-bold text-[#0a2540] mb-4">
              Explore Learning Opportunities
            </h1>
            <p className="text-gray-600 text-lg">
              Discover courses, sessions, and cohorts tailored to your learning journey
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-3 mb-16 flex gap-2 w-full max-w-lg mx-auto">
          <TabButton active={activeTab === "all"} label="All" />
          <TabButton active={activeTab === "courses"} label="Courses" />
          <TabButton active={activeTab === "sessions"} label="Sessions" />
          <TabButton active={activeTab === "cohorts"} label="Cohorts" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "all" && (
              <>
                <CategorySection title="Featured Courses" items={contentData.courses} />
                <CategorySection title="Upcoming Sessions" items={contentData.sessions} isSession={true} />
                <CategorySection title="Active Cohorts" items={contentData.cohorts} />
              </>
            )}
            {activeTab === "courses" && (
              <CategorySection title="All Courses" items={contentData.courses} />
            )}
            {activeTab === "sessions" && (
              <div>
                <div className="mb-10">
                  <h2 className="text-2xl font-bold text-[#003265] mb-4">Expert-Led Live Sessions</h2>
                  <p className="text-gray-600">
                    Join our interactive live sessions with industry experts and enhance your skills in real-time.
                    Participate in Q&As, gain practical insights, and get personalized feedback.
                  </p>
                </div>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
                >
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl shadow-sm">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-[#003265] mb-2">Live Interactive Learning</h3>
                    <p className="text-sm text-gray-700">Engage directly with industry experts in real-time and get your questions answered instantly.</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-teal-100 p-6 rounded-xl shadow-sm">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-[#003265] mb-2">Personalized Feedback</h3>
                    <p className="text-sm text-gray-700">Receive direct feedback and insights tailored to your specific career goals and challenges.</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-violet-100 p-6 rounded-xl shadow-sm">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-[#003265] mb-2">Network with Peers</h3>
                    <p className="text-sm text-gray-700">Connect with like-minded professionals and expand your professional network during sessions.</p>
                  </div>
                </motion.div>
                <CategorySection title="Upcoming Sessions" items={contentData.sessions} isSession={true} />
              </div>
            )}
            {activeTab === "cohorts" && (
              <CategorySection title="All Cohorts" items={contentData.cohorts} />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Modal for Enroll Now button */}
        {selectedCourse && (
          <Modal 
            isOpen={isModalOpen} 
            onClose={handleCloseModal}
            title={selectedCourse.title}
            workshopData={{
              workshopTitle: selectedCourse.title,
              expertName: selectedCourse.instructor.split(' - ')[0],
              expertDetails: selectedCourse.instructor,
              date: selectedCourse.date,
              time: activeTab === "sessions" ? selectedCourse.date.split('•')[1]?.trim() || "Scheduled session" : "Flexible learning hours",
              venue: "Online",
              fee: selectedCourse.price
            }}
          >
            {isAuthenticated ? (
              <RegistrationConfirmation courseData={selectedCourse} setIsSubmitted={setIsSubmitted} />
            ) : (
              <EnrollmentForm courseData={selectedCourse} />
            )}
          </Modal>
        )}

        {/* BookingModal for Session bookings */}
        {selectedCourse && (
          <BookingModal 
            isOpen={isBookingModalOpen} 
            onClose={handleCloseModal}
            title={selectedCourse.title}
            isAuthenticated={isAuthenticated}
            onRedirectToSignup={() => navigate('/signup')}
            sessionData={{
              sessionTitle: selectedCourse.title,
              instructor: selectedCourse.instructor.split(' - ')[0],
              instructorDetails: selectedCourse.instructor,
              date: selectedCourse.date,
              price: selectedCourse.price,
              image: selectedCourse.image,
              color: selectedCourse.color
            }}
          >
            {isAuthenticated && (
              <SessionBookingConfirmation 
                sessionData={selectedCourse} 
                setIsSubmitted={setIsSubmitted} 
              />
            )}
          </BookingModal>
        )}
      </motion.div>
    </div>
  );
};

export default AllCoursesPage;
