'use client'

interface InfoColumn {
  title: string
  description: string
  icon?: string
}

interface InfoColumnsProps {
  id: string
  title?: string
  columns: InfoColumn[]
}

export const InfoColumns: React.FC<InfoColumnsProps> = ({
  title,
  columns,
}) => {
  return (
    <section className="py-16 bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {title}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {columns.map((column, index) => (
            <div 
              key={index} 
              className="group text-center p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
            >
              {column.icon && (
                <div className="mx-auto h-16 w-16 mb-6 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">{column.icon}</span>
                </div>
              )}
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                {column.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {column.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
