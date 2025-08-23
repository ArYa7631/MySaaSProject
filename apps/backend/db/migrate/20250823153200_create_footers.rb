class CreateFooters < ActiveRecord::Migration[7.1]
  def change
    create_table :footers do |t|
      t.references :community, null: false, foreign_key: true
      t.jsonb :sections, default: []

      t.timestamps
    end
    
    add_index :footers, :sections, using: :gin
  end
end
