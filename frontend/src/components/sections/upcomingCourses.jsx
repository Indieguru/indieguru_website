import { Button } from "../ui/button";
import { motion } from "framer-motion";

function UpcomingCourses() {
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
      className="mb-12 p-6 bg-[#cceeed] rounded-xl shadow-md"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center mb-1">
        <span className="mr-2 text-amber-500">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" />
          </svg>
        </span>
        <h2 className="text-2xl font-semibold text-[#003265]">Upcoming Courses</h2>
      </div>
      <p className="text-sm text-[#6d6e76] mb-6 ml-8">
        Review and continue your learning from past sessions. Revisit content, refresh your knowledge, or pick up where you left off.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {courses.map((course, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-transform transform hover:scale-[1.03]"
          >
            <div className="h-48" style={{ backgroundColor: course.color }}>
              <img src={course.image} alt={course.title} className="w-full h-full object-contain" />
            </div>
            <div className="p-4">
              <div className="text-sm text-gray-500 mb-2">{course.date}</div>
              <h3 className="text-lg font-bold text-[#003265] mb-3">{course.title}</h3>
              <p className="text-sm text-gray-600 mb-6">
                Sarah Johnson - Head of Product Customer Platform Gojek Indonesia
              </p>
              <div className="flex justify-between items-center">
                <div className="flex items-baseline">
                  <span className="text-xl font-bold text-[#003265]">$ {course.price}</span>
                  <span className="ml-2 text-gray-400 line-through text-sm">$ {course.originalPrice}</span>
                </div>
                <Button className="bg-blue-800 hover:bg-[#0a2540] text-white text-xs px-3 py-2 h-8 rounded-md">
                  Book
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

export default UpcomingCourses;
