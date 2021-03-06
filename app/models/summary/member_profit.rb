module Summary
  #会员明细表
  class MemberProfit < ProfitBase
    attr_accessor :user
    delegate :user_life, to: :user

    def initialize( user)
      super()
      self.user = user
      self.from_date = user.created_at.to_date
      self.to_date = DateTime.current.to_date

      initialize_attributes
    end


    def initialize_attributes
      # 取得用户生命周期的数据
      # user_life + user_today
      self.deposit_amount = user_life.deposit_amount + user_today.deposit_amount
      self.drawing_amount = user_life.drawing_amount + user_today.drawing_amount
      self.bid_amount = user_life.bid_amount + user_today.bid_amount

      self.bonus = user_life.bonus + user_today.bonus
      self.profit = user_life.profit + user_today.profit
      self.balance = user_today.new_record? ? user_life.balance : user_today.balance
      self.net = drawing_amount + balance - deposit_amount
    end

    # user_today 可能为 nil，所以构建一个 值为 0 对象。
    # 不能用 user.build_user_today, 否则 user.save 会保存那个对象。
    def user_today
      user.user_today || UserDay.new
    end

    def self.generate_csv(member_profits, options = {})
      CSV.generate(options) do |csv|
        csv << ["用户名", "注册时间", "状态", "存款", "提款", "红利", "投注", "输赢", "派奖"]
        member_profits.each do |member_profit|
          csv << [member_profit.user.real_name, member_profit.user.created_at, member_profit.user.state, member_profit.deposit_amount,
            member_profit.drawing_amount, member_profit.bonus, member_profit.bid_amount, member_profit.net,
            member_profit.profit]
        end
      end
    end

  end
end
