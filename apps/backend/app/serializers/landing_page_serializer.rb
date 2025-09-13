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
      
      # Content - extract sections array
      content: landing_page.content,
      sections: extract_sections(landing_page.content),
      
      # Timestamps
      created_at: landing_page.created_at,
      updated_at: landing_page.updated_at
    }
  end

  def extract_sections(content)
    return [] unless content.is_a?(Array) || content.is_a?(Hash)
    
    # Handle both direct sections array and nested sections
    sections = if content.is_a?(Array)
      content
    else
      content['sections'] || content[:sections] || []
    end
    
    # Ensure each section has required fields
    sections.map do |section|
      {
        id: section['id'] || section[:id] || "section-#{SecureRandom.uuid}",
        name: section['name'] || section[:name] || '',
        description: section['description'] || section[:description] || '',
        type: section['type'] || section[:type] || section['name'] || section[:name] || '',
        content: section['content'] || section[:content] || {}
      }.merge(section)
    end
  end
end
