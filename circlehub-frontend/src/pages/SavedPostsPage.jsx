import { useState, useEffect } from 'react';
import { savedPostService } from '../services/api';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import PostCard from '../components/post/PostCard';
import InfiniteScroll from '../components/common/InfiniteScroll';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { Bookmark, Trash2 } from 'lucide-react';

const SavedPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadSavedPosts(0, true);
  }, []);

  const loadSavedPosts = async (pageNum, reset = false) => {
    try {
      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await savedPostService.getSavedPosts(pageNum, 20);
      const newPosts = response.data.content || response.data;
      
      if (reset) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }
      
      setHasMore(newPosts.length === 20);
      setPage(pageNum);
    } catch (error) {
      console.error('Error loading saved posts:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      loadSavedPosts(page + 1, false);
    }
  };

  const handleUnsave = async (postId) => {
    try {
      await savedPostService.unsavePost(postId);
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error unsaving post:', error);
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to remove all saved posts?')) {
      try {
        // Unsave all posts
        await Promise.all(posts.map(post => savedPostService.unsavePost(post.id)));
        setPosts([]);
      } catch (error) {
        console.error('Error clearing saved posts:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="flex pt-16">
        <Sidebar />
        
        <main className="flex-1 ml-64 p-6 min-h-screen">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
                  <Bookmark className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Saved Posts
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    {posts.length} {posts.length === 1 ? 'post' : 'posts'} saved
                  </p>
                </div>
              </div>

              {posts.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </button>
              )}
            </div>

            {/* Content */}
            {loading && posts.length === 0 ? (
              <SkeletonLoader type="post" count={3} />
            ) : posts.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full">
                    <Bookmark className="w-12 h-12 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No saved posts yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  When you save a post, it will appear here
                </p>
              </div>
            ) : (
              <InfiniteScroll
                loadMore={loadMore}
                hasMore={hasMore}
                loading={loadingMore}
              >
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div key={post.id} className="relative group">
                      <PostCard post={post} />
                      
                      {/* Unsave Button Overlay */}
                      <button
                        onClick={() => handleUnsave(post.id)}
                        className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg 
                          opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Remove from saved"
                      >
                        <Bookmark className="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" />
                      </button>
                    </div>
                  ))}
                </div>
              </InfiniteScroll>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SavedPostsPage;
