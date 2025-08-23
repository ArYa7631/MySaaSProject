FactoryBot.define do
  factory :marketplace_configuration do
    community { nil }
    global_text_color { "MyString" }
    global_bg_color { "MyString" }
    global_highlight_color { "MyString" }
    available_locale { "MyString" }
    available_currency { "MyString" }
    is_enabled { false }
    is_super_admin { false }
    logo { "MyString" }
    profile_logo { "MyString" }
    favicon { "MyString" }
    title { "MyString" }
    title_color { "MyString" }
    notification { "MyText" }
    copyright { "MyText" }
    whatsapp_number { "MyString" }
    enable_whatsapp_bot { false }
    facebook_url { "MyString" }
    instagram_url { "MyString" }
    twitter_url { "MyString" }
    github_url { "MyString" }
    skype_url { "MyString" }
    cookie_text { "MyText" }
  end
end
