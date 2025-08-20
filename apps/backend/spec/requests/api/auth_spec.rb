require 'rails_helper'

RSpec.describe 'API Authentication', type: :request do
  describe 'POST /api/auth/sign_up' do
    let(:valid_params) do
      {
        user: {
          email: 'newuser@example.com',
          password: 'password123',
          password_confirmation: 'password123'
        }
      }
    end

    context 'with valid parameters' do
      it 'creates a new user' do
        expect {
          post '/api/auth/sign_up', params: valid_params, as: :json
        }.to change(User, :count).by(1)
      end

      it 'returns success response' do
        post '/api/auth/sign_up', params: valid_params, as: :json
        expect(response).to have_http_status(:ok)
        
        json_response = JSON.parse(response.body)
        expect(json_response['status']['code']).to eq(200)
        expect(json_response['data']['user']['email']).to eq('newuser@example.com')
      end
    end

    context 'with invalid parameters' do
      let(:invalid_params) do
        {
          user: {
            email: 'invalid-email',
            password: '123',
            password_confirmation: '123'
          }
        }
      end

      it 'does not create a user' do
        expect {
          post '/api/auth/sign_up', params: invalid_params, as: :json
        }.not_to change(User, :count)
      end

      it 'returns error response' do
        post '/api/auth/sign_up', params: invalid_params, as: :json
        expect(response).to have_http_status(:unprocessable_content)
      end
    end
  end

  describe 'POST /api/auth/sign_in' do
    let(:user) { create(:user, email: 'test@example.com', password: 'password123') }

    before { user }

    context 'with valid credentials' do
      let(:valid_params) do
        {
          user: {
            email: 'test@example.com',
            password: 'password123'
          }
        }
      end

      it 'returns success response' do
        post '/api/auth/sign_in', params: valid_params, as: :json
        expect(response).to have_http_status(:ok)
        
        json_response = JSON.parse(response.body)
        expect(json_response['status']['code']).to eq(200)
        expect(json_response['data']['user']['email']).to eq('test@example.com')
      end
    end

    context 'with invalid credentials' do
      let(:invalid_params) do
        {
          user: {
            email: 'test@example.com',
            password: 'wrongpassword'
          }
        }
      end

      it 'returns unauthorized response' do
        post '/api/auth/sign_in', params: invalid_params, as: :json
        expect(response).to have_http_status(:unauthorized)
        
        json_response = JSON.parse(response.body)
        expect(json_response['status']['code']).to eq(401)
      end
    end
  end

  describe 'DELETE /api/auth/sign_out' do
    it 'returns success response' do
      delete '/api/auth/sign_out'
      expect(response).to have_http_status(:ok)
      
      json_response = JSON.parse(response.body)
      expect(json_response['status']['code']).to eq(200)
    end
  end

  describe 'GET /health' do
    it 'returns health check response' do
      get '/health'
      expect(response).to have_http_status(:ok)
      
      json_response = JSON.parse(response.body)
      expect(json_response['status']).to eq('healthy')
    end
  end
end
