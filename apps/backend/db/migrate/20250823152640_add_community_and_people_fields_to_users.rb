class AddCommunityAndPeopleFieldsToUsers < ActiveRecord::Migration[7.1]
  def change
    add_reference :users, :community, null: true, foreign_key: true
    add_column :users, :first_name, :string
    add_column :users, :last_name, :string
    add_column :users, :phone_number, :string
    add_column :users, :locale, :string, default: 'en'
    
    # Add indexes for better performance
    add_index :users, :locale
    add_index :users, [:first_name, :last_name]
  end
end
