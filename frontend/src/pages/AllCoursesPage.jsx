import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/button";
import { Users, ArrowRight } from "lucide-react";
import Header from "../components/layout/Header";

const AllCoursesPage = () => {
  const [activeTab, setActiveTab] = useState("all");

  // Sample data structure similar to bookings page
  const contentData = {
    courses: [
      {
        id: 1,
        title: "Product Management Basic - Course",
        instructor: "Sarah Johnson - Head of Product Customer Platform Gojek Indonesia",
        date: "1 - 28 July 2025",
        students: 40,
        price: 380,
        originalPrice: 500,
        image: "/rectangle-2749.png",
        color: "#00b6c4",
      },
      {
        id: 2,
        title: "BM Data Science Professional Certificate",
        instructor: "David Lee - AI Research Lead at Microsoft",
        date: "15 July - 10 August 2025",
        students: 11,
        price: 678,
        originalPrice: 850,
        image: "/rectangle-2749-1.png",
        color: "#ffc619",
      },
    ],
    sessions: [
      {
        id: 1,
        title: "Design Thinking Workshop",
        instructor: "Lisa Wong - UX/UI Director at Google",
        date: "25 April 2025 • 2:00 PM - 4:00 PM",
        students: 18,
        price: 120,
        originalPrice: 200,
        image: "/rectangle-2749-2.png",
        color: "#66bcff",
      },
    ],
    cohorts: [
      {
        id: 1,
        title: "Data Science Spring 2025 Cohort",
        instructor: "Team of 5 Industry Experts",
        date: "15 May - 30 July 2025",
        students: 32,
        price: 1200,
        originalPrice: 1500,
        image: "/rectangle-2749.png",
        color: "#ffc619",
      },
    ],
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
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

  const CourseCard = ({ course }) => {
    const discountPercentage = Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100);
    
    return (
      <motion.div
        variants={itemVariants}
        whileHover={{ y: -8, transition: { duration: 0.2 } }}
        className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
      >
        <div className="relative h-48" style={{ backgroundColor: course.color }}>
          <img src={course.image} alt={course.title} className="w-full h-full object-contain" />
          {discountPercentage > 0 && (
            <div className="absolute top-4 right-4 bg-red-500 text-white font-bold py-1 px-3 rounded-full text-sm">
              {discountPercentage}% OFF
            </div>
          )}
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-[#003265] mb-3 group-hover:text-blue-600 transition-colors">
            {course.title}
          </h3>
          <p className="text-sm text-gray-600 mb-4 flex items-center">
            <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
              {course.instructor.charAt(0)}
            </span>
            {course.instructor}
          </p>
          
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <Users className="w-4 h-4 mr-2" />
            <span>{course.students} students enrolled</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-[#003265]">${course.price}</span>
              <span className="ml-2 text-gray-400 line-through text-sm">${course.originalPrice}</span>
            </div>
            <Button className="bg-blue-800 hover:bg-[#0a2540] text-white rounded-full px-6 flex items-center gap-2 transform transition-transform group-hover:scale-105">
              <span>Enroll Now</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    );
  };

  const CategorySection = ({ title, items }) => {
    if (!items || items.length === 0) return null;
    
    return (
      <div className="mb-16">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-2xl font-bold text-[#003265] relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-1 after:bg-blue-500 after:rounded-full pb-2">
            {title}
          </h2>
          <div className="h-0.5 flex-grow bg-gradient-to-r from-blue-200 to-transparent rounded-full"></div>
        </div>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {items.map((item) => (
            <CourseCard key={item.id} course={item} />
          ))}
        </motion.div>
      </div>
    );
  };

  const TabButton = ({ label, active }) => (
    <button
      onClick={() => setActiveTab(label.toLowerCase())}
      className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
        active
          ? "bg-blue-800 text-white shadow-lg"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto p-6 pt-[120px]"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between mb-12">
          <div className="mb-6 sm:mb-0">
            <h1 className="text-4xl sm:text-5xl font-bold text-[#0a2540] mb-4">
              Explore Learning Opportunities
            </h1>
            <p className="text-gray-600 text-lg">
              Discover courses, sessions, and cohorts tailored to your learning journey
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-3 mb-16 flex gap-2 w-full max-w-lg mx-auto">
          <TabButton active={activeTab === "all"} label="All" />
          <TabButton active={activeTab === "courses"} label="Courses" />
          <TabButton active={activeTab === "sessions"} label="Sessions" />
          <TabButton active={activeTab === "cohorts"} label="Cohorts" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "all" && (
              <>
                <CategorySection title="Featured Courses" items={contentData.courses} />
                <CategorySection title="Upcoming Sessions" items={contentData.sessions} />
                <CategorySection title="Active Cohorts" items={contentData.cohorts} />
              </>
            )}
            {activeTab === "courses" && (
              <CategorySection title="All Courses" items={contentData.courses} />
            )}
            {activeTab === "sessions" && (
              <CategorySection title="All Sessions" items={contentData.sessions} />
            )}
            {activeTab === "cohorts" && (
              <CategorySection title="All Cohorts" items={contentData.cohorts} />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AllCoursesPage;