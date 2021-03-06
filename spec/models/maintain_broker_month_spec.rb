describe MaintainSaleMonth do
  let( :broker ) { create :broker  }
  let( :user ) { create :user, broker: broker  }
  let( :deposit ) { create :deposit, amount: 1000, user: user }

  it "add broker month for one broker" do
    broker
    expect { MaintainSaleMonth.new.run }.to change { SaleMonth.count}.by(1)
  end

  it "add broker months for two brokers" do
    b1 = create :broker
    b2 = create :broker
    expect { MaintainSaleMonth.new.run }.to change { SaleMonth.count}.by(2)
  end


  context " user with deposit" do
    before(:each) {
      @deposit_100 =  create( :deposit, amount: 100, user: user);
      @deposit_100.process!
    }

    it "should has month.valuable_member_count 1 after deposit 100" do
      date = DateTime.current.to_date
      MaintainSaleMonth.new( date ).run
      month = SaleMonth.first
      expect( month.valuable_member_count ).to eq( 1 )
    end

  end
end
