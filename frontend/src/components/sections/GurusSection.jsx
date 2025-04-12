import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Search } from "lucide-react"

function GurusSection() {
  return (
    <section className="mb-12 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
      <div className="flex items-center mb-1">
        <span className="mr-2 text-[#003265]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 21V19C17 16.7909 15.2091 15 13 15H5C2.79086 15 1 16.7909 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2"/>
            <path d="M23 21V19C22.9986 17.1771 21.7079 15.5857 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M16 3.13C17.7105 3.58385 19.0031 5.17973 19.0031 7.005C19.0031 8.83027 17.7105 10.4261 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </span>
        <h2 className="text-2xl font-semibold text-gray-800">All the Gurus you need in one place</h2>
      </div>
      <p className="text-sm text-gray-600 mb-6 ml-8">
        From critical skills to technical topics, IndieGuru supports your professional development.
      </p>

      <div className="relative mb-6 transform transition-transform hover:scale-102 duration-300">
        <Input placeholder="Search for skills, topics, or gurus..." className="pl-10 pr-4 py-2 border border-indigo-200 rounded-lg focus:border-indigo-400 focus:ring focus:ring-indigo-100 transition-all duration-300" />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400 w-4 h-4" />
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <Button className="bg-blue-800 hover:bg-indigo-700 text-white text-xs rounded-full px-4 py-1 h-8 shadow-sm transition-colors duration-300">All Programme</Button>
        <Button variant="outline" className="text-[#003265] border-indigo-200 hover:bg-indigo-50 text-xs rounded-full px-4 py-1 h-8 transition-colors duration-300">
          UI/UX Design
        </Button>
        <Button variant="outline" className="text-[#003265] border-indigo-200 hover:bg-indigo-50 text-xs rounded-full px-4 py-1 h-8 transition-colors duration-300">
          Program Design
        </Button>
        <Button variant="outline" className="text-[#003265] border-indigo-200 hover:bg-indigo-50 text-xs rounded-full px-4 py-1 h-8 transition-colors duration-300">
          Data Science
        </Button>
        <Button variant="outline" className="text-[#003265] border-indigo-200 hover:bg-indigo-50 text-xs rounded-full px-4 py-1 h-8 transition-colors duration-300">
          Digital Marketing
        </Button>
      </div>
    </section>
  )
}

export default GurusSection