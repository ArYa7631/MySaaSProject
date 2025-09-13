'use client'

interface Stat {
  number?: string
  label?: string
  description?: string
}

interface StatsSectionProps {
  title?: string
  description?: string
  stats?: Stat[]
}

export const StatsSection: React.FC<StatsSectionProps> = ({
  title,
  description,
  stats = []
}) => {
  return (
    <div className="py-16 px-8 bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto">
        {title && (
          <h2 className="text-3xl font-bold text-center mb-4">{title}</h2>
        )}
        {description && (
          <p className="text-xl text-gray-300 text-center mb-12">{description}</p>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              {stat.number && (
                <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">
                  {stat.number}
                </div>
              )}
              {stat.label && (
                <div className="text-xl font-semibold mb-2 text-white">
                  {stat.label}
                </div>
              )}
              {stat.description && (
                <div className="text-gray-300 text-sm">
                  {stat.description}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {stats.length === 0 && (
          <div className="text-center text-gray-400">
            <p>No statistics to display</p>
          </div>
        )}
      </div>
    </div>
  )
}
