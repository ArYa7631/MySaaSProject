'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Play, Pause } from 'lucide-react'

interface VideoSectionProps {
  title?: string
  description?: string
  videoUrl?: string
  thumbnailUrl?: string
}

export const VideoSection: React.FC<VideoSectionProps> = ({
  title,
  description,
  videoUrl,
  thumbnailUrl
}) => {
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const getYouTubeEmbedUrl = (url: string) => {
    // Convert YouTube watch URL to embed URL
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0]
      return `https://www.youtube.com/embed/${videoId}`
    }
    // If it's already an embed URL, return as is
    if (url.includes('youtube.com/embed')) {
      return url
    }
    // For other video URLs, return as is
    return url
  }

  return (
    <div className="py-16 px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {title && (
          <h2 className="text-3xl font-bold text-center mb-4">{title}</h2>
        )}
        {description && (
          <p className="text-xl text-gray-600 text-center mb-12">{description}</p>
        )}
        
        <div className="relative bg-black rounded-lg overflow-hidden shadow-lg">
          {videoUrl ? (
            <div className="relative aspect-video">
              {isPlaying ? (
                <iframe
                  src={getYouTubeEmbedUrl(videoUrl)}
                  title={title || 'Video'}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="relative w-full h-full">
                  {thumbnailUrl ? (
                    <img
                      src={thumbnailUrl}
                      alt={title || 'Video thumbnail'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Play className="h-16 w-16 mx-auto mb-4 opacity-70" />
                        <p className="text-lg">Video Preview</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <Button
                      onClick={handlePlayPause}
                      size="lg"
                      className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4"
                    >
                      <Play className="h-8 w-8" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-video bg-gray-800 flex items-center justify-center">
              <div className="text-center text-white">
                <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No video URL provided</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
