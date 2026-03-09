import { useState, useEffect } from 'react';
import { X, UserPlus, UserMinus } from 'lucide-react';
import { followService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import SkeletonLoader from '../common/SkeletonLoader';

const FollowModal = ({ isOpen, onClose, userId, type = 'followers' }) => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [followingMap, setFollowingMap] = useState({});

  useEffect(() => {
    if (isOpen && userId) {
      loadUsers(0, true);
    }
  }, [isOpen, userId, type]);

  const loadUsers = async (pageNum, reset = false) => {
    try {
      setLoading(true);
      
      const response = type === 'followers'
        ? await followService.getFollowers(userId, pageNum, 20)
        : await followService.getFollowing(userId, pageNum, 20);
      
      const newUsers = response.data.content || response.data;
      
      if (reset) {
        setUsers(newUsers);
      } else {
        setUsers(prev => [...prev, ...newUsers]);
      }
      
      setHasMore(newUsers.length === 20);
      setPage(pageNum);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (targetUserId) => {
    try {
      const isFollowing = followingMap[targetUserId];
      
      if (isFollowing) {
        await followService.unfollowUser(targetUserId);
      } else {
        await followService.followUser(targetUserId);
      }
      
      setFollowingMap(prev => ({
        ...prev,
        [targetUserId]: !isFollowing
      }));
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {type === 'followers' ? 'Followers' : 'Following'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && users.length === 0 ? (
            <SkeletonLoader type="user" count={5} />
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                {type === 'followers' ? 'No followers yet' : 'Not following anyone yet'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center gap-3">
                  {/* Avatar */}
                  <img
                    src={user.profilePicture || '/default-avatar.png'}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      @{user.email?.split('@')[0]}
                    </p>
                  </div>

                  {/* Follow Button */}
                  {currentUser?.userId !== user.id && (
                    <button
                      onClick={() => handleFollow(user.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                        followingMap[user.id]
                          ? 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {followingMap[user.id] ? (
                        <>
                          <UserMinus className="w-4 h-4" />
                          Unfollow
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          Follow
                        </>
                      )}
                    </button>
                  )}
                </div>
              ))}

              {/* Load More */}
              {hasMore && (
                <button
                  onClick={() => loadUsers(page + 1, false)}
                  disabled={loading}
                  className="w-full py-2 text-blue-600 dark:text-blue-400 hover:underline font-medium disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowModal;
