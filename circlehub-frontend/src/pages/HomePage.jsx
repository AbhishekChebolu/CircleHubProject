import { useState, useEffect } from 'react';
import { circleService, postService } from '../services/api';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import PostCard from '../components/post/PostCard';
import CircleCard from '../components/circle/CircleCard';
import { Loader2 } from 'lucide-react';

const HomePage = () => {
  const [circles, setCircles] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCircle, setSelectedCircle] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const circlesResponse = await circleService.getAllCircles();
      setCircles(circlesResponse.data);
      
      if (circlesResponse.data.length > 0) {
        loadPosts(circlesResponse.data[0].id);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPosts = async (circleId) => {
    try {
      setLoading(true);
      const postsResponse = await postService.getPostsByCircle(circleId);
      setPosts(postsResponse.data);
      setSelectedCircle(circleId);
    } catch (error) {
      console.error('Error loading posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentClick = (post) => {
    // Navigate to post detail or open comment modal
    console.log('Comment on post:', post.id);
  };

  if (loading && circles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="flex pt-16">
        <Sidebar />
        
        {/* Main Feed */}
        <main className="flex-1 ml-64 mr-80 p-6 min-h-screen">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Home Feed</h1>
            
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
              </div>
            ) : posts.length === 0 ? (
              <div className="card p-12 text-center">
                <p className="text-gray-500">No posts yet. Join a circle and start creating content!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} onCommentClick={handleCommentClick} />
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="fixed right-0 top-16 w-80 h-[calc(100vh-4rem)] glass border-l border-gray-200 dark:border-gray-700 p-6 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-4">Suggested Circles</h2>
            <div className="space-y-4">
              {circles.slice(0, 5).map((circle) => (
                <div 
                  key={circle.id} 
                  onClick={() => loadPosts(circle.id)}
                  className={`cursor-pointer ${selectedCircle === circle.id ? 'ring-2 ring-primary-500' : ''}`}
                >
                  <CircleCard circle={circle} />
                </div>
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
