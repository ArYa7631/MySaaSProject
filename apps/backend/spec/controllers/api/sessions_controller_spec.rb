require 'rails_helper'

RSpec.describe Api::SessionsController, type: :controller do
  let(:user) { create(:user, email: 'test@example.com', password: 'password123') }

  describe 'POST #create' do
    let(:valid_params) do
      {
        user: {
          email: 'test@example.com',
          password: 'password123'
        }
      }
    end

    let(:invalid_params) do
      {
        user: {
          email: 'test@example.com',
          password: 'wrongpassword'
        }
      }
    end

    context 'with valid credentials' do
      before { user } # Ensure user exists

      it 'returns success status' do
        post :create, params: valid_params
        expect(response).to have_http_status(:ok)
      end

      it 'returns correct JSON structure' do
        post :create, params: valid_params
        json_response = JSON.parse(response.body)
        
        expect(json_response['status']['code']).to eq(200)
        expect(json_response['status']['message']).to eq('Signed in successfully.')
        expect(json_response['data']['user']['email']).to eq('test@example.com')
        expect(json_response['data']['user']).to have_key('id')
        expect(json_response['data']['user']).to have_key('created_at')
        expect(json_response['data']['user']).to have_key('updated_at')
      end

      it 'does not include password in response' do
        post :create, params: valid_params
        json_response = JSON.parse(response.body)
        
        expect(json_response['data']['user']).not_to have_key('password')
        expect(json_response['data']['user']).not_to have_key('encrypted_password')
      end
    end

    context 'with invalid credentials' do
      before { user } # Ensure user exists

      it 'returns unauthorized status' do
        post :create, params: invalid_params
        expect(response).to have_http_status(:unauthorized)
      end

      it 'returns error message' do
        post :create, params: invalid_params
        json_response = JSON.parse(response.body)
        
        expect(json_response['status']['code']).to eq(401)
        expect(json_response['status']['message']).to eq('Invalid email or password.')
      end
    end

    context 'with non-existent user' do
      let(:non_existent_params) do
        {
          user: {
            email: 'nonexistent@example.com',
            password: 'password123'
          }
        }
      end

      it 'returns unauthorized status' do
        post :create, params: non_existent_params
        expect(response).to have_http_status(:unauthorized)
      end

      it 'returns error message' do
        post :create, params: non_existent_params
        json_response = JSON.parse(response.body)
        
        expect(json_response['status']['code']).to eq(401)
        expect(json_response['status']['message']).to eq('Invalid email or password.')
      end
    end

    context 'with missing parameters' do
      it 'handles missing user params' do
        post :create, params: {}
        expect(response).to have_http_status(:unauthorized)
      end

      it 'handles missing email' do
        post :create, params: { user: { password: 'password123' } }
        expect(response).to have_http_status(:unauthorized)
      end

      it 'handles missing password' do
        post :create, params: { user: { email: 'test@example.com' } }
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'with empty parameters' do
      it 'handles empty email' do
        post :create, params: { user: { email: '', password: 'password123' } }
        expect(response).to have_http_status(:unauthorized)
      end

      it 'handles empty password' do
        post :create, params: { user: { email: 'test@example.com', password: '' } }
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'DELETE #destroy' do
    it 'returns success status' do
      delete :destroy
      expect(response).to have_http_status(:ok)
    end

    it 'returns correct JSON structure' do
      delete :destroy
      json_response = JSON.parse(response.body)
      
      expect(json_response['status']['code']).to eq(200)
      expect(json_response['status']['message']).to eq('Signed out successfully.')
    end
  end
end
