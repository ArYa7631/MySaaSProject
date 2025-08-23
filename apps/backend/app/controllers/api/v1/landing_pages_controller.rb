class Api::V1::LandingPagesController < Api::V1::BaseController
  before_action :require_community
  before_action :set_landing_page, only: [:show, :update, :destroy]

  # GET /api/v1/communities/:community_id/landing_page
  def show
    if @landing_page
      render_success(@landing_page, LandingPageSerializer)
    else
      render json: ApplicationSerializer.error("Landing page not found", {}, "not_found"), status: :not_found
    end
  end

  # POST /api/v1/communities/:community_id/landing_page
  def create
    @landing_page = current_community.build_landing_page(landing_page_params)
    
    if @landing_page.save
      render_created(@landing_page, LandingPageSerializer)
    else
      render_error("Failed to create landing page", @landing_page.errors.as_json)
    end
  end

  # PATCH/PUT /api/v1/communities/:community_id/landing_page
  def update
    if @landing_page.update(landing_page_params)
      render_success(@landing_page, LandingPageSerializer)
    else
      render_error("Failed to update landing page", @landing_page.errors.as_json)
    end
  end

  # DELETE /api/v1/communities/:community_id/landing_page
  def destroy
    if @landing_page.destroy
      render json: { status: "success", message: "Landing page deleted successfully" }, status: :ok
    else
      render_error("Failed to delete landing page", @landing_page.errors.as_json)
    end
  end

  private

  def set_landing_page
    @landing_page = current_community.landing_page
  end

  def landing_page_params
    params.require(:landing_page).permit(:meta_data, :content)
  end
end
