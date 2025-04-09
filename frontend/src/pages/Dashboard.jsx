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
            navigate("/login");
          }
        } else {
          navigate("/login");
        }
      }
    };

    checkAuth();
    fetchUser();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-7xl mt-28 mx-auto px-4 md:px-6">
        {/* Greeting Section */}
        <section className="mb-8">
          <h1 className="text-2xl font-semibold text-[#232636]">How are you {user.firstName}?</h1>
          <p className="text-sm text-[#6d6e76]">Lorem ipsum dolor sit amet, consectetur ipsum adipiscing</p>
        </section>

        {/* Cards Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <ProfileCard />
          <InterestsCard />
          <GoalsCard />
        </section>

        <ProgressSection />
        <GurusSection />
        <ExpertsSection />
        <ReferSection />
        <PreviousSessionsSection />

      </main>

      <Footer />
    </div>
  )
}

export default Dashboard

