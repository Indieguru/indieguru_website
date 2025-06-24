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
      id: "software-development",
      title: "Software Development",
      color: "#beeeed",
      iconColor: "#65d9d7",
      iconPath: "/group-1.png",
    },
    {
      id: "ai-ml",
      title: "AI/ML",
      color: "#ffcccc",
      iconColor: "#f99d9d",
      iconPath: "/group-2.png",
    },
    {
      id: "data-science",
      title: "Data Science",
      color: "#bcd3eb",
      iconColor: "#6dadef",
      iconPath: "/group-2-1.png",
    },
    {
      id: "cybersecurity",
      title: "Cybersecurity",
      color: "#fff0cc",
      iconColor: "#fbb236",
      iconPath: "/group.png",
    },
    {
      id: "cloud-computing-devops",
      title: "Cloud Computing & DevOps",
      color: "#d9f0d6",
      iconColor: "#7ac673",
      iconPath: "/group-3.png",
    },
    {
      id: "product-management",
      title: "Product Management",
      color: "#ffe0cc",
      iconColor: "#ff9966",
      iconPath: "/group-1.png",
    },
    {
      id: "psychology-therapy",
      title: "Psychology & Therapy",
      color: "#e0ccff",
      iconColor: "#b366ff",
      iconPath: "/group-2.png",
    },
    {
      id: "business-analysis",
      title: "Business Analysis",
      color: "#ffcce6",
      iconColor: "#ff66b3",
      iconPath: "/group-2-1.png",
    },
    {
      id: "strategy-operations",
      title: "Strategy & Operations",
      color: "#ccf2ff",
      iconColor: "#66d9ff",
      iconPath: "/group.png",
    },
    {
      id: "data-analysis",
      title: "Data Analysis",
      color: "#f2ffcc",
      iconColor: "#ccff66",
      iconPath: "/group-3.png",
    },
    {
      id: "chartered-accountancy",
      title: "Chartered Accountancy (CA)",
      color: "#ffe6cc",
      iconColor: "#ffb366",
      iconPath: "/group-1.png",
    },
    {
      id: "cfa",
      title: "CFA",
      color: "#cce6ff",
      iconColor: "#66b3ff",
      iconPath: "/group-2.png",
    },
    {
      id: "investment-banking",
      title: "Investment Banking",
      color: "#ffcccc",
      iconColor: "#ff6666",
      iconPath: "/group-2-1.png",
    },
    {
      id: "financial-planning-analysis",
      title: "Financial Planning & Analysis",
      color: "#e6ffcc",
      iconColor: "#b3ff66",
      iconPath: "/group.png",
    },
    {
      id: "fintech-roles",
      title: "FinTech Roles",
      color: "#ccffe6",
      iconColor: "#66ffb3",
      iconPath: "/group-3.png",
    },
    {
      id: "corporate-criminal-law",
      title: "Corporate & Criminal Law",
      color: "#ffcce6",
      iconColor: "#ff66b3",
      iconPath: "/group-1.png",
    },
    {
      id: "company-secretary",
      title: "Company Secretary",
      color: "#beeeed",
      iconColor: "#65d9d7",
      iconPath: "/group-2.png",
    },
    {
      id: "digital-marketing",
      title: "Digital Marketing",
      color: "#ffcccc",
      iconColor: "#f99d9d",
      iconPath: "/group-2-1.png",
    },
    {
      id: "seo",
      title: "SEO",
      color: "#bcd3eb",
      iconColor: "#6dadef",
      iconPath: "/group.png",
    },
    {
      id: "graphic-designing",
      title: "Graphic Designing",
      color: "#fff0cc",
      iconColor: "#fbb236",
      iconPath: "/group-3.png",
    },
    {
      id: "pr-corporate-communication",
      title: "PR & Corporate Communication",
      color: "#d9f0d6",
      iconColor: "#7ac673",
      iconPath: "/group-1.png",
    },
    {
      id: "content-writing-copywriting",
      title: "Content Writing & Copywriting",
      color: "#ffe0cc",
      iconColor: "#ff9966",
      iconPath: "/group-2.png",
    },
    {
      id: "growth-marketing",
      title: "Growth Marketing",
      color: "#e0ccff",
      iconColor: "#b366ff",
      iconPath: "/group-2-1.png",
    },
    {
      id: "industrial-design",
      title: "Industrial Design",
      color: "#ffcce6",
      iconColor: "#ff66b3",
      iconPath: "/group.png",
    },
    {
      id: "robotics-mechatronics",
      title: "Robotics & Mechatronics",
      color: "#ccf2ff",
      iconColor: "#66d9ff",
      iconPath: "/group-3.png",
    },
    {
      id: "ui-ux-interaction-design",
      title: "UI/UX & Interaction Design",
      color: "#f2ffcc",
      iconColor: "#ccff66",
      iconPath: "/group-1.png",
    },
    {
      id: "fashion-design",
      title: "Fashion Design",
      color: "#ffe6cc",
      iconColor: "#ffb366",
      iconPath: "/group-2.png",
    },
    {
      id: "interior-spatial-design",
      title: "Interior & Spatial Design",
      color: "#cce6ff",
      iconColor: "#66b3ff",
      iconPath: "/group-2-1.png",
    },
    {
      id: "animation-illustration",
      title: "Animation & Illustration",
      color: "#ffcccc",
      iconColor: "#ff6666",
      iconPath: "/group.png",
    },
    {
      id: "fine-arts-applied-arts",
      title: "Fine Arts & Applied Arts",
      color: "#e6ffcc",
      iconColor: "#b3ff66",
      iconPath: "/group-3.png",
    },
    {
      id: "architecture",
      title: "Architecture",
      color: "#ccffe6",
      iconColor: "#66ffb3",
      iconPath: "/group-1.png",
    },
    {
      id: "public-policy-governance",
      title: "Public Policy & Governance",
      color: "#ffcce6",
      iconColor: "#ff66b3",
      iconPath: "/group-2.png",
    },
    {
      id: "exam-prep-upsc",
      title: "Exam Prep Mentorship - UPSC",
      color: "#beeeed",
      iconColor: "#65d9d7",
      iconPath: "/group-2-1.png",
    },
    {
      id: "exam-prep-cuet",
      title: "Exam Prep Mentorship - CUET",
      color: "#ffcccc",
      iconColor: "#f99d9d",
      iconPath: "/group.png",
    },
    {
      id: "exam-prep-net",
      title: "Exam Prep Mentorship - NET",
      color: "#bcd3eb",
      iconColor: "#6dadef",
      iconPath: "/group-3.png",
    },
    {
      id: "exam-prep-jee",
      title: "Exam Prep Mentorship - JEE",
      color: "#fff0cc",
      iconColor: "#fbb236",
      iconPath: "/group-1.png",
    },
    {
      id: "exam-prep-gmat-gre",
      title: "Exam Prep Mentorship - GMAT/GRE",
      color: "#d9f0d6",
      iconColor: "#7ac673",
      iconPath: "/group-2.png",
    },
    {
      id: "exam-prep-banking-govt",
      title: "Exam Prep Mentorship - Banking and other govt exams",
      color: "#ffe0cc",
      iconColor: "#ff9966",
      iconPath: "/group-2-1.png",
    },
    {
      id: "exam-prep-net-jrf",
      title: "Exam Prep Mentorship - NET/JRF",
      color: "#e0ccff",
      iconColor: "#b366ff",
      iconPath: "/group.png",
    },
    {
      id: "journalism",
      title: "Journalism (Print & Digital)",
      color: "#ffcce6",
      iconColor: "#ff66b3",
      iconPath: "/group-3.png",
    },
    {
      id: "content-creation",
      title: "Content Creation (YouTube, Podcasting)",
      color: "#ccf2ff",
      iconColor: "#66d9ff",
      iconPath: "/group-1.png",
    },
    {
      id: "film-video-production",
      title: "Film & Video Production",
      color: "#f2ffcc",
      iconColor: "#ccff66",
      iconPath: "/group-2.png",
    },
    {
      id: "advertising-copywriting",
      title: "Advertising & Copywriting",
      color: "#ffe6cc",
      iconColor: "#ffb366",
      iconPath: "/group-2-1.png",
    },
    {
      id: "ott-new-media",
      title: "OTT & New Media",
      color: "#cce6ff",
      iconColor: "#66b3ff",
      iconPath: "/group.png",
    },
    {
      id: "business-growth",
      title: "Business Growth",
      color: "#ffcccc",
      iconColor: "#ff6666",
      iconPath: "/group-3.png",
    },
    {
      id: "program-management",
      title: "Program Management",
      color: "#e6ffcc",
      iconColor: "#b3ff66",
      iconPath: "/group-1.png",
    },
    {
      id: "hotel-management",
      title: "Hotel Management",
      color: "#ccffe6",
      iconColor: "#66ffb3",
      iconPath: "/group-2.png",
    },
    {
      id: "culinary-arts-bakery",
      title: "Culinary Arts & Bakery",
      color: "#ffcce6",
      iconColor: "#ff66b3",
      iconPath: "/group-2-1.png",
    },
    {
      id: "tourism-travel",
      title: "Tourism & Travel",
      color: "#beeeed",
      iconColor: "#65d9d7",
      iconPath: "/group.png",
    },
    {
      id: "aviation-cabin-crew",
      title: "Aviation & Cabin Crew",
      color: "#ffcccc",
      iconColor: "#f99d9d",
      iconPath: "/group-3.png",
    },
    {
      id: "event-management",
      title: "Event Management",
      color: "#bcd3eb",
      iconColor: "#6dadef",
      iconPath: "/group-1.png",
    },
    {
      id: "make-up-artist",
      title: "Make Up Artist",
      color: "#fff0cc",
      iconColor: "#fbb236",
      iconPath: "/group-2.png",
    },
    {
      id: "dietitian-nutrition",
      title: "Dietitian/ Nutrition",
      color: "#d9f0d6",
      iconColor: "#7ac673",
      iconPath: "/group-2-1.png",
    },
    {
      id: "fitness-training",
      title: "Fitness Training",
      color: "#ffe0cc",
      iconColor: "#ff9966",
      iconPath: "/group.png",
    },
    {
      id: "career-discovery-counselling",
      title: "Career Discovery/ Career Councelling",
      color: "#e0ccff",
      iconColor: "#b366ff",
      iconPath: "/group-3.png",
    },
    {
      id: "study-abroad-guidance",
      title: "Study Abroad Guidance",
      color: "#ffcce6",
      iconColor: "#ff66b3",
      iconPath: "/group-1.png",
    },
    {
      id: "soft-skills-interview-prep",
      title: "Soft Skills & Interview Prep",
      color: "#ccf2ff",
      iconColor: "#66d9ff",
      iconPath: "/group-2.png",
    },
    {
      id: "resume-linkedin-job-search",
      title: "Resume Building & LinkedIn & Job search",
      color: "#f2ffcc",
      iconColor: "#ccff66",
      iconPath: "/group-2-1.png",
    },
    {
      id: "phd-admission-mentorship",
      title: "PHD admission mentorship",
      color: "#ffe6cc",
      iconColor: "#ffb366",
      iconPath: "/group.png",
    },
    {
      id: "stream-selection",
      title: "Stream Selection",
      color: "#cce6ff",
      iconColor: "#66b3ff",
      iconPath: "/group-3.png",
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
          Browse by Expertise
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