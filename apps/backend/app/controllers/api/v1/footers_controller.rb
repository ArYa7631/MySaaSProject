class Api::V1::FootersController < Api::V1::BaseController
  before_action :require_community
  before_action :set_footer, only: [:show, :update, :destroy]

  # GET /api/v1/communities/:community_id/footer
  def show
    if @footer
      render_success(@footer, FooterSerializer)
    else
      render json: ApplicationSerializer.error("Footer not found", {}, "not_found"), status: :not_found
    end
  end

  # POST /api/v1/communities/:community_id/footer
  def create
    @footer = current_community.build_footer(footer_params)
    
    if @footer.save
      render_created(@footer, FooterSerializer)
    else
      render_error("Failed to create footer", @footer.errors.as_json)
    end
  end

  # PATCH/PUT /api/v1/communities/:community_id/footer
  def update
    if @footer
      if @footer.update(footer_params)
        render_success(@footer, FooterSerializer)
      else
        render_error("Failed to update footer", @footer.errors.as_json)
      end
    else
      # Create footer if it doesn't exist
      @footer = current_community.build_footer(footer_params)
      if @footer.save
        render_created(@footer, FooterSerializer)
      else
        render_error("Failed to create footer", @footer.errors.as_json)
      end
    end
  end

  # DELETE /api/v1/communities/:community_id/footer
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
    # Allow nested parameters for footer sections, links, and color fields
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
