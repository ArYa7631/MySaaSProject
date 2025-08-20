Rails.application.routes.draw do
  # Devise routes (needed for mailer)
  devise_for :users, skip: [:sessions, :registrations, :passwords], 
    controllers: {
      passwords: 'api/password_resets'
    }

  # API namespace
  namespace :api do
    # Custom auth routes (no Devise complexity)
    post 'auth/sign_up', to: 'registrations#create'
    post 'auth/sign_in', to: 'sessions#create'
    delete 'auth/sign_out', to: 'sessions#destroy'
  end

  # Password reset routes with devise_scope
  devise_scope :user do
    post 'api/auth/forgot_password', to: 'api/password_resets#create'
    put 'api/auth/reset_password', to: 'api/password_resets#update'
  end

  # Health check endpoint
  get 'health', to: 'health#check'
end


