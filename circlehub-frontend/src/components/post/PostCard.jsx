import { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Bookmark, Edit2, Trash2 } from 'lucide-react';
import { postService, savedPostService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { formatDistanceToNow } from '../../utils/dateUtils';
import VideoPlayer from '../media/VideoPlayer';

const PostCard = ({ post, onCommentClick, compact = false, onDelete, onEdit }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(post.isLikedByCurrentUser);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [saved, setSaved] = useState(post.isSavedByCurrentUser);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  
  const isOwnPost = user?.userId === post.userId;

  const handleLike = async () => {
    try {
      await postService.toggleLike(post.id);
      setLiked(!liked);
      setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleSave = async () => {
    try {
      if (saved) {
        await savedPostService.unsavePost(post.id);
      } else {
        await savedPostService.savePost(post.id);
      }
      setSaved(!saved);
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postService.deletePost(post.id);
        if (onDelete) onDelete(post.id);
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const handleEditSubmit = async () => {
    try {
      await postService.updatePost(post.id, editContent);
      post.content = editContent;
      post.isEdited = true;
      setIsEditing(false);
      if (onEdit) onEdit(post);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const renderMedia = () => {
    if (!post.mediaUrls || post.mediaUrls.length === 0) return null;

    if (post.mediaType === 'VIDEO' || post.mediaType === 'MIXED') {
      return (
        <div className="mb-4 rounded-xl overflow-hidden">
          <VideoPlayer src={post.mediaUrls[0]} />
        </div>
      );
    }

    if (post.mediaUrls.length === 1) {
      return (
        <div className="mb-4 rounded-xl overflow-hidden">
          <img
            src={post.mediaUrls[0]}
            alt="Post media"
            className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      );
    }

    return (
      <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl overflow-hidden">
        {post.mediaUrls.slice(0, 4).map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`Post media ${index + 1}`}
            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
          />
        ))}
      </div>
    );
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
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200"
          >
            <MoreHorizontal className="w-5 h-5 text-gray-500" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-10">
              {isOwnPost ? (
                <>
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Post
                  </button>
                  <button
                    onClick={() => {
                      handleDelete();
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 text-left"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Post
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowMenu(false)}
                  className="w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                >
                  Report Post
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              rows={4}
            />
            <div className="flex gap-2">
              <button
                onClick={handleEditSubmit}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(post.content);
                }}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
            {post.isEdited && (
              <p className="text-xs text-gray-400 mt-1">(edited)</p>
            )}
          </>
        )}
      </div>

      {/* Media */}
      {!isEditing && renderMedia()}

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
        <button
          onClick={handleSave}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium transition-all duration-200 ${
            saved
              ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <Bookmark className={`w-5 h-5 ${saved ? 'fill-blue-500' : ''}`} />
          <span>{saved ? 'Saved' : 'Save'}</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;
