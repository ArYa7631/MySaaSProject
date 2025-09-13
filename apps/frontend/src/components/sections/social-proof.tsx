'use client'

interface SocialProofItem {
  type?: string
  title?: string
  description?: string
  imageUrl?: string
}

interface SocialProofProps {
  title?: string
  description?: string
  items?: SocialProofItem[]
}

export const SocialProof: React.FC<SocialProofProps> = ({
  title,
  description,
  items = []
}) => {
  const renderItem = (item: SocialProofItem, index: number) => {
    switch (item.type) {
      case 'logo':
        return (
          <div key={index} className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.title || `Logo ${index + 1}`}
                className="h-16 w-auto object-contain mb-4 grayscale hover:grayscale-0 transition-all duration-300"
              />
            ) : (
              <div className="h-16 w-32 bg-gray-200 rounded flex items-center justify-center mb-4">
                <span className="text-gray-500 text-sm">{item.title}</span>
              </div>
            )}
            {item.description && (
              <p className="text-sm text-gray-600 text-center">{item.description}</p>
            )}
          </div>
        )
      
      case 'badge':
        return (
          <div key={index} className="flex flex-col items-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.title || `Badge ${index + 1}`}
                className="h-20 w-auto object-contain mb-4"
              />
            ) : (
              <div className="h-20 w-20 bg-yellow-400 rounded-full flex items-center justify-center mb-4">
                <span className="text-white font-bold text-lg">🏆</span>
              </div>
            )}
            {item.title && (
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
            )}
            {item.description && (
              <p className="text-sm text-gray-600 text-center">{item.description}</p>
            )}
          </div>
        )
      
      case 'testimonial':
        return (
          <div key={index} className="flex flex-col items-center p-6 bg-blue-50 rounded-lg border border-blue-200">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.title || `Rating ${index + 1}`}
                className="h-16 w-auto object-contain mb-4"
              />
            ) : (
              <div className="text-4xl mb-4">⭐</div>
            )}
            {item.title && (
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
            )}
            {item.description && (
              <p className="text-sm text-gray-600 text-center">{item.description}</p>
            )}
          </div>
        )
      
      default:
        return (
          <div key={index} className="flex flex-col items-center p-6 bg-gray-50 rounded-lg border border-gray-200">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.title || `Item ${index + 1}`}
                className="h-16 w-auto object-contain mb-4"
              />
            ) : (
              <div className="h-16 w-16 bg-gray-300 rounded-full flex items-center justify-center mb-4">
                <span className="text-gray-600">📊</span>
              </div>
            )}
            {item.title && (
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
            )}
            {item.description && (
              <p className="text-sm text-gray-600 text-center">{item.description}</p>
            )}
          </div>
        )
    }
  }

  return (
    <div className="py-16 px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {title && (
          <h2 className="text-3xl font-bold text-center mb-4">{title}</h2>
        )}
        {description && (
          <p className="text-xl text-gray-600 text-center mb-12">{description}</p>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, index) => renderItem(item, index))}
        </div>
        
        {items.length === 0 && (
          <div className="text-center text-gray-500">
            <p>No social proof items to display</p>
          </div>
        )}
      </div>
    </div>
  )
}
