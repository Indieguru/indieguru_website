import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import axiosInstance from "../../config/axios.config";
import { useNavigate } from "react-router-dom";

function UpcomingCourses() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // console.log('Fetching courses...');
        const response = await axiosInstance.get('/course');
        // console.log('Courses response:', response.data);
        
        // Sort courses by publishing date and take latest ones
        const sortedCourses = response.data
          .sort((a, b) => new Date(b.publishingDate) - new Date(a.publishingDate))
          .slice(0, 4); // Take only first 4 courses
        setCourses(sortedCourses.map(course => ({
          id: course._id, // Changed from course._id to be consistent
          title: course.title,
          date: new Date(course.publishingDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          students: course.purchasedBy?.length || 0,
          price: course.pricing?.total || 0,
          originalPrice: course.pricing?.total ? course.pricing.total * 1.2 : 0, // 20% higher for original price
          image: "/rectangle-2749.png", // Default image
          color: "#00b6c4", // Default color
          instructor: course.expertName
        })));
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (error) {
    return (
      <section className="mb-12 p-6 bg-gradient-to-br from-[#cceeed] to-[#e8f7f7] rounded-xl">
        <div className="text-center text-red-600">
          Error loading courses: {error}
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="mb-12 p-6 bg-gradient-to-br from-[#cceeed] to-[#e8f7f7] rounded-xl">
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12 p-6 bg-gradient-to-br from-[#cceeed] to-[#e8f7f7] rounded-xl">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center">
          <span className="mr-2 bg-amber-100 p-2 rounded-full text-amber-500">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" />
            </svg>
          </span>
          <h2 className="text-2xl font-semibold text-[#003265]">Upcoming Courses</h2>
        </div>
        <button
          onClick={() => navigate('/all-courses')}
          className="flex items-center text-[#003265] hover:text-blue-700 transition-colors duration-200 group"
        >
          <span className="underline text-sm font-medium mr-1">View All</span>
          <svg 
            className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      <p className="text-sm text-[#6d6e76] mb-8 ml-8">
        Explore upcoming courses and prepare for your next learning adventure. Stay ahead with the latest offerings.
      </p>

      {courses.length === 0 ? (
        <div className="text-center text-gray-600">
          No upcoming courses available at the moment.
        </div>
      ) : (
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
                    {course.instructor}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-baseline">
                      <span className="text-xl font-bold text-[#003265]">₹ {course.price}</span>
                      <span className="ml-2 text-gray-400 line-through text-sm">₹ {Math.round(course.originalPrice)}</span>
                    </div>
                    <Button 
                      onClick={() => navigate(`/course/${course.id}`)}
                      className="bg-blue-800 hover:bg-[#0a2540] text-white text-xs px-4 py-2 rounded-full"
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default UpcomingCourses;
