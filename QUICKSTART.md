# CircleHub - Quick Start Guide

Get CircleHub up and running in 5 minutes! ⚡

## Prerequisites Checklist

- [ ] Java 17 or higher installed
- [ ] MySQL 8.0 or higher installed and running
- [ ] Maven 3.6 or higher installed
- [ ] Git installed (for cloning)

### Check Your Installations

```bash
java -version    # Should show Java 17+
mvn -version     # Should show Maven 3.6+
mysql --version  # Should show MySQL 8.0+
```

## Step 1: Clone the Repository

```bash
git clone https://github.com/AbhishekChebolu/CircleHubProject.git
cd CircleHubProject
```

## Step 2: Setup MySQL Database

### Option A: Using MySQL Command Line

```bash
mysql -u root -p
```

Then execute:

```sql
CREATE DATABASE circlehub_db;
exit;
```

### Option B: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your local instance
3. Run: `CREATE DATABASE circlehub_db;`

## Step 3: Configure Database Connection

Edit `src/main/resources/application.properties`:

```properties
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

**Default values:**
- Username: `root`
- Password: `root`

## Step 4: Run the Application

```bash
mvn clean install
mvn spring-boot:run
```

**Expected Output:**
```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.2.0)

...
Application started on port 8080
```

## Step 5: Test the API

### Option A: Using cURL

**Register a new user:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "userId": 1,
  "name": "John Doe",
  "email": "john@example.com"
}
```

### Option B: Using Postman

1. Import `CircleHub-API-Collection.postman_collection.json`
2. Run the "Register User" request
3. Copy the token from response
4. Set it in Postman environment variable `jwt_token`
5. Test other endpoints!

## Step 6: Verify Database

```sql
USE circlehub_db;
SHOW TABLES;
```

**Expected Tables:**
```
+-------------------------+
| Tables_in_circlehub_db  |
+-------------------------+
| users                   |
| circles                 |
| circle_members          |
| posts                   |
| comments                |
| likes                   |
+-------------------------+
```

## Common Use Cases

### 1. Register & Login

```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@test.com","password":"test123"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@test.com","password":"test123"}'
```

### 2. Create a Circle

```bash
curl -X POST http://localhost:8080/api/circles/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Tech Lovers",
    "description": "Discuss latest tech",
    "category": "Technology"
  }'
```

### 3. Create a Post

```bash
curl -X POST http://localhost:8080/api/posts/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "content": "Hello CircleHub!",
    "circleId": 1
  }'
```

### 4. Add a Comment

```bash
curl -X POST http://localhost:8080/api/comments/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "content": "Great post!",
    "postId": 1
  }'
```

### 5. Like a Post

```bash
curl -X POST http://localhost:8080/api/posts/1/like \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Troubleshooting

### Problem: "Connection refused" error

**Solution:** Make sure MySQL is running
```bash
# Linux/Mac
sudo systemctl status mysql

# Windows
net start MySQL80
```

### Problem: "Access denied for user"

**Solution:** Check your MySQL credentials in `application.properties`

### Problem: "Port 8080 already in use"

**Solution:** Change port in `application.properties`:
```properties
server.port=8081
```

### Problem: "Table doesn't exist"

**Solution:** Database tables are auto-created. Restart the application.

### Problem: JWT token expired

**Solution:** Login again to get a new token. Default expiration: 24 hours.

## Development Mode

For development, use the dev profile:

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

**Benefits:**
- Auto-recreate database schema on restart
- Detailed SQL logging
- Debug level logs

## Production Deployment

```bash
# Build JAR
mvn clean package

# Run with production profile
java -jar target/circlehub-backend-1.0.0.jar --spring.profiles.active=prod
```

## Next Steps

1. ✅ Import Postman collection for easy testing
2. ✅ Read the full [README.md](README.md) for detailed documentation
3. ✅ Check [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) for architecture details
4. ✅ Review [database-schema.sql](database-schema.sql) for database structure

## Quick Reference

### API Base URL
```
http://localhost:8080
```

### Public Endpoints (No Auth Required)
- `POST /api/auth/register`
- `POST /api/auth/login`

### Protected Endpoints (Auth Required)
All other endpoints require `Authorization: Bearer TOKEN` header

### Default JWT Expiration
24 hours (configurable in `application.properties`)

## Support

For issues or questions:
1. Check the [README.md](README.md) for detailed docs
2. Review error logs in console
3. Verify database connection
4. Check Postman collection examples

## Success! 🎉

If you see this response from `/api/auth/register`, you're ready to go:

```json
{
  "token": "eyJhbGc...",
  "type": "Bearer",
  "userId": 1,
  "name": "Your Name",
  "email": "your@email.com"
}
```

**Happy coding with CircleHub!** 🚀

---

*Need help? Check the detailed documentation in README.md*
