class CreateCommunityTranslations < ActiveRecord::Migration[7.1]
  def change
    create_table :community_translations do |t|
      t.references :community, null: false, foreign_key: true
      t.string :locale, null: false, limit: 10
      t.text :translation, null: false
      t.string :translation_key, null: false

      t.timestamps
    end
    
    add_index :community_translations, :locale
    add_index :community_translations, :translation_key
    add_index :community_translations, [:community_id, :locale, :translation_key], unique: true, name: 'index_community_translations_unique'
  end
end
