import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../config/axios.config';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import LoadingScreen from '../components/common/LoadingScreen';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export default function BrowseExperts() {
  const { category } = useParams(); // Changed from categoryId to category to match route param
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [filters, setFilters] = useState({
    expertise: '',  // Initialize empty and set in useEffect
  });
  
  // Set the filter value and category name when component mounts or URL changes
  useEffect(() => {
    if (category) {
      // Convert kebab-case to readable format for display
      const formattedCategory = category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      setCategoryName(formattedCategory);
      
      // Set the filter to the exact category from the URL
      setFilters(prev => ({
        ...prev,
        expertise: category
      }));
      
      // Fetch experts with the category filter
      fetchExperts(category);
    } else {
      fetchExperts();
    }
  }, [category]);
  
  const fetchExperts = async (filter = '') => {
    try {
      setLoading(true);
      console.log('Fetching experts for category:', filter);
      
      const response = await axiosInstance.get('/expert/search', {
        params: { filter }
      });
      
      console.log('API response:', response.data);
      setExperts(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching experts:', error);
      setLoading(false);
    }
  };
  
  const filteredExperts = experts.filter(expert => {
    const matchesSearch = !searchTerm || 
      expert.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expert.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expert.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expert.expertise?.some(skill => 
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    // More flexible expertise matching
    const matchesExpertise = !filters.expertise || 
      expert.expertise?.some(skill => {
        const expertiseKeywords = filters.expertise.toLowerCase().split('-');
        return expertiseKeywords.some(keyword => 
          skill.toLowerCase().includes(keyword)
        );
      });
    
    return matchesSearch && matchesExpertise;
  });
  
  // Handle filter change and trigger a new search
  const handleFilterChange = (e) => {
    const newExpertiseFilter = e.target.value;
    setFilters(prev => ({ ...prev, expertise: newExpertiseFilter }));
    
    // Optional: you could add debounce here if you want to auto-search as user types
  };
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 mt-20">
        <h1 className="text-3xl font-bold text-center mb-8">
          {categoryName ? `${categoryName} Experts` : 'Find Your Expert'}
        </h1>
        
        <div className="max-w-3xl mx-auto mb-8">
          <Input
            type="text"
            placeholder="Search experts by name or expertise..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full mb-4"
          />
          
          <div>
            <Input
              type="text"
              placeholder="Expertise"
              value={filters.expertise}
              onChange={handleFilterChange}
              className="w-full"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperts.length > 0 ? (
            filteredExperts.map((expert) => (
              <div key={expert._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={expert.profilePicture || '/placeholder-user.jpg'}
                    alt={expert.name || `${expert.firstName} ${expert.lastName}`}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">{expert.name || `${expert.firstName} ${expert.lastName}`}</h3>
                    <p className="text-gray-600">{expert.title}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {expert.expertise?.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-gray-700">{expert.bio}</p>
                </div>
                <Link to={`/booking/${expert._id}`}>
                  <Button className="w-full bg-blue-800 hover:bg-blue-700 text-white">
                    Book Session
                  </Button>
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center text-gray-600 mt-8 py-12">
              <h3 className="text-xl text-gray-700 mb-4">No experts found for this category</h3>
              <p className="text-gray-600">
                We're currently expanding our expert network. Please check back soon or explore other categories.
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}