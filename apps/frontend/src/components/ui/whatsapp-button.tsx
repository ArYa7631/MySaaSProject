'use client'

import { MessageCircle } from 'lucide-react'
import { MarketplaceConfiguration } from '@mysaasproject/shared'

interface WhatsAppButtonProps {
  config?: MarketplaceConfiguration | null
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ config }) => {
  // Only show if WhatsApp is enabled and number is provided
  if (!config?.whatsapp_number || !config?.enable_whatsapp_bot) {
    return null
  }

  const handleWhatsAppClick = () => {
    // Clean the phone number (remove any non-digit characters)
    const cleanNumber = config.whatsapp_number.replace(/[^\d]/g, '')
    const whatsappUrl = `https://wa.me/${cleanNumber}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
      style={{
        backgroundColor: '#25D366',
        color: '#ffffff'
      }}
      title="Chat with us on WhatsApp"
      aria-label="Open WhatsApp chat"
    >
      <MessageCircle className="h-7 w-7" />
      
      {/* Pulse animation */}
      <div 
        className="absolute inset-0 rounded-full animate-ping"
        style={{ backgroundColor: '#25D366' }}
      />
      
      {/* Tooltip */}
      <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
        Chat with us on WhatsApp
        <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
      </div>
    </button>
  )
}
