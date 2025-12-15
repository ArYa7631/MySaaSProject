class Api::V1::TopbarsController < Api::V1::BaseController
  before_action :require_community
  before_action :require_community_access
  before_action :set_topbar, only: [:show, :update, :destroy]

  def show
    if @topbar
      render_success(@topbar, TopbarSerializer)
    else
      render json: ApplicationSerializer.error("Topbar not found", {}, "not_found"), status: :not_found
    end
  end

  def create
    @topbar = current_community.build_topbar(topbar_params)
    
    if @topbar.save
      render_created(@topbar, TopbarSerializer)
    else
      render_error("Failed to create topbar", @topbar.errors.as_json)
    end
  end

  def update
    if @topbar
      if @topbar.update(topbar_params)
        render_success(@topbar, TopbarSerializer)
      else
        render_error("Failed to update topbar", @topbar.errors.as_json)
      end
    else
      @topbar = current_community.build_topbar(topbar_params)
      if @topbar.save
        render_created(@topbar, TopbarSerializer)
      else
        render_error("Failed to create topbar", @topbar.errors.as_json)
      end
    end
  end

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
