class S3Service
  class << self
    def upload_image(file, folder_path = nil)
      return { success: false, error: 'No file provided' } unless file

      # Use local storage if AWS credentials are not configured or are placeholder values
      if ENV['S3_ACCESS_KEY_ID'].blank? || 
         ENV['S3_ACCESS_KEY_ID'] == 'your_aws_access_key_id' ||
         ENV['S3_ACCESS_KEY_ID'] == 'your_aws_access_key' ||
         ENV['S3_SECRET_ACCESS_KEY'].blank? ||
         ENV['S3_SECRET_ACCESS_KEY'] == 'your_aws_secret_access_key' ||
         ENV['S3_SECRET_ACCESS_KEY'] == 'your_aws_secret_key'
        Rails.logger.info "AWS credentials not configured, using local storage"
        return upload_to_local_storage(file, folder_path)
      end

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

        # Generate public URL (using path-style to support bucket names with dots)
        url = "https://s3.#{ENV['S3_REGION']}.amazonaws.com/#{S3_BUCKET}/#{key}"

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

    def upload_to_local_storage(file, folder_path = nil)
      begin
        # Create uploads directory if it doesn't exist
        uploads_dir = Rails.root.join('public', 'uploads')
        FileUtils.mkdir_p(uploads_dir)

        # Generate unique filename
        filename = generate_filename(file.original_filename)
        file_path = uploads_dir.join(filename)

        # Save file to local storage
        File.open(file_path, 'wb') do |f|
          f.write(file.read)
        end

        # Generate public URL
        base_url = ENV['BACKEND_URL'] || 'http://localhost:3001'
        url = "#{base_url}/uploads/#{filename}"

        {
          success: true,
          url: url,
          key: filename,
          filename: filename,
          content_type: file.content_type,
          size: file.size
        }
      rescue => e
        Rails.logger.error "Local upload error: #{e.message}"
        { success: false, error: 'Upload failed' }
      end
    end

    def delete_image(key)
      return { success: false, error: 'No key provided' } unless key

      # Use local storage if AWS credentials are not configured
      if ENV['S3_ACCESS_KEY_ID'].blank? || 
         ENV['S3_ACCESS_KEY_ID'] == 'your_aws_access_key_id' ||
         ENV['S3_ACCESS_KEY_ID'] == 'your_aws_access_key' ||
         ENV['S3_SECRET_ACCESS_KEY'].blank? ||
         ENV['S3_SECRET_ACCESS_KEY'] == 'your_aws_secret_access_key' ||
         ENV['S3_SECRET_ACCESS_KEY'] == 'your_aws_secret_key'
        Rails.logger.info "AWS credentials not configured, deleting from local storage"
        return delete_local_image(key)
      end

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
      # Use local storage if AWS credentials are not configured
      if ENV['S3_ACCESS_KEY_ID'].blank? || 
         ENV['S3_ACCESS_KEY_ID'] == 'your_aws_access_key_id' ||
         ENV['S3_ACCESS_KEY_ID'] == 'your_aws_access_key' ||
         ENV['S3_SECRET_ACCESS_KEY'].blank? ||
         ENV['S3_SECRET_ACCESS_KEY'] == 'your_aws_secret_access_key' ||
         ENV['S3_SECRET_ACCESS_KEY'] == 'your_aws_secret_key'
        Rails.logger.info "AWS credentials not configured, listing local storage"
        return list_local_images(folder_path)
      end

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
            url: "https://s3.#{ENV['S3_REGION']}.amazonaws.com/#{S3_BUCKET}/#{object.key}",
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


    def list_local_images(folder_path = nil)
      begin
        uploads_dir = Rails.root.join('public', 'uploads')
        return { success: true, images: [] } unless Dir.exist?(uploads_dir)

        images = Dir.glob(File.join(uploads_dir, '*')).map do |file_path|
          next unless File.file?(file_path)
          
          stat = File.stat(file_path)
          {
            key: File.basename(file_path),
            url: "#{ENV['BACKEND_URL'] || 'http://localhost:3001'}/uploads/#{File.basename(file_path)}",
            filename: File.basename(file_path),
            size: stat.size,
            last_modified: stat.mtime
          }
        end.compact

        { success: true, images: images }
      rescue => e
        Rails.logger.error "Local list error: #{e.message}"
        { success: false, error: 'List failed' }
      end
    end

    def delete_local_image(key)
      begin
        file_path = Rails.root.join('public', 'uploads', key)
        
        if File.exist?(file_path)
          File.delete(file_path)
          { success: true }
        else
          { success: false, error: 'File not found' }
        end
      rescue => e
        Rails.logger.error "Local delete error: #{e.message}"
        { success: false, error: 'Delete failed' }
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
