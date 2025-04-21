import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { Input } from "../components/ui/input";
import { Search } from "lucide-react";
import { Card } from "../components/ui/card";
import axiosInstance from "../config/axios.config";

const BrowseExperts = () => {
  const { category } = useParams();
  const [experts, setExperts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);

  const handleSearch = async (filter = "") => {
    try {
      const response = await axiosInstance.get("/expert/search", {
        params: { filter },
      });
      setExperts(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching experts:", error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch(category || ""); // Search with category when component mounts
  }, [category]);

  useEffect(() => {
    if (searchText) {
      handleSearch(searchText); // Search when text changes
    }
  }, [searchText]);

  const categoryTitles = {
    career: "Career Guidance",
    data: "Data, ML & GenAI",
    content: "Content & Marketing",
    finance: "Finance, CAs & Legal"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mt-28 mx-auto px-4 md:px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#003265] mb-2">
            {category ? categoryTitles[category] : "Browse All Experts"}
          </h1>
          <p className="text-gray-600">
            Find and connect with expert mentors who can guide you in your journey
          </p>
        </div>

        <div className="mb-8">
          <div className="relative max-w-xl">
            <Input
              placeholder="Search by name, skills, or expertise..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-10 pr-4 py-2 border border-[#d1dffc] rounded-lg"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6d6e76] w-4 h-4" />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
          </div>
        ) : experts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experts.map((expert) => (
              <Card key={expert._id} className="border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 bg-white">
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={expert.image || "/imagecopy.png"}
                    alt={expert.name}
                    className="w-full h-full object-cover transform transition-transform hover:scale-105 duration-500"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-800">{expert.name}</h3>
                      <p className="text-xs text-[#003265] font-medium">{expert.domain}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">{expert.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {expert.expertise?.map((skill, index) => (
                      <span 
                        key={index}
                        className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">No experts found matching your criteria.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BrowseExperts;