import { Link } from "react-router-dom"
import { Card } from "../ui/card"
import { Button } from "../ui/button"

function InterestsCard() {
  return (
    <Card className="p-6 border border-gray-200 shadow-md bg-white rounded-lg hover:shadow-lg transition-all duration-300">
      <h2 className="text-lg font-semibold text-yellow-600 mb-4 flex items-center">
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
        <span className="text-xs bg-white border border-yellow-200 text-yellow-700 px-3 py-1 rounded-full hover:bg-yellow-50 transition-colors duration-300">UI/UX</span>
        <span className="text-xs bg-white border border-indigo-200 text-indigo-700 px-3 py-1 rounded-full hover:bg-indigo-50 transition-colors duration-300">
          Programming
        </span>
        <span className="text-xs bg-white border border-blue-200 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-50 transition-colors duration-300">
          Web Development
        </span>
        <span className="text-xs bg-white border border-green-200 text-green-700 px-3 py-1 rounded-full hover:bg-green-50 transition-colors duration-300">Course</span>
        <span className="text-xs bg-white border border-indigo-200 text-indigo-700 px-3 py-1 rounded-full hover:bg-indigo-50 transition-colors duration-300">
          Book A Session
        </span>
        <span className="text-xs bg-white border border-blue-200 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-50 transition-colors duration-300">
          Attend Webinar
        </span>
      </div>
      <div className="flex justify-between items-center">
        <Button className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs py-2 px-4 h-8 rounded shadow-sm transition-colors duration-300">
          Show Interests
        </Button>
        <Link to="#" className="text-xs text-yellow-600 hover:text-yellow-800 transition-colors duration-300">
          know more
        </Link>
      </div>
    </Card>
  )
}

export default InterestsCard