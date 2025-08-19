Rails.application.routes.draw do
  # API namespace
  namespace :api do
    # Custom auth routes (no Devise complexity)
    post 'auth/sign_up', to: 'registrations#create'
    post 'auth/sign_in', to: 'sessions#create'
    delete 'auth/sign_out', to: 'sessions#destroy'

    # User profile endpoint
    get 'auth/me', to: 'auth#me'
    
    # Protected routes (require authentication)
    namespace :v1 do
      resources :dashboard, only: [:index]
    end
  end

  # Health check endpoint
  get 'health', to: 'health#check'
end


