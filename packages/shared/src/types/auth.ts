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
  is_enabled: boolean;
  person_id: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

