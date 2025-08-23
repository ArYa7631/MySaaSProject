class CreateCommunities < ActiveRecord::Migration[7.1]
  def change
    create_table :communities do |t|
      t.string :uuid
      t.string :ident
      t.string :domain
      t.boolean :use_domain
      t.boolean :is_enabled
      t.string :locale
      t.string :currency
      t.string :country
      t.string :ip_address
      t.string :person_id

      t.timestamps
    end
    
    # Indexes for better performance
    add_index :communities, :person_id, unique: true
    add_index :communities, :uuid, unique: true
    add_index :communities, :ident, unique: true
    add_index :communities, :domain, unique: true
    add_index :communities, :is_enabled
    add_index :communities, :locale
  end
end
