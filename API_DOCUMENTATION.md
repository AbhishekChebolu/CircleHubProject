# CircleHub API Documentation

Complete API reference for CircleHub Social Media Platform

**Base URL:** `http://localhost:8080`

**Version:** 1.0.0

---

## Table of Contents

1. [Authentication](#authentication)
2. [Users](#users)
3. [Circles](#circles)
4. [Posts](#posts)
5. [Comments](#comments)
6. [Error Handling](#error-handling)

---

## Authentication

### Register User

Create a new user account.

**Endpoint:** `POST /api/auth/register`

**Authentication:** Not required

**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string (required, valid email)",
  "password": "string (required, min 6 characters)"
}
```

**Example:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response:**
- **Code:** 200 OK
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqb2huQGV4YW1wbGUuY29tIi...",
  "type": "Bearer",
  "userId": 1,
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Error Responses:**
- **400 Bad Request** - Validation errors or email already exists
```json
{
  "error": "Email already exists"
}
```

---

### Login User

Authenticate existing user.

**Endpoint:** `POST /api/auth/login`

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "string (required, valid email)",
  "password": "string (required)"
}
```

**Example:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response:**
- **Code:** 200 OK
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqb2huQGV4YW1wbGUuY29tIi...",
  "type": "Bearer",
  "userId": 1,
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Error Responses:**
- **401 Unauthorized** - Invalid credentials
```json
{
  "error": "Invalid email or password"
}
```

---

## Users

### Get User by ID

Retrieve user information by ID.

**Endpoint:** `GET /api/users/{id}`

**Authentication:** Required

**Headers:**
```
Authorization: Bearer {token}
```

**URL Parameters:**
- `id` (required) - User ID

**Success Response:**
- **Code:** 200 OK
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "bio": "Software Developer",
  "profilePicture": "https://example.com/profile.jpg",
  "createdAt": "2026-03-09T12:30:00"
}
```

**Error Responses:**
- **404 Not Found** - User not found
- **401 Unauthorized** - Invalid or missing token

---

### Update User Profile

Update current user's profile.

**Endpoint:** `PUT /api/users/update`

**Authentication:** Required

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "string (optional)",
  "bio": "string (optional)",
  "profilePicture": "string (optional)"
}
```

**Example:**
```json
{
  "name": "John Updated",
  "bio": "Senior Software Developer",
  "profilePicture": "https://example.com/new-profile.jpg"
}
```

**Success Response:**
- **Code:** 200 OK
```json
{
  "id": 1,
  "name": "John Updated",
  "email": "john@example.com",
  "bio": "Senior Software Developer",
  "profilePicture": "https://example.com/new-profile.jpg",
  "createdAt": "2026-03-09T12:30:00"
}
```

---

## Circles

### Create Circle

Create a new circle/community.

**Endpoint:** `POST /api/circles/create`

**Authentication:** Required

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "string (required)",
  "description": "string (optional)",
  "category": "string (required)"
}
```

**Example:**
```json
{
  "name": "Tech Enthusiasts",
  "description": "A community for technology lovers",
  "category": "Technology"
}
```

**Success Response:**
- **Code:** 200 OK
```json
{
  "id": 1,
  "name": "Tech Enthusiasts",
  "description": "A community for technology lovers",
  "category": "Technology",
  "createdById": 1,
  "createdByName": "John Doe",
  "createdAt": "2026-03-09T12:30:00",
  "memberCount": 1
}
```

**Note:** Creator is automatically added as a member.

**Error Responses:**
- **400 Bad Request** - Circle name already exists

---

### Get All Circles

Retrieve all available circles.

**Endpoint:** `GET /api/circles`

**Authentication:** Required

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response:**
- **Code:** 200 OK
```json
[
  {
    "id": 1,
    "name": "Tech Enthusiasts",
    "description": "A community for technology lovers",
    "category": "Technology",
    "createdById": 1,
    "createdByName": "John Doe",
    "createdAt": "2026-03-09T12:30:00",
    "memberCount": 5
  },
  {
    "id": 2,
    "name": "Book Club",
    "description": "Share and discuss books",
    "category": "Literature",
    "createdById": 2,
    "createdByName": "Jane Smith",
    "createdAt": "2026-03-09T13:00:00",
    "memberCount": 3
  }
]
```

---

### Join Circle

Join an existing circle.

**Endpoint:** `POST /api/circles/join`

**Authentication:** Required

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `circleId` (required) - ID of the circle to join

**Example:**
```
POST /api/circles/join?circleId=1
```

**Success Response:**
- **Code:** 200 OK
```json
{
  "success": true,
  "message": "Successfully joined circle"
}
```

**Error Responses:**
- **400 Bad Request** - Already a member or circle not found

---

### Leave Circle

Leave a circle you're a member of.

**Endpoint:** `POST /api/circles/leave`

**Authentication:** Required

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `circleId` (required) - ID of the circle to leave

**Example:**
```
POST /api/circles/leave?circleId=1
```

**Success Response:**
- **Code:** 200 OK
```json
{
  "success": true,
  "message": "Successfully left circle"
}
```

**Error Responses:**
- **400 Bad Request** - Not a member or circle not found

---

## Posts

### Create Post

Create a new post in a circle.

**Endpoint:** `POST /api/posts/create`

**Authentication:** Required

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "content": "string (required)",
  "imageUrl": "string (optional)",
  "circleId": "number (required)"
}
```

**Example:**
```json
{
  "content": "Hello CircleHub! This is my first post.",
  "imageUrl": "https://example.com/image.jpg",
  "circleId": 1
}
```

**Success Response:**
- **Code:** 200 OK
```json
{
  "id": 1,
  "content": "Hello CircleHub! This is my first post.",
  "imageUrl": "https://example.com/image.jpg",
  "createdAt": "2026-03-09T12:30:00",
  "userId": 1,
  "userName": "John Doe",
  "userProfilePicture": "https://example.com/profile.jpg",
  "circleId": 1,
  "circleName": "Tech Enthusiasts",
  "likeCount": 0,
  "commentCount": 0,
  "isLikedByCurrentUser": false
}
```

---

### Get Posts by Circle

Retrieve all posts from a specific circle.

**Endpoint:** `GET /api/posts/circle/{circleId}`

**Authentication:** Required

**Headers:**
```
Authorization: Bearer {token}
```

**URL Parameters:**
- `circleId` (required) - Circle ID

**Success Response:**
- **Code:** 200 OK
```json
[
  {
    "id": 1,
    "content": "Hello CircleHub! This is my first post.",
    "imageUrl": "https://example.com/image.jpg",
    "createdAt": "2026-03-09T12:30:00",
    "userId": 1,
    "userName": "John Doe",
    "userProfilePicture": "https://example.com/profile.jpg",
    "circleId": 1,
    "circleName": "Tech Enthusiasts",
    "likeCount": 5,
    "commentCount": 3,
    "isLikedByCurrentUser": true
  }
]
```

**Note:** Posts are ordered by creation date (newest first).

---

### Toggle Like on Post

Like or unlike a post.

**Endpoint:** `POST /api/posts/{postId}/like`

**Authentication:** Required

**Headers:**
```
Authorization: Bearer {token}
```

**URL Parameters:**
- `postId` (required) - Post ID

**Example:**
```
POST /api/posts/1/like
```

**Success Response:**
- **Code:** 200 OK
```json
{
  "success": true,
  "message": "Like toggled successfully"
}
```

**Behavior:**
- If not liked: Creates a like
- If already liked: Removes the like

---

## Comments

### Add Comment

Add a comment to a post.

**Endpoint:** `POST /api/comments/add`

**Authentication:** Required

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "content": "string (required)",
  "postId": "number (required)"
}
```

**Example:**
```json
{
  "content": "Great post! Thanks for sharing.",
  "postId": 1
}
```

**Success Response:**
- **Code:** 200 OK
```json
{
  "id": 1,
  "content": "Great post! Thanks for sharing.",
  "userId": 1,
  "userName": "John Doe",
  "userProfilePicture": "https://example.com/profile.jpg",
  "postId": 1,
  "createdAt": "2026-03-09T12:30:00"
}
```

---

### Get Comments by Post

Retrieve all comments for a specific post.

**Endpoint:** `GET /api/comments/post/{postId}`

**Authentication:** Required

**Headers:**
```
Authorization: Bearer {token}
```

**URL Parameters:**
- `postId` (required) - Post ID

**Success Response:**
- **Code:** 200 OK
```json
[
  {
    "id": 1,
    "content": "Great post! Thanks for sharing.",
    "userId": 1,
    "userName": "John Doe",
    "userProfilePicture": "https://example.com/profile.jpg",
    "postId": 1,
    "createdAt": "2026-03-09T12:30:00"
  },
  {
    "id": 2,
    "content": "I totally agree!",
    "userId": 2,
    "userName": "Jane Smith",
    "userProfilePicture": "https://example.com/jane.jpg",
    "postId": 1,
    "createdAt": "2026-03-09T12:35:00"
  }
]
```

**Note:** Comments are ordered by creation date (newest first).

---

## Error Handling

### Standard Error Response Format

All errors follow this structure:

```json
{
  "error": "Error message description"
}
```

### Common HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 400 | Bad Request | Validation error or invalid data |
| 401 | Unauthorized | Missing or invalid JWT token |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server error |

### Validation Errors

For validation errors, response includes field-specific messages:

```json
{
  "name": "Name is required",
  "email": "Email should be valid",
  "password": "Password must be at least 6 characters"
}
```

### Authentication Errors

**Missing Token:**
```
Status: 401 Unauthorized
Body: "Unauthorized"
```

**Expired Token:**
```
Status: 401 Unauthorized
Body: "Unauthorized"
```

**Solution:** Login again to get a new token.

---

## Rate Limiting

Currently no rate limiting is implemented. For production deployment, consider implementing rate limiting.

---

## Versioning

Current API version: **v1.0.0**

Future versions will use URL versioning:
- v1: `/api/v1/...`
- v2: `/api/v2/...`

---

## Best Practices

### 1. Always Include Authorization Header

```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

### 2. Set Content-Type for POST/PUT Requests

```
Content-Type: application/json
```

### 3. Handle Token Expiration

- Default expiration: 24 hours
- Store token securely
- Implement token refresh on 401 errors

### 4. Validate Data Client-Side

- Match server-side validation rules
- Provide immediate user feedback

### 5. Use HTTPS in Production

- Never send tokens over HTTP
- Encrypt all traffic

---

## Example Workflow

### Complete User Journey

```bash
# 1. Register
POST /api/auth/register
Body: {"name":"Alice","email":"alice@test.com","password":"test123"}
Response: {token: "...", userId: 1, ...}

# 2. Create a Circle
POST /api/circles/create
Headers: Authorization: Bearer {token}
Body: {"name":"Foodies","category":"Food"}
Response: {id: 1, name: "Foodies", ...}

# 3. Create a Post
POST /api/posts/create
Headers: Authorization: Bearer {token}
Body: {"content":"Best pizza recipe!","circleId":1}
Response: {id: 1, content: "Best pizza recipe!", ...}

# 4. Like the Post
POST /api/posts/1/like
Headers: Authorization: Bearer {token}
Response: {success: true, ...}

# 5. Comment on Post
POST /api/comments/add
Headers: Authorization: Bearer {token}
Body: {"content":"Looks delicious!","postId":1}
Response: {id: 1, content: "Looks delicious!", ...}
```

---

## Testing Tools

### Postman Collection

Import the provided `CircleHub-API-Collection.postman_collection.json` for quick testing.

### cURL Examples

See [QUICKSTART.md](QUICKSTART.md) for complete cURL examples.

---

## Support

For issues or questions:
- Check [README.md](README.md) for detailed setup
- Review [QUICKSTART.md](QUICKSTART.md) for common examples
- See [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) for architecture

---

**Last Updated:** March 9, 2026  
**API Version:** 1.0.0  
**Framework:** Spring Boot 3.2.0
