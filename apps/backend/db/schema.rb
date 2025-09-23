# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2025_09_23_034000) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "communities", force: :cascade do |t|
    t.string "uuid"
    t.string "ident"
    t.string "domain"
    t.boolean "use_domain"
    t.boolean "is_enabled"
    t.string "locale"
    t.string "currency"
    t.string "country"
    t.string "ip_address"
    t.string "person_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["domain"], name: "index_communities_on_domain", unique: true
    t.index ["ident"], name: "index_communities_on_ident", unique: true
    t.index ["is_enabled"], name: "index_communities_on_is_enabled"
    t.index ["locale"], name: "index_communities_on_locale"
    t.index ["person_id"], name: "index_communities_on_person_id", unique: true
    t.index ["uuid"], name: "index_communities_on_uuid", unique: true
  end

  create_table "community_translations", force: :cascade do |t|
    t.bigint "community_id", null: false
    t.string "locale", limit: 10, null: false
    t.text "translation", null: false
    t.string "translation_key", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["community_id", "locale", "translation_key"], name: "index_community_translations_unique", unique: true
    t.index ["community_id"], name: "index_community_translations_on_community_id"
    t.index ["locale"], name: "index_community_translations_on_locale"
    t.index ["translation_key"], name: "index_community_translations_on_translation_key"
  end

  create_table "contacts", force: :cascade do |t|
    t.bigint "community_id", null: false
    t.string "name"
    t.string "email"
    t.string "contact_number"
    t.text "message"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["community_id"], name: "index_contacts_on_community_id"
    t.index ["created_at"], name: "index_contacts_on_created_at"
    t.index ["email"], name: "index_contacts_on_email"
  end

  create_table "content_pages", force: :cascade do |t|
    t.bigint "community_id", null: false
    t.string "title", null: false
    t.string "end_point", null: false
    t.jsonb "data", default: {}
    t.jsonb "meta_data", default: {}
    t.boolean "is_active", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["community_id", "end_point"], name: "index_content_pages_on_community_id_and_end_point", unique: true
    t.index ["community_id"], name: "index_content_pages_on_community_id"
    t.index ["data"], name: "index_content_pages_on_data", using: :gin
    t.index ["end_point"], name: "index_content_pages_on_end_point"
    t.index ["is_active"], name: "index_content_pages_on_is_active"
    t.index ["meta_data"], name: "index_content_pages_on_meta_data", using: :gin
  end

  create_table "footers", force: :cascade do |t|
    t.bigint "community_id", null: false
    t.jsonb "sections", default: []
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "background_color"
    t.string "text_color"
    t.string "link_color"
    t.string "hover_color"
    t.index ["community_id"], name: "index_footers_on_community_id"
    t.index ["sections"], name: "index_footers_on_sections", using: :gin
  end

  create_table "jwt_denylist", force: :cascade do |t|
    t.string "jti", null: false
    t.datetime "exp", null: false
    t.index ["jti"], name: "index_jwt_denylist_on_jti", unique: true
  end

  create_table "landing_pages", force: :cascade do |t|
    t.bigint "community_id", null: false
    t.jsonb "meta_data", default: {}
    t.jsonb "content", default: {}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["community_id"], name: "index_landing_pages_on_community_id"
    t.index ["content"], name: "index_landing_pages_on_content", using: :gin
    t.index ["meta_data"], name: "index_landing_pages_on_meta_data", using: :gin
  end

  create_table "marketplace_configurations", force: :cascade do |t|
    t.bigint "community_id", null: false
    t.string "global_text_color"
    t.string "global_bg_color"
    t.string "global_highlight_color"
    t.string "available_locale"
    t.string "available_currency"
    t.boolean "is_enabled"
    t.boolean "is_super_admin"
    t.string "logo"
    t.string "profile_logo"
    t.string "favicon"
    t.string "title"
    t.string "title_color"
    t.text "notification"
    t.text "copyright"
    t.string "whatsapp_number"
    t.boolean "enable_whatsapp_bot"
    t.string "facebook_url"
    t.string "instagram_url"
    t.string "twitter_url"
    t.string "github_url"
    t.string "skype_url"
    t.text "cookie_text"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["community_id"], name: "index_marketplace_configurations_on_community_id"
  end

  create_table "topbars", force: :cascade do |t|
    t.bigint "community_id", null: false
    t.boolean "is_multilingual", default: false
    t.jsonb "navigation", default: {}
    t.jsonb "profile", default: {}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "background_color"
    t.string "text_color"
    t.string "link_color"
    t.string "hover_color"
    t.index ["community_id"], name: "index_topbars_on_community_id"
    t.index ["navigation"], name: "index_topbars_on_navigation", using: :gin
    t.index ["profile"], name: "index_topbars_on_profile", using: :gin
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "community_id"
    t.string "first_name"
    t.string "last_name"
    t.string "phone_number"
    t.string "locale", default: "en"
    t.boolean "admin", default: false, null: false
    t.index ["community_id"], name: "index_users_on_community_id"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["first_name", "last_name"], name: "index_users_on_first_name_and_last_name"
    t.index ["locale"], name: "index_users_on_locale"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "community_translations", "communities"
  add_foreign_key "contacts", "communities"
  add_foreign_key "content_pages", "communities"
  add_foreign_key "footers", "communities"
  add_foreign_key "landing_pages", "communities"
  add_foreign_key "marketplace_configurations", "communities"
  add_foreign_key "topbars", "communities"
  add_foreign_key "users", "communities"
end
