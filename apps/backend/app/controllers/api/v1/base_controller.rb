class Api::V1::BaseController < ApplicationController
  respond_to :json
  
  # Skip authentication for public endpoints
  skip_before_action :authenticate_user_from_jwt!, only: [:index, :show, :by_domain, :create]

  # Error handling
  rescue_from ActiveRecord::RecordNotFound, with: :not_found
  rescue_from ActiveRecord::RecordInvalid, with: :record_invalid
  rescue_from ActionController::ParameterMissing, with: :parameter_missing

  protected

  def current_community
    @current_community ||= Community.find(params[:community_id]) if params[:community_id]
  end

  def require_community
    unless current_community
      render json: ApplicationSerializer.error("Community not found", {}, "not_found"), status: :not_found
      return false
    end
    true
  end

  def require_community_access
    return true unless current_community && current_user
    
    # If user has no community assigned, deny access
    if current_user.community_id.nil?
      Rails.logger.warn "User #{current_user.id} (#{current_user.email}) has no community assigned but attempted to access community #{current_community.id}"
      render json: ApplicationSerializer.error("Access denied: User is not assigned to any community", {}, "access_denied"), status: :forbidden
      return false
    end
    
    # Check if the user belongs to the requested community
    unless current_user.community_id == current_community.id
      Rails.logger.warn "User #{current_user.id} (#{current_user.email}) attempted to access community #{current_community.id} but belongs to community #{current_user.community_id}"
      render json: ApplicationSerializer.error("Access denied: User does not belong to this community", {}, "access_denied"), status: :forbidden
      return false
    end
    
    true
  end

  def render_success(data, serializer_class = nil, options = {})
    if serializer_class
      render json: serializer_class.render(data, options), status: :ok
    else
      render json: ApplicationSerializer.render(data, options), status: :ok
    end
  end

  def render_created(data, serializer_class = nil, options = {})
    if serializer_class
      render json: serializer_class.render(data, options), status: :created
    else
      render json: ApplicationSerializer.render(data, options), status: :created
    end
  end

  def render_error(message, errors = {}, status = :unprocessable_entity)
    render json: ApplicationSerializer.error(message, errors), status: status
  end

  private

  def not_found(exception)
    render json: ApplicationSerializer.error("Record not found", {}, "not_found"), status: :not_found
  end

  def record_invalid(exception)
    render json: ApplicationSerializer.error(
      "Validation failed", 
      exception.record.errors.as_json,
      "validation_error"
    ), status: :unprocessable_entity
  end

  def parameter_missing(exception)
    render json: ApplicationSerializer.error(
      "Missing required parameter: #{exception.param}",
      {},
      "parameter_missing"
    ), status: :bad_request
  end

  # Pagination helpers
  def paginate(relation)
    page = params[:page] || 1
    per_page = [params[:per_page]&.to_i || 20, 100].min # Max 100 per page
    relation.page(page).per(per_page)
  end

  def pagination_meta(collection)
    return {} unless collection.respond_to?(:current_page)
    
    {
      current_page: collection.current_page,
      per_page: collection.limit_value,
      total_pages: collection.total_pages,
      total_count: collection.total_count
    }
  end
end
