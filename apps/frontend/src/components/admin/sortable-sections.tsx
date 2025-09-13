'use client'

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { DraggableSection } from './draggable-section'
import { LandingPageSection } from '@mysaasproject/shared'

interface SortableSectionsProps {
  sections: LandingPageSection[]
  onReorder: (newOrder: string[]) => void
  onEdit: (section: LandingPageSection) => void
  onDelete: (sectionId: string) => void
}

export function SortableSections({ sections, onReorder, onEdit, onDelete }: SortableSectionsProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = sections.findIndex(section => section.id === active.id)
      const newIndex = sections.findIndex(section => section.id === over?.id)

      const newOrder = arrayMove(sections, oldIndex, newIndex).map(section => section.id)
      onReorder(newOrder)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={sections.map(section => section.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-4">
          {sections.map((section, index) => (
            <DraggableSection
              key={section.id}
              section={section}
              index={index}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
