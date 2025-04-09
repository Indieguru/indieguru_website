import { Link } from "react-router-dom"
import { Card } from "../ui/card"
import { Button } from "../ui/button"

function GoalsCard() {
  return (
    <Card className="p-6 border border-[#e7e7e7]">
      <h2 className="text-lg font-semibold text-[#003265] mb-4">My Goals</h2>
      <p className="text-xs text-[#6d6e76] mb-4">
        Lorem ipsum dolor sit amet, consectetur ipsum adipiscing elit, sed do eiusmod tempor Lorem ipsum dolor sit amet,
        consectetur ipsum dolor sit amet, consectetur ipsum
      </p>
      <div className="flex justify-between items-center">
        <Button className="bg-[#003265] hover:bg-[#143d65] text-white text-xs py-1 px-3 h-8 rounded">Show Goals</Button>
        <Link to="#" className="text-xs text-[#003265]">
          know more
        </Link>
      </div>
    </Card>
  )
}

export default GoalsCard

