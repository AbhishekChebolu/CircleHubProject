# CircleHub Production Upgrade Plan

## Overview
This document outlines the comprehensive upgrade of CircleHub from a basic social platform to a production-ready application with advanced features.

## Phase 1: Backend Enhancements ✅ (In Progress)

### 1.1 Dependencies Added
- ✅ Cloudinary for media storage
- ✅ WebSocket for real-time notifications
- ✅ Redis for caching and rate limiting
- ✅ Bucket4j for rate limiting

### 1.2 New Entity Models
- ✅ **UserFollow** - Follow/unfollow system
- ✅ **SavedPost** - Bookmark posts
- ✅ **Notification** - Real-time notifications
- ✅ **RefreshToken** - JWT refresh tokens

### 1.3 Updated Entities
- ✅ **User** - Added cover picture, website, location, verified status, followers, following
- ✅ **Post** - Added media support (multiple images/videos), edit tracking, saved posts
- ✅ **Comment** - Added nested replies (parent-child relationship)

### 1.4 Configuration Updates
- ✅ Increased file upload limit to 50MB
- ✅ Added Cloudinary configuration
- ✅ Added Redis configuration
- ✅ Added WebSocket configuration
- ✅ Added refresh token expiration
- ✅ Added rate limiting configuration

## Phase 2: New Services & Repositories (To Be Implemented)

### 2.1 New Repositories
- [ ] UserFollowRepository
- [ ] SavedPostRepository
- [ ] NotificationRepository
- [ ] RefreshTokenRepository

### 2.2 New Services
- [ ] **MediaService** - Handle Cloudinary uploads
- [ ] **NotificationService** - Create and manage notifications
- [ ] **FollowService** - Follow/unfollow logic
- [ ] **SavedPostService** - Bookmark management
- [ ] **SearchService** - Search users, circles, posts
- [ ] **FeedService** - Algorithm for different feeds

### 2.3 Updated Services
- [ ] **PostService** - Support media uploads, edit, delete
- [ ] **CommentService** - Support nested comments
- [ ] **AuthService** - Add refresh token logic

## Phase 3: New Controllers & APIs (To Be Implemented)

### 3.1 New Endpoints

#### User Follow
- POST /api/users/{id}/follow
- DELETE /api/users/{id}/unfollow
- GET /api/users/{id}/followers
- GET /api/users/{id}/following

#### Media Upload
- POST /api/media/upload - Upload single file
- POST /api/media/upload-multiple - Upload multiple files
- DELETE /api/media/{publicId} - Delete media

#### Saved Posts
- POST /api/posts/{id}/save
- DELETE /api/posts/{id}/unsave
- GET /api/saved-posts - Get user's saved posts

#### Notifications
- GET /api/notifications - Get user notifications
- PUT /api/notifications/{id}/read - Mark as read
- PUT /api/notifications/read-all - Mark all as read
- DELETE /api/notifications/{id} - Delete notification

#### Search
- GET /api/search/users?q={query}
- GET /api/search/circles?q={query}
- GET /api/search/posts?q={query}
- GET /api/search/all?q={query}

#### Feed
- GET /api/feed/home?page={page}
- GET /api/feed/trending?page={page}
- GET /api/feed/following?page={page}

#### Refresh Token
- POST /api/auth/refresh - Refresh access token

## Phase 4: Frontend Upgrades (To Be Implemented)

### 4.1 New Components
- [ ] **MediaUploader** - Drag & drop file upload
- [ ] **VideoPlayer** - Custom video player with controls
- [ ] **NotificationDropdown** - Real-time notifications
- [ ] **InfiniteScroll** - Lazy loading for feeds
- [ ] **SkeletonLoader** - Loading placeholders
- [ ] **UserCard** - User profile card
- [ ] **FollowButton** - Follow/unfollow button
- [ ] **SaveButton** - Save/unsave button
- [ ] **SearchBar** - Global search
- [ ] **CommentThread** - Nested comments display

### 4.2 New Pages
- [ ] **UserProfilePage** - Complete user profile
- [ ] **EditProfilePage** - Edit user info
- [ ] **SavedPostsPage** - View bookmarked posts
- [ ] **NotificationsPage** - Full notifications list
- [ ] **FollowersPage** - View followers/following
- [ ] **TrendingPage** - Trending posts
- [ ] **SearchResultsPage** - Search results

### 4.3 UI Enhancements
- [ ] Glassmorphism effects
- [ ] Smooth page transitions
- [ ] Optimistic UI updates
- [ ] Real-time notification badges
- [ ] Infinite scroll for all feeds
- [ ] Image/video gallery viewer
- [ ] Skeleton loaders everywhere
- [ ] Toast notifications
- [ ] Confirmation dialogs
- [ ] Loading progress bars

### 4.4 New Hooks
- [ ] **useInfiniteScroll** - Pagination
- [ ] **useMediaUpload** - File uploads
- [ ] **useNotifications** - WebSocket notifications
- [ ] **useSearch** - Debounced search
- [ ] **useFollow** - Follow/unfollow logic

## Phase 5: WebSocket Integration (To Be Implemented)

### 5.1 Backend
- [ ] WebSocket configuration
- [ ] Notification broadcasting
- [ ] User online status
- [ ] Real-time feed updates

### 5.2 Frontend
- [ ] WebSocket connection management
- [ ] Real-time notification updates
- [ ] Live notification badge
- [ ] Reconnection logic

## Phase 6: Security & Performance (To Be Implemented)

### 6.1 Security
- [ ] Rate limiting middleware
- [ ] Input sanitization
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] SQL injection prevention
- [ ] File upload validation

### 6.2 Performance
- [ ] Database indexing
- [ ] Query optimization
- [ ] Redis caching
- [ ] Image optimization (Cloudinary)
- [ ] Video transcoding
- [ ] CDN integration

## Phase 7: Testing & Documentation (To Be Implemented)

### 7.1 Testing
- [ ] Unit tests for services
- [ ] Integration tests for APIs
- [ ] E2E tests for critical flows

### 7.2 Documentation
- [ ] Updated API documentation
- [ ] Frontend component documentation
- [ ] Deployment guide
- [ ] Environment setup guide

## Technology Stack

### Backend
- Java 17
- Spring Boot 3.2.0
- MySQL 8.0
- Redis
- Cloudinary
- WebSocket
- JWT
- Bucket4j (Rate Limiting)

### Frontend
- React 18
- Vite
- TailwindCSS 3.4
- Axios
- React Router
- React Query (recommended)
- Socket.io-client (WebSocket)

## Database Schema Updates

### New Tables
```sql
-- User Follows
CREATE TABLE user_follows (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    follower_id BIGINT NOT NULL,
    following_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (follower_id) REFERENCES users(id),
    FOREIGN KEY (following_id) REFERENCES users(id),
    UNIQUE KEY (follower_id, following_id)
);

-- Saved Posts
CREATE TABLE saved_posts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    post_id BIGINT NOT NULL,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (post_id) REFERENCES posts(id),
    UNIQUE KEY (user_id, post_id)
);

-- Notifications
CREATE TABLE notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    actor_id BIGINT NOT NULL,
    type ENUM('LIKE', 'COMMENT', 'FOLLOW', 'MENTION') NOT NULL,
    reference_id BIGINT,
    content TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (actor_id) REFERENCES users(id)
);

-- Refresh Tokens
CREATE TABLE refresh_tokens (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    expiry_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Updated Tables
```sql
-- Users table additions
ALTER TABLE users ADD COLUMN cover_picture VARCHAR(500);
ALTER TABLE users ADD COLUMN website VARCHAR(255);
ALTER TABLE users ADD COLUMN location VARCHAR(255);
ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT FALSE;

-- Posts table updates
ALTER TABLE posts CHANGE image_url media_urls TEXT;
ALTER TABLE posts ADD COLUMN media_type ENUM('NONE', 'IMAGE', 'VIDEO', 'MIXED');
ALTER TABLE posts ADD COLUMN is_edited BOOLEAN DEFAULT FALSE;
ALTER TABLE posts ADD COLUMN updated_at TIMESTAMP;

-- Comments table update
ALTER TABLE comments ADD COLUMN parent_id BIGINT;
ALTER TABLE comments ADD FOREIGN KEY (parent_id) REFERENCES comments(id);
```

## API Response Examples

### Media Upload Response
```json
{
  "url": "https://res.cloudinary.com/...",
  "publicId": "circlehub/abc123",
  "format": "jpg",
  "width": 1920,
  "height": 1080,
  "size": 245678
}
```

### Notification Response
```json
{
  "id": 1,
  "type": "LIKE",
  "actor": {
    "id": 2,
    "name": "John Doe",
    "profilePicture": "..."
  },
  "content": "liked your post",
  "referenceId": 123,
  "isRead": false,
  "createdAt": "2026-03-09T14:30:00"
}
```

## Implementation Priority

1. **High Priority** (Core Features)
   - Media upload service
   - Follow/unfollow system
   - Saved posts
   - Notifications
   - Refresh tokens

2. **Medium Priority** (Enhancements)
   - Search functionality
   - Feed algorithms
   - Nested comments
   - WebSocket integration

3. **Low Priority** (Polish)
   - Rate limiting
   - Advanced analytics
   - Video transcoding
   - Social sharing

## Next Steps

1. Complete backend services and repositories
2. Implement new API endpoints
3. Create frontend components
4. Integrate WebSocket
5. Add comprehensive testing
6. Update documentation
7. Performance optimization
8. Security hardening

---

**Status**: Phase 1 Complete (40%)
**Last Updated**: March 9, 2026
