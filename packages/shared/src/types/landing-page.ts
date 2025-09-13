export interface LandingPageSection {
  id: string;
  name: string;
  description: string;
  [key: string]: any;
}

export interface MarketplaceConfiguration {
  id: number;
  community_id: number;
  global_text_color: string;
  global_bg_color: string;
  global_highlight_color: string;
  logo: string;
  title: string;
  title_color: string;
  is_enabled: boolean;
}

export interface ContentPage {
  id: number;
  community_id: number;
  title: string;
  end_point: string;
  data: Record<string, any>;
  is_active: boolean;
}
