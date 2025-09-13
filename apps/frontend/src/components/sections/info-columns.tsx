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
    <section className="py-12 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            {title}
          </h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {columns.map((column, index) => (
            <div key={index} className="text-center">
              {column.icon && (
                <div className="mx-auto h-12 w-12 mb-4 flex items-center justify-center rounded-full bg-primary/10">
                  <span className="text-2xl">{column.icon}</span>
                </div>
              )}
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                {column.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {column.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
