import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { Button } from "../components/ui/button";
import { Calendar, CheckCircle2, ChevronRight } from "lucide-react";
import axiosInstance from "../config/axios.config";
import { toast } from "react-toastify";

const BookingPage = () => {
  const { expertId } = useParams();
  const navigate = useNavigate();
  const [expert, setExpert] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [sessionTitle, setSessionTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) return;
    
    const session = sessions.find(
      session => 
        new Date(session.date).toISOString().split('T')[0] === selectedDate && 
        session.startTime === selectedTime
    );

    if (!session) {
      toast.error('Session not available');
      return;
    }

    setSelectedSession(session);
    setShowTitleModal(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedSession || !sessionTitle.trim()) return;
    try {
      const response = await axiosInstance.post(`/session/${selectedSession._id}/book`, {
        sessionTitle: sessionTitle.trim(),
      });

      if (response.status === 200) {
        setSelectedSession(null);
        setSessionTitle("");
        setSelectedDate("");
        setSelectedTime("");
        setShowTitleModal(false);
        setShowSuccessModal(true); // Show success modal instead of toast
      }
    } catch (error) {
      console.error("Error booking session:", error);
      toast.error(error.response?.data?.message || "Failed to book session");
    } finally {
      setShowTitleModal(false);
    }
  };

  const handleViewBookings = () => {
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const sessionsByDate = sessions.reduce((acc, session) => {
    const date = new Date(session.date).toISOString().split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(session);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center space-x-4 mb-6">
                <img
                  src={expert?.avatar || "/placeholder-user.jpg"}
                  alt={expert?.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{expert?.name}</h2>
                  <p className="text-gray-600">{expert?.title}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                  <span className="ml-2 text-gray-600">
                    {expert?.ratings?.overall || "4.5"} ({expert?.ratings?.total || "0"} sessions)
                  </span>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-medium text-gray-900 mb-2">Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {expert?.expertise?.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-medium text-gray-900 mb-2">Session Rate</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{expert?.sessionPricing?.total || "0"}<span className="text-sm text-gray-500">/hour</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Book Your Session</h2>

              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Select Date</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                  {Object.keys(sessionsByDate).map((date) => (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`p-4 rounded-lg border text-center transition-all ${
                        selectedDate === date
                          ? "bg-blue-600 text-white border-blue-600"
                          : "hover:border-blue-600 hover:text-blue-600"
                      }`}
                    >
                      <div className="text-sm">{new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}</div>
                      <div className="text-lg font-bold">{new Date(date).getDate()}</div>
                      <div className="text-sm">{new Date(date).toLocaleDateString('en-US', { month: 'short' })}</div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedDate && (
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Select Time</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {sessionsByDate[selectedDate]?.map((session) => (
                      <button
                        key={session._id}
                        onClick={() => setSelectedTime(session.startTime)}
                        className={`p-3 rounded-lg border text-center transition-all ${
                          selectedTime === session.startTime
                            ? "bg-blue-600 text-white border-blue-600"
                            : "hover:border-blue-600 hover:text-blue-600"
                        }`}
                      >
                        {session.startTime} - {session.endTime}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Booking Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date</span>
                    <span className="font-medium">
                      {selectedDate ? new Date(selectedDate).toLocaleDateString() : "Not selected"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time</span>
                    <span className="font-medium">{selectedTime || "Not selected"}</span>
                  </div>
                  <div className="flex justify-between border-t pt-4">
                    <span className="text-gray-900 font-medium">Total Amount</span>
                    <span className="text-xl font-bold text-gray-900">
                      ₹{expert?.sessionPricing?.total || "0"}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleBooking}
                disabled={!selectedDate || !selectedTime}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg text-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Confirm Booking
              </Button>
            </div>
          </div>
        </div>

        {showTitleModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Add Session Title</h3>
              <input
                type="text"
                value={sessionTitle}
                onChange={(e) => setSessionTitle(e.target.value)}
                placeholder="e.g., Career Discussion, Technical Guidance"
                className="w-full px-3 py-2 border rounded-md mb-4"
              />
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => setShowTitleModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmBooking}
                  disabled={!sessionTitle.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        )}

        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="w-16 h-16 text-green-500" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Booking Successful!</h3>
              <p className="text-gray-600 mb-6">
                Your session has been booked successfully. You can view the details in your dashboard.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={handleViewBookings}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
                >
                  View My Bookings
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BookingPage;