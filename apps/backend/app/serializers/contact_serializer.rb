class ContactSerializer < ApplicationSerializer
  private

  def serialize_single(contact)
    {
      id: contact.id,
      community_id: contact.community_id,
      
      # Contact information
      name: contact.name,
      full_name: contact.full_name,
      email: contact.email,
      contact_number: contact.contact_number,
      contact_info: contact.contact_info,
      
      # Message
      message: contact.message,
      short_message: contact.short_message,
      
      # Timestamps
      created_at: contact.created_at,
      updated_at: contact.updated_at
    }
  end
end
