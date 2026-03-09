import { useState, useEffect, useRef } from 'react';
import { Search, X, User, Users, FileText } from 'lucide-react';
import { searchService } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim().length > 0) {
        performSearch(query);
      } else {
        setResults(null);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const performSearch = async (searchQuery) => {
    setLoading(true);
    try {
      const response = await searchService.searchAll(searchQuery, 0, 5);
      setResults(response.data);
      setIsOpen(true);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults(null);
    setIsOpen(false);
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
    clearSearch();
  };

  const handleCircleClick = (circleId) => {
    navigate(`/circle/${circleId}`);
    clearSearch();
  };

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
    clearSearch();
  };

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
          placeholder="Search users, circles, posts..."
          className="w-full pl-10 pr-10 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 
            rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2">Searching...</p>
            </div>
          ) : (
            <>
              {/* Users */}
              {results.users && results.users.length > 0 && (
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900">
                    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Users
                    </h4>
                  </div>
                  {results.users.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => handleUserClick(user.id)}
                      className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-3"
                    >
                      <img
                        src={user.profilePicture || '/default-avatar.png'}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {user.name}
                          {user.verified && <span className="ml-1 text-blue-500">✓</span>}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Circles */}
              {results.circles && results.circles.length > 0 && (
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900">
                    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Circles
                    </h4>
                  </div>
                  {results.circles.map((circle) => (
                    <div
                      key={circle.id}
                      onClick={() => handleCircleClick(circle.id)}
                      className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    >
                      <p className="font-medium text-gray-900 dark:text-white">
                        {circle.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                        {circle.description}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {circle.memberCount} members
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Posts */}
              {results.posts && results.posts.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900">
                    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Posts
                    </h4>
                  </div>
                  {results.posts.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => handlePostClick(post.id)}
                      className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    >
                      <p className="text-gray-900 dark:text-white line-clamp-2">
                        {post.content}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        by {post.userName} • {post.circleName}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* No Results */}
              {(!results.users || results.users.length === 0) &&
               (!results.circles || results.circles.length === 0) &&
               (!results.posts || results.posts.length === 0) && (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No results found for "{query}"</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
