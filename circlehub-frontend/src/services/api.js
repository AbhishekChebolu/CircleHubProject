import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth Services
export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
  logout: (refreshToken) => api.post('/auth/logout', { refreshToken }),
};

// User Services
export const userService = {
  getUser: (id) => api.get(`/users/${id}`),
  updateUser: (userData) => api.put('/users/update', userData),
};

// Circle Services
export const circleService = {
  getAllCircles: () => api.get('/circles'),
  createCircle: (circleData) => api.post('/circles/create', circleData),
  joinCircle: (circleId) => api.post('/circles/join', null, { params: { circleId } }),
  leaveCircle: (circleId) => api.post('/circles/leave', null, { params: { circleId } }),
};

// Post Services
export const postService = {
  createPost: (postData) => api.post('/posts/create', postData),
  updatePost: (postId, content) => api.put(`/posts/${postId}`, { content }),
  deletePost: (postId) => api.delete(`/posts/${postId}`),
  getPostsByCircle: (circleId) => api.get(`/posts/circle/${circleId}`),
  toggleLike: (postId) => api.post(`/posts/${postId}/like`),
};

// Comment Services
export const commentService = {
  addComment: (commentData) => api.post('/comments/add', commentData),
  getCommentsByPost: (postId) => api.get(`/comments/post/${postId}`),
};

// Media Services
export const mediaService = {
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadMultiple: (files) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    return api.post('/media/upload-multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteFile: (publicId) => api.delete(`/media/${publicId}`),
};

// Follow Services
export const followService = {
  followUser: (userId) => api.post(`/users/${userId}/follow`),
  unfollowUser: (userId) => api.delete(`/users/${userId}/unfollow`),
  getFollowers: (userId, page = 0, size = 20) => 
    api.get(`/users/${userId}/followers`, { params: { page, size } }),
  getFollowing: (userId, page = 0, size = 20) => 
    api.get(`/users/${userId}/following`, { params: { page, size } }),
  getFollowStats: (userId) => api.get(`/users/${userId}/follow-stats`),
};

// Saved Post Services
export const savedPostService = {
  savePost: (postId) => api.post(`/posts/${postId}/save`),
  unsavePost: (postId) => api.delete(`/posts/${postId}/unsave`),
  isSaved: (postId) => api.get(`/posts/${postId}/is-saved`),
  getSavedPosts: (page = 0, size = 20) => 
    api.get('/posts/saved', { params: { page, size } }),
};

// Notification Services
export const notificationService = {
  getNotifications: (page = 0, size = 20) => 
    api.get('/notifications', { params: { page, size } }),
  getUnreadNotifications: () => api.get('/notifications/unread'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (notificationId) => api.put(`/notifications/${notificationId}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  deleteNotification: (notificationId) => api.delete(`/notifications/${notificationId}`),
};

// Search Services
export const searchService = {
  searchAll: (query, page = 0, size = 10) => 
    api.get('/search', { params: { query, page, size } }),
  searchUsers: (query, page = 0, size = 10) => 
    api.get('/search/users', { params: { query, page, size } }),
  searchCircles: (query, page = 0, size = 10) => 
    api.get('/search/circles', { params: { query, page, size } }),
  searchPosts: (query, page = 0, size = 10) => 
    api.get('/search/posts', { params: { query, page, size } }),
};

// Feed Services
export const feedService = {
  getHomeFeed: (page = 0, size = 20) => 
    api.get('/feed/home', { params: { page, size } }),
  getTrendingFeed: (page = 0, size = 20) => 
    api.get('/feed/trending', { params: { page, size } }),
  getExploreFeed: (page = 0, size = 20) => 
    api.get('/feed/explore', { params: { page, size } }),
  getCircleFeed: (circleId, page = 0, size = 20) => 
    api.get(`/feed/circle/${circleId}`, { params: { page, size } }),
};

export default api;
