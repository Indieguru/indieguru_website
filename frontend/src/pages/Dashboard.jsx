import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from "framer-motion";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import ProfileCard from "../components/sections/ProfileCard"
import InterestsCard from "../components/sections/InterestsCard"
import GoalsCard from "../components/sections/GoalsCard"
import ProgressSection from "../components/sections/ProgressSection"
import ReferSection from "../components/sections/ReferSection"
import PreviousSessionsSection from "../components/sections/PreviousSessionsSection"
import { Loader } from "../components/ui/loader"
import useUserStore from "../store/userStore";
import UpcomingCohorts from '../components/sections/upcomingCourses';
import useUserTypeStore from '../store/userTypeStore';
import DashboardExpertSearch from '../components/expert/DashboardExpertSearch';
import checkAuth from '../utils/checkAuth';
import useRedirectStore from '../store/redirectStore';

function Dashboard() {
  const { user, fetchUser } = useUserStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { userType, setUserType } = useUserTypeStore();
  const { redirectUrl, clearRedirectUrl } = useRedirectStore();
  const [loading, setLoading] = useState(true);
  const [authData, setAuthData] = useState(null);

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
        navigate("/expert");
        return;
      } else if (userType === "not_signed_in") {
        navigate("/signup");
        return;
      }
      
      // Handle redirects after successful authentication
      if (redirectUrl) {
        navigate(redirectUrl);
        clearRedirectUrl();
        return;
      }
      
      fetchUser();
    }
  }, [fetchUser, userType, navigate, authData, redirectUrl, clearRedirectUrl]);

  if (loading || !authData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader size="large" />
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.15 
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <motion.main
        className="container mx-auto px-4 py-24"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <ProfileCard />
          </motion.div>
          <motion.div variants={itemVariants}>
            <InterestsCard />
          </motion.div>
          <motion.div variants={itemVariants}>
            <GoalsCard />
          </motion.div>
        </motion.div>

        <motion.div 
          className="mt-6 grid sm:grid-rows-2 gap-4"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <ProgressSection />
          </motion.div>
          <motion.div variants={itemVariants}>
            <ReferSection />
          </motion.div>
        </motion.div>

        <motion.div 
          className="mt-8 grid grid-cols-1 gap-8"
          variants={containerVariants}
        >
          <DashboardExpertSearch />
          <motion.div variants={itemVariants}>
            <PreviousSessionsSection />
          </motion.div>
          <motion.div variants={itemVariants}>
            <UpcomingCohorts />
          </motion.div>
        </motion.div>
      </motion.main>

      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Dashboard;