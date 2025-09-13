require 'aws-sdk-s3'

Aws.config.update({
  region: ENV['S3_REGION'] || 'ap-southeast-2',
  credentials: Aws::Credentials.new(
    ENV['S3_ACCESS_KEY_ID'],
    ENV['S3_SECRET_ACCESS_KEY']
  )
})

# S3 client instance
S3_CLIENT = Aws::S3::Client.new

# S3 bucket name
S3_BUCKET = ENV['S3_BUCKET'] || 'aryasoftwaretech.test.bucket'

# S3 folder path for images
S3_IMAGE_FOLDER_PATH = ENV['S3_IMAGE_FOLDER_PATH'] || 'images'
