'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface FAQ {
  question?: string
  answer?: string
}

interface FAQSectionProps {
  title?: string
  description?: string
  faqs?: FAQ[]
}

export const FAQSection: React.FC<FAQSectionProps> = ({
  title,
  description,
  faqs = []
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
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
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                <span className="font-semibold text-gray-900 pr-4">
                  {faq.question || `Question ${index + 1}`}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              
              {openIndex === index && faq.answer && (
                <div className="px-6 pb-4">
                  <div className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {faqs.length === 0 && (
          <div className="text-center text-gray-500">
            <p>No FAQs to display</p>
          </div>
        )}
      </div>
    </div>
  )
}
