import React from 'react';
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Link } from 'react-router-dom';
import UpcomingCourses from './upcomingCourses';

export default function EducationalPlatform() {
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-[#cceeed] to-[#e8f7f7] p-8 max-w-[100vw] py-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          className="flex justify-between items-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative hidden md:block w-48 h-24 transform hover:scale-105 transition-transform">
            <img src="/Group 237661.png" alt="Learn & Earn" className="object-contain w-full h-full filter drop-shadow-lg" />
          </div>
          <div className="flex-1 text-center mt-4">
            <h1 className="text-[#003265] text-5xl font-bold mb-4 tracking-tight">Upcoming sessions</h1>
            <div className="w-48 h-1.5 bg-gradient-to-r from-blue-800 to-[#00b6c4] mx-auto rounded-full shadow-sm"></div>
          </div>
          <Link to="/all-courses" className="hidden md:block">
            <Button className="bg-[#003265] text-white px-6 py-3 rounded-full hover:bg-[#004590] transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              View All
            </Button>
          </Link>
        </motion.div>

        {/* Course Section */}
        <UpcomingCourses />
      </div>
    </motion.div>
  );
}