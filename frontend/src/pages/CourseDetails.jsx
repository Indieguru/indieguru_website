import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Button } from '../components/ui/button';
import axiosInstance from '../config/axios.config';
import useAuthStore from '../store/authStore';

export default function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axiosInstance.get(`/course/${courseId}`);
        setCourse(response.data);
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      navigate('/signup');
      return;
    }

    try {
      setPurchasing(true);
      await axiosInstance.post(`/course/${courseId}/purchase`);
      // Show success message or redirect to success page
      alert('Course purchased successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error purchasing course:', error);
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 pt-[120px] pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <h1 className="text-4xl font-bold text-[#0a2540] mb-6">{course.title}</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="space-y-6">
                {/* Course Overview Section */}
                <div>
                  <h2 className="text-2xl font-semibold text-[#0a2540] mb-3">Course Overview</h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-600">{course.overview}</p>
                  </div>
                </div>

                {/* Expert Details Section */}
                <div>
                  <h2 className="text-2xl font-semibold text-[#0a2540] mb-3">Expert Details</h2>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-semibold text-blue-600">
                        {course.expertName?.charAt(0) || 'E'}
                      </div>
                      <div className="flex-1 space-y-2">
                        <h3 className="text-xl font-semibold text-[#0a2540]">{course.expertName}</h3>
                        <p className="text-gray-700 font-medium">{course.expertTitle}</p>
                        <div className="mt-3">
                          <p className="text-sm text-gray-600 mb-2">Areas of Expertise:</p>
                          <div className="flex flex-wrap gap-2">
                            {course.expertise?.map((exp, index) => (
                              <span 
                                key={index} 
                                className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                              >
                                {exp}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Learning Outcomes Section */}
                <div>
                  <h2 className="text-2xl font-semibold text-[#0a2540] mb-3">What You'll Learn</h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-600 mb-4">{course.description}</p>
                    <ul className="space-y-2">
                      {course.learningOutcomes?.map((outcome, index) => (
                        <li key={index} className="flex gap-2 text-gray-600">
                          <span className="text-green-500">✓</span>
                          {outcome}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Details Sidebar */}
            <div>
              <div className="bg-gray-50 rounded-xl p-6 sticky top-4">
                <h3 className="text-xl font-semibold text-[#0a2540] mb-4">Course Details</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Duration:</span>
                    <span className="text-[#0a2540]">{course.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Level:</span>
                    <span className="text-[#0a2540]">{course.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Price:</span>
                    <span className="text-[#0a2540] font-semibold">₹{course.pricing.total}</span>
                  </div>
                  {course.startDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Start Date:</span>
                      <span className="text-[#0a2540]">{new Date(course.startDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
                <Button
                  onClick={handlePurchase}
                  disabled={purchasing}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {purchasing ? 'Processing...' : 'Confirm Registration'}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}