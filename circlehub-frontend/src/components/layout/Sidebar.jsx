import { NavLink } from 'react-router-dom';
import { Home, Compass, PlusCircle, Users, TrendingUp, Bookmark } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { icon: Home, label: 'Home', path: '/home' },
    { icon: Compass, label: 'Explore', path: '/explore' },
    { icon: Users, label: 'My Circles', path: '/my-circles' },
    { icon: TrendingUp, label: 'Trending', path: '/trending' },
    { icon: Bookmark, label: 'Saved', path: '/saved' },
  ];

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 glass border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? 'sidebar-item-active' : ''}`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}

        <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
          <NavLink
            to="/create-post"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Create Post</span>
          </NavLink>
        </div>
      </nav>

      {/* Trending Topics */}
      <div className="mt-6">
        <h3 className="px-4 mb-3 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Trending Topics
        </h3>
        <div className="space-y-2">
          {['#Technology', '#Fitness', '#Travel', '#Photography'].map((tag) => (
            <button
              key={tag}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
            >
              <span className="text-primary-600 dark:text-primary-400 font-semibold">{tag}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
