class Api::V1::MarketplaceConfigurationsController < Api::V1::BaseController
  before_action :require_community
  before_action :set_marketplace_configuration, only: [:show, :update, :destroy]

  # GET /api/v1/communities/:community_id/marketplace_configuration
  def show
    if @marketplace_configuration
      render_success(@marketplace_configuration, MarketplaceConfigurationSerializer)
    else
      render json: ApplicationSerializer.error("Marketplace configuration not found", {}, "not_found"), status: :not_found
    end
  end

  # POST /api/v1/communities/:community_id/marketplace_configuration
  def create
    @marketplace_configuration = current_community.build_marketplace_configuration(marketplace_configuration_params)
    
    if @marketplace_configuration.save
      render_created(@marketplace_configuration, MarketplaceConfigurationSerializer)
    else
      render_error("Failed to create marketplace configuration", @marketplace_configuration.errors.as_json)
    end
  end

  # PATCH/PUT /api/v1/communities/:community_id/marketplace_configuration
  def update
    if @marketplace_configuration.update(marketplace_configuration_params)
      render_success(@marketplace_configuration, MarketplaceConfigurationSerializer)
    else
      render_error("Failed to update marketplace configuration", @marketplace_configuration.errors.as_json)
    end
  end

  # DELETE /api/v1/communities/:community_id/marketplace_configuration
  def destroy
    if @marketplace_configuration.destroy
      render json: { status: "success", message: "Marketplace configuration deleted successfully" }, status: :ok
    else
      render_error("Failed to delete marketplace configuration", @marketplace_configuration.errors.as_json)
    end
  end

  private

  def set_marketplace_configuration
    @marketplace_configuration = current_community.marketplace_configuration
  end

  def marketplace_configuration_params
    params.require(:marketplace_configuration).permit(
      :global_text_color, :global_bg_color, :global_highlight_color,
      :available_locale, :available_currency, :is_enabled, :is_super_admin,
      :logo, :profile_logo, :favicon, :title, :title_color,
      :notification, :copyright, :whatsapp_number, :enable_whatsapp_bot,
      :facebook_url, :instagram_url, :twitter_url, :github_url, :skype_url,
      :cookie_text
    )
  end
end
