module Agent
  class BrokerController < BaseController
    layout "agent_broker"
    before_action :authenticate_broker!

    def index
      @broker = current_broker
      @user_month = Summary::SaleMonthlyFactory.create("profit", current_broker.user_cmonths ).first || Summary::SaleMonthlyProfit.new(DateTime.current.to_date)
      @user_day = Summary::BrokerDailyProfitFactory.create( current_broker.user_todays ).first || Summary::BrokerDailyProfit.new(DateTime.current.to_date)
    end


    def show
      @broker = Broker.find(params[:id])
      unless current_broker.admin?
        unless @broker == current_broker
          redirect_to root_path, :alert => "Access denied."
        end
      end
    end

    def update
      @broker = Broker.find(params[:id])
      if @broker.update_attributes(secure_params)
        redirect_to brokers_path, :notice => "broker updated."
      else
        redirect_to brokers_path, :alert => "Unable to update broker."
      end
    end

    def destroy
      broker = Broker.find(params[:id])
      broker.destroy
      redirect_to brokers_path, :notice => "broker deleted."
    end

    def change_password
      if request.patch?
        current_broker.change_password(params["broker"])
        if current_broker.errors.empty?
          flash[:notice] = t :password_changed
        end
        render :change_password
      end
    end
  end
end
