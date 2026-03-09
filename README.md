# CircleHub - Social Media Platform Backend

A comprehensive social media platform backend built with Spring Boot, MySQL, JWT authentication, and RESTful APIs.

## Tech Stack

- **Java 17**
- **Spring Boot 3.2.0**
- **MySQL**
- **JPA / Hibernate**
- **JWT Authentication**
- **Maven**
- **Lombok**

## Features

### 1. User Authentication
- User registration with email validation
- User login with JWT token generation
- Password encryption using BCrypt
- Token-based authentication

### 2. User Profile Management
- View user profile
- Update user profile (name, bio, profile picture)
- User information includes: id, name, email, bio, profilePicture, createdAt

### 3. Circles (Communities)
- Create new circles
- Join existing circles
- Leave circles
- View all circles with member count
- Circle information includes: id, name, description, category, createdBy, createdAt

### 4. Posts
- Create posts inside circles
- View posts by circle
- Post information includes: id, content, imageUrl, userId, circleId, createdAt
- Like count and comment count included in post details

### 5. Comments
- Add comments to posts
- View comments by post
- Comment information includes: id, content, userId, postId, createdAt

### 6. Likes
- Like/unlike posts
- Toggle like functionality
- Track like count per post

## Database Schema

### Tables
- **users** - Store user information
- **circles** - Store circle/community information
- **circle_members** - Junction table for user-circle relationships
- **posts** - Store post information
- **comments** - Store comment information
- **likes** - Store like information (user-post relationship)

## API Endpoints

### Authentication
```
POST /api/auth/register - Register new user
POST /api/auth/login - Login user
```

### Users
```
GET /api/users/{id} - Get user by ID
PUT /api/users/update - Update current user profile
```

### Circles
```
POST /api/circles/create - Create new circle
GET /api/circles - Get all circles
POST /api/circles/join?circleId={id} - Join a circle
POST /api/circles/leave?circleId={id} - Leave a circle
```

### Posts
```
POST /api/posts/create - Create new post
GET /api/posts/circle/{circleId} - Get posts by circle
POST /api/posts/{postId}/like - Toggle like on post
```

### Comments
```
POST /api/comments/add - Add comment to post
GET /api/comments/post/{postId} - Get comments by post
```

## Setup Instructions

### Prerequisites
- Java 17 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher

### Database Setup
1. Install MySQL
2. Create database:
```sql
CREATE DATABASE circlehub_db;
```

### Application Configuration
1. Update `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/circlehub_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

### Running the Application
1. Clone the repository
2. Navigate to project directory
3. Run:
```bash
mvn clean install
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

## Project Structure

```
src/main/java/com/circlehub/
├── config/              # Configuration classes
│   ├── SecurityConfig.java
│   └── CorsConfig.java
├── controller/          # REST controllers
│   ├── AuthController.java
│   ├── UserController.java
│   ├── CircleController.java
│   ├── PostController.java
│   └── CommentController.java
├── dto/                 # Data Transfer Objects
│   ├── RegisterRequest.java
│   ├── LoginRequest.java
│   ├── AuthResponse.java
│   ├── UserDTO.java
│   ├── CircleDTO.java
│   ├── PostDTO.java
│   ├── CommentDTO.java
│   └── ApiResponse.java
├── exception/           # Exception handlers
│   └── GlobalExceptionHandler.java
├── model/               # Entity classes
│   ├── User.java
│   ├── Circle.java
│   ├── CircleMember.java
│   ├── Post.java
│   ├── Comment.java
│   └── Like.java
├── repository/          # JPA repositories
│   ├── UserRepository.java
│   ├── CircleRepository.java
│   ├── CircleMemberRepository.java
│   ├── PostRepository.java
│   ├── CommentRepository.java
│   └── LikeRepository.java
├── security/            # Security components
│   ├── JwtUtil.java
│   ├── JwtAuthenticationFilter.java
│   └── JwtAuthenticationEntryPoint.java
├── service/             # Business logic
│   ├── AuthService.java
│   ├── UserService.java
│   ├── CircleService.java
│   ├── PostService.java
│   ├── CommentService.java
│   ├── LikeService.java
│   └── CustomUserDetailsService.java
└── CircleHubApplication.java  # Main application class
```

## Security

- JWT token-based authentication
- BCrypt password encryption
- Stateless session management
- CORS configuration for cross-origin requests
- Global exception handling

## API Authentication

All endpoints except `/api/auth/register` and `/api/auth/login` require JWT authentication.

Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Sample Request Examples

### Register User
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Circle
```json
POST /api/circles/create
Authorization: Bearer <token>
{
  "name": "Tech Enthusiasts",
  "description": "A circle for tech lovers",
  "category": "Technology"
}
```

### Create Post
```json
POST /api/posts/create
Authorization: Bearer <token>
{
  "content": "Hello CircleHub!",
  "imageUrl": "https://example.com/image.jpg",
  "circleId": 1
}
```

### Add Comment
```json
POST /api/comments/add
Authorization: Bearer <token>
{
  "content": "Great post!",
  "postId": 1
}
```

## Development Notes

- The application uses Hibernate's `ddl-auto=update` to automatically create/update database schema
- All timestamps are automatically managed using `@CreationTimestamp`
- Entity relationships are properly configured with lazy loading for performance
- Global exception handling provides consistent error responses
- DTOs are used to control data exposure and avoid circular references

## Future Enhancements

- File upload for images
- User search functionality
- Friend/Follow system
- Notifications
- Real-time messaging
- Email verification
- Password reset
- Admin panel
- Analytics and reporting

## License

MIT License

## Author

CircleHub Team
