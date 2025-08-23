class CreateMarketplaceConfigurations < ActiveRecord::Migration[7.1]
  def change
    create_table :marketplace_configurations do |t|
      t.references :community, null: false, foreign_key: true
      t.string :global_text_color
      t.string :global_bg_color
      t.string :global_highlight_color
      t.string :available_locale
      t.string :available_currency
      t.boolean :is_enabled
      t.boolean :is_super_admin
      t.string :logo
      t.string :profile_logo
      t.string :favicon
      t.string :title
      t.string :title_color
      t.text :notification
      t.text :copyright
      t.string :whatsapp_number
      t.boolean :enable_whatsapp_bot
      t.string :facebook_url
      t.string :instagram_url
      t.string :twitter_url
      t.string :github_url
      t.string :skype_url
      t.text :cookie_text

      t.timestamps
    end
  end
end
