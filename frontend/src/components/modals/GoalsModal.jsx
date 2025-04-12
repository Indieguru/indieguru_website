"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Loader2 } from "lucide-react"
import { Modal } from "../ui/modal"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { fetchGoals } from "../../services/api"

function GoalsModal({ isOpen, onClose, currentGoals, onSave }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [goals, setGoals] = useState([])
  const [selectedGoals, setSelectedGoals] = useState([])
  const [loading, setLoading] = useState(false)

  // Initialize selected goals from current goals
  useEffect(() => {
    if (currentGoals) {
      setSelectedGoals(currentGoals)
    }
  }, [currentGoals])

  // Load goals when modal opens or search term changes
  useEffect(() => {
    const loadGoals = async () => {
      setLoading(true)
      try {
        const data = await fetchGoals(searchTerm)
        setGoals(data)
      } catch (error) {
        console.error("Error fetching goals:", error)
      } finally {
        setLoading(false)
      }
    }

    if (isOpen) {
      loadGoals()
    }
  }, [isOpen, searchTerm])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const toggleGoal = (goal) => {
    if (selectedGoals.includes(goal.name)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== goal.name))
    } else {
      setSelectedGoals([...selectedGoals, goal.name])
    }
  }

  const handleSave = () => {
    onSave(selectedGoals)
    onClose()
  }

  // Group goals by category
  const groupedGoals = goals.reduce((acc, goal) => {
    if (!acc[goal.category]) {
      acc[goal.category] = []
    }
    acc[goal.category].push(goal)
    return acc
  }, {})

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Your Goals">
      <div className="mb-4 relative">
        <Input
          placeholder="Search goals..."
          value={searchTerm}
          onChange={handleSearch}
          className="pl-10 pr-4 py-2 border border-[#d1dffc] rounded-lg"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6d6e76] w-4 h-4" />
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-[#232636] mb-2">Selected Goals</h4>
        <div className="flex flex-wrap gap-2 min-h-10">
          {selectedGoals.map((goal) => (
            <span key={goal} className="px-3 py-1 bg-blue-800 text-white rounded-full text-xs flex items-center">
              {goal}
              <button onClick={() => toggleGoal({ name: goal })} className="ml-2 text-white hover:text-[#a3d7ff]">
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="max-h-60 overflow-y-auto pr-2">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="w-8 h-8 text-[#003265] animate-spin" />
          </div>
        ) : (
          Object.entries(groupedGoals).map(([category, categoryGoals]) => (
            <div key={category} className="mb-4">
              <h4 className="text-sm font-medium text-[#232636] mb-2">{category}</h4>
              <div className="grid grid-cols-2 gap-2">
                {categoryGoals.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => toggleGoal(goal)}
                    className={`flex items-center justify-between px-3 py-2 rounded-md text-xs transition-colors ${
                      selectedGoals.includes(goal.name)
                        ? "bg-blue-800 text-white"
                        : "bg-[#f9fbff] text-[#232636] hover:bg-[#deefff]"
                    }`}
                  >
                    <span>{goal.name}</span>
                    {selectedGoals.includes(goal.name) ? (
                      <span className="text-white">✓</span>
                    ) : (
                      <Plus size={14} className="text-[#003265]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-[#d8d8d8]">
        <Button onClick={onClose} className="border border-[#676767] text-[#676767] bg-white hover:bg-[#f5f5f5]">
          Cancel
        </Button>
        <Button onClick={handleSave} className="bg-blue-800 text-white hover:bg-[#143d65]">
          Save Goals
        </Button>
      </div>
    </Modal>
  )
}

export default GoalsModal

