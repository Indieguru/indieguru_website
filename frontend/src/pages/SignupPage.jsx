"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, BookOpen, Mail } from "lucide-react";
import axiosInstance from "../config/axios.config";
import useAuthStore from "../store/authStore";
import useUserTypeStore from "../store/userTypeStore";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [buttonText, setButtonText] = useState("Get OTP");
  const [errorMessage, setErrorMessage] = useState("");
  const [timer, setTimer] = useState(0);
  const [resendActive, setResendActive] = useState(false);
  const { isAuthenticated, fetchIsAuthenticated } = useAuthStore();
  const { userType, setUserType } = useUserTypeStore();
  const [assessmentData, setAssessmentData] = useState(null);
  const [isInApp, setIsInApp] = useState(false);
  const message = "Google Sign-In is disabled inside in-app browsers. Please open in Safari/Chrome.";

  useEffect(() => {
    // Load saved assessment data if it exists
    const savedData = localStorage.getItem("assessmentData");
    if (savedData) {
      setAssessmentData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && showOtpInput) {
      setResendActive(true);
    }
    return () => clearInterval(interval);
  }, [timer, showOtpInput]);

  
  useEffect(() => {
    setIsInApp(isInAppBrowser());
  }, []);

  const isInAppBrowser = () => {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    return (
      /FBAN|FBAV|Instagram|LinkedInApp|Twitter/i.test(ua) ||
      (ua.includes("wv") && ua.includes("Android")) ||
      ua.includes("GSA")
    );
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setErrorMessage("");
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    if (e.target.value.length === 6) {
      setErrorMessage("");
    }
  };

  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSendOtp = async () => {
    setErrorMessage("");
    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    try {
      // Choose the correct endpoint based on userType
      const endpoint = userType === "expert" 
        ? "/expert/auth/send-email-otp" 
        : "/user/auth/send-email-otp";
      
      const response = await axiosInstance.post(endpoint, {
        email: email,
        role: userType,
      });

      setShowOtpInput(true);
      setButtonText("Verify");
      setTimer(30);
      
      // In development mode, if OTP is included in the response, auto-fill it
      if (response.data.otp) {
        setOtp(response.data.otp);
        // Show a notice to the user
        setErrorMessage(`Dev mode: OTP auto-filled (${response.data.otp})`);
      }
    } catch (err) {
      setErrorMessage("Failed to send OTP: " + (err.response?.data?.message || err.message));
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setErrorMessage("Please enter a valid 6-digit OTP");
      return;
    }
    
    try {
      // Choose the correct endpoint based on userType
      const endpoint = userType === "expert" 
        ? "/expert/auth/verify-email-otp" 
        : "/user/auth/verify-email-otp";
      
      const response = await axiosInstance.post(endpoint, {
        email: email,
        otp: otp,
        role: userType,
      });
      // Store the userType before any async operations
      const selectedUserType = userType;
      
      // Update authentication state
      await fetchIsAuthenticated();
      
      // Navigate based on the originally selected userType
      console.log("Final navigation userType:", selectedUserType);
      if (selectedUserType === "expert") {
        navigate("/expert", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
      
    } catch (err) {
      console.error("Verification error:", err);
      setErrorMessage("Invalid OTP. Please try again.");
    }
  };

  const handleButtonClick = () => {
    if (!showOtpInput) {
      handleSendOtp();
    } else {
      handleVerifyOtp();
    }
  };

  const handleResendOtp = () => {
    setTimer(30);
    setResendActive(false);
    handleSendOtp();
  };

  const handleGoogleSigninClick = () => {
    const backendUrl =
      import.meta.env.VITE_TYPE === "production"
        ? import.meta.env.VITE_BACKEND_URL
        : `${import.meta.env.VITE_BACKEND_URL}:${import.meta.env.VITE_BACKEND_PORT}`;
    if (userType === "student") {
      window.location.href = `${backendUrl}/api/v1/user/auth/google`;
    } else {
      window.location.href = `${backendUrl}/api/v1/expert/auth/google`;
    }
  };

  const handleRoleChange = (role) => {
    setUserType(role);
  };

  return (
    <div className="max-w-[100vw] min-h-screen flex items-center justify-center p-4 mt-[-60px] md:p-8 lg:p-20 bg-gray-50 overflow-hidden">
      <div className="w-full max-w-7xl shadow-xl rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 bg-white">
        {/* Left side - Illustration */}
        <div className="hidden lg:flex flex-col justify-center items-center bg-[#0a2540] p-12 h-full">
          <img
            src="/image.png"
            alt="Person logging in"
            className="max-w-full h-auto rounded-xl shadow-lg"
            onError={(e) => {
              e.target.src =
                "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IndieGuru_Beta-9L3tfVpLjDlq5LGymU2bYWXxPz33Ei.png";
              e.target.onError = null;
            }}
          />
          <h2 className="text-white text-2xl font-bold mt-8 text-center">Expand your knowledge and skills</h2>
          <p className="text-blue-100 mt-4 text-center max-w-md">
            Join our community of learners and experts today to start your educational journey.
          </p>
        </div>

        {/* Right side - Form */}
        <div className="bg-gray-100 p-6 sm:p-10 md:p-12">
          <div className="max-w-md mx-auto">
            {/* Logo */}
            <div className="mb-8">
              <Link to="/" className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="IndieGuru Logo"
                  className="h-10 w-auto"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <span className="text-2xl font-bold text-[#0a2540]">IndieGuru</span>
              </Link>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-[#0a2540] mb-2">Welcome!</h1>
            <p className="text-lg text-[#185899] mb-8">Sign in to continue your journey.</p>

            {/* Role Selection */}
            <div className="mb-8">
              <p className="text-lg font-medium text-[#0a2540] mb-3">I am logging in as:</p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleRoleChange("student")}
                  className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
                    userType === "student"
                      ? "border-[#185899] bg-blue-50 text-[#185899]"
                      : "border-gray-200 hover:border-gray-300 text-gray-600"
                  }`}
                >
                  <BookOpen size={20} />
                  <span className="font-medium">Student</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange("expert")}
                  className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
                    userType === "expert"
                      ? "border-[#185899] bg-blue-50 text-[#185899]"
                      : "border-gray-200 hover:border-gray-300 text-gray-600"
                  }`}
                >
                  <User size={20} />
                  <span className="font-medium">Expert</span>
                </button>
              </div>
            </div>

            <form className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-lg font-medium text-[#0a2540]">
                  Email Address
                </label>
                {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
                <div className="flex">
                  <div className="relative w-full">
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="Enter your email address"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#185899] bg-white"
                    />
                    <Mail className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {showOtpInput && (
                <div className="space-y-2">
                  <label htmlFor="otp" className="block text-lg font-medium text-[#0a2540]">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={handleOtpChange}
                    placeholder="Enter the 6-digit OTP"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#185899] bg-white"
                  />
                  <div className="flex justify-between items-center">
                    {timer > 0 && (
                      <p className="text-sm text-gray-500">
                        Resend OTP in {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
                      </p>
                    )}
                    {resendActive && (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="text-[#185899] hover:underline"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleButtonClick}
                className="w-full bg-[#0a2540] text-white py-3 rounded-md hover:bg-[#185899] transition-colors font-medium"
              >
                {buttonText}
              </button>

              <div className="flex items-center justify-center">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="px-4 text-gray-500">or</span>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>

              <div className="signIn relative group">
                <button
                  type="button"
                  onClick={() => !isInApp && handleGoogleSigninClick()}
                  disabled={isInApp}
                  className={`w-full flex items-center bg-white justify-center gap-2 border border-gray-300 py-3 rounded-md transition-colors ${isInApp ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"}`}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M18.1711 8.36788H17.5V8.33329H10V11.6666H14.6422C13.9272 13.6916 12.1155 15.0833 10 15.0833C7.23891 15.0833 5.00002 12.8444 5.00002 10.0833C5.00002 7.32218 7.23891 5.08329 10 5.08329C11.2745 5.08329 12.4344 5.54385 13.3419 6.30274L15.7094 3.93524C14.1039 2.5241 12.1149 1.66663 10 1.66663C5.3978 1.66663 1.66669 5.39774 1.66669 9.99996C1.66669 14.6022 5.3978 18.3333 10 18.3333C14.6022 18.3333 18.3334 14.6022 18.3334 9.99996C18.3334 9.44107 18.2756 8.89718 18.1711 8.36788Z"
                      fill="#FFC107"
                    />
                    <path
                      d="M2.62744 6.12445L5.36522 8.12557C6.10744 6.29501 7.90078 5.08334 10 5.08334C11.2745 5.08334 12.4344 5.5439 13.3419 6.30279L15.7094 3.93529C14.1039 2.52415 12.1149 1.66668 10 1.66668C6.79168 1.66668 4.02255 3.47112 2.62744 6.12445Z"
                      fill="#FF3D00"
                    />
                    <path
                      d="M10 18.3333C12.0755 18.3333 13.9389 17.5041 15.3372 16.1458L12.7228 13.9375C11.8539 14.5875 10.8061 14.9792 10 14.9792C7.89725 14.9792 6.09393 13.6 5.37226 11.5917L2.58337 13.7125C3.96393 16.4125 6.76948 18.3333 10 18.3333Z"
                      fill="#4CAF50"
                    />
                    <path
                      d="M18.1711 8.36777H17.5V8.33319H10V11.6665H14.6422C14.2956 12.6315 13.6652 13.472 12.8517 14.0748L12.8522 14.0743L15.4667 16.2826C15.2356 16.4959 18.3333 14.1665 18.3333 9.99986C18.3333 9.44097 18.2756 8.89708 18.1711 8.36777Z"
                      fill="#1976D2"
                    />
                  </svg>
                  <span>Sign In with Google</span>
                </button>
                {isInApp && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block 
                  bg-black text-white text-xs px-3 py-2 rounded-md w-max shadow-lg z-20">
                  {message}
                </div>
              )}
              </div>
            </form>

            <p className="text-sm text-gray-600 mt-8 text-center">
              By proceeding, you agree to our{" "}
              <Link to="/terms" className="text-[#185899] hover:underline">
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-[#185899] hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;