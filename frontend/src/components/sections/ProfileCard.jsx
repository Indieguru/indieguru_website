import { Link } from "react-router-dom"
import { Card } from "../ui/card"

function ProfileCard() {
  return (
    <Card className="p-6 border border-[#e7e7e7]">
      <h2 className="text-lg font-semibold text-[#003265] mb-4">My Profile</h2>
      <div className="flex items-center gap-3 mb-4">
        <div className="text-[#04c339]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M3 17L9 11L13 15L21 7"
              stroke="#04c339"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M17 7H21V11" stroke="#04c339" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <div className="text-xl font-bold text-[#003265]">6/8</div>
          <div className="text-sm text-[#6d6e76]">Profile Completed</div>
        </div>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <div className="text-[#fbb236]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="8" stroke="#fbb236" strokeWidth="2" fill="none" />
            <path d="M12 8V12L15 14" stroke="#fbb236" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <div className="text-xl font-bold text-[#003265]">32</div>
          <div className="text-sm text-[#6d6e76]">Coins Earned</div>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <Link
          to="/profile"
          className="bg-[#003265] hover:bg-[#143d65] text-white text-xs py-1 px-3 h-8 rounded flex items-center justify-center"
        >
          Complete Now
        </Link>
        <div className="flex items-center gap-2">
          <Link to="#" className="text-xs text-[#003265]">
            how to earn
          </Link>
          <Link to="#" className="text-xs text-[#003265]">
            know more
          </Link>
        </div>
      </div>
    </Card>
  )
}

export default ProfileCard

