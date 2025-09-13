Rails.application.routes.draw do
  # Devise routes (needed for mailer)
  devise_for :users, skip: [:sessions, :registrations, :passwords], 
    controllers: {
      passwords: 'api/password_resets'
    }

  # API namespace
  namespace :api do
    namespace :v1 do
      # Communities with nested resources
      resources :communities do
        # Single resources (has_one relationships)
        resource :marketplace_configuration, only: [:show, :create, :update, :destroy]
        resource :landing_page, only: [:show, :create, :update, :destroy]
        resource :topbar, only: [:show, :create, :update, :destroy]
        resource :footer, only: [:show, :create, :update, :destroy]
        
        # Collection resources (has_many relationships)
        resources :content_pages
        resources :contacts, only: [:index, :show, :create, :destroy]
        resources :translations, controller: 'community_translations'
        resources :users, only: [:index, :show, :create, :update, :destroy]
      end
      
      # Public endpoints (no community context needed)
      resources :communities, only: [:index, :show]
      
      # Auth routes within v1 namespace
      post 'auth/sign_up', to: 'registrations#create'
      post 'auth/sign_in', to: 'sessions#create'
      delete 'auth/sign_out', to: 'sessions#destroy'
      post 'auth/forgot_password', to: 'password_resets#create'
      put 'auth/reset_password', to: 'password_resets#update'
    end
  end

  # Health check endpoint
  get 'health', to: 'health#check'
end


