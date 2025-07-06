import { Link } from "react-router-dom"
import { Card } from "../ui/card"
import { motion } from "framer-motion"
import useUserStore from "../../store/userStore"
import { useEffect, useState } from "react"

function ProfileCard() {
  const { user, fetchUser } = useUserStore();
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
    <Card className="p-6 h-full border border-gray-200 shadow-md bg-white rounded-lg hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col h-full">
        <h2 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center">
          <span className="mr-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.4 15C19.1277 15.8031 19.0095 16.6495 19.0526 17.4984C19.0957 18.3472 19.2994 19.1772 19.65 19.95L19.7 20H4.3L4.35 19.95C4.70062 19.1772 4.90432 18.3472 4.94743 17.4984C4.99053 16.6495 4.87227 15.8031 4.6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          My Profile
        </h2>
        <div className="flex items-center mb-4">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="relative w-12 h-12 rounded-full overflow-hidden bg-indigo-100 mr-3"
          >
            <img
              src={user?.profilePicture || "/person.png"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </motion.div>
          <div>
            <h3 className="font-medium text-gray-900">{user?.firstName || 'Guest'}</h3>
            <p className="text-xs text-gray-500">{user?.role || 'User'}</p>
          </div>
        </div>

        {/* Profile Progress Section */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Profile Completion</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-indigo-900">{completionData.completedSteps}/{completionData.totalSteps}</span>
              {isCompleted && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-indigo-900"
                >
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </motion.div>
              )}
            </div>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-indigo-600 rounded-full"
            />
          </div>
        </div>

        <Link
          to="/profile"
          className="mt-auto text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          View Profile →
        </Link>
      </div>
    </Card>
  );
}

export default ProfileCard