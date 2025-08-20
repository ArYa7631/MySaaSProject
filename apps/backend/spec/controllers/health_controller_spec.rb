require 'rails_helper'

RSpec.describe HealthController, type: :controller do
  describe 'GET #check' do
    it 'returns success status' do
      get :check
      expect(response).to have_http_status(:ok)
    end

    it 'returns correct JSON structure' do
      get :check
      json_response = JSON.parse(response.body)
      
      expect(json_response['status']).to eq('healthy')
      expect(json_response['timestamp']).to be_present
      expect(json_response['environment']).to eq('development')
    end

    it 'returns valid timestamp format' do
      get :check
      json_response = JSON.parse(response.body)
      
      expect { Time.parse(json_response['timestamp']) }.not_to raise_error
    end
  end
end
