import { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { postService } from '../../services/api';
import { formatDistanceToNow } from '../../utils/dateUtils';

const PostCard = ({ post, onCommentClick }) => {
  const [liked, setLiked] = useState(post.isLikedByCurrentUser);
  const [likeCount, setLikeCount] = useState(post.likeCount);

  const handleLike = async () => {
    try {
      await postService.toggleLike(post.id);
      setLiked(!liked);
      setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <div className="card p-6 mb-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white font-semibold shadow-lg">
            {post.userName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold hover:text-primary-600 cursor-pointer transition-colors">
                {post.userName}
              </h3>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-primary-600 dark:text-primary-400 font-medium hover:underline cursor-pointer">
                {post.circleName}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(post.createdAt)}
            </p>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200">
          <MoreHorizontal className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
      </div>

      {/* Image */}
      {post.imageUrl && (
        <div className="mb-4 rounded-xl overflow-hidden">
          <img
            src={post.imageUrl}
            alt="Post"
            className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center gap-6 py-3 border-t border-b border-gray-100 dark:border-gray-700 text-sm text-gray-500">
        <span>{likeCount} likes</span>
        <span>{post.commentCount} comments</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3">
        <button
          onClick={handleLike}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium transition-all duration-200 ${
            liked
              ? 'text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <Heart className={`w-5 h-5 ${liked ? 'fill-red-500' : ''}`} />
          <span>Like</span>
        </button>
        <button
          onClick={() => onCommentClick(post)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
        >
          <MessageCircle className="w-5 h-5" />
          <span>Comment</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200">
          <Share2 className="w-5 h-5" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;
