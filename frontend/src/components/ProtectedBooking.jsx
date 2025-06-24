// filepath: /Users/anukuljain/Desktop/indiegurustd copy/frontend/src/components/ProtectedBooking.jsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '../config/axios.config';
import { RefreshCw } from 'lucide-react';

const ProtectedBooking = () => {
  const [courseStudents, setCourseStudents] = useState(0);
  const [sessionStudents, setSessionStudents] = useState(0);
  const [cohortStudents, setCohortStudents] = useState(0);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [totalStudents, setTotalStudents] = useState(0);

  const fetchStudentStats = async () => {
    setIsLoadingStats(true);
    try {
      // Fetch course student enrollments
      const courseResponse = await axiosInstance.get('/expert/students/courses');
      setCourseStudents(courseResponse.data.count || 0);
      
      // Fetch session student bookings
      const sessionResponse = await axiosInstance.get('/expert/students/sessions');
      setSessionStudents(sessionResponse.data.count || 0);
      
      // Fetch cohort student enrollments
      const cohortResponse = await axiosInstance.get('/expert/students/cohorts');
      setCohortStudents(cohortResponse.data.count || 0);
      
      // Calculate total unique students (might be less than sum if students overlap)
      const total = (courseResponse.data.count || 0) + 
                    (sessionResponse.data.count || 0) + 
                    (cohortResponse.data.count || 0);
      setTotalStudents(total);
    } catch (error) {
      console.error('Error fetching student statistics:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStudentStats();
  }, []);

  // Calculate percentages for progress bars
  const getPercentage = (value) => {
    if (totalStudents === 0) return 0;
    return Math.round((value / totalStudents) * 100);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-[0.1px] border-[#00b6c4]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Student Enrollment</h3>
        <button 
          onClick={fetchStudentStats} 
          disabled={isLoadingStats}
          className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-300"
          title="Refresh statistics"
        >
          <RefreshCw className={`w-4 h-4 text-gray-600 ${isLoadingStats ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      <div className="text-3xl font-bold text-gray-900 mb-3">{totalStudents}</div>
      <p className="text-sm text-gray-600 mb-4">Total students enrolled across all offerings</p>
      
      <div className="space-y-4">
        {/* Courses */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Courses</span>
            <span className="text-sm font-medium text-gray-700">{courseStudents}</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div 
              className="h-2 bg-blue-500 rounded-full" 
              style={{ width: `${getPercentage(courseStudents)}%` }}
            ></div>
          </div>
        </div>
        
        {/* Sessions */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Sessions</span>
            <span className="text-sm font-medium text-gray-700">{sessionStudents}</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div 
              className="h-2 bg-green-500 rounded-full" 
              style={{ width: `${getPercentage(sessionStudents)}%` }}
            ></div>
          </div>
        </div>
        
        {/* Cohorts */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Cohorts</span>
            <span className="text-sm font-medium text-gray-700">{cohortStudents}</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div 
              className="h-2 bg-yellow-500 rounded-full" 
              style={{ width: `${getPercentage(cohortStudents)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtectedBooking;