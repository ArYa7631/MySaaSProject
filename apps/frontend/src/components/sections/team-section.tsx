'use client'

interface TeamMember {
  name?: string
  role?: string
  bio?: string
  imageUrl?: string
}

interface TeamSectionProps {
  title?: string
  description?: string
  members?: TeamMember[]
}

export const TeamSection: React.FC<TeamSectionProps> = ({
  title,
  description,
  members = []
}) => {
  return (
    <div className="py-16 px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {title && (
          <h2 className="text-3xl font-bold text-center mb-4">{title}</h2>
        )}
        {description && (
          <p className="text-xl text-gray-600 text-center mb-12">{description}</p>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((member, index) => (
            <div key={index} className="text-center group">
              <div className="relative mb-6">
                {member.imageUrl ? (
                  <img
                    src={member.imageUrl}
                    alt={member.name || `Team member ${index + 1}`}
                    className="w-48 h-48 mx-auto rounded-full object-cover shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                  />
                ) : (
                  <div className="w-48 h-48 mx-auto rounded-full bg-gray-200 flex items-center justify-center shadow-lg">
                    <div className="text-gray-400 text-4xl">👤</div>
                  </div>
                )}
              </div>
              
              {member.name && (
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {member.name}
                </h3>
              )}
              
              {member.role && (
                <p className="text-blue-600 font-medium mb-3">
                  {member.role}
                </p>
              )}
              
              {member.bio && (
                <p className="text-gray-600 text-sm leading-relaxed">
                  {member.bio}
                </p>
              )}
            </div>
          ))}
        </div>
        
        {members.length === 0 && (
          <div className="text-center text-gray-500">
            <p>No team members to display</p>
          </div>
        )}
      </div>
    </div>
  )
}
