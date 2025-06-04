"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"

const CategoryBrowser = () => {
  const navigate = useNavigate();
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const sectionRefCurrent = sectionRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRefCurrent) {
      observer.observe(sectionRefCurrent);
    }

    return () => {
      if (sectionRefCurrent) {
        observer.unobserve(sectionRefCurrent);
      }
    };
  }, []);

  const categories = [
    {
      id: "technology",
      title: "Technology",
      color: "#beeeed",
      iconColor: "#65d9d7",
      iconPath: "/group-1.png",
    },
    {
      id: "healthcare",
      title: "Healthcare",
      color: "#ffcccc",
      iconColor: "#f99d9d",
      iconPath: "/group-2.png",
    },
    {
      id: "finance",
      title: "Finance",
      color: "#bcd3eb",
      iconColor: "#6dadef",
      iconPath: "/group-2-1.png",
    },
    {
      id: "education",
      title: "Education",
      color: "#fff0cc",
      iconColor: "#fbb236",
      iconPath: "/group.png",
    },
    {
      id: "engineering",
      title: "Engineering",
      color: "#d9f0d6",
      iconColor: "#7ac673",
      iconPath: "/group-3.png",
    },
    {
      id: "marketing",
      title: "Marketing",
      color: "#ffe0cc",
      iconColor: "#ff9966",
      iconPath: "/group-1.png",
    },
    {
      id: "design",
      title: "Design",
      color: "#e0ccff",
      iconColor: "#b366ff",
      iconPath: "/group-2.png",
    },
    {
      id: "business",
      title: "Business Management",
      color: "#ffcce6",
      iconColor: "#ff66b3",
      iconPath: "/group-2-1.png",
    },
    {
      id: "data-science",
      title: "Data Science",
      color: "#ccf2ff",
      iconColor: "#66d9ff",
      iconPath: "/group.png",
    },
    {
      id: "research",
      title: "Research & Development",
      color: "#f2ffcc",
      iconColor: "#ccff66",
      iconPath: "/group-3.png",
    },
    {
      id: "manufacturing",
      title: "Manufacturing",
      color: "#ffe6cc",
      iconColor: "#ffb366",
      iconPath: "/group-1.png",
    },
    {
      id: "consulting",
      title: "Consulting",
      color: "#cce6ff",
      iconColor: "#66b3ff",
      iconPath: "/group-2.png",
    },
    {
      id: "law",
      title: "Law",
      color: "#ffcccc",
      iconColor: "#ff6666",
      iconPath: "/group-2-1.png",
    },
    {
      id: "media",
      title: "Media & Entertainment",
      color: "#e6ffcc",
      iconColor: "#b3ff66",
      iconPath: "/group.png",
    },
    {
      id: "architecture",
      title: "Architecture",
      color: "#ccffe6",
      iconColor: "#66ffb3",
      iconPath: "/group-3.png",
    },
    {
      id: "life-sciences",
      title: "Life Sciences",
      color: "#ffcce6",
      iconColor: "#ff66b3",
      iconPath: "/group-1.png",
    },
  ]

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId)
    navigate(`/browse-experts/${categoryId}`)
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      ref={sectionRef}
      className="max-w-[100vw] py-16 px-4 mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
    >
      <motion.div
        className="text-center mb-12"
        variants={itemVariants}
      >
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-[#003265] mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Browse by Category
        </motion.h2>
        <motion.div 
          className="w-48 h-1 bg-blue-800 mx-auto"
          initial={{ scaleX: 0 }}
          animate={isVisible ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        />
      </motion.div>

      <motion.div
        className="relative overflow-hidden"
        variants={itemVariants}
      >
        <div 
          className="flex gap-6 snap-x snap-mandatory pb-4 px-4 overflow-x-scroll no-scrollbar"
          style={{ 
            scrollSnapType: 'x mandatory', 
            scrollBehavior: 'smooth', 
            WebkitOverflowScrolling: 'touch', 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none' 
          }}
        >
          {categories.concat(categories).map((category, index) => (
            <motion.div
              key={index}
              className="flex-none w-64 h-72 snap-center cursor-pointer"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCategoryClick(category.id)}
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <motion.div
                className={`w-64 h-72 rounded-xl overflow-hidden shadow-md transition-all duration-300 ${
                  selectedCategory === category.id ? "ring-4 ring-[#003265]" : ""
                }`}
                style={{ backgroundColor: category.color }}
                animate={{
                  scale: selectedCategory === category.id ? 1.05 : 1,
                  boxShadow: hoveredCategory === category.id 
                    ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                    : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-8 flex flex-col items-center">
                  <motion.div
                    className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
                    style={{ backgroundColor: `${category.iconColor}40` }}
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.img
                      src={category.iconPath}
                      alt={category.title}
                      className="w-12 h-12 object-contain"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    />
                  </motion.div>
                  <motion.h3
                    className="text-xl md:text-2xl font-semibold text-center"
                    style={{
                      color: category.iconColor,
                      opacity: hoveredCategory === category.id ? 1 : 0.8
                    }}
                  >
                    {category.title}
                  </motion.h3>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedCategory && (
          <motion.div
            className="mt-8 p-6 bg-white rounded-lg shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <motion.h3 
              className="text-xl font-semibold text-[#003265] mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {categories.find((c) => c.id === selectedCategory)?.title} Courses
            </motion.h3>
            <motion.p 
              className="text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Explore our selection of courses in this category. Click on any course to learn more and enroll.
            </motion.p>
            <motion.button
              className="mt-4 px-6 py-2 bg-blue-800 text-white rounded-md hover:bg-[#0a2540] transition-colors"
              onClick={() => console.log(`View all ${selectedCategory} courses`)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View All Courses
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CategoryBrowser;