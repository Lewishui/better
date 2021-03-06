class CreateUserWallets < ActiveRecord::Migration[5.0]
  def change
    create_table :wallets do |t|
      t.references :user, foreign_key: true             # add_index :wallets, :user_id
      t.decimal :amount
      t.string :memo
      t.datetime :deleted_at
      t.integer :originator_id
      t.string :originator_type
      # 用户充值(deposit)，用户投注获利(bid)，用户转账(transfer)
      # 同一条 deposit记录，可能会有两条 wallet, 一条是充值，一条是活动红利。
      # 这样方便选出 红利记录和充值记录
      t.boolean :is_bonus, default: false
      t.timestamps null: false
    end

    add_index :wallets, :deleted_at

    add_index :wallets, [:originator_id, :originator_type], name: :wallets_originator

  end
end
