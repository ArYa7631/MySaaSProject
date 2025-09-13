require 'rails_helper'

RSpec.describe 'Communities API', type: :request do
  let(:community) { create(:community, domain: 'example.com', is_enabled: true) }
  let(:disabled_community) { create(:community, domain: 'disabled.com', is_enabled: false) }

  describe 'GET /api/v1/communities' do
    it 'returns all communities' do
      community
      disabled_community
      
      get '/api/v1/communities'
      
      expect(response).to have_http_status(:ok)
      json_response = JSON.parse(response.body)
      expect(json_response['data']).to be_an(Array)
      expect(json_response['data'].length).to eq(2)
    end
  end

  describe 'GET /api/v1/communities/:id' do
    it 'returns a specific community' do
      get "/api/v1/communities/#{community.id}"
      
      expect(response).to have_http_status(:ok)
      json_response = JSON.parse(response.body)
      expect(json_response['data']['id']).to eq(community.id)
      expect(json_response['data']['domain']).to eq(community.domain)
    end

    it 'returns 404 for non-existent community' do
      get '/api/v1/communities/99999'
      
      expect(response).to have_http_status(:not_found)
    end
  end

  describe 'GET /api/v1/communities/by-domain/:domain' do
    context 'with valid domain' do
      it 'returns community for enabled domain' do
        get "/api/v1/communities/by-domain/#{community.domain}"
        
        expect(response).to have_http_status(:ok)
        json_response = JSON.parse(response.body)
        expect(json_response['data']['id']).to eq(community.id)
        expect(json_response['data']['domain']).to eq(community.domain)
        expect(json_response['data']['marketplace_configuration']).to be_present
        expect(json_response['data']['landing_page']).to be_present
        expect(json_response['data']['topbar']).to be_present
        expect(json_response['data']['footer']).to be_present
      end

      it 'returns 404 for disabled community' do
        get "/api/v1/communities/by-domain/#{disabled_community.domain}"
        
        expect(response).to have_http_status(:not_found)
        json_response = JSON.parse(response.body)
        expect(json_response['error']).to include('Community not found')
      end
    end

    context 'with invalid domain' do
      it 'returns 404 for non-existent domain' do
        get '/api/v1/communities/by-domain/nonexistent.com'
        
        expect(response).to have_http_status(:not_found)
        json_response = JSON.parse(response.body)
        expect(json_response['error']).to include('Community not found for domain: nonexistent.com')
      end
    end
  end

  describe 'POST /api/v1/communities' do
    let(:valid_params) do
      {
        community: {
          domain: 'newcommunity.com',
          person_id: 'new-person-123',
          locale: 'en',
          currency: 'USD',
          country: 'US'
        }
      }
    end

    it 'creates a new community' do
      expect {
        post '/api/v1/communities', params: valid_params, as: :json
      }.to change(Community, :count).by(1)
      
      expect(response).to have_http_status(:created)
      json_response = JSON.parse(response.body)
      expect(json_response['data']['domain']).to eq('newcommunity.com')
      expect(json_response['data']['ident']).to eq('newcommunity_com')
    end

    it 'returns validation errors for invalid params' do
      invalid_params = { community: { domain: '' } }
      
      post '/api/v1/communities', params: invalid_params, as: :json
      
      expect(response).to have_http_status(:unprocessable_entity)
      json_response = JSON.parse(response.body)
      expect(json_response['error']).to include('Validation failed')
    end
  end

  describe 'PATCH /api/v1/communities/:id' do
    it 'updates a community' do
      patch "/api/v1/communities/#{community.id}", 
            params: { community: { locale: 'es' } }, 
            as: :json
      
      expect(response).to have_http_status(:ok)
      json_response = JSON.parse(response.body)
      expect(json_response['data']['locale']).to eq('es')
    end

    it 'returns validation errors for invalid updates' do
      patch "/api/v1/communities/#{community.id}", 
            params: { community: { domain: '' } }, 
            as: :json
      
      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe 'DELETE /api/v1/communities/:id' do
    it 'deletes a community' do
      expect {
        delete "/api/v1/communities/#{community.id}"
      }.to change(Community, :count).by(-1)
      
      expect(response).to have_http_status(:ok)
      json_response = JSON.parse(response.body)
      expect(json_response['status']).to eq('success')
    end
  end
end
