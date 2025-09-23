class Api::V1::TopbarsController < Api::V1::BaseController
  before_action :require_community
  before_action :require_community_access
  before_action :set_topbar, only: [:show, :update, :destroy]

  # GET /api/v1/communities/:community_id/topbar
  def show
    if @topbar
      render_success(@topbar, TopbarSerializer)
    else
      render json: ApplicationSerializer.error("Topbar not found", {}, "not_found"), status: :not_found
    end
  end

  # POST /api/v1/communities/:community_id/topbar
  def create
    @topbar = current_community.build_topbar(topbar_params)
    
    if @topbar.save
      render_created(@topbar, TopbarSerializer)
    else
      render_error("Failed to create topbar", @topbar.errors.as_json)
    end
  end

  # PATCH/PUT /api/v1/communities/:community_id/topbar
  def update
    if @topbar
      if @topbar.update(topbar_params)
        render_success(@topbar, TopbarSerializer)
      else
        render_error("Failed to update topbar", @topbar.errors.as_json)
      end
    else
      # Create topbar if it doesn't exist
      @topbar = current_community.build_topbar(topbar_params)
      if @topbar.save
        render_created(@topbar, TopbarSerializer)
      else
        render_error("Failed to create topbar", @topbar.errors.as_json)
      end
    end
  end

  # DELETE /api/v1/communities/:community_id/topbar
  def destroy
    if @topbar.destroy
      render json: { status: "success", message: "Topbar deleted successfully" }, status: :ok
    else
      render_error("Failed to delete topbar", @topbar.errors.as_json)
    end
  end

  private

  def set_topbar
    @topbar = current_community.topbar
  end

  def topbar_params
    # Allow nested parameters for navigation items and color fields
    params.require(:topbar).permit(
      :is_multilingual, 
      :profile,
      :background_color,
      :text_color,
      :link_color,
      :hover_color,
      navigation: [
        items: [:id, :name, :url, :isExternal, :order]
      ]
    )
  end
end
