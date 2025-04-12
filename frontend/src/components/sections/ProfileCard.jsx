import { Link } from "react-router-dom"
import { Card } from "../ui/card"

function ProfileCard() {
  return (
    <Card className="p-6 border border-gray-200 shadow-md bg-white rounded-lg hover:shadow-lg transition-all duration-300">
      <h2 className="text-lg font-semibold text-indigo-700 mb-4 flex items-center">
        <span className="mr-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12Z" stroke="currentColor" strokeWidth="2" />
            <path d="M20 21C20 16.5 16.42 13 12 13C7.58 13 4 16.5 4 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
        My Profile
      </h2>
      <div className="flex items-center gap-3 mb-4 bg-gray-50 p-3 rounded-lg transform transition-transform hover:scale-102 duration-300">
        <div className="text-green-500">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M3 17L9 11L13 15L21 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M17 7H21V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <div className="text-xl font-bold text-indigo-700">6/8</div>
          <div className="text-sm text-gray-600">Profile Completed</div>
        </div>
      </div>
      <div className="flex items-center gap-3 mb-4 bg-gray-50 p-3 rounded-lg transform transition-transform hover:scale-102 duration-300">
        <div className="text-yellow-500">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M12 8V12L15 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <div className="text-xl font-bold text-indigo-700">32</div>
          <div className="text-sm text-gray-600">Coins Earned</div>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <Link
          to="/profile"
          className="bg-blue-800 hover:bg-indigo-700 text-white text-xs py-2 px-4 h-8 rounded flex items-center justify-center shadow-sm transition-colors duration-300"
        >
          Complete Now
        </Link>
        <div className="flex items-center gap-3">
          <Link to="#" className="text-xs text-[#003265] hover:text-indigo-800 transition-colors duration-300">
            how to earn
          </Link>
          <Link to="#" className="text-xs text-[#003265] hover:text-indigo-800 transition-colors duration-300">
            know more
          </Link>
        </div>
      </div>
    </Card>
  )
}

export default ProfileCard