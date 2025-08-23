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

puts "Creating Community..."
# Create Community
community = Community.create!(
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

puts "Creating User..."
# Create User
user = User.create!(
  email: "aryasoftwaretech@gmail.com",
  password: "password123",
  password_confirmation: "password123",
  first_name: "Nitesh",
  last_name: "Arya",
  phone_number: "+917631286357",
  locale: "en",
  community: community
)

puts "Creating Marketplace Configuration..."
# Create Marketplace Configuration
marketplace_config = MarketplaceConfiguration.create!(
  community: community,
  global_text_color: "#9fff5b",
  global_bg_color: "linear-gradient(to top left,#40E0D0,#FF8C00,#FF0080)",
  global_highlight_color: "#09203f",
  available_locale: "english",
  available_currency: "INR",
  is_enabled: true,
  is_super_admin: false,
  logo: "https://s3.ap-southeast-2.amazonaws.com/aryasoftwaretech.test.bucket/images/my_own_file/arya_software_tech_logo.webp",
  profile_logo: "https://s3.ap-southeast-2.amazonaws.com/aryasoftwaretech.test.bucket/images/my_own_file/arya_software_tech_logo.webp",
  favicon: "https://aryasoftwaretech.com/_next/image?url=%2Fimages%2Farya_software_tech.png&w=96&q=75",
  title: "Arya Software Tech",
  title_color: "#09203f",
  notification: "",
  copyright: "© 2025 Arya Software Tech. All rights reserved. Custom website development and digital solutions from India.",
  whatsapp_number: "7631286357",
  enable_whatsapp_bot: true,
  facebook_url: "https://www.facebook.com/nitesh.arya.39904",
  instagram_url: "https://www.instagram.com/nitesharyatech/?fbclid=IwY2xjawLgFvNleHRuA2FlbQIxMABicmlkETFidkFjaUlGb3NibEQ1dWZUAR7pafUQfi-3plv7TZQapRaLfBTwFkcFqxUBm0Ny4SYTG9v7Jj-e9Oo5LW6VYg_aem_8Rsx7lAY3wfmq0Q8s4nErA#",
  twitter_url: "",
  github_url: "",
  skype_url: "",
  cookie_text: "We use cookies to enhance your experience on our website. By continuing to browse, you agree to our use of cookies."
)

puts "Creating Landing Page..."
# Create Landing Page
landing_page = LandingPage.create!(
  community: community,
  meta_data: {
    "title" => "Welcome to www.aryasoftwaretech.com",
    "description" => "This is Description page of www.aryasoftwaretech.com"
  },
  content: [
    {
      "id" => "ttvMm",
      "name" => "Carousel",
      "Carousel" => {
        "legend" => "Arya Software Tech",
        "imageUrl" => [
          {
            "url" => "https://s3.ap-southeast-2.amazonaws.com/aryasoftwaretech.test.bucket/images/my_own_file/freepik__the-style-is-candid-image-photography-with-natural__88968.png"
          },
          {
            "url" => "https://s3.ap-southeast-2.amazonaws.com/aryasoftwaretech.test.bucket/images/my_own_file/freepik__the-style-is-candid-image-photography-with-natural__88967.png"
          },
          {
            "url" => "https://s3.ap-southeast-2.amazonaws.com/aryasoftwaretech.test.bucket/images/my_own_file/freepik__the-style-is-candid-image-photography-with-natural__88966.png"
          }
        ]
      },
      "description" => "A scrolling image display"
    },
    {
      "id" => "6TnxC",
      "name" => "Jumbotron",
      "Jumbotron" => {
        "title" => "Arya Software Tech",
        "description" => "We craft custom websites, smart integrations, and scalable digital solutions tailored to your business.",
        "buttonLabels" => {
          "learn" => "Learn More",
          "start" => "Get Started",
          "learnURL" => "http://google.com",
          "startURL" => "http://google.com"
        }
      },
      "description" => "A large header section"
    },
    {
      "id" => "SCraa",
      "name" => "Video",
      "Video" => {
        "videoURL" => "https://www.youtube.com/watch?v=ZYut4tT93p0&list=RDWTD2cYcY7_k&start_radio=1"
      },
      "description" => "Single video display"
    },
    {
      "id" => "vdgal",
      "name" => "VideoGallery",
      "description" => "A gallery of videos.",
      "VideoGallery" => {
        "videoURL" => [
          {
            "url" => "https://www.youtube.com/watch?v=ZYut4tT93p0"
          },
          {
            "url" => "https://www.youtube.com/watch?v=r8ha8K_u9PY"
          },
          {
            "url" => "https://www.youtube.com/watch?v=YEoPQZ_V6i0"
          }
        ]
      }
    },
    {
      "id" => "1rWRS",
      "name" => "Gallery",
      "Gallery" => {
        "imageUrl" => [
          {
            "url" => "https://s3.ap-southeast-2.amazonaws.com/aryasoftwaretech.test.bucket/images/my_own_file/problem solving basic.png"
          },
          {
            "url" => "https://s3.ap-southeast-2.amazonaws.com/aryasoftwaretech.test.bucket/images/my_own_file/udemyc.jpg"
          },
          {
            "url" => "https://s3.ap-southeast-2.amazonaws.com/aryasoftwaretech.test.bucket/images/my_own_file/typescript.jpg"
          },
          {
            "url" => "https://s3.ap-southeast-2.amazonaws.com/aryasoftwaretech.test.bucket/images/my_own_file/react basic.png"
          },
          {
            "url" => "https://s3.ap-southeast-2.amazonaws.com/aryasoftwaretech.test.bucket/images/my_own_file/javascript basic.png"
          },
          {
            "url" => "https://s3.ap-southeast-2.amazonaws.com/aryasoftwaretech.test.bucket/images/my_own_file/javascript intermedite.png"
          }
        ]
      },
      "description" => "Image gallery for products"
    },
    {
      "id" => "D93uS",
      "name" => "ImgDescription",
      "description" => "Image with description",
      "ImgDescription" => {
        "header" => "Nitesh Arya",
        "imageURL" => "https://s3.ap-southeast-2.amazonaws.com/aryasoftwaretech.test.bucket/images/my_own_file/IMG-20250430-WA0041.jpg",
        "buttonURL" => "https://leetcode.com/u/niteshcoder/",
        "buttonLabel" => "Leetcode Profile",
        "description" => "Highly motivated Full-Stack Developer with over 5 years of experience specializing in React.js, Next.js, and Ruby on Rails. Proven track record in building scalable SaaS applications, optimizing performance, and integrating secure payment solutions. Passionate about problem-solving, automation, and delivering high-quality software solutions."
      }
    }
  ]
)

puts "Creating Topbar..."
# Create Topbar
topbar = Topbar.create!(
  community: community,
  is_multilingual: false,
  navigation: [
    {
      "linkHref" => "https://aryasoftwaretech.com/",
      "linkTitle" => "Home"
    },
    {
      "linkHref" => "/content/service",
      "linkTitle" => "Services"
    }
  ],
  profile: [
    {
      "linkHref" => "/content/nitesh-profile",
      "linkTitle" => "profiles"
    }
  ]
)

puts "Creating Footer..."
# Create Footer (using new dynamic structure)
footer = Footer.create!(
  community: community,
  sections: [
    {
      "label" => "Resources",
      "links" => [
        {
          "name" => "LinkedIn",
          "link" => "https://www.linkedin.com/in/nitesh-arya-619a81179/"
        }
      ]
    },
    {
      "label" => "Follow Us",
      "links" => [
        {
          "name" => "LinkedIn",
          "link" => "https://www.linkedin.com/in/nitesh-arya-619a81179/"
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
# Create Content Pages
content_pages = [
  {
    title: "Homes",
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
            },
            {
              "url" => "https://s3.ap-southeast-2.amazonaws.com/aryasoftwaretech.test.bucket/images/my_own_file/Screenshot%202024-08-24%20at%209.21.41%E2%80%AFPM.png"
            }
          ]
        },
        "description" => "Image gallery for products"
      },
      {
        "id" => "Ce6w7",
        "name" => "CustomEditor",
        "description" => "Rich text editor section",
        "CustomEditor" => {
          "editorData" => {
            "time" => 1751014246743,
            "blocks" => [
              {
                "id" => "Na149kSs4s",
                "data" => {
                  "text" => "dfadfs"
                },
                "type" => "paragraph"
              },
              {
                "id" => "he0lujY4Yy",
                "data" => {
                  "text" => "d"
                },
                "type" => "paragraph"
              },
              {
                "id" => "4Z964GHuRO",
                "data" => {
                  "text" => "sdf"
                },
                "type" => "paragraph"
              },
              {
                "id" => "tlF2vwu30K",
                "data" => {
                  "text" => "fs"
                },
                "type" => "paragraph"
              },
              {
                "id" => "73PpbEQi_F",
                "data" => {
                  "text" => "df"
                },
                "type" => "paragraph"
              },
              {
                "id" => "_VFwSCwZzM",
                "data" => {
                  "text" => "sf"
                },
                "type" => "paragraph"
              },
              {
                "id" => "XH9UnCKj3z",
                "data" => {
                  "text" => "ss"
                },
                "type" => "paragraph"
              }
            ],
            "version" => "2.28.0"
          }
        }
      }
    ],
    meta_data: {"title" => "Services", "description" => "Our services page"},
    is_active: true
  },
  {
    title: "profiles",
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
                  "text" => "cvdfdsafds"
                },
                "type" => "paragraph"
              },
              {
                "id" => "5CQJPzvN1Z",
                "data" => {
                  "text" => "dfsd"
                },
                "type" => "paragraph"
              },
              {
                "id" => "tlzpoL3ulP",
                "data" => {
                  "text" => "f"
                },
                "type" => "paragraph"
              },
              {
                "id" => "wMsIoZlfLW",
                "data" => {
                  "text" => "sdf"
                },
                "type" => "paragraph"
              },
              {
                "id" => "qq_0ihEscy",
                "data" => {
                  "text" => "fsd"
                },
                "type" => "paragraph"
              },
              {
                "id" => "7nnJ0DACVn",
                "data" => {
                  "text" => "f"
                },
                "type" => "paragraph"
              },
              {
                "id" => "gxT2ErdoU_",
                "data" => {
                  "text" => "sd"
                },
                "type" => "paragraph"
              },
              {
                "id" => "H4bjT9aPLf",
                "data" => {
                  "items" => [
                    {
                      "text" => "dfgdfg",
                      "checked" => true
                    },
                    {
                      "text" => "fgs",
                      "checked" => false
                    },
                    {
                      "text" => "dfgdsf",
                      "checked" => false
                    },
                    {
                      "text" => "gd",
                      "checked" => false
                    }
                  ]
                },
                "type" => "checkList"
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

content_pages.each do |page_data|
  ContentPage.create!(
    community: community,
    title: page_data[:title],
    end_point: page_data[:end_point],
    data: page_data[:data],
    meta_data: page_data[:meta_data],
    is_active: page_data[:is_active]
  )
end

puts "Creating Sample Contacts..."
# Create Sample Contacts
contacts = [
  {
    name: "John Doe",
    email: "john@example.com",
    contact_number: "+1234567890",
    message: "Interested in your services"
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    contact_number: "+0987654321",
    message: "Looking for website development"
  }
]

contacts.each do |contact_data|
  Contact.create!(
    community: community,
    name: contact_data[:name],
    email: contact_data[:email],
    contact_number: contact_data[:contact_number],
    message: contact_data[:message]
  )
end

puts "Creating Sample Translations..."
# Create Sample Translations
translations = [
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
  }
]

translations.each do |translation_data|
  CommunityTranslation.create!(
    community: community,
    locale: translation_data[:locale],
    translation_key: translation_data[:translation_key],
    translation: translation_data[:translation]
  )
end

puts "✅ Seed data created successfully!"
puts "Community ID: #{community.id}"
puts "User Email: #{user.email}"
puts "Password: password123"
puts "API URL: http://localhost:3001"
puts "Frontend URL: http://localhost:3000"
