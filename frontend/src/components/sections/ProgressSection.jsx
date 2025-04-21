import { motion } from "framer-motion";
import useUserStore from "../../store/userStore";
import { useState, useEffect } from "react";

function ProgressSection() {
  const { user } = useUserStore();
  const [completionData, setCompletionData] = useState({
    completedSteps: 0,
    totalSteps: 8
  });

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
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-green-500 text-white text-xs px-2 py-1 rounded-full"
              >
                Completed!
              </motion.div>
            )}
          </div>
        </div>
        <div className="h-2 w-full bg-indigo-950/30 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`h-full rounded-full ${isCompleted ? 'bg-green-500' : 'bg-indigo-400'}`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center gap-2 text-white mb-1">
            <div className="text-indigo-200">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 17L9 11L13 15L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 7H21V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-sm">Courses Enrolled</span>
          </div>
          <div className="text-2xl font-bold text-white">4</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center gap-2 text-white mb-1">
            <div className="text-indigo-200">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 17L9 11L13 15L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 7H21V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-sm">Skills Learned</span>
          </div>
          <div className="text-2xl font-bold text-white">4</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center gap-2 text-white mb-1">
            <div className="text-indigo-200">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-sm">Daily Streak</span>
          </div>
          <div className="text-2xl font-bold text-white">100</div>
        </motion.div>
      </div>
    </section>
  );
}

export default ProgressSection;