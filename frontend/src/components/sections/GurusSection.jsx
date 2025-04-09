import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Search } from "lucide-react"

function GurusSection() {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold text-[#232636] mb-1">All the Gurus you need in one place</h2>
      <p className="text-sm text-[#6d6e76] mb-4">
        From critical skills to technical topics, IndieGuru supports your professional development.
      </p>

      <div className="relative mb-6">
        <Input placeholder="Search..." className="pl-10 pr-4 py-2 border border-[#d1dffc] rounded-lg" />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6d6e76] w-4 h-4" />
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <Button className="bg-[#003265] text-white text-xs rounded-full px-4 py-1 h-8">All Programme</Button>
        <Button variant="outline" className="text-[#003265] border-[#d1dffc] text-xs rounded-full px-4 py-1 h-8">
          UI/UX Design
        </Button>
        <Button variant="outline" className="text-[#003265] border-[#d1dffc] text-xs rounded-full px-4 py-1 h-8">
          Program Design
        </Button>
        <Button variant="outline" className="text-[#003265] border-[#d1dffc] text-xs rounded-full px-4 py-1 h-8">
          Program Design
        </Button>
        <Button variant="outline" className="text-[#003265] border-[#d1dffc] text-xs rounded-full px-4 py-1 h-8">
          Program Design
        </Button>
      </div>
    </section>
  )
}

export default GurusSection

