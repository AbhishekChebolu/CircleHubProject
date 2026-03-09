import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image, X } from 'lucide-react';
import { circleService, postService } from '../services/api';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';

const CreatePostPage = () => {
  const navigate = useNavigate();
  const [circles, setCircles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    content: '',
    imageUrl: '',
    circleId: '',
  });

  useEffect(() => {
    loadCircles();
  }, []);

  const loadCircles = async () => {
    try {
      const response = await circleService.getAllCircles();
      setCircles(response.data);
      if (response.data.length > 0) {
        setFormData((prev) => ({ ...prev, circleId: response.data[0].id }));
      }
    } catch (error) {
      console.error('Error loading circles:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await postService.createPost(formData);
      navigate('/home');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="flex pt-16">
        <Sidebar />
        
        <main className="flex-1 ml-64 p-6">
          <div className="max-w-3xl mx-auto">
            <div className="card p-8">
              <h1 className="text-3xl font-bold mb-6">Create Post</h1>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Select Circle */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Select Circle
                  </label>
                  <select
                    value={formData.circleId}
                    onChange={(e) => setFormData({ ...formData, circleId: e.target.value })}
                    className="input-field"
                    required
                  >
                    {circles.map((circle) => (
                      <option key={circle.id} value={circle.id}>
                        {circle.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    What's on your mind?
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Share your thoughts..."
                    className="input-field min-h-[200px] resize-none"
                    required
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Image URL (optional)
                  </label>
                  <div className="relative">
                    <Image className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      className="input-field pl-12"
                    />
                  </div>
                  {formData.imageUrl && (
                    <div className="mt-4 relative rounded-xl overflow-hidden">
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-full h-auto"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, imageUrl: '' })}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading || !formData.content || !formData.circleId}
                    className="btn-primary flex-1"
                  >
                    {loading ? 'Posting...' : 'Post'}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreatePostPage;
