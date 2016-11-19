class DeviseCreateUsers < ActiveRecord::Migration[5.0]
  def change
    create_table :users do |t|
      ## awesome_nested_set
      #t.integer :parent_id, :null => true, :index => true
      # use invited_by_id
      t.integer :lft, :null => false,  :index => true
      t.integer :rgt, :null => false,  :index => true
      # optional fields
      t.integer :depth, :null => false, :default => 0
      t.integer :children_count, :null => false, :default => 0
      
      ## Database authenticatable
      t.string :email,              null: false, default: ""
      t.string :encrypted_password, null: false, default: ""
      t.string :encrypted_money_password, null: false, default: ""

      ## Recoverable
      t.string   :reset_password_token
      t.datetime :reset_password_sent_at

      ## Rememberable
      t.datetime :remember_created_at

      ## Trackable
      t.integer  :sign_in_count, default: 0, null: false
      t.datetime :current_sign_in_at
      t.datetime :last_sign_in_at
      t.string   :current_sign_in_ip
      t.string   :last_sign_in_ip

      ## Confirmable
      # t.string   :confirmation_token
      # t.datetime :confirmed_at
      # t.datetime :confirmation_sent_at
      # t.string   :unconfirmed_email # Only if using reconfirmable

      # Lockable
       t.integer  :failed_attempts, default: 0, null: false # Only if lock strategy is :failed_attempts
       t.string   :unlock_token # Only if unlock strategy is :email or :both
       t.datetime :locked_at

      t.string :nickname
      t.integer :gender, null: false, default: 0
      t.string :phone, null: false, default: ""
      t.string :qq, null: false, default: ""
      #password protection
      t.string :pp_question, null: false, default: ""
      t.string :pp_answer, null: false, default: ""
      #real name validation
      t.string :firstname
      t.string :lastname
      t.string :real_name
      t.integer :id_type, null: false, default: 0
      t.string :id_number
      t.string :country_code

      t.timestamps null: false
    end
    add_index :users, :created_at
    add_index :users, :email,                unique: true
    add_index :users, :reset_password_token, unique: true
    # add_index :users, :confirmation_token,   unique: true
     add_index :users, :unlock_token,         unique: true
  end
end
