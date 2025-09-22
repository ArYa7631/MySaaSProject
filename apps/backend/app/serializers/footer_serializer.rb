class FooterSerializer < ApplicationSerializer
  private

  def serialize_single(footer)
    {
      id: footer.id,
      community_id: footer.community_id,
      
      # Dynamic sections structure with converted links
      sections: footer.sections_with_converted_links,
      section_labels: footer.section_labels,
      
      # Helper methods for common sections
      resource_links: footer.resource_links,
      social_links: footer.social_links,
      legal_links: footer.legal_links,
      copyright_text: footer.copyright_text,
      
      # Colors
      background_color: footer.background_color,
      text_color: footer.text_color,
      link_color: footer.link_color,
      hover_color: footer.hover_color,
      
      # Timestamps
      created_at: footer.created_at,
      updated_at: footer.updated_at
    }
  end
end
