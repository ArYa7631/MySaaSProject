class Footer < ApplicationRecord
  belongs_to :community

  # Validations
  validates :sections, presence: true

  # Default values (using jsonb to match migrations)
  attribute :sections, :jsonb, default: []

  # Instance methods
  def section_links
    sections || []
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
