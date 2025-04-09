import React from "react";
import { Button } from "../ui/button.jsx"; // Ensure the file extension is correct
import { motion } from "framer-motion"; // Import framer-motion

export default function EducationalPlatform() {
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
      className="min-h-screen bg-[#cceeed] p-8 max-w-[100vw]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          className="flex justify-between items-start mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative w-48 h-24">
            <img src="/Group 237661.png" alt="Learn & Earn" className="object-contain w-full h-full" />
          </div>
          <div className="flex-1 text-center mt-4">
            <h1 className="text-[#003265] text-5xl font-bold mb-2">Upcoming sessions</h1>
            <div className="w-48 h-1 bg-[#003265] mx-auto"></div>
          </div>
          <div className="w-28 h-auto mt-2">
            <img src="/hello--users-people-hello.png" alt="Video call illustration" className="object-contain w-full h-full" />
          </div>
        </motion.div>

        {/* Course Cards - Horizontal Scroll */}
        <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 px-4 scrollbar-hide"
               style={{ scrollSnapType: 'x mandatory', scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
            {courses.concat(courses).map((course, index) => (
              <motion.div
                key={index}
                className="flex-none w-80 snap-center bg-white rounded-lg overflow-hidden shadow-md"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                <div className="h-48" style={{ backgroundColor: course.color }}>
                  <img src={course.image} alt={course.title} className="w-full h-full object-contain" />
                </div>
                <div className="p-4">
                  <div className="text-sm text-gray-500 mb-2">{course.date}</div>
                  <h3 className="text-lg font-bold text-[#003265] mb-3">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-6">{course.instructor}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-baseline">
                      <span className="text-xl font-bold text-[#003265]">$ {course.price}</span>
                      <span className="ml-2 text-gray-400 line-through text-sm">$ {course.originalPrice}</span>
                    </div>
                    <Button className="bg-[#003265] hover:bg-[#0a2540] text-white">Enroll Now</Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}