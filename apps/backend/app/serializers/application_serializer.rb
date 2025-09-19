# Base serializer for all API responses
class ApplicationSerializer
  def initialize(object, options = {})
    @object = object
    @options = options
  end

  def as_json
    if @object.respond_to?(:map) && !@object.is_a?(Hash)
      # Collection (but not a hash)
      {
        status: "success",
        data: @object.map { |item| serialize_single(item) },
        meta: build_meta
      }
    else
      # Single object or hash
      {
        status: "success",
        data: serialize_single(@object)
      }
    end
  end

  private

  def serialize_single(object)
    # Override in subclasses
    object.as_json
  end

  def build_meta
    return {} unless @object.respond_to?(:current_page)
    
    {
      current_page: @object.current_page,
      per_page: @object.limit_value,
      total_pages: @object.total_pages,
      total_count: @object.total_count
    }
  end

  # Class method for easy usage
  def self.render(object, options = {})
    new(object, options).as_json
  end

  # Error response helper
  def self.error(message, errors = {}, status = "error")
    {
      status: status,
      message: message,
      errors: errors
    }
  end
end
