import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
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
  const [experts, setExperts] = useState([]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axiosInstance.get("/user/auth/check-auth");
      } catch (error) {
        if (error.response.status === 401) {
          try {
            await axiosInstance.get("/user/auth/check-auth");
          } catch {
            // navigate("/signup");
          }
        } else {
          // navigate("/signup");
        }
      }
    };

    checkAuth();
    fetchUser();
  }, [navigate]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 transition-all duration-500">
      <Header />

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mt-28 mx-auto px-4 md:px-6"
      >
        {/* Greeting Section */}
        <motion.section 
          variants={itemVariants}
          className="mb-8 p-6 border-l-4 border-indigo-900 bg-white rounded-lg shadow-md transform hover:scale-[1.02] transition-all duration-300 hover:shadow-lg"
        >
          <h1 className="text-2xl font-semibold text-gray-800">Welcome back, {user.firstName}!</h1>
          <p className="text-sm text-gray-600 mt-1">Continue your learning journey where you left off</p>
        </motion.section>

        {/* Cards Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div 
            variants={itemVariants} 
            whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }} 
            transition={{ duration: 0.2 }}
          >
            <ProfileCard />
          </motion.div>
          <motion.div 
            variants={itemVariants} 
            whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }} 
            transition={{ duration: 0.2 }}
          >
            <InterestsCard />
          </motion.div>
          <motion.div 
            variants={itemVariants} 
            whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }} 
            transition={{ duration: 0.2 }}
          >
            <GoalsCard />
          </motion.div>
        </section>

        <motion.div 
          variants={itemVariants} 
          className="mt-12" // Increased margin for better section separation
        >
          <ProgressSection />
        </motion.div>
        
        {/* Gurus Section with enhanced animations */}
        <motion.div 
          variants={itemVariants} 
          whileHover={{ y: -5 }} 
          transition={{ duration: 0.3 }}
          className="mt-16 transform hover:shadow-lg rounded-xl overflow-hidden"
        >
          <GurusSection setExperts={setExperts} />
        </motion.div>
        
        {/* Experts Section with staggered animation */}
        <motion.div 
          variants={itemVariants} 
          whileHover={{ y: -5 }} 
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mt-12 transform hover:shadow-lg rounded-xl overflow-hidden"
        >
          <ExpertsSection experts={experts} />
        </motion.div>
        
        {/* Refer Section with attention-grabbing animation */}
        <motion.div 
          variants={itemVariants}  
          transition={{ duration: 0.3 }}
          className="mt-16 transform rounded-xl overflow-hidden"
        >
          <ReferSection />
        </motion.div>
        
        {/* Previous Sessions with smooth reveal */}
        <motion.div 
          variants={itemVariants} 
          whileHover={{ y: -5 }} 
          transition={{ duration: 0.3 }}
          className="mt-12 transform hover:shadow-lg rounded-xl overflow-hidden"
        >
          <PreviousSessionsSection />
        </motion.div>
        
        {/* Upcoming Courses with subtle scale effect */}
        <motion.div 
          variants={itemVariants} 
          whileHover={{ scale: 1.01 }} 
          transition={{ duration: 0.3 }}
          className="mt-12 mb-16 transform hover:shadow-lg rounded-xl overflow-hidden"
        >
          <UpcomingCourses />
        </motion.div>
      </motion.main>

      <Footer />
    </div>
  )
}

export default Dashboard