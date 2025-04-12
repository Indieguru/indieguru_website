import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import ProfileCard from "../components/sections/ProfileCard"
import InterestsCard from "../components/sections/InterestsCard"
import GoalsCard from "../components/sections/GoalsCard"
import ProgressSection from "../components/sections/ProgressSection"
import GurusSection from "../components/sections/GurusSection"
import ExpertsSection from "../components/sections/ExpertsSection"
import ReferSection from "../components/sections/ReferSection"
import PreviousSessionsSection from "../components/sections/PreviousSessionsSection"
import useUserStore from "../store/userStore";
import axiosInstance from "../config/axios.config";
import UpcomingCourses from '../components/sections/upcomingCourses';

function Dashboard() {
  const { user, fetchUser } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axiosInstance.get("/user/auth/check-auth");
      } catch (error) {
        if (error.response.status === 401) {
          try {
            await axiosInstance.post("/user/auth/refresh-token");
            await axiosInstance.get("/user/auth/check-auth");
          } catch {
            navigate("/signup");
          }
        } else {
          navigate("/signup");
        }
      }
    };

    checkAuth();
    fetchUser();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mt-28 mx-auto px-4 md:px-6">
        {/* Greeting Section */}
        <section className="mb-8 p-4 border-l-4 border-indigo-500 bg-white rounded-lg shadow-sm animate-fade-in-down">
          <h1 className="text-2xl font-semibold text-gray-800">Welcome back, {user.firstName}!</h1>
          <p className="text-sm text-gray-600">Continue your learning journey where you left off</p>
        </section>

        {/* Cards Section with staggered animation */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <ProfileCard />
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <InterestsCard />
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <GoalsCard />
          </div>
        </section>

        <div className="animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <ProgressSection />
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          <GurusSection />
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          <ExpertsSection />
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: "0.7s" }}>
          <ReferSection />
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
          <PreviousSessionsSection />
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
          <UpcomingCourses />
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Dashboard