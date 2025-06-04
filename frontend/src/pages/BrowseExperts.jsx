import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../config/axios.config';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';

export default function BrowseExperts() {
  const { category } = useParams();
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    expertise: category || '',
  });

  useEffect(() => {
    fetchExperts();
  }, []);

  useEffect(() => {
    if (category) {
      setFilters(prev => ({
        ...prev,
        expertise: category
      }));
    }
  }, [category]);

  const fetchExperts = async () => {
    try {
      const response = await axiosInstance.get('/expert/search', {
        params: { filter: category }
      });
      setExperts(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching experts:', error);
      setLoading(false);
    }
  };

  const filteredExperts = experts.filter(expert => {
    const matchesSearch = expert.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expert.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expert.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expert.expertise?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesExpertise = !filters.expertise || 
      expert.expertise?.some(skill => skill.toLowerCase().includes(filters.expertise.toLowerCase()));

    return matchesSearch && matchesExpertise;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 mt-20">
        <h1 className="text-3xl font-bold text-center mb-8">
          {category ? `${category} Experts` : 'Find Your Expert'}
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
              placeholder="Filter by expertise"
              value={filters.expertise}
              onChange={(e) => setFilters(prev => ({ ...prev, expertise: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperts.map((expert) => (
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
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Book Session
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {filteredExperts.length === 0 && (
          <div className="text-center text-gray-600 mt-8">
            No experts found matching your criteria.
          </div>
        )}
      </div>
    </>
  );
}