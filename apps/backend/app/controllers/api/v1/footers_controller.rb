class Api::V1::FootersController < Api::V1::BaseController
  before_action :require_community
  before_action :require_community_access
  before_action :set_footer, only: [:show, :update, :destroy]

  def show
    if @footer
      render_success(@footer, FooterSerializer)
    else
      render json: ApplicationSerializer.error("Footer not found", {}, "not_found"), status: :not_found
    end
  end

  def create
    @footer = current_community.build_footer(footer_params)
    
    if @footer.save
      render_created(@footer, FooterSerializer)
    else
      render_error("Failed to create footer", @footer.errors.as_json)
    end
  end

  def update
    if @footer
      if @footer.update(footer_params)
        render_success(@footer, FooterSerializer)
      else
        render_error("Failed to update footer", @footer.errors.as_json)
      end
    else
      @footer = current_community.build_footer(footer_params)
      if @footer.save
        render_created(@footer, FooterSerializer)
      else
        render_error("Failed to create footer", @footer.errors.as_json)
      end
    end
  end

  def destroy
    if @footer.destroy
      render json: { status: "success", message: "Footer deleted successfully" }, status: :ok
    else
      render_error("Failed to delete footer", @footer.errors.as_json)
    end
  end

  private

  def set_footer
    @footer = current_community.footer
  end

  def footer_params
    params.require(:footer).permit(
      :background_color,
      :text_color,
      :link_color,
      :hover_color,
      sections: [
        :id, :label,
        links: [:id, :name, :url, :isExternal, :order]
      ]
    )
  end
end
