import { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { circleService } from '../services/api';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import CircleCard from '../components/circle/CircleCard';
import CreateCircleModal from '../components/circle/CreateCircleModal';

const ExplorePage = () => {
  const [circles, setCircles] = useState([]);
  const [filteredCircles, setFilteredCircles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Technology', 'Fitness', 'Travel', 'Photography', 'Food', 'Music', 'Art', 'Gaming', 'Business'];

  useEffect(() => {
    loadCircles();
  }, []);

  useEffect(() => {
    filterCircles();
  }, [searchTerm, selectedCategory, circles]);

  const loadCircles = async () => {
    try {
      const response = await circleService.getAllCircles();
      setCircles(response.data);
      setFilteredCircles(response.data);
    } catch (error) {
      console.error('Error loading circles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCircles = () => {
    let filtered = circles;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((circle) => circle.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (circle) =>
          circle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          circle.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCircles(filtered);
  };

  const handleCircleCreated = () => {
    loadCircles();
    setShowCreateModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="flex pt-16">
        <Sidebar />
        
        <main className="flex-1 ml-64 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Explore Circles</h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Discover and join communities that match your interests
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create Circle
                </button>
              </div>

              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search circles..."
                  className="input-field pl-12"
                />
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-2 rounded-xl font-medium whitespace-nowrap transition-all duration-200 ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Circles Grid */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredCircles.length === 0 ? (
              <div className="card p-12 text-center">
                <p className="text-gray-500">No circles found. Try a different search or create one!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCircles.map((circle) => (
                  <CircleCard key={circle.id} circle={circle} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Create Circle Modal */}
      {showCreateModal && (
        <CreateCircleModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCircleCreated}
        />
      )}
    </div>
  );
};

export default ExplorePage;
