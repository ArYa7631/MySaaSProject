export interface LandingPageSection {
  id: string;
  name: string;
  type: string;
  description: string;
  content: Record<string, any>;
  [key: string]: any;
}

export interface MarketplaceConfiguration {
  id: number;
  community_id: number;
  global_text_color: string;
  global_bg_color: string;
  global_highlight_color: string;
  available_locale: string;
  available_currency: string;
  is_enabled: boolean;
  is_super_admin: boolean;
  logo: string;
  profile_logo: string;
  favicon: string;
  title: string;
  title_color: string;
  notification: string;
  copyright: string;
  whatsapp_number: string;
  enable_whatsapp_bot: boolean;
  facebook_url: string;
  instagram_url: string;
  twitter_url: string;
  github_url: string;
  skype_url: string;
  cookie_text: string;
  created_at: string;
  updated_at: string;
}

export interface ContentPage {
  id: number;
  community_id: number;
  title: string;
  end_point: string;
  data: Record<string, any>;
  is_active: boolean;
}
