import { Link } from "react-router-dom"
import { Card } from "../ui/card"
import { Button } from "../ui/button"
import { motion } from "framer-motion"
import useUserStore from "../../store/userStore"

function GoalsCard() {
  const { user } = useUserStore();

  return (
    <Card className="p-6 h-full border border-gray-200 shadow-md bg-white rounded-lg hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col h-full">
        <h2 className="text-lg font-semibold text-[#00b6c4] mb-4 flex items-center">
          <span className="mr-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 17L9 11L13 15L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          My Goals
        </h2>
        <p className="text-xs text-gray-600 mb-4">
          Set and track your learning goals to stay motivated and measure your progress over time.
        </p>
        <div className="space-y-3 mb-4">
          {user?.goals?.length > 0 ? (
            user.goals.map((goal, index) => (
              <div 
                key={index}
                className="flex items-center p-2 rounded-lg bg-[#e8f7f7] border border-[#cceeed]"
              >
                <div className="w-8 h-8 rounded-full bg-[#cceeed] flex items-center justify-center mr-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-[#00b6c4]">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-grow">
                  <h4 className="text-sm font-medium text-gray-900">{goal}</h4>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No goals set yet</p>
          )}
        </div>
        <div className="flex-grow"></div>
        <div className="flex justify-between items-center">
          <Link to="/profile#goals">
            <button 
              className="bg-[#00b6c4] hover:bg-[#009bb0] text-white text-xs py-2 px-4 h-8 rounded shadow-sm transition-all duration-300"
            >
              Manage Goals
            </button>
          </Link>
          <Link to="/profile#goals" className="text-xs text-[#00b6c4] hover:text-[#009bb0] transition-colors duration-300">
            View All
          </Link>
        </div>
      </div>
    </Card>
  )
}

export default GoalsCard