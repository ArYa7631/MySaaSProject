class UserSerializer < ApplicationSerializer
  private

  def serialize_single(user)
    {
      id: user.id,
      email: user.email,
      
      # Personal information
      first_name: user.first_name,
      last_name: user.last_name,
      full_name: user.full_name,
      display_name: user.display_name,
      phone_number: user.phone_number,
      locale: user.locale,
      
      # Community association
      community_id: user.community_id,
      community: include_community(user),
      
      # Timestamps
      created_at: user.created_at,
      updated_at: user.updated_at
    }.compact
  end

  def include_community(user)
    return nil unless @options[:include_community]
    return nil unless user.community
    
    {
      id: user.community.id,
      ident: user.community.ident,
      domain: user.community.domain,
      display_name: user.community.display_name
    }
  end
end
