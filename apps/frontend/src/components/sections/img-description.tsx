'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/ui/image-upload'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, ExternalLink, Image as ImageIcon, X, Edit3 } from 'lucide-react'
import { ImageUploadResponse } from '@/services/image.service'

interface ImgDescriptionProps {
  id: string
  header: string
  imageURL: string
  description: string
  buttonURL?: string
  buttonLabel?: string
  isEditing?: boolean
  onUpdate?: (updates: { 
    header?: string
    imageURL?: string
    description?: string
    buttonURL?: string
    buttonLabel?: string
  }) => void
}

export const ImgDescription: React.FC<ImgDescriptionProps> = ({
  header,
  imageURL,
  description,
  buttonURL,
  buttonLabel,
  isEditing = false,
  onUpdate,
}) => {
  const router = useRouter()
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [isEditingContent, setIsEditingContent] = useState(false)
  const [editData, setEditData] = useState({
    header,
    description,
    buttonURL: buttonURL || '',
    buttonLabel: buttonLabel || ''
  })

  const handleNavigation = (url: string) => {
    if (url.startsWith('http')) {
      window.open(url, '_blank')
    } else {
      router.push(url)
    }
  }

  const handleImageUpload = (response: ImageUploadResponse) => {
    onUpdate?.({ imageURL: response.url })
    setShowImageUpload(false)
  }

  const removeImage = () => {
    onUpdate?.({ imageURL: '' })
  }

  const handleSaveContent = () => {
    onUpdate?.(editData)
    setIsEditingContent(false)
  }

  const handleCancelEdit = () => {
    setEditData({
      header,
      description,
      buttonURL: buttonURL || '',
      buttonLabel: buttonLabel || ''
    })
    setIsEditingContent(false)
  }

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Section */}
          <div className="relative">
            {imageURL ? (
              <div className="relative group">
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <img
                    src={imageURL}
                    alt={header}
                    className="w-full h-96 lg:h-[500px] object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                {isEditing && (
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setShowImageUpload(true)}
                      className="bg-white/90 hover:bg-white shadow-lg"
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Change
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={removeImage}
                      className="bg-red-500/90 hover:bg-red-600 shadow-lg"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <div className="w-full h-96 lg:h-[500px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                  <div className="text-center">
                    <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 mb-4">No image uploaded</p>
                    {isEditing && (
                      <Button
                        variant="outline"
                        onClick={() => setShowImageUpload(true)}
                      >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Upload Image
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Image Upload Modal */}
            {showImageUpload && isEditing && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 rounded-2xl">
                <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Upload Image</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowImageUpload(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <ImageUpload
                    onUploadSuccess={handleImageUpload}
                    folder="about"
                    maxFiles={1}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              {isEditing && isEditingContent ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editData.header}
                    onChange={(e) => setEditData(prev => ({ ...prev, header: e.target.value }))}
                    className="w-full text-3xl md:text-4xl font-bold text-gray-900 dark:text-white bg-transparent border-b-2 border-blue-500 focus:outline-none"
                    placeholder="Enter header..."
                  />
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={handleSaveContent}>
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                    {header}
                  </h2>
                  {isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingContent(true)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              {isEditing && isEditingContent ? (
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                  rows={6}
                  className="w-full text-lg text-gray-600 dark:text-gray-400 bg-transparent border-2 border-blue-500 rounded-lg p-3 focus:outline-none resize-none"
                  placeholder="Enter description..."
                />
              ) : (
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            {/* Button */}
            {buttonURL && buttonLabel && (
              <div>
                {isEditing && isEditingContent ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Button URL
                        </label>
                        <input
                          type="url"
                          value={editData.buttonURL}
                          onChange={(e) => setEditData(prev => ({ ...prev, buttonURL: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                          placeholder="https://example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Button Label
                        </label>
                        <input
                          type="text"
                          value={editData.buttonLabel}
                          onChange={(e) => setEditData(prev => ({ ...prev, buttonLabel: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                          placeholder="Button Text"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <Button
                    size="lg"
                    onClick={() => handleNavigation(buttonURL)}
                    className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    {buttonLabel}
                    {buttonURL.startsWith('http') ? (
                      <ExternalLink className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    ) : (
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    )}
                  </Button>
                )}
              </div>
            )}

            {/* Add Button Section (when no button exists) */}
            {isEditing && !buttonURL && !buttonLabel && (
              <div className="pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsEditingContent(true)}
                  className="border-dashed border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Add Call-to-Action Button
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
