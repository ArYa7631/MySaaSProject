import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-gray-200 dark:bg-gray-700',
        className
      )}
    />
  )
}

interface SectionSkeletonProps {
  type?: 'hero' | 'jumbotron' | 'gallery' | 'info-columns' | 'contact-form' | 'testimonials' | 'features' | 'pricing' | 'img-description'
}

export const SectionSkeleton: React.FC<SectionSkeletonProps> = ({ type = 'hero' }) => {
  switch (type) {
    case 'hero':
      return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <Skeleton className="absolute inset-0" />
          <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <Skeleton className="h-6 w-64 mx-auto mb-4" />
            <Skeleton className="h-16 w-96 mx-auto mb-6" />
            <Skeleton className="h-8 w-80 mx-auto mb-8" />
            <div className="flex justify-center gap-4">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-12 w-32" />
            </div>
          </div>
        </section>
      )
    
    case 'jumbotron':
      return (
        <section className="py-16">
          <div className="max-w-screen-xl mx-auto px-4 text-center">
            <Skeleton className="h-12 w-96 mx-auto mb-6" />
            <Skeleton className="h-6 w-80 mx-auto mb-10" />
            <div className="flex justify-center gap-4">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-12 w-32" />
            </div>
          </div>
        </section>
      )
    
    case 'gallery':
      return (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-8 w-48 mx-auto mb-12" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-2xl" />
              ))}
            </div>
          </div>
        </section>
      )
    
    case 'info-columns':
      return (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-8 w-48 mx-auto mb-16" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="text-center p-8">
                  <Skeleton className="h-16 w-16 mx-auto mb-6 rounded-full" />
                  <Skeleton className="h-6 w-32 mx-auto mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )
    
    case 'contact-form':
      return (
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Skeleton className="h-8 w-48 mx-auto mb-4" />
              <Skeleton className="h-6 w-80 mx-auto" />
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 md:p-12">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Skeleton className="h-12" />
                  <Skeleton className="h-12" />
                </div>
                <Skeleton className="h-32" />
                <Skeleton className="h-12 w-32 mx-auto" />
              </div>
            </div>
          </div>
        </section>
      )
    
    case 'testimonials':
      return (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Skeleton className="h-8 w-64 mx-auto mb-4" />
              <Skeleton className="h-6 w-80 mx-auto" />
            </div>
            <div className="max-w-4xl mx-auto">
              <Skeleton className="h-64 rounded-2xl" />
            </div>
          </div>
        </section>
      )
    
    case 'features':
      return (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Skeleton className="h-8 w-48 mx-auto mb-4" />
              <Skeleton className="h-6 w-80 mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="p-6 border rounded-lg">
                  <Skeleton className="h-12 w-12 mb-4" />
                  <Skeleton className="h-6 w-32 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )
    
    case 'pricing':
      return (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Skeleton className="h-8 w-64 mx-auto mb-4" />
              <Skeleton className="h-6 w-80 mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-8 border rounded-2xl">
                  <Skeleton className="h-6 w-32 mx-auto mb-4" />
                  <Skeleton className="h-8 w-24 mx-auto mb-6" />
                  <div className="space-y-3 mb-6">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Skeleton key={j} className="h-4 w-full" />
                    ))}
                  </div>
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )
    
    case 'img-description':
      return (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <Skeleton className="h-96 lg:h-[500px] rounded-2xl" />
              <div className="space-y-8">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-12 w-40" />
              </div>
            </div>
          </div>
        </section>
      )
    
    default:
      return (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        </section>
      )
  }
}

export const LandingPageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Navbar Skeleton */}
      <div className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <div className="flex space-x-4">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </div>

      {/* Sections Skeleton */}
      <SectionSkeleton type="hero" />
      <SectionSkeleton type="info-columns" />
      <SectionSkeleton type="gallery" />
      <SectionSkeleton type="img-description" />
      <SectionSkeleton type="testimonials" />
      <SectionSkeleton type="contact-form" />

      {/* Footer Skeleton */}
      <div className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-6 w-24" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-36" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
