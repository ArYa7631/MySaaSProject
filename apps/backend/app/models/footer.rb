class Footer < ApplicationRecord
  belongs_to :community

  # Validations - allow empty arrays but ensure sections exist
  validates :sections, presence: true, allow_blank: true

  # Color validations
  validates :background_color, format: { with: /\A#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\z|\Alinear-gradient\(.*\)\z|\A[a-zA-Z]+\z/, message: "must be a valid color (hex, gradient, or CSS color name)" }, allow_blank: true
  validates :text_color, format: { with: /\A#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\z|\Alinear-gradient\(.*\)\z|\A[a-zA-Z]+\z/, message: "must be a valid color (hex, gradient, or CSS color name)" }, allow_blank: true
  validates :link_color, format: { with: /\A#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\z|\Alinear-gradient\(.*\)\z|\A[a-zA-Z]+\z/, message: "must be a valid color (hex, gradient, or CSS color name)" }, allow_blank: true
  validates :hover_color, format: { with: /\A#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\z|\Alinear-gradient\(.*\)\z|\A[a-zA-Z]+\z/, message: "must be a valid color (hex, gradient, or CSS color name)" }, allow_blank: true

  # Default values (using jsonb to match migrations)
  attribute :sections, :jsonb, default: []

  # Instance methods
  def section_links
    sections || []
  end

  def sections_with_converted_links
    return [] unless sections.is_a?(Array)
    
    sections.map do |section|
      if section.is_a?(Hash)
        converted_section = section.dup
        if section['links'].is_a?(Array)
          converted_section['links'] = section['links'].map.with_index do |link, index|
            if link.is_a?(Hash)
              # Ensure all required fields are present
              link.merge(
                'id' => link['id'] || "link-#{index}",
                'order' => link['order'] || index
              )
            else
              link
            end
          end
        end
        converted_section
      else
        section
      end
    end
  end

  def find_section(label)
    sections.find { |section| section['label'] == label }
  end

  def section_labels
    sections.map { |section| section['label'] }
  end

  def add_section(label, links = [])
    new_section = {
      'label' => label,
      'links' => links
    }
    self.sections = (sections || []) + [new_section]
  end

  def update_section(label, links)
    section_index = sections.index { |section| section['label'] == label }
    if section_index
      sections[section_index]['links'] = links
    else
      add_section(label, links)
    end
  end

  def remove_section(label)
    self.sections = sections.reject { |section| section['label'] == label }
  end

  # Legacy methods for backward compatibility
  def resource_links
    find_section('Resources')&.dig('links') || []
  end

  def social_links
    find_section('Follow Us')&.dig('links') || []
  end

  def legal_links
    find_section('Legal')&.dig('links') || []
  end

  def copyright_text
    find_section('Legal')&.dig('copyright') || ''
  end
end
