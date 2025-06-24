import { motion } from "framer-motion";
import useUserStore from "../../store/userStore";
import { useState, useEffect } from "react";
import axiosInstance from "../../config/axios.config";

function ProgressSection() {
  const { user } = useUserStore();
  const [completionData, setCompletionData] = useState({
    completedSteps: 0,
    totalSteps: 8
  });
  const [coursesCount, setCoursesCount] = useState(0);
  const [sessionsCount, setSessionsCount] = useState(0);
  const [cohortsCount, setCohortsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const calculateCompletedSteps = () => {
      let completed = 0;
      if (user?.firstName) completed++;
      if (user?.lastName) completed++;
      if (user?.email) completed++;
      if (user?.gender) completed++;
      if (user?.phone) completed++;
      if (user?.interests?.length > 0) completed++;
      if (user?.goals?.length > 0) completed++;
      if (user?.profilePicture) completed++;
      return completed;
    };
    setCompletionData({
      completedSteps: calculateCompletedSteps(),
      totalSteps: 8
    });
  }, [user]);

  // Fetch user's courses, sessions, and cohorts data
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const [coursesRes, sessionsRes, cohortsRes] = await Promise.all([
          axiosInstance.get('/user/courses'),
          axiosInstance.get('/user/sessions'),
          axiosInstance.get('/user/cohorts')
        ]);
        
        setCoursesCount(coursesRes.data?.length || 0);
        setSessionsCount(sessionsRes.data?.length || 0);
        setCohortsCount(cohortsRes.data?.length || 0);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?._id) {
      fetchUserData();
    }
  }, [user]);

  const completionPercentage = (completionData.completedSteps / completionData.totalSteps) * 100;
  const isCompleted = completionData.completedSteps === completionData.totalSteps;

  return (
    <section className="bg-gradient-to-r from-indigo-900 to-indigo-800 p-6 rounded-lg">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2 text-white">
            <div className="text-indigo-200">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19.4 15C19.1277 15.8031 19.0095 16.6495 19.0526 17.4984C19.0957 18.3472 19.2994 19.1772 19.65 19.95L19.7 20H4.3L4.35 19.95C4.70062 19.1772 4.90432 18.3472 4.94743 17.4984C4.99053 16.6495 4.87227 15.8031 4.6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-sm">Profile Completion</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white">{completionData.completedSteps}/{completionData.totalSteps}</span>
            {isCompleted && (
              <div
                className="bg-green-500 text-white text-xs px-2 py-1 rounded-full"
              >
                Completed!
              </div>
            )}
          </div>
        </div>
        <div className="h-2 w-full bg-indigo-950/30 rounded-full overflow-hidden">
          <div
            style={{ width: `${completionPercentage}%` }}
            className={`h-full rounded-full ${isCompleted ? 'bg-green-500' : 'bg-white'}`}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <div className="flex items-center gap-2 text-white mb-1">
            <div className="text-indigo-200">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 17L9 11L13 15L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 7H21V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-sm">Courses Enrolled</span>
          </div>
          <div className="text-2xl font-bold text-white">{isLoading ? "..." : coursesCount}</div>
        </div>
        <div>
          <div className="flex items-center gap-2 text-white mb-1">
            <div className="text-indigo-200">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 17L9 11L13 15L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 7H21V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-sm">Sessions Joined</span>
          </div>
          <div className="text-2xl font-bold text-white">{isLoading ? "..." : sessionsCount}</div>
        </div>
        <div>
          <div className="flex items-center gap-2 text-white mb-1">
            <div className="text-indigo-200">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 17L9 11L13 15L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 7H21V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-sm">Cohorts Joined</span>
          </div>
          <div className="text-2xl font-bold text-white">{isLoading ? "..." : cohortsCount}</div>
        </div>
      </div>
    </section>
  );
}
export default ProgressSection;