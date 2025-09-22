class AddColorFieldsToTopbarsAndFooters < ActiveRecord::Migration[7.1]
  def change
    # Add color fields to topbars table
    add_column :topbars, :background_color, :string
    add_column :topbars, :text_color, :string
    add_column :topbars, :link_color, :string
    add_column :topbars, :hover_color, :string
    
    # Add color fields to footers table
    add_column :footers, :background_color, :string
    add_column :footers, :text_color, :string
    add_column :footers, :link_color, :string
    add_column :footers, :hover_color, :string
  end
end
