import React, { useRef } from "react";
import { Button } from "../ui/button.jsx"; // Ensure the file extension is correct
import { motion } from "framer-motion"; // Import framer-motion
import { Link } from "react-router-dom"; // Add this import

export default function EducationalPlatform() {
  const scrollContainerRef = useRef(null);
  
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 336, // Width of card (320px) + gap (16px)
        behavior: 'smooth'
      });
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -336,
        behavior: 'smooth'
      });
    }
  };

  const courses = [
    {
      id: 1,
      title: "Product Management Basic - Course",
      instructor: "Sarah Johnson - Head of Product Customer Platform Gojek Indonesia",
      date: "1 - 28 July 2022",
      students: 40,
      price: 380,
      originalPrice: 500,
      image: "/rectangle-2749.png",
      color: "#00b6c4",
    },
    {
      id: 2,
      title: "BM Data Science Professional Certificate",
      instructor: "Sarah Johnson - Head of Product Customer Platform Gojek Indonesia",
      date: "1 - 28 July 2022",
      students: 11,
      price: 678,
      originalPrice: 500,
      image: "/rectangle-2749-1.png",
      color: "#ffc619",
    },
    {
      id: 3,
      title: "The Science of Well-Being",
      instructor: "Sarah Johnson - Head of Product Customer Platform Gojek Indonesia",
      date: "1 - 28 July 2022",
      students: 234,
      price: 123,
      originalPrice: 500,
      image: "/rectangle-2749-2.png",
      color: "#66bcff",
    },
    {
      id: 4,
      title: "Python for Everybody Specialization",
      instructor: "Sarah Johnson - Head of Product Customer Platform Gojek Indonesia",
      date: "1 - 28 July 2022",
      students: 342,
      price: 567,
      originalPrice: 500,
      image: "/rectangle-2749-3.png",
      color: "#00b6c4",
    },
  ];

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
          className="flex justify-between items-start mb-16"
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

        {/* Course Cards - Horizontal Scroll */}
        <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div 
            ref={scrollContainerRef}
            className="flex gap-8 overflow-x-auto snap-x snap-mandatory pb-8 px-4 scrollbar-hide relative"
            style={{ scrollSnapType: 'x mandatory', scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch', msOverflowStyle: 'none', scrollbarWidth: 'none' }}
          >
            {courses.concat(courses).map((course, index) => (
              <motion.div
                key={index}
                className="flex-none w-[340px] snap-center bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div 
                  className="h-52 relative overflow-hidden group"
                  style={{ backgroundColor: course.color }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-300" 
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <div className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {course.date}
                    </div>
                    <div className="ml-auto flex items-center text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                      {course.students} students
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-[#003265] mb-3 leading-tight hover:text-blue-700 transition-colors duration-200">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-6 line-clamp-2">{course.instructor}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-[#003265]">$ {course.price}</span>
                      <span className="text-sm text-gray-400 line-through">$ {course.originalPrice}</span>
                    </div>
                    <Button 
                      className="bg-[#003265] hover:bg-[#004590] text-white px-6 py-2.5 rounded-full font-medium transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      Enroll Now
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Scroll Arrows */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg z-10 transition-all duration-200 hover:scale-110 hover:shadow-xl border border-gray-100"
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-6 h-6 text-[#003265]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>

          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg z-10 transition-all duration-200 hover:scale-110 hover:shadow-xl border border-gray-100"
            style={{ transform: 'translate(50%, -50%)' }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-6 h-6 text-[#003265]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}