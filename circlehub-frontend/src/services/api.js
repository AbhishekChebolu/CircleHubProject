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
  getPostsByCircle: (circleId) => api.get(`/posts/circle/${circleId}`),
  toggleLike: (postId) => api.post(`/posts/${postId}/like`),
};

// Comment Services
export const commentService = {
  addComment: (commentData) => api.post('/comments/add', commentData),
  getCommentsByPost: (postId) => api.get(`/comments/post/${postId}`),
};

export default api;
