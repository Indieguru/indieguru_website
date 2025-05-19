import { Button } from "../ui/button";

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
    <section className="mb-12 p-6 bg-gradient-to-br from-[#cceeed] to-[#e8f7f7] rounded-xl">
      <div className="flex items-center mb-1">
        <span className="mr-2 bg-amber-100 p-2 rounded-full text-amber-500">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" />
          </svg>
        </span>
        <h2 className="text-2xl font-semibold text-[#003265]">Upcoming Courses</h2>
      </div>
      
      <p className="text-sm text-[#6d6e76] mb-8 ml-8">
        Explore upcoming courses and prepare for your next learning adventure. Stay ahead with the latest offerings.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="group">
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="h-48 relative overflow-hidden" style={{ backgroundColor: course.color }}>
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-full object-contain" 
                />
              </div>
              <div className="p-4">
                <div className="text-sm text-gray-500 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {course.date}
                </div>
                <h3 className="text-lg font-bold text-[#003265] mb-3 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Sarah Johnson - Head of Product Customer Platform Gojek Indonesia
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex items-baseline">
                    <span className="text-xl font-bold text-[#003265]">₹ {course.price}</span>
                    <span className="ml-2 text-gray-400 line-through text-sm">₹ {course.originalPrice}</span>
                  </div>
                  <Button className="bg-blue-800 hover:bg-[#0a2540] text-white text-xs px-4 py-2 rounded-full">
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default UpcomingCourses;
