class CreateTopbars < ActiveRecord::Migration[7.1]
  def change
    create_table :topbars do |t|
      t.references :community, null: false, foreign_key: true
      t.boolean :is_multilingual, default: false
      t.jsonb :navigation, default: {}
      t.jsonb :profile, default: {}

      t.timestamps
    end
    
    add_index :topbars, :navigation, using: :gin
    add_index :topbars, :profile, using: :gin
  end
end
