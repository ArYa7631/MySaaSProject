class CommunityTranslationSerializer < ApplicationSerializer
  private

  def serialize_single(translation)
    {
      id: translation.id,
      community_id: translation.community_id,
      
      # Translation information
      locale: translation.locale,
      translation_key: translation.translation_key,
      translation: translation.translation,
      localized_key: translation.localized_key,
      
      # Timestamps
      created_at: translation.created_at,
      updated_at: translation.updated_at
    }
  end
end
