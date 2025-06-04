import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import ProfileCard from "../components/sections/ProfileCard"
import InterestsCard from "../components/sections/InterestsCard"
import GoalsCard from "../components/sections/GoalsCard"
import ProgressSection from "../components/sections/ProgressSection"
import ReferSection from "../components/sections/ReferSection"
import PreviousSessionsSection from "../components/sections/PreviousSessionsSection"
import useUserStore from "../store/userStore";
import UpcomingCourses from '../components/sections/upcomingCourses';
import useUserTypeStore from '../store/userTypeStore';
import ExpertSearch from '../components/expert/ExpertSearch';
import checkAuth from '../utils/checkAuth';

function Dashboard() {
  const { user, fetchUser } = useUserStore();
  const navigate = useNavigate();
  const { userType, setUserType } = useUserTypeStore();
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
      fetchUser();
    }
  }, [fetchUser, userType, navigate, authData]);

  if (loading || !authData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
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
          className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8"
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
          <ExpertSearch />
          <motion.div variants={itemVariants}>
            <PreviousSessionsSection />
          </motion.div>
          <motion.div variants={itemVariants}>
            <UpcomingCourses />
          </motion.div>
        </motion.div>
      </motion.main>

      <Footer />
    </div>
  );
}

export default Dashboard;