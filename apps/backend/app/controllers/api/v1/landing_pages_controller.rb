class Api::V1::LandingPagesController < Api::V1::BaseController
  # Skip authentication for development
  skip_before_action :authenticate_user_from_jwt! if Rails.env.development?
  before_action :require_community
  before_action :set_landing_page, only: [:show, :update, :destroy]

  # GET /api/v1/communities/:community_id/landing_page
  def show
    if @landing_page
      render_success(@landing_page, LandingPageSerializer)
    else
      # Return empty sections array if no landing page exists
      render json: {
        status: "success",
        data: {
          id: nil,
          community_id: current_community.id,
          sections: [],
          meta_data: {},
          created_at: nil,
          updated_at: nil
        }
      }, status: :ok
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
    if @landing_page
      if @landing_page.update(landing_page_params)
        render_success(@landing_page, LandingPageSerializer)
      else
        render_error("Failed to update landing page", @landing_page.errors.as_json)
      end
    else
      # Create landing page if it doesn't exist
      @landing_page = current_community.build_landing_page(landing_page_params)
      if @landing_page.save
        render_created(@landing_page, LandingPageSerializer)
      else
        render_error("Failed to create landing page", @landing_page.errors.as_json)
      end
    end
  end

  # DELETE /api/v1/communities/:community_id/landing_page
  def destroy
    if @landing_page&.destroy
      render json: { status: "success", message: "Landing page deleted successfully" }, status: :ok
    else
      render_error("Failed to delete landing page", {})
    end
  end

  private

  def set_landing_page
    @landing_page = current_community.landing_page
  end

  def landing_page_params
    # Handle both sections array and content object
    if params[:landing_page]&.key?(:sections)
      # For sections, we need to preserve the existing content structure
      # and merge the new sections with existing ones
      existing_content = @landing_page&.content || []
      
      # If we're updating sections, replace the entire content with the new sections
      # This assumes the frontend sends the complete sections array
      {
        content: params[:landing_page][:sections],
        meta_data: params[:landing_page][:meta_data] || @landing_page&.meta_data || {}
      }
    else
      params.require(:landing_page).permit(:meta_data, :content)
    end
  end
end
