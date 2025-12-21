'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Play, X, Youtube } from 'lucide-react'
import { MarketplaceConfiguration } from '@mysaasproject/shared'

interface VideoItem {
  url: string
  title?: string
  description?: string
}

interface VideoGalleryProps {
  id: string
  title?: string
  videos: VideoItem[]
  isEditing?: boolean
  onUpdate?: (videos: VideoItem[]) => void
  marketplaceConfig?: MarketplaceConfiguration | null
}

// YouTube URL validation and video ID extraction
const extractYouTubeVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    /youtu\.be\/([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return match[1]
    }
  }
  
  return null
}

const isValidYouTubeUrl = (url: string): boolean => {
  return extractYouTubeVideoId(url) !== null
}

const getYouTubeThumbnail = (videoId: string): string => {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
}

const getYouTubeEmbedUrl = (videoId: string): string => {
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
}

export const VideoGallery: React.FC<VideoGalleryProps> = ({
  title,
  videos,
  isEditing = false,
  onUpdate,
  marketplaceConfig,
}) => {
  const [newVideoUrl, setNewVideoUrl] = useState('')
  const [newVideoTitle, setNewVideoTitle] = useState('')
  const [newVideoDescription, setNewVideoDescription] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)

  const handleAddVideo = () => {
    if (!newVideoUrl.trim()) return
    
    if (!isValidYouTubeUrl(newVideoUrl)) {
      alert('Please enter a valid YouTube URL')
      return
    }

    const newVideo: VideoItem = {
      url: newVideoUrl.trim(),
      title: newVideoTitle.trim() || undefined,
      description: newVideoDescription.trim() || undefined,
    }

    const updatedVideos = [...videos, newVideo]
    onUpdate?.(updatedVideos)
    
    // Reset form
    setNewVideoUrl('')
    setNewVideoTitle('')
    setNewVideoDescription('')
    setShowAddForm(false)
  }

  const removeVideo = (index: number) => {
    const updatedVideos = videos.filter((_, i) => i !== index)
    onUpdate?.(updatedVideos)
  }

  const openVideoModal = (videoUrl: string) => {
    setSelectedVideo(videoUrl)
  }

  const closeVideoModal = () => {
    setSelectedVideo(null)
  }

  // Get colors from marketplace config
  const backgroundColor = marketplaceConfig?.global_bg_color || '#f8fafc'
  const textColor = marketplaceConfig?.global_text_color || '#1f2937'
  const highlightColor = marketplaceConfig?.global_highlight_color || '#3b82f6'

  if (isEditing) {
    return (
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {title || 'Video Gallery'}
            </h2>
            <Button
              variant="outline"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Video
            </Button>
          </div>

          {/* Add Video Form */}
          {showAddForm && (
            <div className="mb-8 p-6 border rounded-lg bg-white dark:bg-gray-700">
              <h3 className="text-lg font-semibold mb-4">Add New Video</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="videoUrl">YouTube URL *</Label>
                  <Input
                    id="videoUrl"
                    value={newVideoUrl}
                    onChange={(e) => setNewVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Only YouTube URLs are supported
                  </p>
                </div>
                <div>
                  <Label htmlFor="videoTitle">Video Title (optional)</Label>
                  <Input
                    id="videoTitle"
                    value={newVideoTitle}
                    onChange={(e) => setNewVideoTitle(e.target.value)}
                    placeholder="Enter video title"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="videoDescription">Description (optional)</Label>
                  <Input
                    id="videoDescription"
                    value={newVideoDescription}
                    onChange={(e) => setNewVideoDescription(e.target.value)}
                    placeholder="Enter video description"
                    className="mt-1"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleAddVideo} disabled={!newVideoUrl.trim()}>
                    Add Video
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Current Videos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Current Videos ({videos.length})</h3>
            {videos.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <Youtube className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No videos added yet</p>
                <p className="text-sm text-gray-400">Add YouTube videos to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video, index) => {
                  const videoId = extractYouTubeVideoId(video.url)
                  const thumbnail = videoId ? getYouTubeThumbnail(videoId) : ''
                  
                  return (
                    <div key={index} className="relative group">
                      <div className="relative overflow-hidden rounded-lg shadow-lg">
                        {thumbnail ? (
                          <img
                            src={thumbnail}
                            alt={video.title || `Video ${index + 1}`}
                            className="w-full h-48 object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                            <Youtube className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="flex space-x-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => openVideoModal(video.url)}
                            >
                              <Play className="h-4 w-4 mr-1" />
                              Preview
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeVideo(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate" title={video.title}>
                          {video.title || `Video ${index + 1}`}
                        </p>
                        {video.description && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate" title={video.description}>
                            {video.description}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }

  // Public view (non-editing)
  return (
    <section 
      className="py-16"
      style={{ backgroundColor: backgroundColor }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="text-center mb-12">
            <h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: textColor }}
            >
              {title}
            </h2>
            <div 
              className="w-24 h-1 mx-auto rounded-full"
              style={{ backgroundColor: highlightColor }}
            ></div>
          </div>
        )}
        
        {videos.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-lg border border-gray-200 dark:border-gray-700">
              <Youtube className="h-20 w-20 text-gray-400 mx-auto mb-6" />
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">No videos to display</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm">Videos will appear here once added</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video, index) => {
              const videoId = extractYouTubeVideoId(video.url)
              const thumbnail = videoId ? getYouTubeThumbnail(videoId) : ''
              
              return (
                <div 
                  key={index} 
                  className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
                  onClick={() => openVideoModal(video.url)}
                >
                  <div className="relative overflow-hidden">
                    {thumbnail ? (
                      <img
                        src={thumbnail}
                        alt={video.title || `Video ${index + 1}`}
                        className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                        <Youtube className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Play button overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="bg-white/90 rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                        <Play className="h-8 w-8 text-gray-800 ml-1" fill="currentColor" />
                      </div>
                    </div>
                    
                    {/* Video info overlay */}
                    <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                      <p className="text-white font-medium text-sm truncate" title={video.title}>
                        {video.title || `Video ${index + 1}`}
                      </p>
                      {video.description && (
                        <p className="text-white/80 text-xs truncate" title={video.description}>
                          {video.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-4xl bg-white rounded-lg overflow-hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={closeVideoModal}
              className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white"
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="aspect-video">
              {(() => {
                const videoId = extractYouTubeVideoId(selectedVideo)
                if (videoId) {
                  return (
                    <iframe
                      src={getYouTubeEmbedUrl(videoId)}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  )
                }
                return (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <p className="text-gray-500">Invalid video URL</p>
                  </div>
                )
              })()}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
