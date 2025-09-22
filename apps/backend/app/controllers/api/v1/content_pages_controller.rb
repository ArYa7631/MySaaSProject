class Api::V1::ContentPagesController < Api::V1::BaseController
  before_action :require_community
  before_action :set_content_page, only: [:show, :update, :destroy]

  # GET /api/v1/communities/:community_id/content_pages
  def index
    content_pages = current_community.content_pages.order(:created_at)
    content_pages = content_pages.active if params[:active_only] == 'true'
    content_pages = content_pages.by_end_point(params[:end_point]) if params[:end_point]
    content_pages = paginate(content_pages) if params[:page]
    
    render_success(content_pages, ContentPageSerializer)
  end

  # GET /api/v1/communities/:community_id/content_pages/:id
  def show
    render_success(@content_page, ContentPageSerializer)
  end

  # POST /api/v1/communities/:community_id/content_pages
  def create
    @content_page = current_community.content_pages.build(content_page_params)
    
    if @content_page.save
      render_created(@content_page, ContentPageSerializer)
    else
      render_error("Failed to create content page", @content_page.errors.as_json)
    end
  end

  # PATCH/PUT /api/v1/communities/:community_id/content_pages/:id
  def update
    if @content_page.update(content_page_params)
      render_success(@content_page, ContentPageSerializer)
    else
      render_error("Failed to update content page", @content_page.errors.as_json)
    end
  end

  # DELETE /api/v1/communities/:community_id/content_pages/:id
  def destroy
    if @content_page.destroy
      render json: { status: "success", message: "Content page deleted successfully" }, status: :ok
    else
      render_error("Failed to delete content page", @content_page.errors.as_json)
    end
  end

  private

  def set_content_page
    @content_page = current_community.content_pages.find(params[:id])
  end

  def content_page_params
    params.require(:content_page).permit(
      :title, 
      :end_point, 
      :is_active,
      data: {},
      meta_data: {}
    )
  end
end
