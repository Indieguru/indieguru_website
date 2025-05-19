import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { Button } from "../components/ui/button";
import { Calendar } from "lucide-react";
import axiosInstance from "../config/axios.config";

const timeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
  "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM"
];

const BookingPage = () => {
  const { expertId } = useParams();
  const [expert, setExpert] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpertDetails = async () => {
      try {
        const response = await axiosInstance.get(`/expert/${expertId}`);
        setExpert(response.data.expert);
      } catch (error) {
        console.error("Error fetching expert details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (expertId) {
      fetchExpertDetails();
    }
  }, [expertId]);

  const handleBooking = async () => {
    try {
      await axiosInstance.post("/session/book", {
        expertId,
        date: selectedDate,
        time: selectedTime,
      });
      // Navigate to success page or show success message
    } catch (error) {
      console.error("Error booking session:", error);
      // Show error message
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Expert Details */}
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
                  <p className="text-gray-600">{expert?.domain}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                  <span className="ml-2 text-gray-600">
                    {expert?.ratings?.toFixed(1) || "4.5"} ({expert?.sessionCount || "0"} sessions)
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
                    ₹{expert?.sessionRate || "150"}<span className="text-sm text-gray-500">/hour</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Book Your Session</h2>

              {/* Date Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Select Date</h3>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Time Slots */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Select Time</h3>
                <div className="grid grid-cols-3 gap-4">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        selectedTime === time
                          ? "bg-blue-600 text-white border-blue-600"
                          : "hover:border-blue-600 hover:text-blue-600"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Booking Summary */}
              <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Booking Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date</span>
                    <span className="font-medium">{selectedDate || "Not selected"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time</span>
                    <span className="font-medium">{selectedTime || "Not selected"}</span>
                  </div>
                  <div className="flex justify-between border-t pt-4">
                    <span className="text-gray-900 font-medium">Total Amount</span>
                    <span className="text-xl font-bold text-gray-900">
                      ₹{expert?.sessionRate || "150"}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleBooking}
                disabled={!selectedDate || !selectedTime}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg text-lg font-semibold transition-colors"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Confirm Booking
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingPage;