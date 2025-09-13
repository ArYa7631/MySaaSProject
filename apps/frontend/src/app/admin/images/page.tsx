'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  Upload, 
  Image as ImageIcon, 
  Folder,
  BarChart3,
  Trash2
} from 'lucide-react'
import { ImageUpload } from '@/components/ui/image-upload'
import { ImageGallery } from '@/components/ui/image-gallery'
import { useToast } from '@/hooks/use-toast'

const imageFolders = [
  { name: 'hero', label: 'Hero Backgrounds', description: 'Background images for hero sections' },
  { name: 'gallery', label: 'Gallery Images', description: 'Images for gallery sections' },
  { name: 'testimonials', label: 'Testimonials', description: 'Profile images for testimonials' },
  { name: 'features', label: 'Feature Icons', description: 'Icons and images for feature sections' },
  { name: 'general', label: 'General Images', description: 'General purpose images' }
]

export default function ImagesPage() {
  const [activeFolder, setActiveFolder] = useState('hero')
  const { toast } = useToast()

  const handleUploadSuccess = () => {
    toast({
      title: 'Upload Successful',
      description: 'Image uploaded successfully.',
    })
  }

  const handleUploadError = (error: string) => {
    toast({
      title: 'Upload Failed',
      description: error,
      variant: 'destructive',
    })
  }

  const handleImageDelete = () => {
    toast({
      title: 'Image Deleted',
      description: 'Image has been deleted successfully.',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Image Management</h1>
        <p className="text-gray-600 mt-2">Upload and manage images for your landing pages</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Images</CardTitle>
            <ImageIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Across all folders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0 MB</div>
            <p className="text-xs text-muted-foreground">AWS S3 storage</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Upload className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Images uploaded</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Folders</CardTitle>
            <Folder className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{imageFolders.length}</div>
            <p className="text-xs text-muted-foreground">Organized folders</p>
          </CardContent>
        </Card>
      </div>

      {/* Folder Tabs */}
      <Tabs value={activeFolder} onValueChange={setActiveFolder} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          {imageFolders.map((folder) => (
            <TabsTrigger key={folder.name} value={folder.name} className="text-xs">
              {folder.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {imageFolders.map((folder) => (
          <TabsContent key={folder.name} value={folder.name} className="space-y-6">
            {/* Folder Header */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Folder className="h-5 w-5 mr-2" />
                      {folder.label}
                    </CardTitle>
                    <CardDescription>{folder.description}</CardDescription>
                  </div>
                  <Badge variant="outline">{folder.name}</Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Upload and Gallery */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upload Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Upload className="h-5 w-5 mr-2" />
                    Upload Images
                  </CardTitle>
                  <CardDescription>
                    Upload new images to the {folder.label.toLowerCase()} folder
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ImageUpload
                    onUploadSuccess={handleUploadSuccess}
                    onUploadError={handleUploadError}
                    folder={folder.name}
                    maxFiles={10}
                    className="w-full"
                  />
                </CardContent>
              </Card>

              {/* Gallery Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ImageIcon className="h-5 w-5 mr-2" />
                    Manage Images
                  </CardTitle>
                  <CardDescription>
                    View, organize, and delete images in this folder
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ImageGallery
                    folder={folder.name}
                    onImageDelete={handleImageDelete}
                    className="w-full"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common image management tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <Upload className="h-5 w-5 mb-2" />
              <span className="font-medium">Bulk Upload</span>
              <span className="text-sm text-muted-foreground">Upload multiple images at once</span>
            </Button>

            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <Trash2 className="h-5 w-5 mb-2" />
              <span className="font-medium">Clean Up</span>
              <span className="text-sm text-muted-foreground">Remove unused images</span>
            </Button>

            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <BarChart3 className="h-5 w-5 mb-2" />
              <span className="font-medium">Storage Report</span>
              <span className="text-sm text-muted-foreground">View storage usage details</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
