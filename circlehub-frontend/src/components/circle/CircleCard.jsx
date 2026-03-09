import { Users, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CircleCard = ({ circle }) => {
  const navigate = useNavigate();

  const getCategoryColor = (category) => {
    const colors = {
      Technology: 'from-blue-500 to-blue-600',
      Fitness: 'from-green-500 to-green-600',
      Travel: 'from-purple-500 to-purple-600',
      Photography: 'from-pink-500 to-pink-600',
      Food: 'from-orange-500 to-orange-600',
      Music: 'from-red-500 to-red-600',
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  return (
    <div 
      onClick={() => navigate(`/circle/${circle.id}`)}
      className="card p-6 cursor-pointer group hover:scale-105"
    >
      {/* Circle Icon */}
      <div className={`w-16 h-16 bg-gradient-to-br ${getCategoryColor(circle.category)} rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg mb-4 group-hover:shadow-xl transition-all duration-300`}>
        {circle.name.charAt(0).toUpperCase()}
      </div>

      {/* Circle Info */}
      <h3 className="text-lg font-bold mb-2 group-hover:text-primary-600 transition-colors">
        {circle.name}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
        {circle.description}
      </p>

      {/* Category Badge */}
      <div className="flex items-center justify-between">
        <span className="px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg text-xs font-semibold">
          {circle.category}
        </span>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{circle.memberCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircleCard;
