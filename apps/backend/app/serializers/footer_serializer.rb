class FooterSerializer < ApplicationSerializer
  private

  def serialize_single(footer)
    {
      id: footer.id,
      community_id: footer.community_id,
      
      # Dynamic sections structure
      sections: footer.sections,
      section_labels: footer.section_labels,
      
      # Helper methods for common sections
      resource_links: footer.resource_links,
      social_links: footer.social_links,
      legal_links: footer.legal_links,
      copyright_text: footer.copyright_text,
      
      # Timestamps
      created_at: footer.created_at,
      updated_at: footer.updated_at
    }
  end
end
