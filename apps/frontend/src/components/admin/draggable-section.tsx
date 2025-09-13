'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, GripVertical } from 'lucide-react'
import { LandingPageSection } from '@mysaasproject/shared'

interface DraggableSectionProps {
  section: LandingPageSection
  index: number
  onEdit: (section: LandingPageSection) => void
  onDelete: (sectionId: string) => void
}

export function DraggableSection({ section, index, onEdit, onDelete }: DraggableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <Card 
      ref={setNodeRef} 
      style={style} 
      className={`hover:shadow-md transition-shadow ${isDragging ? 'shadow-lg' : ''}`}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
            >
              <GripVertical className="h-4 w-4 text-gray-400" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                {index + 1}
              </div>
              <div>
                <CardTitle className="text-lg">{section.name}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onEdit(section)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-red-600 hover:text-red-700"
              onClick={() => onDelete(section.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-sm text-gray-600">
            <strong>Type:</strong> {section.type}
          </div>
          <div className="text-sm text-gray-600">
            <strong>ID:</strong> {section.id}
          </div>
          {section.content && Object.keys(section.content).length > 0 && (
            <div className="text-sm text-gray-600">
              <strong>Content:</strong> {Object.keys(section.content).length} fields
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
