import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/button";
import { Calendar, Clock, Users, Award, ArrowRight } from "lucide-react";
import Header from "../components/layout/Header";

const BookingsPage = () => {
  const [activeTab, setActiveTab] = useState("upcoming");

  // Sample data for different categories
  const sampleData = {
    upcoming: {
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
        {
          id: 2,
          title: "Front-End Development Q&A",
          instructor: "Michael Torres - Senior Dev at Airbnb",
          date: "30 April 2025 • 10:00 AM - 12:00 PM",
          students: 24,
          price: 75,
          originalPrice: 100,
          image: "/rectangle-2749-3.png",
          color: "#00b6c4",
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
    },
    past: {
      courses: [
        {
          id: 1,
          title: "Python for Everybody Specialization",
          instructor: "John Smith - Principal Engineer at Amazon",
          date: "1 - 28 January 2025",
          students: 342,
          price: 567,
          originalPrice: 700,
          image: "/rectangle-2749-3.png",
          color: "#00b6c4",
          completed: true,
        },
      ],
      sessions: [
        {
          id: 1,
          title: "Networking for Tech Professionals",
          instructor: "Anna Martinez - CTO at Stripe",
          date: "15 March 2025 • 1:00 PM - 3:00 PM",
          students: 45,
          price: 50,
          originalPrice: 80,
          image: "/rectangle-2749-1.png",
          color: "#66bcff",
          completed: true,
        },
      ],
      cohorts: [
        {
          id: 1,
          title: "Full Stack Web Development Winter Cohort",
          instructor: "Team of 3 Senior Developers",
          date: "10 Nov 2024 - 28 Feb 2025",
          students: 28,
          price: 2500,
          originalPrice: 3000,
          image: "/rectangle-2749-2.png",
          color: "#ffc619",
          completed: true,
        },
      ],
    },
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Course card component
  const CourseCard = ({ course }) => {
    // Calculate discount percentage
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
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <Calendar className="w-4 h-4 mr-2" />
            {course.date}
          </div>
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
            {course.completed ? (
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6 flex items-center gap-2 transform transition-transform group-hover:scale-105">
                <Award className="w-4 h-4" />
                <span>Certificate</span>
              </Button>
            ) : (
              <Button className="bg-blue-800 hover:bg-[#0a2540] text-white rounded-full px-6 flex items-center gap-2 transform transition-transform group-hover:scale-105">
                <span>Join Now</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  // Render a category section
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

  // Custom tab indicator component
  const TabIndicator = ({ active, label, icon }) => (
    <button
      onClick={() => handleTabChange(label.toLowerCase())}
      className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
        active
          ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg shadow-blue-200"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {icon}
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
            <span className="text-blue-600 font-semibold mb-2 block">My Learning Journey</span>
            <h1 className="text-4xl sm:text-4xl font-bold text-[#0a2540] relative">
              My Bookings
              {/* <span className="absolute -bottom-2 left-0 w-24 h-1 bg-blue-500 rounded-full"></span> */}
            </h1>
          </div>
          <div className="w-32 h-32 relative">
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
            <img 
              src="/hello--users-people-hello.png" 
              alt="Learning illustration" 
              className="object-contain w-full h-full relative z-10" 
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-xl p-2 mb-16 flex w-full max-w-md mx-auto">
          <TabIndicator 
            active={activeTab === "upcoming"} 
            label="Upcoming" 
            icon={<Calendar className="w-5 h-5" />}
          />
          <TabIndicator 
            active={activeTab === "past"} 
            label="Past" 
            icon={<Clock className="w-5 h-5" />}
          />
        </div>

        {/* Content Sections */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CategorySection 
              title="Courses" 
              items={sampleData[activeTab].courses} 
            />
            
            <CategorySection 
              title="Sessions" 
              items={sampleData[activeTab].sessions} 
            />
            
            <CategorySection 
              title="Cohorts" 
              items={sampleData[activeTab].cohorts} 
            />

            {/* Empty state if no content */}
            {Object.values(sampleData[activeTab]).every(arr => !arr || arr.length === 0) && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 bg-white rounded-3xl shadow-lg p-12"
              >
                <div className="text-gray-400 text-8xl mb-6 animate-bounce">🔍</div>
                <h3 className="text-3xl font-bold text-gray-700 mb-4">No bookings found</h3>
                <p className="text-gray-500 text-lg mb-8">You don't have any {activeTab} bookings at the moment.</p>
                <Button className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-full px-8 py-6 text-lg hover:shadow-lg hover:shadow-blue-200 transition-all">
                  Explore Courses
                </Button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default BookingsPage;