class S3Service
  class << self
    def upload_image(file, folder_path = nil)
      return { success: false, error: 'No file provided' } unless file

      begin
        # Generate unique filename
        filename = generate_filename(file.original_filename)
        folder = folder_path || S3_IMAGE_FOLDER_PATH
        key = "#{folder}/#{filename}"

        # Upload to S3
        response = S3_CLIENT.put_object(
          bucket: S3_BUCKET,
          key: key,
          body: file.read,
          content_type: file.content_type,
          acl: 'public-read'
        )

        # Generate public URL
        url = "https://#{S3_BUCKET}.s3.#{ENV['S3_REGION']}.amazonaws.com/#{key}"

        {
          success: true,
          url: url,
          key: key,
          filename: filename,
          content_type: file.content_type,
          size: file.size
        }
      rescue Aws::S3::Errors::ServiceError => e
        Rails.logger.error "S3 upload error: #{e.message}"
        { success: false, error: e.message }
      rescue => e
        Rails.logger.error "Upload error: #{e.message}"
        { success: false, error: 'Upload failed' }
      end
    end

    def delete_image(key)
      return { success: false, error: 'No key provided' } unless key

      begin
        S3_CLIENT.delete_object(
          bucket: S3_BUCKET,
          key: key
        )

        { success: true }
      rescue Aws::S3::Errors::ServiceError => e
        Rails.logger.error "S3 delete error: #{e.message}"
        { success: false, error: e.message }
      rescue => e
        Rails.logger.error "Delete error: #{e.message}"
        { success: false, error: 'Delete failed' }
      end
    end

    def list_images(folder_path = nil)
      begin
        folder = folder_path || S3_IMAGE_FOLDER_PATH
        prefix = "#{folder}/"

        response = S3_CLIENT.list_objects_v2(
          bucket: S3_BUCKET,
          prefix: prefix
        )

        images = response.contents.map do |object|
          {
            key: object.key,
            url: "https://#{S3_BUCKET}.s3.#{ENV['S3_REGION']}.amazonaws.com/#{object.key}",
            filename: File.basename(object.key),
            size: object.size,
            last_modified: object.last_modified
          }
        end

        { success: true, images: images }
      rescue Aws::S3::Errors::ServiceError => e
        Rails.logger.error "S3 list error: #{e.message}"
        { success: false, error: e.message }
      rescue => e
        Rails.logger.error "List error: #{e.message}"
        { success: false, error: 'List failed' }
      end
    end

    def generate_presigned_url(key, expires_in = 3600)
      begin
        signer = Aws::S3::Presigner.new(client: S3_CLIENT)
        url = signer.presigned_url(:get_object, bucket: S3_BUCKET, key: key, expires_in: expires_in)
        
        { success: true, url: url }
      rescue => e
        Rails.logger.error "Presigned URL error: #{e.message}"
        { success: false, error: e.message }
      end
    end

    private

    def generate_filename(original_filename)
      timestamp = Time.current.strftime('%Y%m%d_%H%M%S')
      random_string = SecureRandom.hex(8)
      extension = File.extname(original_filename)
      base_name = File.basename(original_filename, extension).parameterize

      "#{base_name}_#{timestamp}_#{random_string}#{extension}"
    end
  end
end
