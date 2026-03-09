import { useState, useEffect } from 'react';
import { circleService, feedService } from '../services/api';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import PostCard from '../components/post/PostCard';
import CircleCard from '../components/circle/CircleCard';
import InfiniteScroll from '../components/common/InfiniteScroll';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { TrendingUp, Home as HomeIcon, Compass } from 'lucide-react';

const HomePage = () => {
  const [circles, setCircles] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [feedType, setFeedType] = useState('home'); // 'home', 'trending', 'explore'

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const circlesResponse = await circleService.getAllCircles();
      setCircles(circlesResponse.data);
      
      // Load initial feed
      await loadFeed(0, true);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFeed = async (pageNum, reset = false) => {
    try {
      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      let response;
      switch (feedType) {
        case 'trending':
          response = await feedService.getTrendingFeed(pageNum, 20);
          break;
        case 'explore':
          response = await feedService.getExploreFeed(pageNum, 20);
          break;
        default:
          response = await feedService.getHomeFeed(pageNum, 20);
      }

      const newPosts = response.data;
      
      if (reset) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }
      
      setHasMore(newPosts.length === 20);
      setPage(pageNum);
    } catch (error) {
      console.error('Error loading feed:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleFeedTypeChange = (type) => {
    setFeedType(type);
    setPosts([]);
    setPage(0);
    setHasMore(true);
  };

  useEffect(() => {
    if (feedType) {
      loadFeed(0, true);
    }
  }, [feedType]);

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      loadFeed(page + 1, false);
    }
  };

  const handleCommentClick = (post) => {
    // Navigate to post detail or open comment modal
    console.log('Comment on post:', post.id);
  };



  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="flex pt-16">
        <Sidebar />
        
        {/* Main Feed */}
        <main className="flex-1 ml-64 mr-80 p-6 min-h-screen">
          <div className="max-w-3xl mx-auto">
            {/* Feed Type Selector */}
            <div className="flex gap-2 mb-6 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm">
              <button
                onClick={() => handleFeedTypeChange('home')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
                  ${feedType === 'home' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <HomeIcon className="w-4 h-4" />
                Home
              </button>
              <button
                onClick={() => handleFeedTypeChange('trending')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
                  ${feedType === 'trending' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <TrendingUp className="w-4 h-4" />
                Trending
              </button>
              <button
                onClick={() => handleFeedTypeChange('explore')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
                  ${feedType === 'explore' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <Compass className="w-4 h-4" />
                Explore
              </button>
            </div>
            
            {loading && posts.length === 0 ? (
              <SkeletonLoader type="post" count={3} />
            ) : posts.length === 0 ? (
              <div className="card p-12 text-center">
                <p className="text-gray-500">No posts yet. Join a circle and start creating content!</p>
              </div>
            ) : (
              <InfiniteScroll
                loadMore={loadMore}
                hasMore={hasMore}
                loading={loadingMore}
              >
                <div className="space-y-4">
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} onCommentClick={handleCommentClick} />
                  ))}
                </div>
              </InfiniteScroll>
            )}
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="fixed right-0 top-16 w-80 h-[calc(100vh-4rem)] glass border-l border-gray-200 dark:border-gray-700 p-6 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-4">Suggested Circles</h2>
            <div className="space-y-4">
              {circles.slice(0, 5).map((circle) => (
                <CircleCard key={circle.id} circle={circle} />
              ))}
            </div>
          </div>

          {/* Trending Tags */}
          <div>
            <h2 className="text-lg font-bold mb-4">Trending Topics</h2>
            <div className="space-y-2">
              {['#Technology', '#Fitness', '#Travel', '#Photography', '#Startups'].map((tag) => (
                <div key={tag} className="card p-3 hover:scale-105 transition-all duration-200 cursor-pointer">
                  <p className="font-semibold text-primary-600 dark:text-primary-400">{tag}</p>
                  <p className="text-sm text-gray-500">{Math.floor(Math.random() * 1000)} posts</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default HomePage;
