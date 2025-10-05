class CommunitySetupService
  def self.create_community_with_defaults(user, domain, community_name = nil)
    # Generate unique identifiers
    uuid = SecureRandom.uuid
    person_id = SecureRandom.alphanumeric(5)
    
    # Create community name from domain if not provided
    community_name ||= domain.humanize
    
    # Create the community
    community = Community.create!(
      uuid: uuid,
      ident: community_name,
      domain: domain,
      use_domain: true,
      is_enabled: true,
      locale: "en",
      currency: "USD",
      country: "US",
      ip_address: "127.0.0.1",
      person_id: person_id
    )
    
    # Create marketplace configuration with defaults
    create_marketplace_configuration(community, community_name)
    
    # Create beautiful landing page with defaults
    create_landing_page(community, community_name)
    
    # Create navigation (topbar)
    create_topbar(community)
    
    # Create footer
    create_footer(community)
    
    # Create default content pages
    create_content_pages(community, community_name)
    
    # Create sample contacts
    create_sample_contacts(community)
    
    # Create translations
    create_translations(community, community_name)
    
    # Associate user with community and set as admin
    user.update!(community: community, admin: true)
    
    community
  end
  
  private
  
  def self.create_marketplace_configuration(community, community_name)
    MarketplaceConfiguration.create!(
      community: community,
      global_text_color: "#ffffff",
      global_bg_color: "#FF66CC",
      global_highlight_color: "#3b82f6",
      available_locale: "english",
      available_currency: "USD",
      is_enabled: true,
      is_super_admin: false,
      logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      profile_logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      favicon: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=96&q=75",
      title: community_name,
      title_color: "#ffffff",
      notification: "🚀 Welcome to #{community_name}! We're excited to help you grow your business.",
      copyright: "© 2025 #{community_name}. All rights reserved. Built with passion and expertise.",
      whatsapp_number: "+1234567890",
      enable_whatsapp_bot: true,
      facebook_url: "",
      instagram_url: "",
      twitter_url: "",
      github_url: "",
      skype_url: "",
      cookie_text: "We use cookies to enhance your experience on our website. By continuing to browse, you agree to our use of cookies and our privacy policy."
    )
  end
  
  def self.create_landing_page(community, community_name)
    LandingPage.create!(
      community: community,
      meta_data: {
        "title" => "#{community_name} - Professional Services",
        "description" => "Professional services and digital solutions. Transform your ideas into reality with modern technology."
      },
      content: [
        {
          "id" => "hero-section",
          "name" => "Hero Section",
          "type" => "HeroSection",
          "content" => {
            "title" => "Welcome to #{community_name}",
            "subtitle" => "Professional Services & Digital Solutions",
            "description" => "We provide comprehensive digital solutions tailored to your business needs. From concept to deployment, we bring your ideas to life with cutting-edge technology and innovative approaches.",
            "primaryButton" => {
              "url" => "/contact",
              "text" => "Get Started"
            },
            "secondaryButton" => {
              "url" => "/services",
              "text" => "Our Services"
            },
            "backgroundImage" => "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
            "textColor" => "#1f2937",
            "titleColor" => "#1f2937",
            "subtitleColor" => "#374151",
            "descriptionColor" => "#4b5563",
            "overlayColor" => "rgba(255, 255, 255, 0.85)",
            "overlayOpacity" => 0.85
          },
          "description" => "Modern hero section with stunning background and proper text contrast"
        },
        {
          "id" => "features-section",
          "name" => "Why Choose Us",
          "type" => "Features",
          "content" => {
            "title" => "Why Choose #{community_name}?",
            "subtitle" => "Excellence in Every Project",
            "features" => [
              {
                "title" => "Expert Team",
                "description" => "Our skilled professionals bring years of experience and passion to every project.",
                "icon" => "👥",
                "imageUrl" => "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              },
              {
                "title" => "Modern Technology",
                "description" => "We use the latest tools and technologies to deliver cutting-edge solutions.",
                "icon" => "⚡",
                "imageUrl" => "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              },
              {
                "title" => "24/7 Support",
                "description" => "Round-the-clock support to ensure your projects run smoothly.",
                "icon" => "🛠️",
                "imageUrl" => "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              },
              {
                "title" => "Quality Guaranteed",
                "description" => "We stand behind our work with comprehensive quality assurance.",
                "icon" => "✅",
                "imageUrl" => "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              }
            ]
          },
          "description" => "Feature highlights with beautiful images"
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
                "description" => "Custom websites and web applications built with modern technologies like React, Next.js, and Node.js for optimal performance and user experience.",
                "icon" => "🌐"
              },
              {
                "title" => "Mobile Solutions",
                "description" => "Cross-platform mobile applications for iOS and Android using React Native and Flutter for seamless user experience.",
                "icon" => "📱"
              },
              {
                "title" => "Digital Strategy",
                "description" => "Comprehensive digital strategies to grow your business online with data-driven insights and proven methodologies.",
                "icon" => "📊"
              },
              {
                "title" => "Cloud Solutions",
                "description" => "Scalable cloud infrastructure and deployment solutions using AWS, Azure, and Google Cloud for maximum efficiency.",
                "icon" => "☁️"
              },
              {
                "title" => "Consulting",
                "description" => "Expert guidance and technical consulting for your projects with personalized recommendations and strategic planning.",
                "icon" => "💡"
              },
              {
                "title" => "Support & Maintenance",
                "description" => "Ongoing support and maintenance for all your digital needs with proactive monitoring and updates.",
                "icon" => "🛠️"
              }
            ]
          },
          "description" => "Services overview with detailed descriptions"
        },
        {
          "id" => "stats-section",
          "name" => "Our Impact",
          "type" => "StatsSection",
          "content" => {
            "title" => "Our Impact",
            "description" => "Numbers that speak for themselves",
            "stats" => [
              {
                "number" => "500+",
                "label" => "Projects Completed",
                "description" => "Successfully delivered projects across various industries"
              },
              {
                "number" => "150+",
                "label" => "Happy Clients",
                "description" => "Satisfied customers worldwide"
              },
              {
                "number" => "99%",
                "label" => "Success Rate",
                "description" => "Project completion and client satisfaction rate"
              },
              {
                "number" => "24/7",
                "label" => "Support",
                "description" => "Round-the-clock assistance and monitoring"
              }
            ]
          },
          "description" => "Impressive statistics showcase"
        },
        {
          "id" => "testimonials-section",
          "name" => "Client Testimonials",
          "type" => "Testimonials",
          "content" => {
            "title" => "What Our Clients Say",
            "subtitle" => "Trusted by Industry Leaders",
            "testimonials" => [
              {
                "name" => "Sarah Johnson",
                "company" => "TechCorp Inc.",
                "role" => "CEO",
                "content" => "Exceptional work! The team delivered our e-commerce platform ahead of schedule with outstanding quality and attention to detail.",
                "rating" => 5,
                "avatar" => "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
              },
              {
                "name" => "Michael Chen",
                "company" => "InnovateLab",
                "role" => "CTO",
                "content" => "Professional, reliable, and technically excellent. Highly recommend for any complex web development project.",
                "rating" => 5,
                "avatar" => "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
              },
              {
                "name" => "Emily Rodriguez",
                "company" => "FutureSoft",
                "role" => "Product Manager",
                "content" => "The mobile app they built for us has been a game-changer for our business growth and customer engagement.",
                "rating" => 5,
                "avatar" => "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
              }
            ]
          },
          "description" => "Client testimonials and reviews"
        },
        {
          "id" => "gallery-section",
          "name" => "Our Work",
          "type" => "Gallery",
          "content" => {
            "title" => "Portfolio Gallery",
            "subtitle" => "Showcasing Our Best Work",
            "images" => [
              {
                "url" => "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                "alt" => "Web Development Project",
                "title" => "E-commerce Platform",
                "description" => "Modern e-commerce solution with advanced features"
              },
              {
                "url" => "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                "alt" => "Mobile App Development",
                "title" => "Mobile Banking App",
                "description" => "Secure and user-friendly mobile banking application"
              },
              {
                "url" => "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                "alt" => "Data Analytics Dashboard",
                "title" => "Analytics Dashboard",
                "description" => "Comprehensive data visualization and analytics"
              },
              {
                "url" => "https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                "alt" => "Cloud Infrastructure",
                "title" => "Cloud Migration",
                "description" => "Scalable cloud infrastructure setup"
              },
              {
                "url" => "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                "alt" => "AI & Machine Learning",
                "title" => "AI Solutions",
                "description" => "Artificial intelligence and automation solutions"
              },
              {
                "url" => "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                "alt" => "UI/UX Design",
                "title" => "Design System",
                "description" => "Comprehensive design system and user interface"
              }
            ]
          },
          "description" => "Portfolio showcase with project images"
        },
        {
          "id" => "team-section",
          "name" => "Meet Our Team",
          "type" => "TeamSection",
          "content" => {
            "title" => "Meet Our Team",
            "description" => "The talented individuals behind our success",
            "members" => [
              {
                "name" => "Alex Thompson",
                "role" => "CEO & Founder",
                "bio" => "Visionary leader with 15+ years in tech, passionate about building innovative solutions that make a difference.",
                "imageUrl" => "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                "linkedin" => "#",
                "twitter" => "#"
              },
              {
                "name" => "Maria Rodriguez",
                "role" => "CTO",
                "bio" => "Technical expert and innovation driver, specializing in scalable architecture and cutting-edge technologies.",
                "imageUrl" => "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                "linkedin" => "#",
                "twitter" => "#"
              },
              {
                "name" => "David Kim",
                "role" => "Lead Developer",
                "bio" => "Full-stack developer with expertise in modern web technologies and best practices for optimal performance.",
                "imageUrl" => "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                "linkedin" => "#",
                "twitter" => "#"
              }
            ]
          },
          "description" => "Team member profiles and roles"
        },
        {
          "id" => "pricing-section",
          "name" => "Our Pricing",
          "type" => "Pricing",
          "content" => {
            "title" => "Choose Your Plan",
            "subtitle" => "Flexible pricing for every business size",
            "plans" => [
              {
                "name" => "Starter",
                "price" => "$99",
                "period" => "month",
                "description" => "Perfect for small businesses and startups",
                "features" => [
                  "Up to 5 pages",
                  "Basic support",
                  "SSL certificate",
                  "Mobile responsive design",
                  "Basic analytics"
                ],
                "popular" => false,
                "buttonText" => "Get Started"
              },
              {
                "name" => "Professional",
                "price" => "$199",
                "period" => "month",
                "description" => "Ideal for growing businesses",
                "features" => [
                  "Up to 15 pages",
                  "Priority support",
                  "Advanced analytics",
                  "Custom integrations",
                  "SEO optimization",
                  "Performance monitoring"
                ],
                "popular" => true,
                "buttonText" => "Most Popular"
              },
              {
                "name" => "Enterprise",
                "price" => "$399",
                "period" => "month",
                "description" => "For large organizations",
                "features" => [
                  "Unlimited pages",
                  "24/7 dedicated support",
                  "Custom features",
                  "Dedicated account manager",
                  "Advanced security",
                  "White-label options"
                ],
                "popular" => false,
                "buttonText" => "Contact Sales"
              }
            ]
          },
          "description" => "Flexible pricing plans for all needs"
        },
        {
          "id" => "faq-section",
          "name" => "Frequently Asked Questions",
          "type" => "FAQSection",
          "content" => {
            "title" => "Frequently Asked Questions",
            "description" => "Find answers to common questions about our services",
            "faqs" => [
              {
                "question" => "What services do you offer?",
                "answer" => "We provide comprehensive digital solutions including web development, mobile apps, cloud solutions, AI/ML services, consulting, and ongoing support."
              },
              {
                "question" => "How long does a typical project take?",
                "answer" => "Project timelines vary based on complexity. Simple websites take 2-4 weeks, while complex applications can take 2-6 months. We provide detailed timelines during consultation."
              },
              {
                "question" => "Do you provide ongoing support?",
                "answer" => "Yes, we offer 24/7 support and maintenance packages to ensure your applications run smoothly with proactive monitoring and updates."
              },
              {
                "question" => "What technologies do you use?",
                "answer" => "We use modern technologies including React, Next.js, Node.js, Python, AWS, Azure, and various mobile frameworks to deliver cutting-edge solutions."
              },
              {
                "question" => "Can you work with our existing systems?",
                "answer" => "Absolutely! We specialize in integrating with existing systems and can help modernize your current infrastructure while maintaining compatibility."
              },
              {
                "question" => "Do you offer custom solutions?",
                "answer" => "Yes, we create fully customized solutions tailored to your specific business needs and requirements."
              }
            ]
          },
          "description" => "Common questions and detailed answers"
        },
        {
          "id" => "contact-section",
          "name" => "Get In Touch",
          "type" => "ContactForm",
          "content" => {
            "title" => "Ready to Start Your Project?",
            "subtitle" => "Let's Build Something Amazing Together",
            "description" => "Have an idea for a website, application, or digital solution? We'd love to hear about your project and discuss how we can bring it to life.",
            "formFields" => [
              {
                "name" => "name",
                "label" => "Full Name",
                "type" => "text",
                "required" => true
              },
              {
                "name" => "email",
                "label" => "Email Address",
                "type" => "email",
                "required" => true
              },
              {
                "name" => "company",
                "label" => "Company",
                "type" => "text",
                "required" => false
              },
              {
                "name" => "phone",
                "label" => "Phone Number",
                "type" => "tel",
                "required" => false
              },
              {
                "name" => "project_type",
                "label" => "Project Type",
                "type" => "select",
                "required" => true,
                "options" => [
                  "Web Development",
                  "Mobile App",
                  "Cloud Solutions",
                  "AI/ML Services",
                  "Consulting",
                  "Other"
                ]
              },
              {
                "name" => "budget",
                "label" => "Budget Range",
                "type" => "select",
                "required" => false,
                "options" => [
                  "Under $10,000",
                  "$10,000 - $25,000",
                  "$25,000 - $50,000",
                  "$50,000 - $100,000",
                  "Over $100,000"
                ]
              },
              {
                "name" => "message",
                "label" => "Project Description",
                "type" => "textarea",
                "required" => true
              }
            ],
            "submitButtonText" => "Send Message",
            "successMessage" => "Thank you for your message! We'll get back to you within 24 hours.",
            "contactInfo" => {
              "email" => "contact@#{community_name.downcase.gsub(' ', '')}.com",
              "phone" => "+1 (555) 123-4567",
              "address" => "123 Business Street, Suite 100, City, State 12345"
            }
          },
          "description" => "Contact form with project inquiry fields"
        },
        {
          "id" => "newsletter-section",
          "name" => "Stay Updated",
          "type" => "NewsletterSection",
          "content" => {
            "title" => "Stay Updated",
            "description" => "Subscribe to our newsletter for the latest updates, tips, and industry insights.",
            "placeholder" => "Enter your email address",
            "buttonText" => "Subscribe Now",
            "successMessage" => "Thank you for subscribing! Check your email for confirmation."
          },
          "description" => "Newsletter subscription for updates"
        },
      ]
    )
  end
  
  def self.create_topbar(community)
    Topbar.create!(
      community: community,
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
          "linkHref" => "/team",
          "linkTitle" => "Team"
        },
        {
          "linkHref" => "/about",
          "linkTitle" => "About"
        },
        {
          "linkHref" => "/contact",
          "linkTitle" => "Contact"
        }
      ],
      profile: [
        {
          "linkHref" => "/admin",
          "linkTitle" => "Admin Dashboard"
        },
        {
          "linkHref" => "/login",
          "linkTitle" => "Admin Login"
        }
      ],
      background_color: "#ffffff",
      text_color: "#1f2937",
      link_color: "#374151",
      hover_color: "#3b82f6"
    )
  end
  
  def self.create_footer(community)
    Footer.create!(
      community: community,
      sections: [
        {
          "label" => "Services",
          "links" => [
            {
              "name" => "Web Development",
              "link" => "/services#web-development"
            },
            {
              "name" => "Mobile Solutions",
              "link" => "/services#mobile-solutions"
            },
            {
              "name" => "Digital Strategy",
              "link" => "/services#digital-strategy"
            },
            {
              "name" => "Cloud Solutions",
              "link" => "/services#cloud-solutions"
            },
            {
              "name" => "Consulting",
              "link" => "/services#consulting"
            }
          ]
        },
        {
          "label" => "Company",
          "links" => [
            {
              "name" => "About Us",
              "link" => "/about"
            },
            {
              "name" => "Our Team",
              "link" => "/team"
            },
            {
              "name" => "Portfolio",
              "link" => "/portfolio"
            },
            {
              "name" => "Contact",
              "link" => "/contact"
            },
            {
              "name" => "Privacy Policy",
              "link" => "/privacy"
            },
            {
              "name" => "Terms of Service",
              "link" => "/terms"
            }
          ]
        },
        {
          "label" => "Support",
          "links" => [
            {
              "name" => "Help Center",
              "link" => "/help"
            },
            {
              "name" => "Documentation",
              "link" => "/docs"
            },
            {
              "name" => "FAQ",
              "link" => "/faq"
            },
            {
              "name" => "Status",
              "link" => "/status"
            }
          ]
        },
        {
          "label" => "Resources",
          "links" => [
            {
              "name" => "Blog",
              "link" => "/blog"
            },
            {
              "name" => "Case Studies",
              "link" => "/case-studies"
            },
            {
              "name" => "White Papers",
              "link" => "/white-papers"
            },
            {
              "name" => "Webinars",
              "link" => "/webinars"
            }
          ]
        }
      ],
      background_color: "#1f2937",
      text_color: "#f9fafb",
      link_color: "#d1d5db",
      hover_color: "#3b82f6"
    )
  end
  
  def self.create_content_pages(community, community_name)
    content_pages = [
      {
        title: "Home",
        end_point: "/content/home",
        data: {"sections" => []},
        meta_data: {"title" => "Home", "description" => "Welcome to #{community_name} - Professional Digital Solutions"},
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
              "subtitle" => "Comprehensive Digital Solutions for Your Business",
              "columns" => [
                {
                  "title" => "Web Development",
                  "description" => "Custom websites and web applications built with modern technologies like React, Next.js, and Node.js for optimal performance and user experience.",
                  "icon" => "🌐"
                },
                {
                  "title" => "Mobile Solutions",
                  "description" => "Cross-platform mobile applications for iOS and Android using React Native and Flutter for seamless user experience.",
                  "icon" => "📱"
                },
                {
                  "title" => "Digital Strategy",
                  "description" => "Comprehensive digital strategies to grow your business online with data-driven insights and proven methodologies.",
                  "icon" => "📊"
                },
                {
                  "title" => "Cloud Solutions",
                  "description" => "Scalable cloud infrastructure and deployment solutions using AWS, Azure, and Google Cloud for maximum efficiency.",
                  "icon" => "☁️"
                },
                {
                  "title" => "Consulting",
                  "description" => "Expert guidance and technical consulting for your projects with personalized recommendations and strategic planning.",
                  "icon" => "💡"
                },
                {
                  "title" => "Support & Maintenance",
                  "description" => "Ongoing support and maintenance for all your digital needs with proactive monitoring and updates.",
                  "icon" => "🛠️"
                }
              ]
            }
          }
        ],
        meta_data: {"title" => "Services", "description" => "Our comprehensive digital solutions and services"},
        is_active: true
      },
      {
        title: "About",
        end_point: "/content/about",
        data: [
          {
            "id" => "about-content",
            "name" => "About Content",
            "type" => "CustomEditor",
            "content" => {
              "editorData" => {
                "time" => Time.current.to_i * 1000,
                "blocks" => [
                  {
                    "id" => "about-text",
                    "data" => {
                      "text" => "Welcome to #{community_name}. We are a team of dedicated professionals committed to delivering exceptional digital solutions and services that drive business growth and innovation."
                    },
                    "type" => "paragraph"
                  },
                  {
                    "id" => "mission-text",
                    "data" => {
                      "text" => "Our Mission: To empower businesses with cutting-edge technology and creative solutions that make a real difference in today's digital landscape."
                    },
                    "type" => "paragraph"
                  },
                  {
                    "id" => "values-text",
                    "data" => {
                      "text" => "Our Values: Innovation, Quality, Integrity, and Collaboration guide everything we do. We constantly push boundaries while maintaining the highest ethical standards."
                    },
                    "type" => "paragraph"
                  }
                ],
                "version" => "2.28.0"
              }
            }
          }
        ],
        meta_data: {"title" => "About Us", "description" => "Learn more about #{community_name} and our mission"},
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
              "subtitle" => "Showcasing Our Best Projects",
              "images" => [
                {
                  "url" => "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                  "alt" => "E-commerce Platform",
                  "title" => "E-commerce Platform",
                  "description" => "Modern e-commerce solution with advanced features"
                },
                {
                  "url" => "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                  "alt" => "Mobile Banking App",
                  "title" => "Mobile Banking App",
                  "description" => "Secure and user-friendly mobile banking application"
                }
              ]
            }
          }
        ],
        meta_data: {"title" => "Portfolio", "description" => "Explore our portfolio of successful projects"},
        is_active: true
      },
      {
        title: "Team",
        end_point: "/content/team",
        data: [
          {
            "id" => "team-members",
            "name" => "Our Team",
            "type" => "TeamSection",
            "content" => {
              "title" => "Meet Our Team",
              "description" => "The talented individuals behind our success",
              "members" => [
                {
                  "name" => "Alex Thompson",
                  "role" => "CEO & Founder",
                  "bio" => "Visionary leader with 15+ years in tech, passionate about building innovative solutions.",
                  "imageUrl" => "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                }
              ]
            }
          }
        ],
        meta_data: {"title" => "Our Team", "description" => "Meet the talented professionals behind #{community_name}"},
        is_active: true
      },
      {
        title: "Contact",
        end_point: "/content/contact",
        data: [
          {
            "id" => "contact-form",
            "name" => "Contact Form",
            "type" => "ContactForm",
            "content" => {
              "title" => "Get In Touch",
              "subtitle" => "Ready to Start Your Project?",
              "description" => "Have an idea for a website, application, or digital solution? We'd love to hear about your project.",
              "formFields" => [
                {
                  "name" => "name",
                  "label" => "Full Name",
                  "type" => "text",
                  "required" => true
                },
                {
                  "name" => "email",
                  "label" => "Email Address",
                  "type" => "email",
                  "required" => true
                },
                {
                  "name" => "message",
                  "label" => "Project Description",
                  "type" => "textarea",
                  "required" => true
                }
              ]
            }
          }
        ],
        meta_data: {"title" => "Contact Us", "description" => "Get in touch with #{community_name} for your project needs"},
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
  end
  
  def self.create_sample_contacts(community)
    # Create a few sample contacts for demonstration
    sample_contacts = [
      {
        name: "Sample Contact",
        email: "contact@example.com",
        contact_number: "+1234567890",
        message: "This is a sample contact for demonstration purposes."
      }
    ]
    
    sample_contacts.each do |contact_data|
      Contact.create!(
        community: community,
        name: contact_data[:name],
        email: contact_data[:email],
        contact_number: contact_data[:contact_number],
        message: contact_data[:message]
      )
    end
  end
  
  def self.create_translations(community, community_name)
    translations_data = [
      {
        locale: "en",
        translation_key: "welcome_message",
        translation: "Welcome to #{community_name}"
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
        translation_key: "about_us",
        translation: "About Us"
      }
    ]
    
    translations_data.each do |translation_data|
      CommunityTranslation.create!(
        community: community,
        locale: translation_data[:locale],
        translation_key: translation_data[:translation_key],
        translation: translation_data[:translation]
      )
    end
  end
end
