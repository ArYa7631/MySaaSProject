'use client'

import { WhatsAppButton } from '@/components/ui/whatsapp-button'
import { useCommunityContext } from '@/hooks/use-community-context'

export const GlobalWhatsAppButton: React.FC = () => {
  const { community } = useCommunityContext()
  const marketplaceConfig = community?.marketplace_configuration || null

  return <WhatsAppButton config={marketplaceConfig} />
}

