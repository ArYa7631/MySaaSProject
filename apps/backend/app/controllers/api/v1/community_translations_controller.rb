class Api::V1::CommunityTranslationsController < Api::V1::BaseController
  before_action :require_community
  before_action :require_community_access
  before_action :set_translation, only: [:show, :update, :destroy]

  # GET /api/v1/communities/:community_id/translations
  def index
    translations = current_community.community_translations.order(:created_at)
    translations = translations.by_locale(params[:locale]) if params[:locale]
    translations = translations.by_key(params[:translation_key]) if params[:translation_key]
    translations = paginate(translations) if params[:page]
    
    render_success(translations, CommunityTranslationSerializer)
  end

  # GET /api/v1/communities/:community_id/translations/:id
  def show
    render_success(@translation, CommunityTranslationSerializer)
  end

  # POST /api/v1/communities/:community_id/translations
  def create
    @translation = current_community.community_translations.build(translation_params)
    
    if @translation.save
      render_created(@translation, CommunityTranslationSerializer)
    else
      render_error("Failed to create translation", @translation.errors.as_json)
    end
  end

  # PATCH/PUT /api/v1/communities/:community_id/translations/:id
  def update
    if @translation.update(translation_params)
      render_success(@translation, CommunityTranslationSerializer)
    else
      render_error("Failed to update translation", @translation.errors.as_json)
    end
  end

  # DELETE /api/v1/communities/:community_id/translations/:id
  def destroy
    if @translation.destroy
      render json: { status: "success", message: "Translation deleted successfully" }, status: :ok
    else
      render_error("Failed to delete translation", @translation.errors.as_json)
    end
  end

  private

  def set_translation
    @translation = current_community.community_translations.find(params[:id])
  end

  def translation_params
    params.require(:translation).permit(:locale, :translation_key, :translation)
  end
end
