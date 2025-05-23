import { useState } from "react";
import { Modal } from "../ui/modal";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import axiosInstance from "../../config/axios.config";
import { useNavigate } from "react-router-dom";
import useUserTypeStore from "../../store/userTypeStore";
import useUserStore from "../../store/userStore";
import Loader from "../layout/Loader";
import * as Motion from "framer-motion";

const industries = [
  { id: "tech", name: "Technology & Software", color: "#beeeed", iconPath: "/group-1.png" },
  { id: "data", name: "Data Science & Analytics", color: "#ffcccc", iconPath: "/group-2.png" },
  { id: "design", name: "Design & Creative", color: "#bcd3eb", iconPath: "/group-2-1.png" },
  { id: "business", name: "Business & Entrepreneurship", color: "#fff0cc", iconPath: "/group.png" },
  { id: "marketing", name: "Marketing & Digital Media", color: "#d9f0d6", iconPath: "/group-3.png" },
  { id: "finance", name: "Finance & Investment", color: "#ffe0cc", iconPath: "/group-1.png" },
  { id: "education", name: "Education & Teaching", color: "#e0ccff", iconPath: "/group-2.png" },
  { id: "health", name: "Healthcare & Wellness", color: "#ffcce6", iconPath: "/group-2-1.png" }
];

const ExpertSelectionModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { userType } = useUserTypeStore();

  const isAuthenticated = !!user?.firstName;

  const filteredIndustries = industries.filter(industry =>
    industry.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const handleIndustrySelect = (industry) => {
    setSelectedIndustry(industry);
    setStep(2);
    fetchExperts(industry.name);
  };

  const fetchExperts = async (industry) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/expert/search", {
        params: { filter: industry }
      });
      setExperts(response.data.data);
    } catch (error) {
      console.error("Error fetching experts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExpertSelect = (expert) => {
    if (!isAuthenticated || userType !== 'student') {
      navigate("/signup");
      onClose();
      return;
    }
    navigate(`/booking/${expert._id}`);
    onClose();
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    fetchExperts(e.target.value);
  };

  return (
    <Motion.AnimatePresence>
      {isOpen && (
        <Motion.motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0"
        >
          <div className="absolute inset-0 bg-black/20 backdrop-blur-md" onClick={onClose} />

          <Motion.motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-6xl"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white/40 backdrop-blur-xl border border-white/20">
              {/* Vector Decorations */}
              <Motion.motion.img
                src="/vector1.png"
                alt="Vector decoration"
                className="absolute -top-16 -right-16 w-40 h-40 opacity-15 z-0"
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                }}
              />
              <Motion.motion.img
                src="/vector2.png"
                alt="Vector decoration"
                className="absolute -bottom-16 -left-16 w-40 h-40 opacity-15 z-0 rotate-45"
                animate={{ 
                  rotate: [45, 405],
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                  scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                }}
              />

              {/* Content Container */}
              <div className="relative z-10 px-16 py-10 bg-gradient-to-br from-white/50 to-transparent">
                <div className="max-w-4xl mx-auto">
                  {/* Header */}
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        {step === 1 ? "Choose Your Industry" : "Select an Expert"}
                      </h2>
                      {step === 2 && (
                        <p className="text-gray-600 mt-1 font-medium">From {selectedIndustry.name}</p>
                      )}
                    </div>
                    <button 
                      onClick={onClose} 
                      className="text-gray-500 hover:text-gray-700 transition-colors duration-200 hover:rotate-90 transform p-2 rounded-full hover:bg-gray-100/50"
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Progress Steps */}
                  <div className="flex justify-center mb-8">
                    <div className="flex items-center space-x-3">
                      <Motion.motion.div
                        animate={{
                          scale: step === 1 ? 1.2 : 1,
                          backgroundColor: step === 1 ? "#3B82F6" : "#E5E7EB"
                        }}
                        className="w-2.5 h-2.5 rounded-full"
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      />
                      <div className="w-8 h-0.5 bg-gray-200 rounded" />
                      <Motion.motion.div
                        animate={{
                          scale: step === 2 ? 1.2 : 1,
                          backgroundColor: step === 2 ? "#3B82F6" : "#E5E7EB"
                        }}
                        className="w-2.5 h-2.5 rounded-full"
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <Motion.AnimatePresence mode="wait">
                    <Motion.motion.div
                      key={step}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -20, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {step === 1 ? (
                        <>
                          <div className="relative mb-6">
                            <Input
                              type="text"
                              placeholder="Search categories..."
                              value={categorySearch}
                              onChange={(e) => setCategorySearch(e.target.value)}
                              className="w-full pl-10 pr-4 py-3 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredIndustries.map((industry) => (
                              <Motion.motion.button
                                key={industry.id}
                                onClick={() => handleIndustrySelect(industry)}
                                className="group relative p-6 rounded-xl text-left transition-all duration-300 overflow-hidden"
                                style={{ backgroundColor: industry.color + '40' }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <div className="relative z-10">
                                  <img 
                                    src={industry.iconPath} 
                                    alt={industry.name} 
                                    className="w-12 h-12 mb-4"
                                  />
                                  <h3 className="font-semibold text-gray-900 group-hover:text-gray-800">
                                    {industry.name}
                                  </h3>
                                </div>
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                              </Motion.motion.button>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div>
                          <div className="relative mb-6">
                            <Input
                              type="text"
                              placeholder="Search experts by name or expertise..."
                              value={searchQuery}
                              onChange={handleSearch}
                              className="w-full pl-10 pr-4 py-3 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          </div>

                          <div className="relative">
                            {loading ? (
                              <div className="py-12">
                                <Loader fullScreen={false} />
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2">
                                {experts.map((expert) => (
                                  <Motion.motion.div
                                    key={expert._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    <Card
                                      className="p-4 cursor-pointer hover:shadow-lg transition-all duration-300"
                                      onClick={() => handleExpertSelect(expert)}
                                    >
                                      <div className="flex gap-4">
                                        <img
                                          src={expert.avatar || "/placeholder-user.jpg"}
                                          alt={expert.name}
                                          className="w-16 h-16 rounded-full object-cover"
                                        />
                                        <div className="flex-1">
                                          <h3 className="font-semibold text-gray-900">{expert.name}</h3>
                                          <p className="text-sm text-gray-600">{expert.domain}</p>
                                          <div className="flex items-center mt-2">
                                            <div className="flex text-yellow-400">
                                              {[...Array(5)].map((_, i) => (
                                                <span key={i} className="text-lg">★</span>
                                              ))}
                                            </div>
                                            <span className="text-sm text-gray-600 ml-2">
                                              {expert.ratings?.toFixed(1) || "4.5"}
                                            </span>
                                            <span className="text-sm text-gray-400 ml-2">
                                              ({expert.sessionCount || "0"} sessions)
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </Card>
                                  </Motion.motion.div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </Motion.motion.div>
                  </Motion.AnimatePresence>

                  {/* Navigation */}
                  <div className="flex justify-between items-center mt-8">
                    {step === 2 && (
                      <Button
                        onClick={() => setStep(1)}
                        className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2 hover:bg-gray-100/50"
                        variant="ghost"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Motion.motion.div>
        </Motion.motion.div>
      )}
    </Motion.AnimatePresence>
  );
};

export default ExpertSelectionModal;