module DomainNormalization
  extend ActiveSupport::Concern

  private

  def find_community_by_domain(domain)
    # Try to find community with exact domain match first
    community = Community.find_by(domain: domain, is_enabled: true)
    
    # If not found, try to find by normalizing www subdomain
    unless community
      community = find_community_by_domain_normalization(domain)
    end
    
    community
  end

  def find_community_by_domain_normalization(domain)
    # Normalize domain by removing or adding www prefix
    normalized_domain = normalize_domain_for_lookup(domain)
    
    # Try to find community with normalized domain
    Community.find_by(domain: normalized_domain, is_enabled: true)
  end

  def normalize_domain_for_lookup(domain)
    # If domain starts with www., remove it
    # If domain doesn't start with www., add it
    if domain.start_with?('www.')
      domain[4..-1] # Remove 'www.'
    else
      "www.#{domain}" # Add 'www.'
    end
  end
end
