# Create a default user for testing
User.create!(
  email: 'admin@example.com',
  password: 'password123',
  password_confirmation: 'password123'
)

puts "Created default user: admin@example.com / password123"


