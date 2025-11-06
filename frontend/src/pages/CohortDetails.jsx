import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Users, ArrowRight, AlertTriangle, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import LoadingScreen from "../components/common/LoadingScreen";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import axiosInstance from "../config/axios.config";
import useAuthStore from "../store/authStore";
import { toast } from "react-toastify";
import useUserTypeStore from "../store/userTypeStore";
import useRedirectStore from "../store/redirectStore";
import useUserStore from "../store/userStore";
import PhoneUpdateModal from "../components/modals/PhoneUpdateModal";
import initiateRazorpayPayment from "../components/paymentGateway/RazorpayButton"; // Adjust the import path as necessary

const CohortDetails = () => {
  const { cohortId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { userType } = useUserTypeStore();
  const { setRedirectUrl } = useRedirectStore();
  const { user, fetchUser } = useUserStore();
  const [cohort, setCohort] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

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
    if (!isAuthenticated || userType === "not_signed_in") {
      // Save the current URL to redirect back after login
      setRedirectUrl(window.location.pathname);
      navigate("/signup");
      return;
    }

    if (userType === "expert") {
      toast.info("Please sign in as a student to join this cohort", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      return;
    }

    // Check if cohort is approved
    if (cohort.status !== "approved") {
      toast.error("This cohort is not available for enrollment at this time.", {
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

    // If phone exists, proceed with joining cohort
    proceedWithJoining();
  };

  const handlePhoneUpdateSuccess = (phoneNumber) => {
    setShowPhoneModal(false);
    fetchUser(); // Refresh user data
    toast.success("Phone number updated! Proceeding with cohort registration.", {
      position: "top-center",
      autoClose: 3000,
    });
    // Proceed with purchase after phone update
    proceedWithJoining();
  };

  const proceedWithJoining = async () => {
    console.log("Initiating payment for cohort:", cohortId,cohort.pricing?.total);
      const res = await initiateRazorpayPayment({   
              amount: cohort.pricing?.total,
              bookingType: "Cohort",
              id: cohortId,
            });
  // Check if payment link generation was successful
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
        setIsJoining(true);
        const response = await axiosInstance.post(`/cohort/${cohortId}/purchase`,{
        paymentId: res.data.payment._id
        });
        if (response.status === 200) {
          setIsJoining(false);
          navigate('/dashboard');
          }

        
      } catch (error) {
        console.error("Error joining cohort:", error);
        toast.error(error.response?.data?.message || "Failed to join cohort. Please try again.");
      } finally {
        setIsJoining(false);
      }
    }
    else{
      console.log("Something Went Wrong")
    }
  };

  if (loading) {
    return <LoadingScreen />;
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
              className="mt-4 bg-blue-800 text-white"
            >
              Back to Courses
            </Button>
          </div>
        </div>
      </>
    );
  }

  // Display cohort status notification
  const renderStatusBanner = () => {
    if (cohort.status === "pending") {
      return (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-amber-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-700">
                This cohort is pending approval and is not available for enrollment yet.
              </p>
            </div>
          </div>
        </div>
      );
    } else if (cohort.status === "rejected") {
      return (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">This cohort is not available for enrollment.</p>
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
            {/* Status Banner */}
            {renderStatusBanner()}

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
                    disabled={isJoining || cohort.status !== "approved"}
                    className="w-full bg-blue-800 hover:bg-blue-700 text-white py-3 rounded-full font-medium flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isJoining ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      <>
                        <span>Join Cohort</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
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
      <Footer />
    </div>
  );
};

export default CohortDetails;