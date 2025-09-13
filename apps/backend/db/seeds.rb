# Clear existing data
puts "Clearing existing data..."
Community.destroy_all
User.destroy_all
MarketplaceConfiguration.destroy_all
LandingPage.destroy_all
Topbar.destroy_all
Footer.destroy_all
ContentPage.destroy_all
Contact.destroy_all
CommunityTranslation.destroy_all

# Clear JWT denylist separately to avoid user_id issue
JwtDenylist.delete_all if defined?(JwtDenylist)

puts "Creating Localhost Development Community..."
# Create Localhost Community for Development
localhost_community = Community.create!(
  uuid: "localhost-dev",
  ident: "Arya Software Tech - Development",
  domain: "localhost",
  use_domain: true,
  is_enabled: true,
  locale: "en",
  currency: "INR",
  country: "India",
  ip_address: "127.0.0.1",
  person_id: "localhost-dev"
)

puts "Creating Production Community..."
# Create Production Community
production_community = Community.create!(
  uuid: "lShUq",
  ident: "Nitesh Arya",
  domain: "www.aryasoftwaretech.com",
  use_domain: true,
  is_enabled: true,
  locale: "en",
  currency: "INR",
  country: "India",
  ip_address: "127.0.0.1",
  person_id: "jAbt5"
)

puts "Creating Users..."
# Create Users for both communities
localhost_user = User.create!(
  email: "admin@localhost.com",
  password: "password123",
  password_confirmation: "password123",
  first_name: "Admin",
  last_name: "User",
  phone_number: "+917631286357",
  locale: "en",
  community: localhost_community
)

production_user = User.create!(
  email: "aryasoftwaretech@gmail.com",
  password: "password123",
  password_confirmation: "password123",
  first_name: "Nitesh",
  last_name: "Arya",
  phone_number: "+917631286357",
  locale: "en",
  community: production_community
)

puts "Creating Marketplace Configurations..."
# Create Marketplace Configuration for Localhost
localhost_marketplace_config = MarketplaceConfiguration.create!(
  community: localhost_community,
  global_text_color: "#ffffff",
  global_bg_color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  global_highlight_color: "#4f46e5",
  available_locale: "english",
  available_currency: "INR",
  is_enabled: true,
  is_super_admin: false,
  logo: "https://s3.ap-southeast-2.amazonaws.com/aryasoftwaretech.test.bucket/images/my_own_file/arya_software_tech_logo.webp",
  profile_logo: "https://s3.ap-southeast-2.amazonaws.com/aryasoftwaretech.test.bucket/images/my_own_file/arya_software_tech_logo.webp",
  favicon: "https://aryasoftwaretech.com/_next/image?url=%2Fimages%2Farya_software_tech.png&w=96&q=75",
  title: "Arya Software Tech",
  title_color: "#ffffff",
  notification: "🚀 Welcome to our development environment!",
  copyright: "© 2025 Arya Software Tech. All rights reserved. Custom website development and digital solutions from India.",
  whatsapp_number: "7631286357",
  enable_whatsapp_bot: true,
  facebook_url: "https://www.facebook.com/nitesh.arya.39904",
  instagram_url: "https://www.instagram.com/nitesharyatech/",
  twitter_url: "",
  github_url: "https://github.com/nitesharya",
  skype_url: "",
  cookie_text: "We use cookies to enhance your experience on our website. By continuing to browse, you agree to our use of cookies."
)

# Create Marketplace Configuration for Production
production_marketplace_config = MarketplaceConfiguration.create!(
  community: production_community,
  global_text_color: "#ffffff",
  global_bg_color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  global_highlight_color: "#4f46e5",
  available_locale: "english",
  available_currency: "INR",
  is_enabled: true,
  is_super_admin: false,
  logo: "https://s3.ap-southeast-2.amazonaws.com/aryasoftwaretech.test.bucket/images/my_own_file/arya_software_tech_logo.webp",
  profile_logo: "https://s3.ap-southeast-2.amazonaws.com/aryasoftwaretech.test.bucket/images/my_own_file/arya_software_tech_logo.webp",
  favicon: "https://aryasoftwaretech.com/_next/image?url=%2Fimages%2Farya_software_tech.png&w=96&q=75",
  title: "Arya Software Tech",
  title_color: "#ffffff",
  notification: "",
  copyright: "© 2025 Arya Software Tech. All rights reserved. Custom website development and digital solutions from India.",
  whatsapp_number: "7631286357",
  enable_whatsapp_bot: true,
  facebook_url: "https://www.facebook.com/nitesh.arya.39904",
  instagram_url: "https://www.instagram.com/nitesharyatech/",
  twitter_url: "",
  github_url: "https://github.com/nitesharya",
  skype_url: "",
  cookie_text: "We use cookies to enhance your experience on our website. By continuing to browse, you agree to our use of cookies."
)

puts "Creating Beautiful Landing Pages..."

# Create Beautiful Landing Page for Localhost
localhost_landing_page = LandingPage.create!(
  community: localhost_community,
  meta_data: {
    "title" => "Arya Software Tech - Custom Web Development",
    "description" => "Professional web development services, custom applications, and digital solutions. Transform your ideas into reality with modern technology."
  },
  content: [
    {
      "id" => "hero-section",
      "name" => "Hero Section",
      "type" => "Jumbotron",
      "content" => {
        "title" => "Arya Software Tech",
        "subtitle" => "Custom Web Development & Digital Solutions",
        "description" => "We craft scalable web applications, modern websites, and digital solutions tailored to your business needs. From concept to deployment, we bring your ideas to life.",
        "primaryButton" => {
          "url" => "/contact",
          "text" => "Get Started"
        },
        "secondaryButton" => {
          "url" => "/portfolio",
          "text" => "View Portfolio"
        }
      },
      "description" => "Main hero section with call-to-action buttons"
    },
    {
      "id" => "services-section",
      "name" => "Our Services",
      "type" => "InfoColumns",
      "content" => {
        "title" => "What We Offer",
        "subtitle" => "Comprehensive Digital Solutions",
        "columns" => [
          {
            "title" => "Web Development",
            "description" => "Custom websites and web applications built with modern technologies like React, Next.js, and Ruby on Rails.",
            "icon" => "🌐"
          },
          {
            "title" => "Mobile Apps",
            "description" => "Cross-platform mobile applications using React Native for iOS and Android.",
            "icon" => "📱"
          },
          {
            "title" => "E-commerce Solutions",
            "description" => "Online stores with secure payment integrations and inventory management systems.",
            "icon" => "🛒"
          },
          {
            "title" => "Technical Consulting",
            "description" => "Architecture guidance, code reviews, and technical strategy for your projects.",
            "icon" => "💡"
          }
        ]
      },
      "description" => "Services overview with icons and descriptions"
    },
    {
      "id" => "portfolio-gallery",
      "name" => "Portfolio Gallery",
      "type" => "Gallery",
      "content" => {
        "title" => "Our Work",
        "subtitle" => "Recent Projects & Achievements",
        "imageUrl" => [
          {
            "url" => "https://s3.ap-southeast-2.amazonaws.com/aryasoftwaretech.test.bucket/images/my_own_file/problem%20solving%20basic.png",
            "title" => "Problem Solving Skills",
            "description" => "Advanced algorithmic thinking and problem-solving capabilities"
          },
          {
            "url" => "https://s3.ap-southeast-2.amazonaws.com/aryasoftwaretech.test.bucket/images/my_own_file/udemyc.jpg",
            "title" => "Udemy Certification",
            "description" => "Professional development and continuous learning"
          },
          {
            "url" => "https://s3.ap-southeast-2.amazonaws.com/aryasoftwaretech.test.bucket/images/my_own_file/typescript.jpg",
            "title" => "TypeScript Expertise",
            "description" => "Type-safe development with modern JavaScript"
          },
          {
            "url" => "https://s3.ap-southeast-2.amazonaws.com/aryasoftwaretech.test.bucket/images/my_own_file/react%20basic.png",
            "title" => "React Development",
            "description" => "Building interactive user interfaces"
          },
          {
            "url" => "https://s3.ap-southeast-2.amazonaws.com/aryasoftwaretech.test.bucket/images/my_own_file/javascript%20basic.png",
            "title" => "JavaScript Mastery",
            "description" => "Core programming fundamentals"
          },
          {
            "url" => "https://s3.ap-southeast-2.amazonaws.com/aryasoftwaretech.test.bucket/images/my_own_file/javascript%20intermedite.png",
            "title" => "Advanced JavaScript",
            "description" => "Complex applications and frameworks"
          }
        ]
      },
      "description" => "Portfolio showcase with project images"
    },
    {
      "id" => "about-section",
      "name" => "About Nitesh",
      "type" => "ImgDescription",
      "content" => {
        "header" => "Meet Nitesh Arya",
        "imageURL" => "https://s3.ap-southeast-2.amazonaws.com/aryasoftwaretech.test.bucket/images/my_own_file/IMG-20250430-WA0041.jpg",
        "buttonURL" => "https://leetcode.com/u/niteshcoder/",
        "buttonLabel" => "View LeetCode Profile",
        "description" => "Highly motivated Full-Stack Developer with over 5 years of experience specializing in React.js, Next.js, and Ruby on Rails. Proven track record in building scalable SaaS applications, optimizing performance, and integrating secure payment solutions. Passionate about problem-solving, automation, and delivering high-quality software solutions that drive business growth."
      },
      "description" => "Personal profile and professional background"
    },
    {
      "id" => "testimonials-section",
      "name" => "Client Testimonials",
      "type" => "InfoColumns",
      "content" => {
        "title" => "What Clients Say",
        "subtitle" => "Trusted by Businesses Worldwide",
        "columns" => [
          {
            "title" => "John Doe",
            "description" => "\"Exceptional work! Nitesh delivered our e-commerce platform ahead of schedule with outstanding quality.\"",
            "icon" => "⭐"
          },
          {
            "title" => "Jane Smith",
            "description" => "\"Professional, reliable, and technically excellent. Highly recommend for any web development project.\"",
            "icon" => "⭐"
          },
          {
            "title" => "Tech Startup",
            "description" => "\"The mobile app he built for us has been a game-changer for our business growth.\"",
            "icon" => "⭐"
          }
        ]
      },
      "description" => "Client testimonials and reviews"
    },
    {
      "id" => "contact-section",
      "name" => "Get In Touch",
      "type" => "Jumbotron",
      "content" => {
        "title" => "Ready to Start Your Project?",
        "subtitle" => "Let's Build Something Amazing Together",
        "description" => "Have an idea for a website, mobile app, or digital solution? I'd love to hear about your project and discuss how we can bring it to life.",
        "primaryButton" => {
          "url" => "https://wa.me/917631286357",
          "text" => "WhatsApp Me"
        },
        "secondaryButton" => {
          "url" => "mailto:aryasoftwaretech@gmail.com",
          "text" => "Send Email"
        }
      },
      "description" => "Contact section with call-to-action"
    }
  ]
)

# Create Landing Page for Production (same content)
production_landing_page = LandingPage.create!(
  community: production_community,
  meta_data: {
    "title" => "Arya Software Tech - Custom Web Development",
    "description" => "Professional web development services, custom applications, and digital solutions. Transform your ideas into reality with modern technology."
  },
  content: localhost_landing_page.content
)

puts "Creating Navigation & Footer..."

# Create Topbar for Localhost
localhost_topbar = Topbar.create!(
  community: localhost_community,
  is_multilingual: false,
  navigation: [
    {
      "linkHref" => "/",
      "linkTitle" => "Home"
    },
    {
      "linkHref" => "/services",
      "linkTitle" => "Services"
    },
    {
      "linkHref" => "/portfolio",
      "linkTitle" => "Portfolio"
    },
    {
      "linkHref" => "/about",
      "linkTitle" => "About"
    }
  ],
  profile: [
    {
      "linkHref" => "/admin",
      "linkTitle" => "Admin"
    }
  ]
)

# Create Topbar for Production
production_topbar = Topbar.create!(
  community: production_community,
  is_multilingual: false,
  navigation: [
    {
      "linkHref" => "https://aryasoftwaretech.com/",
      "linkTitle" => "Home"
    },
    {
      "linkHref" => "/content/service",
      "linkTitle" => "Services"
    },
    {
      "linkHref" => "/portfolio",
      "linkTitle" => "Portfolio"
    },
    {
      "linkHref" => "/about",
      "linkTitle" => "About"
    }
  ],
  profile: [
    {
      "linkHref" => "/content/nitesh-profile",
      "linkTitle" => "Profile"
    }
  ]
)

# Create Footer for Localhost
localhost_footer = Footer.create!(
  community: localhost_community,
  sections: [
    {
      "label" => "Services",
      "links" => [
        {
          "name" => "Web Development",
          "link" => "/services#web-development"
        },
        {
          "name" => "Mobile Apps",
          "link" => "/services#mobile-apps"
        },
        {
          "name" => "E-commerce",
          "link" => "/services#ecommerce"
        }
      ]
    },
    {
      "label" => "Connect",
      "links" => [
        {
          "name" => "LinkedIn",
          "link" => "https://www.linkedin.com/in/nitesh-arya-619a81179/"
        },
        {
          "name" => "GitHub",
          "link" => "https://github.com/nitesharya"
        },
        {
          "name" => "LeetCode",
          "link" => "https://leetcode.com/u/niteshcoder/"
        }
      ]
    },
    {
      "label" => "Contact",
      "links" => [
        {
          "name" => "WhatsApp",
          "link" => "https://wa.me/917631286357"
        },
        {
          "name" => "Email",
          "link" => "mailto:aryasoftwaretech@gmail.com"
        }
      ]
    }
  ]
)

# Create Footer for Production
production_footer = Footer.create!(
  community: production_community,
  sections: [
    {
      "label" => "Resources",
      "links" => [
        {
          "name" => "LinkedIn",
          "link" => "https://www.linkedin.com/in/nitesh-arya-619a81179/"
        },
        {
          "name" => "GitHub",
          "link" => "https://github.com/nitesharya"
        }
      ]
    },
    {
      "label" => "Follow Us",
      "links" => [
        {
          "name" => "LinkedIn",
          "link" => "https://www.linkedin.com/in/nitesh-arya-619a81179/"
        },
        {
          "name" => "Instagram",
          "link" => "https://www.instagram.com/nitesharyatech/"
        }
      ]
    },
    {
      "label" => "Legal",
      "links" => []
    }
  ]
)

puts "Creating Content Pages..."

# Create Content Pages for Localhost
localhost_content_pages = [
  {
    title: "Home",
    end_point: "/content/home",
    data: {"sections" => []},
    meta_data: {"title" => "Home", "description" => "Welcome to Arya Software Tech"},
    is_active: true
  },
  {
    title: "Services",
    end_point: "/content/services",
    data: [
      {
        "id" => "services-overview",
        "name" => "Services Overview",
        "type" => "InfoColumns",
        "content" => {
          "title" => "Our Services",
          "subtitle" => "Comprehensive Digital Solutions",
          "columns" => [
            {
              "title" => "Web Development",
              "description" => "Custom websites and web applications built with modern technologies.",
              "icon" => "🌐"
            },
            {
              "title" => "Mobile Development",
              "description" => "Cross-platform mobile applications for iOS and Android.",
              "icon" => "📱"
            },
            {
              "title" => "E-commerce Solutions",
              "description" => "Online stores with secure payment integrations.",
              "icon" => "🛒"
            },
            {
              "title" => "Technical Consulting",
              "description" => "Architecture guidance and technical strategy.",
              "icon" => "💡"
            }
          ]
        }
      }
    ],
    meta_data: {"title" => "Services", "description" => "Our comprehensive digital solutions"},
    is_active: true
  },
  {
    title: "Portfolio",
    end_point: "/content/portfolio",
    data: [
      {
        "id" => "portfolio-gallery",
        "name" => "Portfolio Gallery",
        "type" => "Gallery",
        "content" => {
          "title" => "Our Work",
          "subtitle" => "Recent Projects & Achievements",
          "imageUrl" => [
            {
              "url" => "https://s3.ap-southeast-2.amazonaws.com/aryasoftwaretech.test.bucket/images/my_own_file/problem%20solving%20basic.png",
              "title" => "Problem Solving",
              "description" => "Advanced algorithmic thinking"
            },
            {
              "url" => "https://s3.ap-southeast-2.amazonaws.com/aryasoftwaretech.test.bucket/images/my_own_file/typescript.jpg",
              "title" => "TypeScript",
              "description" => "Type-safe development"
            }
          ]
        }
      }
    ],
    meta_data: {"title" => "Portfolio", "description" => "Our recent projects and achievements"},
    is_active: true
  }
]

localhost_content_pages.each do |page_data|
  ContentPage.create!(
    community: localhost_community,
    title: page_data[:title],
    end_point: page_data[:end_point],
    data: page_data[:data],
    meta_data: page_data[:meta_data],
    is_active: page_data[:is_active]
  )
end

# Create Content Pages for Production
production_content_pages = [
  {
    title: "Home",
    end_point: "/content/home",
    data: {"sections" => []},
    meta_data: {"title" => "Home", "description" => "Welcome to our home page"},
    is_active: true
  },
  {
    title: "Services",
    end_point: "/content/service",
    data: [
      {
        "id" => "2CRDb",
        "name" => "Gallery",
        "Gallery" => {
          "imageUrl" => [
            {
              "url" => "https://s3.ap-southeast-2.amazonaws.com/aryasoftwaretech.test.bucket/images/my_own_file/Screenshot%202024-08-24%20at%209.21.41%E2%80%AFPM.png"
            }
          ]
        },
        "description" => "Image gallery for products"
      }
    ],
    meta_data: {"title" => "Services", "description" => "Our services page"},
    is_active: true
  },
  {
    title: "Profile",
    end_point: "/content/nitesh-profile",
    data: [
      {
        "id" => "ALzvz",
        "name" => "CustomEditor",
        "description" => "Rich text editor section",
        "CustomEditor" => {
          "editorData" => {
            "time" => 1752388471865,
            "blocks" => [
              {
                "id" => "hgxYrPVY6H",
                "data" => {
                  "text" => "Nitesh Arya - Full Stack Developer"
                },
                "type" => "paragraph"
              }
            ],
            "version" => "2.28.0"
          }
        }
      }
    ],
    meta_data: {"title" => "Profile", "description" => "Nitesh Arya's profile page"},
    is_active: true
  }
]

production_content_pages.each do |page_data|
  ContentPage.create!(
    community: production_community,
    title: page_data[:title],
    end_point: page_data[:end_point],
    data: page_data[:data],
    meta_data: page_data[:meta_data],
    is_active: page_data[:is_active]
  )
end

puts "Creating Sample Contacts..."

# Create Sample Contacts for both communities
contacts_data = [
  {
    name: "John Doe",
    email: "john@example.com",
    contact_number: "+1234567890",
    message: "Interested in your web development services"
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    contact_number: "+0987654321",
    message: "Looking for a custom e-commerce solution"
  },
  {
    name: "Tech Startup",
    email: "startup@example.com",
    contact_number: "+1122334455",
    message: "Need a mobile app for our business"
  }
]

contacts_data.each do |contact_data|
  Contact.create!(
    community: localhost_community,
    name: contact_data[:name],
    email: contact_data[:email],
    contact_number: contact_data[:contact_number],
    message: contact_data[:message]
  )
  
  Contact.create!(
    community: production_community,
    name: contact_data[:name],
    email: contact_data[:email],
    contact_number: contact_data[:contact_number],
    message: contact_data[:message]
  )
end

puts "Creating Translations..."

# Create Translations for both communities
translations_data = [
  {
    locale: "en",
    translation_key: "welcome_message",
    translation: "Welcome to Arya Software Tech"
  },
  {
    locale: "en",
    translation_key: "services_title",
    translation: "Our Services"
  },
  {
    locale: "en",
    translation_key: "contact_us",
    translation: "Contact Us"
  },
  {
    locale: "en",
    translation_key: "get_started",
    translation: "Get Started"
  },
  {
    locale: "en",
    translation_key: "view_portfolio",
    translation: "View Portfolio"
  }
]

translations_data.each do |translation_data|
  CommunityTranslation.create!(
    community: localhost_community,
    locale: translation_data[:locale],
    translation_key: translation_data[:translation_key],
    translation: translation_data[:translation]
  )
  
  CommunityTranslation.create!(
    community: production_community,
    locale: translation_data[:locale],
    translation_key: translation_data[:translation_key],
    translation: translation_data[:translation]
  )
end

puts "✅ Seed data created successfully!"
puts ""
puts "🌐 LOCALHOST COMMUNITY (Development):"
puts "   Community ID: #{localhost_community.id}"
puts "   Domain: localhost"
puts "   User Email: admin@localhost.com"
puts "   Password: password123"
puts ""
puts "🚀 PRODUCTION COMMUNITY:"
puts "   Community ID: #{production_community.id}"
puts "   Domain: www.aryasoftwaretech.com"
puts "   User Email: aryasoftwaretech@gmail.com"
puts "   Password: password123"
puts ""
puts "📱 Access URLs:"
puts "   Frontend: http://localhost:3000"
puts "   Backend API: http://localhost:3001"
puts "   Admin Dashboard: http://localhost:3000/admin"
puts ""
puts "🎨 Beautiful Landing Page Features:"
puts "   ✅ Hero Section with Call-to-Action"
puts "   ✅ Services Overview with Icons"
puts "   ✅ Portfolio Gallery"
puts "   ✅ About Section with Profile"
puts "   ✅ Client Testimonials"
puts "   ✅ Contact Section"
puts "   ✅ Professional Navigation & Footer"