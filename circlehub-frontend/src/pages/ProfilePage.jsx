import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userService, followService, feedService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import PostCard from '../components/post/PostCard';
import InfiniteScroll from '../components/common/InfiniteScroll';
import SkeletonLoader, { ProfileSkeleton } from '../components/common/SkeletonLoader';
import { 
  MapPin, Link as LinkIcon, Calendar, Users, 
  UserPlus, UserMinus, Settings, Bookmark, 
  Grid, List, CheckCircle 
} from 'lucide-react';
import { format } from 'date-fns';

const ProfilePage = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  const [followStats, setFollowStats] = useState({ followers: 0, following: 0 });
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  
  const [activeTab, setActiveTab] = useState('posts'); // 'posts', 'saved'
  const [viewMode, setViewMode] = useState('list'); // 'list', 'grid'
  
  const isOwnProfile = currentUser?.userId === parseInt(userId);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      
      // Load user profile
      const profileResponse = await userService.getUser(userId);
      setProfile(profileResponse.data);
      
      // Load follow stats
      const statsResponse = await followService.getFollowStats(userId);
      setFollowStats(statsResponse.data);
      
      // Check if following (if not own profile)
      if (!isOwnProfile) {
        // This would need to be implemented in backend
        // For now, we'll skip this check
      }
      
      // Load posts
      await loadPosts(0, true);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPosts = async (pageNum, reset = false) => {
    try {
      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      // For now, load from explore feed
      // TODO: Implement user-specific post endpoint
      const response = await feedService.getExploreFeed(pageNum, 20);
      const newPosts = response.data;
      
      if (reset) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }
      
      setHasMore(newPosts.length === 20);
      setPage(pageNum);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleFollow = async () => {
    try {
      setFollowLoading(true);
      
      if (isFollowing) {
        await followService.unfollowUser(userId);
        setIsFollowing(false);
        setFollowStats(prev => ({ ...prev, followers: prev.followers - 1 }));
      } else {
        await followService.followUser(userId);
        setIsFollowing(true);
        setFollowStats(prev => ({ ...prev, followers: prev.followers + 1 }));
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setFollowLoading(false);
    }
  };

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      loadPosts(page + 1, false);
    }
  };

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="flex pt-16">
          <Sidebar />
          <main className="flex-1 ml-64 p-6">
            <div className="max-w-4xl mx-auto">
              <ProfileSkeleton />
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="flex pt-16">
        <Sidebar />
        
        <main className="flex-1 ml-64 p-6 min-h-screen">
          <div className="max-w-4xl mx-auto">
            {/* Cover Image */}
            <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg overflow-hidden">
              {profile?.coverPicture && (
                <img 
                  src={profile.coverPicture} 
                  alt="Cover" 
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Profile Info */}
            <div className="bg-white dark:bg-gray-800 rounded-b-lg shadow-sm border border-gray-200 dark:border-gray-700 px-6 pb-6">
              <div className="flex items-end gap-4 -mt-16 mb-4">
                {/* Profile Picture */}
                <div className="relative">
                  <img
                    src={profile?.profilePicture || '/default-avatar.png'}
                    alt={profile?.name}
                    className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-900 object-cover"
                  />
                  {profile?.verified && (
                    <div className="absolute bottom-2 right-2 bg-blue-500 rounded-full p-1">
                      <CheckCircle className="w-6 h-6 text-white" fill="currentColor" />
                    </div>
                  )}
                </div>

                {/* Name & Actions */}
                <div className="flex-1 mt-16">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {profile?.name}
                    </h1>
                    {profile?.verified && (
                      <CheckCircle className="w-5 h-5 text-blue-500" fill="currentColor" />
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">@{profile?.email?.split('@')[0]}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mb-2">
                  {isOwnProfile ? (
                    <button
                      onClick={() => navigate('/settings')}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Edit Profile
                    </button>
                  ) : (
                    <button
                      onClick={handleFollow}
                      disabled={followLoading}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
                        ${isFollowing 
                          ? 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                    >
                      {isFollowing ? <UserMinus className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                      {isFollowing ? 'Unfollow' : 'Follow'}
                    </button>
                  )}
                </div>
              </div>

              {/* Bio */}
              {profile?.bio && (
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {profile.bio}
                </p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                {profile?.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {profile.location}
                  </div>
                )}
                {profile?.website && (
                  <a 
                    href={profile.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <LinkIcon className="w-4 h-4" />
                    {profile.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
                {profile?.createdAt && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined {format(new Date(profile.createdAt), 'MMMM yyyy')}
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="flex gap-6">
                <button className="hover:underline">
                  <span className="font-bold text-gray-900 dark:text-white">
                    {followStats.following}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 ml-1">Following</span>
                </button>
                <button className="hover:underline">
                  <span className="font-bold text-gray-900 dark:text-white">
                    {followStats.followers}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 ml-1">Followers</span>
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6">
                <div className="flex gap-1">
                  <button
                    onClick={() => setActiveTab('posts')}
                    className={`px-4 py-3 font-medium border-b-2 transition-colors
                      ${activeTab === 'posts' 
                        ? 'border-blue-600 text-blue-600 dark:text-blue-400' 
                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
                  >
                    Posts
                  </button>
                  {isOwnProfile && (
                    <button
                      onClick={() => setActiveTab('saved')}
                      className={`px-4 py-3 font-medium border-b-2 transition-colors flex items-center gap-2
                        ${activeTab === 'saved' 
                          ? 'border-blue-600 text-blue-600 dark:text-blue-400' 
                          : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
                    >
                      <Bookmark className="w-4 h-4" />
                      Saved
                    </button>
                  )}
                </div>

                {/* View Mode Toggle */}
                <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {activeTab === 'posts' ? (
                  posts.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      No posts yet
                    </div>
                  ) : (
                    <InfiniteScroll
                      loadMore={loadMore}
                      hasMore={hasMore}
                      loading={loadingMore}
                    >
                      <div className={viewMode === 'grid' 
                        ? 'grid grid-cols-3 gap-4' 
                        : 'space-y-4'}>
                        {posts.map((post) => (
                          <PostCard key={post.id} post={post} compact={viewMode === 'grid'} />
                        ))}
                      </div>
                    </InfiniteScroll>
                  )
                ) : (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    Saved posts will appear here
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
