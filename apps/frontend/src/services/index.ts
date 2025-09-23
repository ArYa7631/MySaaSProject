// API Services
export { default as AuthService } from './auth.service'
export { default as CommunityService } from './community.service'
export { default as ContactService } from './contact.service'
export { default as LandingPageService } from './landing-page.service'
export { default as AnalyticsService } from './analytics.service'
export { default as UploadService } from './upload.service'

// API Client
export { default as apiClient, apiClientMethods } from '@/lib/api-client'

// Types
export type {
  ApiResponse,
  PaginatedResponse,
  ErrorResponse,
} from '@/lib/api-client'

export type {
  AuthResponse,
  PasswordResetRequest,
  PasswordResetConfirm,
  ChangePasswordRequest,
  UpdateProfileRequest,
} from './auth.service'

export type {
  CommunityStats,
  CommunitySettings,
  CommunityMember,
  CreateCommunityRequest,
  UpdateCommunityRequest,
} from './community.service'

export type {
  Contact,
  CreateContactRequest,
  ContactFilters,
} from './contact.service'

export type {
  AnalyticsMetrics,
  UserActivity,
  CommunityGrowth,
  EngagementMetrics,
  AnalyticsFilters,
} from './analytics.service'

export type {
  UploadProgress,
  UploadedFile,
  UploadOptions,
  FileValidationResult,
} from './upload.service'
