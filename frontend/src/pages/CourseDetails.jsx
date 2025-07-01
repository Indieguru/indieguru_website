import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Button } from '../components/ui/button';
import axiosInstance from '../config/axios.config';
import useAuthStore from '../store/authStore';
import Loader from '../components/layout/Loader';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Clock, Award, Calendar, CheckCircle2, Wallet, BookOpen, Users, Shield, AlertCircle, Stars, GraduationCap, BookMarked } from 'lucide-react';
import useUserStore from '../store/userStore';
import useUserTypeStore from '../store/userTypeStore';
import useRedirectStore from '../store/redirectStore';
import PhoneUpdateModal from '../components/modals/PhoneUpdateModal';
import initiateRazorpayPayment from '../components/paymentGateway/RazorpayButton';

export default function CourseDetails() {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, fetchUser } = useUserStore();
  const { userType } = useUserTypeStore();
  const { isAuthenticated } = useAuthStore();
  const { setRedirectUrl } = useRedirectStore();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axiosInstance.get(`/course/${courseId}`);
        setCourse(response.data);
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      // Save the current URL to redirect back after login
      setRedirectUrl(window.location.pathname);
      toast.info("Please sign up or log in to register for this course", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate('/signup');
      return;
    }

    if (userType === "expert") {
      toast.info("Please sign in as a student to purchase this course", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      return;
    }

    // Check if course is approved
    if (course.status !== 'approved') {
      toast.error("This course is not available for purchase at this time.", {
        position: "top-center",
        autoClose: 5000,
      });
      return;
    }

    // Check if phone number is missing
    if (!user.phone) {
      setShowPhoneModal(true);
      return;
    }

    // If phone exists, proceed with purchase
    proceedWithPurchase();
  };

  const handlePhoneUpdateSuccess = (phoneNumber) => {
    setShowPhoneModal(false);
    fetchUser(); // Refresh user data
    toast.success("Phone number updated! Proceeding with course registration.", {
      position: "top-center",
      autoClose: 3000,
    });
    // Proceed with purchase after phone update
    proceedWithPurchase();
  };

  const proceedWithPurchase = async () => {
     const res = await initiateRazorpayPayment({   
          amount: course.pricing.total,
          bookingType: "Course",
          id: courseId,
        });
    if(res){ 
      if (res?.status === "failed") {
        toast.error(res.message || "Failed while generating payment link", {
          icon: "❌",
          position: "top-center",
          autoClose: 5000,
        });
        return;
      }   
        try {
          console.log(res);
          console.log(":::::::::::::::::::::::::::::::::::::::::::")
          console.log(res.data)
          console.log(":::::::::::::::::::::::::::::::::::::::::::")
          console.log(res.data.payment._id)
          console.log(":::::::::::::::::::::::::::::::::::::::::::")
          setPurchasing(true);
          const response = await axiosInstance.post(`/course/${courseId}/purchase`,{
            paymentId: res.data.payment._id
          });
          if (response.status === 200) {
          setShowSuccessModal(true);
          navigate('/dashboard');
          }
        } catch (error) {
          console.error('Error purchasing course:', error);
          toast.error(error.response?.data?.message || 'Failed to register for the course. Please try again.', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
          });
        } finally {
          setPurchasing(false);
        }
    }
    else{
      console.log("Something Went Wrong")
    }
  };
  
  const handleEnroll = handlePurchase; // Alias for the same functionality
  
  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigate('/dashboard');
  };

  if (loading) {
    return <Loader text="Loading course details" fullScreen={true} />;
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <div className="mb-6 text-red-500 inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Course Not Found</h2>
          <p className="text-gray-600 mb-6">The course you're looking for doesn't exist or has been removed.</p>
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/courses')}
              className="w-full bg-gradient-to-r from-indigo-800 to-indigo-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-indigo-900 transition-all font-semibold shadow-md"
            >
              Browse Courses
            </Button>
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="w-full border border-gray-200 text-gray-600 py-3 rounded-xl hover:bg-gray-50 font-medium"
            >
              Back to Home
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Display course status notification
  const renderStatusBanner = () => {
    if (course.status === 'pending') {
      return (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-amber-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-700">
                This course is pending approval and is not available for purchase yet.
              </p>
            </div>
          </div>
        </div>
      );
    } else if (course.status === 'rejected') {
      return (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                This course is not available for purchase.
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      {/* Phone Update Modal */}
      <PhoneUpdateModal 
        isOpen={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
        onSuccess={handlePhoneUpdateSuccess}
      />
      
      <main className="max-w-7xl mx-auto px-4 pt-[120px] pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header with background */}
          <div className="bg-indigo-800 p-8 md:p-10 text-white">
            <div className="max-w-3xl">
              <div className="inline-block px-3 py-1 bg-blue-500/30 rounded-full text-sm font-medium mb-4">
                {course.category || 'Professional Course'}
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{course.title}</h1>
              <p className="text-blue-50 text-lg mb-4 max-w-2xl">{course.tagline || 'Expand your skills and advance your career with this professional course'}</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <span className="ml-2">{course.duration}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Banner */}
          {renderStatusBanner()}
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="space-y-8">
                  {/* Expert Details Section */}
                  <div>
                    <h2 className="text-2xl font-semibold text-[#0a2540] mb-4 flex items-center">
                      <span className="p-2 rounded-md bg-blue-50 text-indigo-800 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                          <path d="M16 8.5c0 2-4 3-4 3s-4-1-4-3 4-3 4-3 4 1 4 3" />
                        </svg>
                      </span>
                      Expert Instructor
                    </h2>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                      <div className="flex items-start gap-6">
                        <div className="relative">
                          <div className="absolute inset-0 rounded-full bg-blue-200 blur-sm opacity-60"></div>
                          <div className="relative w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-md">
                            {course.expertName?.charAt(0) || 'E'}
                          </div>
                        </div>
                        <div className="flex-1 space-y-3">
                          <h3 className="text-xl font-bold text-indigo-900">{course.expertName}</h3>
                          <p className="text-blue-800 font-medium">{course.expertTitle}</p>
                          <div className="mt-4">
                            <p className="text-sm font-medium text-indigo-600 mb-3">Areas of Expertise:</p>
                            <div className="flex flex-wrap gap-2">
                              {course.expertise?.map((exp, index) => (
                                <span 
                                  key={index} 
                                  className="inline-block px-4 py-1.5 bg-white text-indigo-900 font-medium rounded-full text-sm border border-indigo-100 shadow-sm"
                                >
                                  {exp}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Learning Outcomes Section */}
                  <div>
                    <h2 className="text-2xl font-semibold text-[#0a2540] mb-4 flex items-center">
                      <span className="p-2 rounded-md bg-blue-50 text-indigo-800 mr-3">
                        <CheckCircle2 className="w-5 h-5" />
                      </span>
                      What You'll Learn
                    </h2>
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                      <p className="text-gray-700 leading-relaxed mb-6">{course.description}</p>
                      <ul className="space-y-3 pl-1">
                        {course.learningOutcomes?.map((outcome, index) => (
                        <li key={index} className="flex items-start gap-3 text-gray-700">
                          <span className="mt-1 flex-shrink-0 w-5 h-5 bg-green-100 rounded-full text-green-600 flex items-center justify-center">
                            <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                          <span className="font-medium">{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            {/* Course Details Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl p-6 sticky top-4 shadow-lg border border-gray-100">
                <div className="bg-blue-50 -mt-6 -mx-6 mb-6 p-6 rounded-t-xl border-b border-blue-100">
                  <h3 className="text-xl font-bold text-blue-900 mb-1">Course Details</h3>
                  <p className="text-indigo-800 text-sm">Enroll today to secure your spot</p>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Clock className="w-5 h-5 text-indigo-800 mr-3" />
                    <div>
                      <p className="text-gray-500 text-sm">Duration</p>
                      <p className="font-medium text-[#0a2540]">{course.duration}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <Wallet className="w-5 h-5 text-indigo-800 mr-3" />
                    <div>
                      <p className="text-blue-700 text-sm font-medium">Price</p>
                      <p className="font-bold text-blue-900 text-xl">₹{course.pricing.total}</p>
                    </div>
                  </div>
                  
                  {course.startDate && (
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-indigo-800 mr-3" />
                      <div>
                        <p className="text-gray-500 text-sm">Start Date</p>
                        <p className="font-medium text-[#0a2540]">{new Date(course.startDate).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <Button
                    onClick={handlePurchase}
                    disabled={purchasing || course.status !== 'approved'}
                    className="w-full bg-gradient-to-r from-indigo-800 to-indigo-600 text-white py-4 rounded-xl hover:from-blue-700 hover:to-indigo-900 transition-all font-bold text-lg shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {purchasing ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      'Confirm Registration'
                    )}
                  </Button>
                  
                  <p className="text-center text-xs text-gray-500 px-4">
                    By registering, you agree to our terms of service and privacy policy
                  </p>
                </div>
              </div>
            </div>
          </div>
          </div>
        </motion.div>
      </main>
      
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-6 mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h3>
              <p className="text-gray-600 mb-6">
                Congratulations! You have successfully registered for this course. 
                You can access all course materials from your dashboard.
              </p>
              
              <div className="space-y-3">
                <Button
                  onClick={handleSuccessClose}
                  className="w-full bg-gradient-to-r from-indigo-800 to-indigo-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-indigo-900 transition-colors font-semibold"
                >
                  Go to Dashboard
                </Button>
                <button
                  onClick={handleSuccessClose}
                  className="w-full py-3 text-gray-600 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      <Footer />
      
      {/* Toast Notifications */}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
