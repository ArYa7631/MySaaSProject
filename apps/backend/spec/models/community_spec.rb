require 'rails_helper'

RSpec.describe Community, type: :model do
  describe 'validations' do
    subject { build(:community) }

    it { should validate_presence_of(:uuid) }
    it { should validate_uniqueness_of(:uuid) }
    it { should validate_presence_of(:ident) }
    it { should validate_uniqueness_of(:ident) }
    it { should validate_presence_of(:domain) }
    it { should validate_uniqueness_of(:domain) }
    it { should validate_presence_of(:locale) }
    it { should validate_presence_of(:currency) }
    it { should validate_presence_of(:country) }
    it { should validate_presence_of(:person_id) }
    it { should validate_uniqueness_of(:person_id) }
  end

  describe 'associations' do
    it { should have_many(:users).dependent(:destroy) }
    it { should have_one(:marketplace_configuration).dependent(:destroy) }
    it { should have_one(:landing_page).dependent(:destroy) }
    it { should have_one(:topbar).dependent(:destroy) }
    it { should have_one(:footer).dependent(:destroy) }
    it { should have_many(:content_pages).dependent(:destroy) }
    it { should have_many(:contacts).dependent(:destroy) }
    it { should have_many(:community_translations).dependent(:destroy) }
  end

  describe 'default values' do
    it 'sets default values on creation' do
      community = Community.create!(
        domain: 'test.com',
        person_id: 'test-person-123'
      )
      
      expect(community.use_domain).to be false
      expect(community.is_enabled).to be true
      expect(community.locale).to eq('en')
      expect(community.currency).to eq('USD')
      expect(community.country).to eq('US')
    end
  end

  describe 'callbacks' do
    it 'generates uuid before validation' do
      community = build(:community, uuid: nil)
      community.valid?
      expect(community.uuid).to be_present
    end

    it 'generates ident from domain before validation' do
      community = build(:community, domain: 'test-example.com', ident: nil)
      community.valid?
      expect(community.ident).to eq('test_example_com')
    end
  end

  describe 'instance methods' do
    let(:community) { create(:community, ident: 'test_community', is_enabled: true) }

    describe '#display_name' do
      it 'returns humanized ident' do
        expect(community.display_name).to eq('Test community')
      end
    end

    describe '#active?' do
      it 'returns true when enabled' do
        expect(community.active?).to be true
      end

      it 'returns false when disabled' do
        community.update!(is_enabled: false)
        expect(community.active?).to be false
      end
    end
  end

  describe 'scopes' do
    let!(:active_community) { create(:community, is_enabled: true) }
    let!(:inactive_community) { create(:community, is_enabled: false) }

    describe '.active' do
      it 'returns only enabled communities' do
        expect(Community.where(is_enabled: true)).to include(active_community)
        expect(Community.where(is_enabled: true)).not_to include(inactive_community)
      end
    end
  end
end
