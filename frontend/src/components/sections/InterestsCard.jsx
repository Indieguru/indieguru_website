import { Link } from "react-router-dom"
import { Card } from "../ui/card"
import { Button } from "../ui/button"
import { motion } from "framer-motion"
import useUserStore from "../../store/userStore"

function InterestsCard() {
  const { user } = useUserStore();

  return (
    <Card className="p-6 h-full border border-gray-200 shadow-md bg-white rounded-lg hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col h-full">
        <h2 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center">
          <span className="mr-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 7V12L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </span>
          My Interests
        </h2>
        <p className="text-xs text-gray-600 mb-4">
          Track your interests to get personalized recommendations for courses, webinars, and expert sessions tailored to your learning journey.
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {user?.interests?.length > 0 ? (
            user.interests.map((interest, index) => (
              <motion.span 
                key={index}
                whileHover={{ scale: 1.05 }}
                className="text-xs bg-white border border-indigo-200 text-indigo-700 px-3 py-1 rounded-full hover:bg-indigo-50 transition-all duration-300"
              >
                {interest}
              </motion.span>
            ))
          ) : (
            <p className="text-sm text-gray-500">No interests added yet</p>
          )}
        </div>
        <div className="flex-grow"></div>
        <div className="flex justify-between items-center">
          <Link to="/profile#interests">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-indigo-900 hover:bg-indigo-700 text-white text-xs py-2 px-4 h-8 rounded shadow-sm transition-all duration-300"
            >
              Manage Interests
            </motion.button>
          </Link>
          <Link to="/profile#interests" className="text-xs text-indigo-900 hover:text-indigo-800 transition-colors duration-300">
            View All
          </Link>
        </div>
      </div>
    </Card>
  )
}

export default InterestsCard