# API Documentation

## Overview

The MySaaSProject API is a RESTful API built with Ruby on Rails. It provides endpoints for authentication, community management, landing page configuration, and analytics.

## Base URL

- **Development**: `http://localhost:3001/api/v1`
- **Production**: `https://api.example.com/api/v1`

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Response Format

All API responses follow this format:

```json
{
  "data": {
    // Response data
  },
  "message": "Success message",
  "status": "success"
}
```

Error responses:

```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  },
  "status": "error"
}
```

## Endpoints

### Authentication

#### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "first_name": "John",
  "last_name": "Doe",
  "name": "My Community",
  "domain": "my-community"
}
```

**Response:**
```json
{
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "community_id": 1
    },
    "token": "jwt_token_here",
    "community": {
      "id": 1,
      "name": "My Community",
      "domain": "my-community"
    }
  },
  "message": "User registered successfully",
  "status": "success"
}
```

#### Login User
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "community_id": 1
    },
    "token": "jwt_token_here",
    "community": {
      "id": 1,
      "name": "My Community",
      "domain": "my-community"
    }
  },
  "message": "Login successful",
  "status": "success"
}
```

#### Get Current User
```http
GET /auth/me
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "community_id": 1,
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:00:00Z"
  },
  "status": "success"
}
```

#### Logout User
```http
POST /auth/logout
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "message": "Logged out successfully",
  "status": "success"
}
```

### Communities

#### Get Communities
```http
GET /communities
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "My Community",
      "domain": "my-community",
      "description": "A great community",
      "is_enabled": true,
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-01T00:00:00Z"
    }
  ],
  "status": "success"
}
```

#### Get Community
```http
GET /communities/:id
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "name": "My Community",
    "domain": "my-community",
    "description": "A great community",
    "is_enabled": true,
    "settings": {
      "theme": "light",
      "features": ["landing_page", "analytics"]
    },
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:00:00Z"
  },
  "status": "success"
}
```

#### Update Community
```http
PUT /communities/:id
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "name": "Updated Community Name",
  "description": "Updated description",
  "settings": {
    "theme": "dark",
    "features": ["landing_page", "analytics", "members"]
  }
}
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "name": "Updated Community Name",
    "description": "Updated description",
    "settings": {
      "theme": "dark",
      "features": ["landing_page", "analytics", "members"]
    },
    "updated_at": "2023-01-01T00:00:00Z"
  },
  "message": "Community updated successfully",
  "status": "success"
}
```

### Landing Pages

#### Get Landing Page Sections
```http
GET /communities/:id/landing_page
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "data": [
    {
      "id": "section-1",
      "name": "HeroSection",
      "description": "Hero section",
      "content": {
        "title": "Welcome to Our Community",
        "description": "Join our amazing community",
        "primaryButton": {
          "text": "Get Started",
          "url": "/signup"
        },
        "secondaryButton": {
          "text": "Learn More",
          "url": "/about"
        }
      },
      "order": 1
    },
    {
      "id": "section-2",
      "name": "Features",
      "description": "Features section",
      "content": {
        "title": "Our Features",
        "features": [
          {
            "title": "Feature 1",
            "description": "Description of feature 1",
            "icon": "star"
          }
        ]
      },
      "order": 2
    }
  ],
  "status": "success"
}
```

#### Update Landing Page Sections
```http
PUT /communities/:id/landing_page
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "sections": [
    {
      "id": "section-1",
      "name": "HeroSection",
      "description": "Hero section",
      "content": {
        "title": "Updated Title",
        "description": "Updated description",
        "primaryButton": {
          "text": "Get Started",
          "url": "/signup"
        }
      },
      "order": 1
    }
  ]
}
```

**Response:**
```json
{
  "message": "Landing page updated successfully",
  "status": "success"
}
```

#### Get Marketplace Configuration
```http
GET /communities/:id/marketplace_configuration
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "community_id": 1,
    "global_text_color": "#000000",
    "global_bg_color": "#ffffff",
    "global_highlight_color": "#3b82f6",
    "logo": "https://example.com/logo.png",
    "title": "My Community",
    "title_color": "#000000",
    "is_enabled": true,
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:00:00Z"
  },
  "status": "success"
}
```

#### Update Marketplace Configuration
```http
PUT /communities/:id/marketplace_configuration
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "global_text_color": "#333333",
  "global_bg_color": "#f8f9fa",
  "global_highlight_color": "#007bff",
  "title": "Updated Community Title"
}
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "community_id": 1,
    "global_text_color": "#333333",
    "global_bg_color": "#f8f9fa",
    "global_highlight_color": "#007bff",
    "title": "Updated Community Title",
    "updated_at": "2023-01-01T00:00:00Z"
  },
  "message": "Marketplace configuration updated successfully",
  "status": "success"
}
```

### Analytics

#### Get Community Analytics
```http
GET /communities/:id/analytics
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `start_date` (optional): Start date in YYYY-MM-DD format
- `end_date` (optional): End date in YYYY-MM-DD format
- `metric` (optional): Specific metric to retrieve

**Response:**
```json
{
  "data": {
    "page_views": 1250,
    "unique_visitors": 450,
    "conversion_rate": 0.15,
    "top_pages": [
      {
        "page": "/",
        "views": 500
      },
      {
        "page": "/about",
        "views": 300
      }
    ],
    "traffic_sources": [
      {
        "source": "direct",
        "visits": 400
      },
      {
        "source": "organic",
        "visits": 300
      }
    ]
  },
  "status": "success"
}
```

#### Track Page View
```http
POST /analytics/page_view
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "page": "/",
  "referrer": "https://google.com",
  "user_agent": "Mozilla/5.0...",
  "ip_address": "192.168.1.1"
}
```

**Response:**
```json
{
  "message": "Page view tracked successfully",
  "status": "success"
}
```

### File Upload

#### Upload File
```http
POST /upload
```

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Form Data:**
- `file`: The file to upload
- `type` (optional): File type (image, document, etc.)
- `folder` (optional): Target folder

**Response:**
```json
{
  "data": {
    "id": 1,
    "filename": "example.jpg",
    "url": "https://example.com/uploads/example.jpg",
    "size": 1024000,
    "type": "image/jpeg",
    "created_at": "2023-01-01T00:00:00Z"
  },
  "message": "File uploaded successfully",
  "status": "success"
}
```

#### Get User Files
```http
GET /upload/files
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `type` (optional): Filter by file type
- `folder` (optional): Filter by folder
- `page` (optional): Page number for pagination
- `per_page` (optional): Items per page

**Response:**
```json
{
  "data": {
    "files": [
      {
        "id": 1,
        "filename": "example.jpg",
        "url": "https://example.com/uploads/example.jpg",
        "size": 1024000,
        "type": "image/jpeg",
        "created_at": "2023-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_count": 50,
      "per_page": 10
    }
  },
  "status": "success"
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `AUTHENTICATION_FAILED` | Invalid or missing authentication token |
| `AUTHORIZATION_FAILED` | User doesn't have permission to access resource |
| `VALIDATION_ERROR` | Request data validation failed |
| `RESOURCE_NOT_FOUND` | Requested resource not found |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `INTERNAL_SERVER_ERROR` | Server error |

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Authentication endpoints**: 5 requests per minute
- **General API endpoints**: 100 requests per minute
- **File upload endpoints**: 10 requests per minute

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Pagination

List endpoints support pagination with the following query parameters:

- `page`: Page number (default: 1)
- `per_page`: Items per page (default: 20, max: 100)

Pagination metadata is included in responses:
```json
{
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_count": 100,
    "per_page": 20
  }
}
```

## Webhooks

The API supports webhooks for real-time notifications. Configure webhooks in the community settings to receive notifications for:

- User registration
- Page view tracking
- File uploads
- Community updates

Webhook payloads include the event type and relevant data:
```json
{
  "event": "user.registered",
  "data": {
    "user_id": 1,
    "email": "user@example.com",
    "community_id": 1
  },
  "timestamp": "2023-01-01T00:00:00Z"
}
```
