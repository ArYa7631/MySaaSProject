class LandingPageSerializer < ApplicationSerializer
  private

  def serialize_single(landing_page)
    {
      id: landing_page.id,
      community_id: landing_page.community_id,
      
      # Meta information
      title: landing_page.title,
      description: landing_page.description,
      keywords: landing_page.keywords,
      meta_data: landing_page.meta_data,
      
      # Content
      content: landing_page.content,
      content_components: extract_content_components(landing_page.content),
      
      # Timestamps
      created_at: landing_page.created_at,
      updated_at: landing_page.updated_at
    }
  end

  def extract_content_components(content)
    return [] unless content.is_a?(Array)
    
    content.map do |component|
      {
        id: component['id'],
        name: component['name'],
        description: component['description'],
        type: component['name']&.downcase
      }
    end
  end
end
