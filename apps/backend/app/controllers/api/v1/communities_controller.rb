class Api::V1::CommunitiesController < Api::V1::BaseController
  before_action :set_community, only: [:show, :update, :destroy]

  def index
    communities = Community.all.order(:created_at)
    communities = paginate(communities) if params[:page]
    
    options = {}
    options[:include_stats] = true if params[:include_stats] == 'true'
    options[:include_marketplace_configuration] = true if params[:include_marketplace_configuration] == 'true'
    
    render_success(communities, CommunitySerializer, options)
  end

  def by_domain
    domain = params[:domain]
    
    @community = Community.find_by(domain: domain, is_enabled: true)
    
    unless @community
      render json: ApplicationSerializer.error("Community not found for domain: #{domain}", {}, "not_found"), status: :not_found
      return
    end
    
    options = {}
    options[:include_marketplace_configuration] = true
    options[:include_landing_page] = true
    options[:include_topbar] = true
    options[:include_footer] = true
    
    render_success(@community, CommunitySerializer, options)
  end

  def show
    options = {}
    options[:include_stats] = true if params[:include_stats] == 'true'
    options[:include_marketplace_configuration] = true if params[:include_marketplace_configuration] == 'true'
    options[:include_landing_page] = true if params[:include_landing_page] == 'true'
    options[:include_topbar] = true if params[:include_topbar] == 'true'
    options[:include_footer] = true if params[:include_footer] == 'true'
    
    render_success(@community, CommunitySerializer, options)
  end

  def create
    @community = Community.new(community_params)
    
    if @community.save
      render_created(@community, CommunitySerializer)
    else
      render_error("Failed to create community", @community.errors.as_json)
    end
  end

  def update
    if @community.update(community_params)
      render_success(@community, CommunitySerializer)
    else
      render_error("Failed to update community", @community.errors.as_json)
    end
  end

  def destroy
    if @community.destroy
      render json: { status: "success", message: "Community deleted successfully" }, status: :ok
    else
      render_error("Failed to delete community", @community.errors.as_json)
    end
  end

  private

  def set_community
    @community = Community.find(params[:id])
  end

  def community_params
    params.require(:community).permit(
      :uuid, :ident, :domain, :use_domain, :is_enabled,
      :locale, :currency, :country, :ip_address, :person_id
    )
  end
end
