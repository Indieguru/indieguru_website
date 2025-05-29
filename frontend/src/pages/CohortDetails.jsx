import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Users, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import Header from "../components/layout/Header";
import axiosInstance from "../config/axios.config";
import useAuthStore from "../store/authStore";

const CohortDetails = () => {
  const { cohortId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [cohort, setCohort] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCohortDetails = async () => {
      try {
        const response = await axiosInstance.get(`/cohort/${cohortId}`);
        setCohort(response.data);
      } catch (error) {
        console.error("Error fetching cohort details:", error);
        setError(error.response?.data?.message || "Error fetching cohort details");
      } finally {
        setLoading(false);
      }
    };

    fetchCohortDetails();
  }, [cohortId]);

  const handleJoinCohort = async () => {
    if (!isAuthenticated) {
      navigate("/email-signin", { 
        state: { redirectUrl: `/cohort/${cohortId}` }
      });
      return;
    }

    try {
      const response = await axiosInstance.post(`/cohort/${cohortId}/purchase`);
      if (response.data.paymentId) {
        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID,
          amount: cohort.pricing.total * 100, // Amount in smallest currency unit (paise)
          currency: cohort.pricing.currency || 'INR',
          name: "IndieGuru",
          description: `Cohort: ${cohort.title}`,
          order_id: response.data.paymentId,
          handler: function (response) {
            navigate("/payment-success", {
              state: {
                type: "cohort",
                details: {
                  title: cohort.title,
                  price: cohort.pricing.total,
                  date: new Date(cohort.startDate).toLocaleDateString()
                }
              }
            });
          }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (error) {
      console.error("Error joining cohort:", error);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </>
    );
  }

  if (error || !cohort) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
            <p className="text-gray-600">{error || "Cohort not found"}</p>
            <Button 
              onClick={() => navigate("/all-courses")}
              className="mt-4 bg-blue-600 text-white"
            >
              Back to Courses
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto p-6 pt-[120px]"
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="relative h-64 bg-gradient-to-r from-blue-600 to-indigo-600">
            <img 
              src={cohort.image || "/rectangle-2749.png"} 
              alt={cohort.title} 
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <h1 className="text-4xl font-bold text-white text-center px-4">{cohort.title}</h1>
            </div>
          </div>

          <div className="p-8">
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                <span>Starts {new Date(cohort.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                <span>{cohort.purchasedBy?.length || 0} enrolled</span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">About this Cohort</h2>
                  <p className="text-gray-600">{cohort.description}</p>

                  <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">What you'll learn</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    {cohort.learningObjectives?.map((objective, index) => (
                      <li key={index}>{objective}</li>
                    ))}
                  </ul>

                  <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Schedule</h3>
                  <p className="text-gray-600">
                    {`${new Date(cohort.startDate).toLocaleDateString()} - ${new Date(cohort.endDate).toLocaleDateString()}`}
                  </p>
                </div>
              </div>

              <div className="md:col-span-1">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-gray-900">₹{cohort.pricing?.total || 0}</div>
                    {cohort.pricing?.total && (
                      <div className="text-gray-500 line-through">₹{Math.floor(cohort.pricing.total * 1.2)}</div>
                    )}
                    <div className="text-sm text-gray-600 mt-2">
                      {cohort.pricing?.expertFee && `Expert Fee: ₹${cohort.pricing.expertFee}`}
                    </div>
                  </div>

                  <Button
                    onClick={handleJoinCohort}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full font-medium flex items-center justify-center gap-2"
                  >
                    <span>Join Cohort</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <img 
                          src={cohort.expertImage || "/placeholder-user.jpg"}
                          alt={cohort.expertName}
                          className="w-12 h-12 rounded-full"
                        />
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-900">{cohort.expertName}</h4>
                        <p className="text-sm text-gray-500">{cohort.expertTitle}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CohortDetails;