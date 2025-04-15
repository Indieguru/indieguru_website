import { Link } from "react-router-dom"
import { Card } from "../ui/card"
import { Button } from "../ui/button"

function GoalsCard() {
  return (
    <Card className="p-6 border border-gray-200 shadow-md bg-white rounded-lg hover:shadow-lg transition-all duration-300 h-full">
      <div className="flex flex-col h-full">
        <h2 className="text-lg font-semibold text-green-600 mb-4 flex items-center">
          <span className="mr-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          My Goals
        </h2>
        <p className="text-xs text-gray-600 mb-4">
          Set and track your learning objectives. Breaking down your journey into achievable goals helps maintain focus and measure your progress over time.
        </p>
        <div className="flex-grow"></div>
        <div className="flex justify-between items-center">
          <Button className="bg-green-600 hover:bg-green-700 text-white text-xs py-2 px-4 h-8 rounded shadow-sm transition-colors duration-300">
            Show Goals
          </Button>
          <Link to="#" className="text-xs text-green-600 hover:text-green-800 transition-colors duration-300">
            know more
          </Link>
        </div>
      </div>
    </Card>
  )
}

export default GoalsCard