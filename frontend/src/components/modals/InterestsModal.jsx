"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Loader2 } from "lucide-react"
import { Modal } from "../ui/modal"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { fetchInterests } from "../../services/api"

function InterestsModal({ isOpen, onClose, currentInterests, onSave }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [interests, setInterests] = useState([])
  const [selectedInterests, setSelectedInterests] = useState([])
  const [loading, setLoading] = useState(false)

  // Initialize selected interests from current interests
  useEffect(() => {
    if (currentInterests) {
      setSelectedInterests(currentInterests)
    }
  }, [currentInterests])

  // Load interests when modal opens or search term changes
  useEffect(() => {
    const loadInterests = async () => {
      setLoading(true)
      try {
        const data = await fetchInterests(searchTerm)
        setInterests(data)
      } catch (error) {
        console.error("Error fetching interests:", error)
      } finally {
        setLoading(false)
      }
    }

    if (isOpen) {
      loadInterests()
    }
  }, [isOpen, searchTerm])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest.name)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest.name))
    } else {
      setSelectedInterests([...selectedInterests, interest.name])
    }
  }

  const handleSave = () => {
    onSave(selectedInterests)
    onClose()
  }

  // Group interests by category
  const groupedInterests = interests.reduce((acc, interest) => {
    if (!acc[interest.category]) {
      acc[interest.category] = []
    }
    acc[interest.category].push(interest)
    return acc
  }, {})

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Your Interests">
      <div className="mb-4 relative">
        <Input
          placeholder="Search interests..."
          value={searchTerm}
          onChange={handleSearch}
          className="pl-10 pr-4 py-2 border border-[#d1dffc] rounded-lg"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6d6e76] w-4 h-4" />
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-[#232636] mb-2">Selected Interests</h4>
        <div className="flex flex-wrap gap-2 min-h-10">
          {selectedInterests.map((interest) => (
            <span key={interest} className="px-3 py-1 bg-[#003265] text-white rounded-full text-xs flex items-center">
              {interest}
              <button
                onClick={() => toggleInterest({ name: interest })}
                className="ml-2 text-white hover:text-[#a3d7ff]"
              >
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
          Object.entries(groupedInterests).map(([category, categoryInterests]) => (
            <div key={category} className="mb-4">
              <h4 className="text-sm font-medium text-[#232636] mb-2">{category}</h4>
              <div className="grid grid-cols-2 gap-2">
                {categoryInterests.map((interest) => (
                  <button
                    key={interest.id}
                    onClick={() => toggleInterest(interest)}
                    className={`flex items-center justify-between px-3 py-2 rounded-md text-xs transition-colors ${
                      selectedInterests.includes(interest.name)
                        ? "bg-[#003265] text-white"
                        : "bg-[#f9fbff] text-[#232636] hover:bg-[#deefff]"
                    }`}
                  >
                    <span>{interest.name}</span>
                    {selectedInterests.includes(interest.name) ? (
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
        <Button onClick={handleSave} className="bg-[#003265] text-white hover:bg-[#143d65]">
          Save Interests
        </Button>
      </div>
    </Modal>
  )
}

export default InterestsModal

