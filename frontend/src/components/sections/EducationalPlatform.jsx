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
          className="flex justify-center items-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="text-center">
            <h1 className="text-[#003265] text-5xl font-bold mb-4 tracking-tight">Upcoming sessions</h1>
            {/* <div className="w-48 h-1.5 bg-gradient-to-r from-blue-800 to-[#00b6c4] mx-auto rounded-full shadow-sm"></div> */}
          </div>
        </motion.div>

        {/* Course Section */}
        <UpcomingCourses />
      </div>
    </motion.div>
  );
}