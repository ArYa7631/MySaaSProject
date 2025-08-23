class CreateContacts < ActiveRecord::Migration[7.1]
  def change
    create_table :contacts do |t|
      t.references :community, null: false, foreign_key: true
      t.string :name
      t.string :email
      t.string :contact_number
      t.text :message

      t.timestamps
    end
    
    add_index :contacts, :email
    add_index :contacts, :created_at
  end
end
