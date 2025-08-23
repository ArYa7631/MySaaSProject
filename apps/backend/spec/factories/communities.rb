FactoryBot.define do
  factory :community do
    uuid { "MyString" }
    ident { "MyString" }
    domain { "MyString" }
    use_domain { false }
    is_enabled { false }
    locale { "MyString" }
    currency { "MyString" }
    country { "MyString" }
    ip_address { "MyString" }
    person_id { "MyString" }
  end
end
