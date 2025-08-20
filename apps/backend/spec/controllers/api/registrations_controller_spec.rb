require 'rails_helper'

RSpec.describe Api::RegistrationsController, type: :controller do
  describe 'POST #create' do
    let(:valid_params) do
      {
        user: {
          email: 'test@example.com',
          password: 'password123',
          password_confirmation: 'password123'
        }
      }
    end

    let(:invalid_params) do
      {
        user: {
          email: 'invalid-email',
          password: '123',
          password_confirmation: '123'
        }
      }
    end

    context 'with valid parameters' do
      it 'creates a new user' do
        expect {
          post :create, params: valid_params
        }.to change(User, :count).by(1)
      end

      it 'returns success status' do
        post :create, params: valid_params
        expect(response).to have_http_status(:ok)
      end

      it 'returns correct JSON structure' do
        post :create, params: valid_params
        json_response = JSON.parse(response.body)
        
        expect(json_response['status']['code']).to eq(200)
        expect(json_response['status']['message']).to eq('Signed up successfully.')
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

    context 'with invalid parameters' do
      it 'does not create a user' do
        expect {
          post :create, params: invalid_params
        }.not_to change(User, :count)
      end

      it 'returns unprocessable entity status' do
        post :create, params: invalid_params
        expect(response).to have_http_status(:unprocessable_content)
      end

      it 'returns error messages' do
        post :create, params: invalid_params
        json_response = JSON.parse(response.body)
        
        expect(json_response['status']['code']).to eq(422)
        expect(json_response['status']['message']).to eq("User couldn't be created successfully.")
        expect(json_response['errors']).to be_present
      end
    end

    context 'with duplicate email' do
      before { create(:user, email: 'test@example.com') }

      it 'does not create a duplicate user' do
        expect {
          post :create, params: valid_params
        }.not_to change(User, :count)
      end

      it 'returns error for duplicate email' do
        post :create, params: valid_params
        json_response = JSON.parse(response.body)
        
        expect(json_response['errors']).to include('Email has already been taken')
      end
    end

    context 'with missing parameters' do
      it 'handles missing user params' do
        post :create, params: {}
        expect(response).to have_http_status(:unprocessable_content)
      end

      it 'handles missing email' do
        post :create, params: { user: { password: 'password123', password_confirmation: 'password123' } }
        expect(response).to have_http_status(:unprocessable_content)
      end

      it 'handles missing password' do
        post :create, params: { user: { email: 'test@example.com' } }
        expect(response).to have_http_status(:unprocessable_content)
      end
    end
  end
end
