import { apiClientMethods, PaginatedResponse } from '@/lib/api-client'

export interface Contact {
  id: number
  community_id: number
  name: string
  full_name: string
  email: string
  contact_number?: string
  contact_info: string
  message: string
  short_message: string
  created_at: string
  updated_at: string
}

export interface CreateContactRequest {
  name?: string
  email: string
  contact_number?: string
  message: string
}

export interface ContactFilters {
  email?: string
  recent?: boolean
  page?: number
  per_page?: number
}

export class ContactService {
  // Get all contacts for a community
  static async getContacts(
    communityId: number,
    filters: ContactFilters = {}
  ): Promise<PaginatedResponse<Contact>> {
    const params = new URLSearchParams()
    
    if (filters.email) params.append('email', filters.email)
    if (filters.recent) params.append('recent', 'true')
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.per_page) params.append('per_page', filters.per_page.toString())

    const queryString = params.toString()
    const url = `/communities/${communityId}/contacts${queryString ? `?${queryString}` : ''}`
    
    const response = await apiClientMethods.get<{ data: Contact[] }>(url)
    
    // Convert the response to PaginatedResponse format
    return {
      status: 'success',
      data: response.data,
      pagination: {
        page: 1,
        per_page: response.data.length,
        total: response.data.length,
        total_pages: 1
      }
    }
  }

  // Get a specific contact
  static async getContact(communityId: number, contactId: number): Promise<Contact> {
    const response = await apiClientMethods.get<Contact>(`/communities/${communityId}/contacts/${contactId}`)
    return response.data
  }

  // Create a new contact (submit contact form)
  static async createContact(communityId: number, data: CreateContactRequest): Promise<Contact> {
    const response = await apiClientMethods.post<Contact>(`/communities/${communityId}/contacts`, {
      contact: data
    })
    return response.data
  }

  // Delete a contact
  static async deleteContact(communityId: number, contactId: number): Promise<void> {
    await apiClientMethods.delete(`/communities/${communityId}/contacts/${contactId}`)
  }

  // Get recent contacts (last 7 days)
  static async getRecentContacts(communityId: number, limit: number = 10): Promise<Contact[]> {
    const response = await this.getContacts(communityId, { recent: true, per_page: limit })
    return response.data
  }

  // Search contacts by email
  static async searchContactsByEmail(communityId: number, email: string): Promise<Contact[]> {
    const response = await this.getContacts(communityId, { email })
    return response.data
  }
}

export default ContactService
