import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import LoadingScreen from "../components/common/LoadingScreen";
import { Button } from "../components/ui/button";
import { Calendar, CheckCircle2, ChevronRight, Star, Clock, User, Award, IndianRupee, X, Phone } from "lucide-react";
import axiosInstance from "../config/axios.config";
import { toast, ToastContainer } from "react-toastify";
import useUserTypeStore from '../store/userTypeStore';
import checkAuth from '../utils/checkAuth';
import useRedirectStore from '../store/redirectStore';
import useAuthStore from '../store/authStore';
import PhoneUpdateModal from "../components/modals/PhoneUpdateModal";
import initiateRazorpayPayment from "../components/paymentGateway/RazorpayButton";
import useUserStore from "../store/userStore";

const BookingPage = () => {
  const { expertId } = useParams();
  const navigate = useNavigate();
  const [expert, setExpert] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [sessionTitle, setSessionTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { userType, setUserType } = useUserTypeStore();
  const [authData, setAuthData] = useState(null);
  const { setRedirectUrl } = useRedirectStore();
  const { isAuthenticated } = useAuthStore();
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const { user, fetchUser } = useUserStore();

  useEffect(() => {
    const handleAuth = async () => {
      const data = await checkAuth(setUserType, setLoading);
      setAuthData(data);
    };
    handleAuth();
  }, [setUserType]);

  useEffect(() => {
    if (authData) {
      if (userType === "expert") {
        toast.error('Please sign in as a student to book a session', {
          position: "top-center",
          autoClose: 5000,
        });
        return;
      }
    }
  }, [userType, authData]);

  useEffect(() => {
    const fetchExpertAndSessions = async () => {
      try {
        const [expertResponse, sessionsResponse] = await Promise.all([
          axiosInstance.get(`/expert/${expertId}`),
          axiosInstance.get(`/expert/${expertId}/sessions`)
        ]);
        
        setExpert(expertResponse.data);
        const availableSessions = sessionsResponse.data.filter(session => !session.bookedStatus);
        setSessions(availableSessions);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (expertId) {
      fetchExpertAndSessions();
    }
  }, [expertId]);

  // Check if user has a phone number
  const checkPhoneNumber = () => {
    if (!user || !user.phone) {
      setShowPhoneModal(true);
      return false;
    }
    return true;
  };

  // Handle phone update success
  const handlePhoneUpdateSuccess = (phoneNumber) => {
    setShowPhoneModal(false);
    fetchUser(); // Refresh user data
    toast.success("Phone number updated! Proceeding with course registration.", {
      position: "top-center",
      autoClose: 3000,
    });
    
    // Show the title modal to continue with booking
    setShowTitleModal(true);
  };

  const handleBooking = async () => {
    if (userType === 'not_signed_in') {
      // Save the current URL to redirect back after login
      setRedirectUrl(window.location.pathname);
      navigate('/signup');
      return;
    }

    if (userType === "expert") {
      toast.error('Please sign in as a student to book a session', {
        position: "top-center",
        autoClose: 5000,
      });
      return;
    }
    if (!user.phone) {
      setShowPhoneModal(true);
      return;
    }


    if (!selectedDate) {
      toast.error('Please select a date', {
        icon: "🗓️",
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    
    if (!selectedTime) {
      toast.error('Please select a time slot', {
        icon: "⏰",
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    
    
    const session = sessions.find(
      session => 
        new Date(session.date).toISOString().split('T')[0] === selectedDate && 
        session.startTime === selectedTime
    );

    if (!session) {
      toast.error('Session is no longer available', {
        icon: "❌",
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    setSelectedSession(session);
    
    // Check if phone number exists before proceeding
    if (!checkPhoneNumber()) {
      return; // Phone modal will be shown by checkPhoneNumber()
    }
    
    setShowTitleModal(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedSession) {
      toast.error('Session selection is invalid. Please try again.', {
        icon: "⚠️",
        position: "top-center",
      });
      setShowTitleModal(false);
      return;
    }

    if (userType === "expert") {
      toast.error('Please sign in as a student to book a session', {
        position: "top-center",
        autoClose: 5000,
      });
      setShowTitleModal(false);
      return;
    }
    

    const res = await initiateRazorpayPayment({   
      amount: expert?.sessionPricing?.total,
      bookingType: "Session",
      id: selectedSession._id,
    });
    
    if (res){
      if (res?.status === "failed") {
          toast.error(res.message || "Failed while generating payment link", {
            icon: "❌",
            position: "top-center",
            autoClose: 5000,
          });
          return;
        }
      try {
        // Show loading screen while processing booking
        setShowTitleModal(false);
        setProcessingPayment(true);
        const response = await axiosInstance.post(`/session/${selectedSession._id}/book`, {
          title: sessionTitle,
          paymentId: res.data.payment._id
        });
        if (response.status === 200) {
          setProcessingPayment(false);
          setShowSuccessModal(true);
        }
      } catch (error) {
        setProcessingPayment(false);
        toast.error(error.response?.data?.message || "Failed to book session. Please try again later.", {
          icon: "❌",
          position: "top-center",
          autoClose: 5000,            
        });
      } finally {
        setShowTitleModal(false);
      }
    }
  };

  const handleViewBookings = () => {
    navigate("/dashboard");
  };

  if (loading || processingPayment) {
    return <LoadingScreen />;
  }

  const sessionsByDate = sessions.reduce((acc, session) => {
    const date = new Date(session.date).toISOString().split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(session);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50">
      <Header />
      <PhoneUpdateModal 
        isOpen={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
        onSuccess={handlePhoneUpdateSuccess}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <div className="flex flex-col items-center sm:flex-row sm:items-center gap-6 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-100 rounded-full blur-md opacity-50"></div>
                  <img
                    src={expert?.profilePicture || "/placeholder-expert.png"}
                    alt={expert?.name || "Expert"}
                    className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white shadow-md"
                  />
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-2xl font-bold text-gray-800">{expert?.name || "Loading..."}</h2>
                  <p className="text-blue-600 font-medium">{expert?.title || "Expert"}</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* <div className="bg-blue-50 rounded-lg p-4 flex items-center">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <span className="ml-3 text-gray-700 font-medium">
                    {expert?.ratings?.overall} ({expert?.ratings?.total} sessions)
                  </span>
                </div> */}

                <div className="border-t border-gray-100 pt-6">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <Award className="w-5 h-5 text-blue-600 mr-2" />
                    Expertise
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {expert?.expertise?.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium border border-gray-200 hover:border-blue-300 transition-colors"
                      >
                        {skill}
                      </span>
                    )) || <span className="text-gray-500">Loading expertise...</span>}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <IndianRupee className="w-5 h-5 text-blue-600 mr-2" />
                    Session Rate
                  </h3>
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                    <p className="text-3xl font-bold text-blue-700">
                      ₹{expert?.sessionPricing?.total || "0"}
                      <span className="text-sm font-normal text-blue-600 ml-1">/hour</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
                <Calendar className="w-6 h-6 mr-3 text-blue-600" />
                Book Your Session
              </h2>

              <div className="mb-10">
                <div className="flex items-center mb-6">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${selectedDate ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'} font-bold mr-3 transition-colors`}>
                    {selectedDate ? '✓' : '1'}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Select Date</h3>
                  {!selectedDate && <span className="ml-2 text-sm text-orange-500 font-medium">(Required)</span>}
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {Object.keys(sessionsByDate).length > 0 ? (
                    Object.keys(sessionsByDate).map((date) => (
                      <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`p-4 rounded-xl border-2 text-center transition-all ${
                          selectedDate === date
                            ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-400 shadow-sm"
                            : "hover:bg-blue-50 hover:border-blue-200 border-gray-100"
                        }`}
                      >
                        <div className="text-sm font-medium mb-1">{new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}</div>
                        <div className="text-2xl font-bold my-1">{new Date(date).getDate()}</div>
                        <div className="text-sm">{new Date(date).toLocaleDateString('en-US', { month: 'short' })}</div>
                      </button>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
                      No available dates found
                    </div>
                  )}
                </div>
              </div>

              {selectedDate && (
                <div className="mb-10">
                  <div className="flex items-center mb-6">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${selectedTime ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'} font-bold mr-3 transition-colors`}>
                      {selectedTime ? '✓' : '2'}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Select Time</h3>
                    {!selectedTime && <span className="ml-2 text-sm text-orange-500 font-medium">(Required)</span>}
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {sessionsByDate[selectedDate]?.length > 0 ? (
                      sessionsByDate[selectedDate]?.map((session) => (
                        <button
                          key={session._id}
                          onClick={() => setSelectedTime(session.startTime)}
                          className={`p-4 rounded-xl border-2 text-center transition-all flex items-center justify-center ${
                            selectedTime === session.startTime
                              ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-400 shadow-sm"
                              : "hover:bg-blue-50 hover:border-blue-200 border-gray-100"
                          }`}
                        >
                          <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="font-medium">{session.startTime} - {session.endTime}</span>
                        </button>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
                        No available time slots for this date
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className={`bg-gradient-to-r from-blue-50 to-gray-50 p-6 rounded-xl border ${selectedDate && selectedTime ? 'border-blue-300 shadow-md' : 'border-blue-100'} mb-8 transition-all`}>
                <div className="flex items-center mb-6">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${selectedDate && selectedTime ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'} font-bold mr-3 transition-colors`}>
                    {selectedDate && selectedTime ? '✓' : '3'}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Booking Summary</h3>
                  {(!selectedDate || !selectedTime) && <span className="ml-2 text-sm text-orange-500 font-medium">(Complete previous steps first)</span>}
                </div>
                
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white rounded-lg p-4 border border-gray-100">
                    <span className="text-gray-500 font-medium mb-2 sm:mb-0">Date</span>
                    <span className="font-semibold text-gray-800 px-3 py-1 bg-blue-50 rounded-md">
                      {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}) : "Not selected"}
                    </span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white rounded-lg p-4 border border-gray-100">
                    <span className="text-gray-500 font-medium mb-2 sm:mb-0">Time</span>
                    <span className="font-semibold text-gray-800 px-3 py-1 bg-blue-50 rounded-md">
                      {selectedTime || "Not selected"}
                    </span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-gray-200 pt-5">
                    <span className="text-gray-700 font-semibold">Total Amount</span>
                    <div className="mt-2 sm:mt-0 bg-blue-800 text-white px-6 py-2 rounded-lg shadow-sm">
                      <span className="text-2xl font-bold">₹{expert?.sessionPricing?.total || "0"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleBooking}
                disabled={!selectedDate || !selectedTime}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-5 rounded-xl text-lg font-bold tracking-wide transition-all shadow-lg disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed relative group overflow-hidden"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></span>
                <span className="flex items-center justify-center relative z-10">
                  <Calendar className="w-5 h-5 mr-3" />
                  {!selectedDate ? 'Select a Date First' : 
                   !selectedTime ? 'Select a Time Slot' : 'Confirm Booking'}
                </span>
                <span className="absolute bottom-0 left-0 right-0 h-1 bg-white opacity-0 transform translate-y-1 group-hover:opacity-20 group-hover:translate-y-0 transition-all duration-300"></span>
              </Button>
            </div>
          </div>
        </div>

        {/* Phone Update Modal */}
        {showPhoneModal && (
          <PhoneUpdateModal 
            isOpen={showPhoneModal}
            onClose={() => setShowPhoneModal(false)}
            onSuccess={handlePhoneUpdateSuccess}
          />
        )}

        {showTitleModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-xl border border-gray-200 animate-fadeIn">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                  Add Session Title
                </h3>
                <button 
                  onClick={() => setShowTitleModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <p className="text-gray-600 mb-4">Please enter a title for your session with the expert</p>
              
              <input
                type="text"
                value={sessionTitle}
                onChange={(e) => setSessionTitle(e.target.value)}
                placeholder="e.g., Career Discussion, Technical Guidance"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
              
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setShowTitleModal(false)}
                  className="px-5 py-3 text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-lg font-medium transition-colors hover:shadow-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmBooking}
                  disabled={!sessionTitle.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-medium transition-colors disabled:opacity-50 shadow-md flex items-center justify-center relative overflow-hidden group"
                >
                  <span className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-20 transition-opacity"></span>
                  {!sessionTitle.trim() ? (
                    <span className="flex items-center">
                      <X className="w-4 h-4 mr-2" />
                      Enter Title
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Confirm Booking
                    </span>
                  )}
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white opacity-0 transform translate-y-0.5 group-hover:opacity-30 group-hover:translate-y-0 transition-all"></span>
                </button>
              </div>
            </div>
          </div>
        )}

        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-10 max-w-md w-full shadow-xl border border-gray-200 text-center animate-fadeIn">
              <div className="flex justify-center mb-6">
                <div className="bg-green-50 p-5 rounded-full border border-green-100">
                  <CheckCircle2 className="w-20 h-20 text-green-500" />
                </div>
              </div>
              
              <h3 className="text-3xl font-bold text-gray-800 mb-4">Booking Successful!</h3>
              
              <div className="text-gray-600 mb-8 text-lg">
                <p>Your session has been booked successfully. You can view all the details in your dashboard.</p>
              </div>
              
              <div className="space-y-4">
                <Button
                  onClick={handleViewBookings}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-xl font-bold transition-colors flex items-center justify-center shadow-lg"
                >
                  View My Bookings
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
                
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full px-5 py-4 text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-xl font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <ToastContainer 
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="rounded-lg shadow-lg border border-gray-100"
        bodyClassName="text-base font-medium"
        progressClassName="bg-blue-800"
      />
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default BookingPage;