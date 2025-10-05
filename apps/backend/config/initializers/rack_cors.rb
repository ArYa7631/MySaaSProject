# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin Ajax requests.

# Read more: https://github.com/cyu/rack-cors

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  # Development configuration - specific origins with credentials
  if Rails.env.development?
    allow do
      origins ENV.fetch('CORS_ORIGIN', 'http://localhost:3000'),
              /^https?:\/\/localhost(:\d+)?$/,  # Allow localhost with any port
              /^https?:\/\/127\.0\.0\.1(:\d+)?$/  # Allow 127.0.0.1 with any port
      
      resource '*',
        headers: :any,
        methods: [:get, :post, :put, :patch, :delete, :options, :head],
        credentials: true,  # Allow credentials for JWT tokens
        expose: ['Authorization']
    end
  end
  
  # Production configuration - allow all origins without credentials
  if Rails.env.production?
    allow do
      origins '*'  # Allow all origins for multi-domain setup
      resource '*',
        headers: :any,
        methods: [:get, :post, :put, :patch, :delete, :options, :head],
        credentials: false,  # No credentials for wildcard origins
        expose: ['Authorization']
    end
  end
end
