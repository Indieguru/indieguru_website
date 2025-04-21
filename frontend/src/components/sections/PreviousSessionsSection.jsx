import { Button } from "../ui/button";
import { motion } from "framer-motion";

function PreviousSessionsSection() {
  const courses = [
    {
      id: 1,
      title: "Product Management Basic - Course",
      date: "1 - 28 July 2022",
      students: 40,
      price: 380,
      originalPrice: 500,
      image: "/rectangle-2749.png",
      color: "#00b6c4",
    },
    {
      id: 2,
      title: "BI Data Science Professional Certificate",
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
      date: "1 - 28 July 2022",
      students: 342,
      price: 567,
      originalPrice: 500,
      image: "/rectangle-2749-3.png",
      color: "#00b6c4",
    },
  ];

  return (
    <motion.section
      className="mb-12 p-6 bg-gradient-to-br from-indigo-50 to-white rounded-xl shadow-md"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="flex items-center mb-1"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.span 
          className="mr-2 text-amber-500"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" />
          </svg>
        </motion.span>
        <h2 className="text-2xl font-semibold text-[#003265]">Previous Sessions</h2>
      </motion.div>
      
      <motion.p 
        className="text-sm text-[#6d6e76] mb-8 ml-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Review and continue your learning from past sessions. Revisit content, refresh your knowledge, or pick up where you left off.
      </motion.p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {courses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group"
          >
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div 
                className="h-48 relative overflow-hidden group-hover:shadow-inner transition-all duration-300" 
                style={{ backgroundColor: course.color }}
              >
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-300" 
                />
              </div>
              <div className="p-4">
                <div className="text-sm text-gray-500 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {course.date}
                </div>
                <h3 className="text-lg font-bold text-[#003265] mb-3 line-clamp-2 group-hover:text-indigo-700 transition-colors duration-300">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Sarah Johnson - Head of Product Customer Platform Gojek Indonesia
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex items-baseline">
                    <span className="text-xl font-bold text-[#003265]">$ {course.price}</span>
                    <span className="ml-2 text-gray-400 line-through text-sm">$ {course.originalPrice}</span>
                  </div>
                  <Button className="bg-blue-800 hover:bg-[#0a2540] text-white text-xs px-3 py-2 h-8 rounded-md transform hover:scale-105 transition-all duration-300">
                    Book Again
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

export default PreviousSessionsSection;
