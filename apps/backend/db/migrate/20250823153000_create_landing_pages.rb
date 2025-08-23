class CreateLandingPages < ActiveRecord::Migration[7.1]
  def change
    create_table :landing_pages do |t|
      t.references :community, null: false, foreign_key: true
      t.jsonb :meta_data, default: {}
      t.jsonb :content, default: {}

      t.timestamps
    end
    
    add_index :landing_pages, :meta_data, using: :gin
    add_index :landing_pages, :content, using: :gin
  end
end
