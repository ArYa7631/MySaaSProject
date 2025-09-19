# Image Upload Setup Guide

## Overview
The image upload functionality has been configured to work with both AWS S3 and local storage. By default, it will use local storage for development and can be configured to use S3 for production.

## Docker Setup

### 1. Environment Variables
Create a `.env` file in the project root with the following variables:

```bash
# Copy the example file
cp env.docker.example .env

# Edit the .env file with your actual values
```

### 2. For Local Storage (Development)
If you don't have AWS S3 configured, the system will automatically use local storage. The uploads will be stored in `apps/backend/public/uploads/` and served from `/uploads/` URL path.

### 3. For AWS S3 (Production)
Set the following environment variables in your `.env` file:

```bash
S3_ACCESS_KEY_ID=your_actual_aws_access_key
S3_SECRET_ACCESS_KEY=your_actual_aws_secret_key
S3_BUCKET=your_s3_bucket_name
S3_REGION=your_aws_region
S3_IMAGE_FOLDER_PATH=images
```

## Running the Application

### Development Mode
```bash
# Start the development environment
docker-compose -f docker-compose.dev.yml up --build

# The application will be available at:
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
```

### Production Mode
```bash
# Start the production environment
docker-compose up --build

# The application will be available at:
# Frontend: http://localhost:8080
# Backend: http://localhost:3001
```

## Image Upload Features

### Admin Panel
- Navigate to `/admin/images` to access the image management interface
- Upload images to different folders (hero, gallery, testimonials, features, general)
- View, organize, and delete uploaded images
- Support for multiple file formats: JPEG, PNG, GIF, WebP
- Maximum file size: 10MB per image

### API Endpoints
- `POST /api/v1/images/upload` - Upload an image
- `GET /api/v1/images` - List all images
- `DELETE /api/v1/images/:key` - Delete an image
- `GET /api/v1/images/presigned-url` - Get presigned URL for private images

## Troubleshooting

### Common Issues

1. **Upload fails with "Server returned HTML instead of JSON"**
   - Check if the backend is running
   - Verify the API URL configuration
   - Check Docker container logs: `docker-compose logs backend`

2. **Images not displaying**
   - Ensure the uploads directory is properly mounted in Docker
   - Check file permissions on the uploads directory
   - Verify the image URLs are accessible

3. **Authentication errors**
   - Make sure you're logged in to the admin panel
   - Check if the JWT token is valid
   - Verify the authentication headers are being sent

### Debugging Steps

1. Check backend logs:
   ```bash
   docker-compose logs backend
   ```

2. Check frontend logs in browser console

3. Test API connectivity:
   ```bash
   curl http://localhost:3001/health
   ```

4. Test image upload endpoint:
   ```bash
   curl -X POST http://localhost:3001/api/v1/images/upload \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -F "image=@/path/to/test-image.jpg"
   ```

## File Structure

```
apps/backend/
├── public/
│   └── uploads/          # Local storage directory
├── app/
│   ├── controllers/
│   │   └── api/v1/
│   │       └── images_controller.rb
│   └── services/
│       └── s3_service.rb
└── config/
    └── initializers/
        └── aws.rb
```

## Security Notes

- Images are stored with unique filenames to prevent conflicts
- File type validation is enforced on both frontend and backend
- File size limits are enforced (10MB maximum)
- Authentication is required for all image operations
- In production, consider using AWS S3 with proper IAM policies
