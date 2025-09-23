'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ContactService, Contact } from '@/services/contact.service'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Calendar, 
  Search, 
  Trash2, 
  Eye,
  RefreshCw
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function AdminContactsPage() {
  const { community, loading: authLoading } = useAuth()
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)

  // Fetch contacts
  const {
    data: contactsResponse,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['contacts', community?.id],
    queryFn: () => ContactService.getContacts(community!.id, { recent: true }),
    enabled: !!community && !authLoading,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const contacts = contactsResponse?.data || []

  // Delete contact mutation
  const deleteContactMutation = useMutation({
    mutationFn: (contactId: number) => ContactService.deleteContact(community!.id, contactId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts', community?.id] })
      setShowDeleteConfirm(null)
    },
  })

  // Filter contacts based on search term
  const filteredContacts = contacts.filter((contact: Contact) => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      contact.name?.toLowerCase().includes(searchLower) ||
      contact.email.toLowerCase().includes(searchLower) ||
      contact.message.toLowerCase().includes(searchLower) ||
      contact.contact_number?.toLowerCase().includes(searchLower)
    )
  })

  const handleDeleteContact = (contactId: number) => {
    deleteContactMutation.mutate(contactId)
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!community) {
    return (
      <div className="flex items-center justify-center h-64">
        <Alert variant="destructive">
          <AlertDescription>
            Community not found. Please refresh the page.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load contacts: {error?.message || 'Unknown error'}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contact Inquiries</h1>
          <p className="text-gray-600 mt-1">
            Manage and respond to contact form submissions
          </p>
        </div>
        <Button
          onClick={() => refetch()}
          variant="outline"
          size="sm"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Badge variant="secondary">
          {filteredContacts.length} {filteredContacts.length === 1 ? 'inquiry' : 'inquiries'}
        </Badge>
      </div>

      {/* Contacts List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No contacts found' : 'No contact inquiries yet'}
          </h3>
          <p className="text-gray-600">
            {searchTerm 
              ? 'Try adjusting your search terms'
              : 'Contact inquiries will appear here when users submit the contact form'
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredContacts.map((contact: Contact) => (
            <div
              key={contact.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-5 w-5 text-gray-400" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        {contact.full_name}
                      </h3>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {formatDistanceToNow(new Date(contact.created_at), { addSuffix: true })}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{contact.email}</span>
                    </div>
                    {contact.contact_number && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{contact.contact_number}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(contact.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-800 whitespace-pre-wrap">
                      {contact.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedContact(contact)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(contact.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Delete Confirmation */}
              {showDeleteConfirm === contact.id && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800 mb-3">
                    Are you sure you want to delete this contact inquiry? This action cannot be undone.
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteContact(contact.id)}
                      disabled={deleteContactMutation.isPending}
                    >
                      {deleteContactMutation.isPending ? 'Deleting...' : 'Delete'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowDeleteConfirm(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Contact Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Contact Details</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedContact(null)}
                >
                  Close
                </Button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <p className="text-gray-900">{selectedContact.full_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <p className="text-gray-900">{selectedContact.email}</p>
                  </div>
                  {selectedContact.contact_number && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <p className="text-gray-900">{selectedContact.contact_number}</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Submitted
                    </label>
                    <p className="text-gray-900">
                      {new Date(selectedContact.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-800 whitespace-pre-wrap">
                      {selectedContact.message}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedContact(null)}
                  >
                    Close
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleDeleteContact(selectedContact.id)
                      setSelectedContact(null)
                    }}
                    disabled={deleteContactMutation.isPending}
                  >
                    Delete Inquiry
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
