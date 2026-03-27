# MERN Stack Backend API

A production-ready Node.js and Express.js backend server for the MERN stack application with user authentication, subscription management, video handling, and e-commerce functionalities.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Database](#database)
- [Authentication](#authentication)
- [File Upload](#file-upload)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- Node.js (v14.0.0 or higher)
- npm or yarn package manager
- MongoDB (local or cloud instance)
- Cloudinary account (for image/video uploads)
- Git

## Installation

1. **Clone the repository and navigate to backend folder:**
   ```bash
   cd Back-end
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Verify installation:**
   ```bash
   npm list
   ```

## Environment Setup

1. **Create a `.env` file in the root of the Back-end folder:**
   ```bash
   touch .env
   ```

2. **Add the following environment variables:**
   ```
   # Server Configuration
   PORT=5000
   NODE_ENV=production

   # Database Configuration
   MONGODB_URI=mongodb://username:password@localhost:27017/yourdatabase
   # For MongoDB Atlas:
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/yourdatabase?retryWrites=true&w=majority

   # Cloudinary Configuration
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_min_32_characters
   JWT_EXPIRY=7d

   # Email Configuration (Optional)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASSWORD=your_app_password

   # CORS Configuration
   CORS_ORIGIN=http://localhost:3000,https://yourdomain.com
   ```

3. **Ensure `.env` is in `.gitignore`** (sensitive data protection)

## Running the Application

### Development Mode

```bash
npm run dev
```

The server will start at `http://localhost:5000`

### Production Mode

```bash
npm start
```

### Testing

```bash
npm test
```

### Linting

```bash
npm run lint
```

## Project Structure

```
Back-end/
├── src/
│   ├── config/
│   │   └── DB.js              # Database connection
│   ├── constants.js            # Application constants
│   ├── Controller/
│   │   └── user.controller.js  # User business logic
│   ├── middlewares/
│   │   ├── auth.middleware.js  # Authentication middleware
│   │   └── multer.middleware.js# File upload middleware
│   ├── models/
│   │   ├── User.model.js
│   │   ├── Video.model.js
│   │   ├── Subscription.model.js
│   │   ├── Ecommerce/
│   │   │   ├── user.model.js
│   │   │   ├── product.model.js
│   │   │   ├── category.model.js
│   │   │   └── order.model.js
│   │   └── todo/
│   │       ├── todo.model.js
│   │       └── subTodo.model.js
│   ├── routes/
│   │   └── user.route.js       # User routes
│   └── utils/
│       ├── asyncHandler.js     # Async error handling wrapper
│       ├── apiError.js         # Custom error class
│       ├── apiResponse.js      # Standardized response format
│       └── cloudinary.js       # Cloudinary integration
├── public/
│   └── temp/                   # Temporary file storage
├── index.js                    # Application entry point
├── package.json
├── .env                        # Environment variables (not in git)
├── .gitignore
└── README.md
```

## API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

### User Routes

#### Register User
- **POST** `/users/register`
- **Body:** 
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }
  ```

#### Login User
- **POST** `/users/login`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

#### Get User Profile
- **GET** `/users/profile`
- **Headers:** Authorization required

#### Update User Profile
- **PUT** `/users/profile`
- **Headers:** Authorization required

#### Logout
- **POST** `/users/logout`
- **Headers:** Authorization required

## Database

### Connection

The database connection is configured in `src/config/DB.js`. Ensure your MongoDB instance is running and the connection URI is correct in your `.env` file.

### Collections

- **Users:** User account information and authentication
- **Videos:** Video metadata and references
- **Subscriptions:** User subscription plans
- **Products:** E-commerce products
- **Categories:** Product categories
- **Orders:** E-commerce orders
- **Todos:** User todo items
- **SubTodos:** Nested todo items

## Authentication

The application uses JWT (JSON Web Tokens) for authentication:

- Tokens are issued upon login
- Tokens expire after the duration specified in `.env` (default: 7 days)
- Auth middleware validates tokens on protected routes
- Refresh tokens can be implemented for extended sessions

## File Upload

File uploads are handled using Multer and Cloudinary:

1. Files are temporarily stored in `public/temp/`
2. Files are uploaded to Cloudinary for permanent storage
3. Cloudinary URLs are returned and stored in the database
4. Temporary files are cleaned up after upload

**Supported file types:** Images (jpg, png, gif), Videos (mp4, mkv, avi)

## Error Handling

The application uses custom error handling with standardized responses:

### Error Response Format
```json
{
  "success": false,
  "message": "Error message",
  "errors": ["Detailed error info"]
}
```

### Common HTTP Status Codes
- `200 OK` - Successful request
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Permission denied
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Best Practices

### Security
- Always use HTTPS in production
- Validate and sanitize all user inputs
- Never commit `.env` files to git
- Use strong JWT secrets
- Implement rate limiting
- Use helmet.js for HTTP headers security
- Implement CORS properly

### Code Quality
- Use async/await for asynchronous operations
- Implement proper error handling with try-catch
- Use asyncHandler wrapper for route handlers
- Keep controller functions focused and modular
- Use middleware for cross-cutting concerns

### Performance
- Use database indexes for frequently queried fields
- Implement pagination for large datasets
- Cache frequently accessed data
- Monitor database queries
- Use CDN for static files via Cloudinary

### Logging and Monitoring
- Implement comprehensive logging
- Monitor application health
- Track API response times
- Use error tracking services (Sentry, etc.)

## Deployment

### Heroku Deployment

1. **Install Heroku CLI**
2. **Login to Heroku:**
   ```bash
   heroku login
   ```

3. **Create Heroku app:**
   ```bash
   heroku create your-app-name
   ```

4. **Set environment variables:**
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   ```

5. **Deploy:**
   ```bash
   git push heroku main
   ```

### Docker Deployment

Create a `Dockerfile` for containerization (optional).

### Environment-Specific Configuration

- **Development:** Use local MongoDB, debug logging enabled
- **Production:** Use MongoDB Atlas, minimal logging, optimized code
- **Staging:** Similar to production with additional debugging

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti :5000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :5000    # Windows
```

### MongoDB Connection Error
- Check MongoDB URI in `.env`
- Ensure MongoDB service is running
- Verify network access (if using MongoDB Atlas)

### Cloudinary Upload Error
- Verify API credentials in `.env`
- Check file size limits
- Ensure file format is supported

### JWT Token Expired
- Issue a new token by re-logging in
- Implement refresh token mechanism for seamless UX

### CORS Errors
- Check `CORS_ORIGIN` in `.env`
- Ensure frontend URL is whitelisted

## Contributing

1. Create a new branch for features
2. Follow the existing code structure
3. Commit changes with clear messages
4. Create a pull request for review

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue in the repository or contact the development team.

---

**Version:** 1.0.0  
**Last Updated:** March 2026
