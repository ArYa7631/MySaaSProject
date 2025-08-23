class CreateContentPages < ActiveRecord::Migration[7.1]
  def change
    create_table :content_pages do |t|
      t.references :community, null: false, foreign_key: true
      t.string :title, null: false
      t.string :end_point, null: false
      t.jsonb :data, default: {}
      t.jsonb :meta_data, default: {}
      t.boolean :is_active, default: true

      t.timestamps
    end
    
    add_index :content_pages, :end_point
    add_index :content_pages, :is_active
    add_index :content_pages, :data, using: :gin
    add_index :content_pages, :meta_data, using: :gin
    add_index :content_pages, [:community_id, :end_point], unique: true
  end
end
