class Api::V1::ImagesController < Api::V1::BaseController
  # Authentication is handled by ApplicationController via JwtAuthentication concern

  # POST /api/v1/images/upload
  def upload
    unless params[:image].present?
      render_error("No image file provided", {}, :bad_request)
      return
    end

    # Validate file type
    allowed_types = %w[image/jpeg image/jpg image/png image/gif image/webp]
    unless allowed_types.include?(params[:image].content_type)
      render_error("Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed", {}, :bad_request)
      return
    end

    # Validate file size (max 10MB)
    max_size = 10.megabytes
    if params[:image].size > max_size
      render_error("File too large. Maximum size is 10MB", {}, :bad_request)
      return
    end

    # Upload to S3 (or local storage in development)
    result = S3Service.upload_image(params[:image], params[:folder])

    if result[:success]
      render_success({
        url: result[:url],
        key: result[:key],
        filename: result[:filename],
        content_type: result[:content_type],
        size: result[:size]
      })
    else
      render_error("Upload failed: #{result[:error]}", {}, :unprocessable_entity)
    end
  end

  # DELETE /api/v1/images/:key
  def destroy
    key = params[:key]
    
    # Decode the key if it's URL encoded
    key = CGI.unescape(key) if key.include?('%')

    result = S3Service.delete_image(key)

    if result[:success]
      render json: { status: "success", message: "Image deleted successfully" }, status: :ok
    else
      render_error("Delete failed: #{result[:error]}", {}, :unprocessable_entity)
    end
  end

  # GET /api/v1/images
  def index
    folder = params[:folder] || S3_IMAGE_FOLDER_PATH
    result = S3Service.list_images(folder)

    if result[:success]
      render_success(result[:images])
    else
      render_error("Failed to list images: #{result[:error]}", {}, :unprocessable_entity)
    end
  end

end
