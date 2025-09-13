import { Suspense } from 'react'
import { LandingPageContent } from '@/components/landing/landing-page-content'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function LandingPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LandingPageContent />
    </Suspense>
  )
}
