export interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  community_id?: number; // Add community support
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  password_confirmation: string;
  name?: string; // Add community name
  domain?: string; // Add domain
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Community {
  id: number;
  uuid: string;
  ident: string;
  domain: string;
  use_domain: boolean;
  is_enabled: boolean;
  locale: string;
  currency: string;
  country: string;
  display_name: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  marketplace_configuration?: {
    id: number;
    community_id: number;
    global_text_color: string;
    global_bg_color: string;
    global_highlight_color: string;
    title_color: string;
    available_locale: string;
    available_currency: string;
    is_enabled: boolean;
    is_super_admin: boolean;
    enable_whatsapp_bot: boolean;
    logo: string;
    profile_logo: string;
    favicon: string;
    title: string;
    notification: string;
    copyright: string;
    cookie_text: string;
    whatsapp_number: string;
    social_links: {
      facebook: string;
      instagram: string;
      twitter: string;
      github: string;
      skype: string;
    };
    has_social_links: boolean;
    facebook_url: string;
    instagram_url: string;
    twitter_url: string;
    github_url: string;
    skype_url: string;
    created_at: string;
    updated_at: string;
  };
  landing_page?: {
    id: number;
    community_id: number;
    title: string;
    description: string;
    keywords: string[];
    meta_data: {
      title: string;
      description: string;
    };
    content: any[];
    sections: any[];
    created_at: string;
    updated_at: string;
  };
  topbar?: {
    id: number;
    community_id: number;
    is_multilingual: boolean;
    show_language_selector: boolean;
    navigation: Array<{
      linkHref: string;
      linkTitle: string;
    }>;
    navigation_items: Array<{
      linkHref: string;
      linkTitle: string;
    }>;
    profile: Array<{
      linkHref: string;
      linkTitle: string;
    }>;
    profile_settings: Array<{
      linkHref: string;
      linkTitle: string;
    }>;
    created_at: string;
    updated_at: string;
  };
  footer?: {
    id: number;
    community_id: number;
    sections: Array<{
      label: string;
      links: Array<{
        link: string;
        name: string;
      }>;
    }>;
    section_labels: string[];
    resource_links: any[];
    social_links: any[];
    legal_links: any[];
    copyright_text: string;
    created_at: string;
    updated_at: string;
  };
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

