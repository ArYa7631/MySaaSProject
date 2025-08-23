class ContentPageSerializer < ApplicationSerializer
  private

  def serialize_single(content_page)
    {
      id: content_page.id,
      community_id: content_page.community_id,
      
      # Basic information
      title: content_page.title,
      end_point: content_page.end_point,
      slug: content_page.slug,
      is_active: content_page.is_active,
      
      # Meta information
      page_title: content_page.page_title,
      page_description: content_page.page_description,
      page_keywords: content_page.page_keywords,
      meta_data: content_page.meta_data,
      
      # Content
      data: content_page.data,
      content_sections: content_page.content_sections,
      content_components: extract_content_components(content_page.data),
      
      # Timestamps
      created_at: content_page.created_at,
      updated_at: content_page.updated_at
    }
  end

  def extract_content_components(data)
    return [] unless data.is_a?(Array)
    
    data.map do |component|
      {
        id: component['id'],
        name: component['name'],
        description: component['description'],
        type: component['name']&.downcase,
        has_content: component.keys.any? { |key| key != 'id' && key != 'name' && key != 'description' }
      }
    end
  end
end
