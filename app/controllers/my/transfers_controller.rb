module My
  class TransfersController < BaseController
     before_action :set_transfer, only: [:show, :edit, :update, :destroy]

    # GET /transfers
    # GET /transfers.json
    def index
      @page = params["page"]
      @transfers = Transfer.order("created_at desc").all.paginate(:page => @page)
    end

    # GET /transfers/1
    # GET /transfers/1.json
    def show
    end

    # GET /transfers/new
    def new
      @transfer = Transfer.new
    end

    # GET /transfers/1/edit
    def edit
    end

    # POST /transfers
    # POST /transfers.json
    def create
      @transfer = current_user.transfers.build(transfer_params)

      respond_to do |format|
        if @transfer.save
          format.html { redirect_to my_transfers_url, notice: 'Transfer was successfully created.' }
          format.json { render :show, status: :created, location: @transfer }
        else
          format.html { render :new }
          format.json { render json: @transfer.errors, status: :unprocessable_entity }
        end
      end
    end

    # PATCH/PUT /transfers/1
    # PATCH/PUT /transfers/1.json
    def update
      respond_to do |format|
        if @transfer.update(transfer_params)
          format.html { redirect_to @transfer, notice: 'Transfer was successfully updated.' }
          format.json { render :show, status: :ok, location: @transfer }
        else
          format.html { render :edit }
          format.json { render json: @transfer.errors, status: :unprocessable_entity }
        end
      end
    end

    # DELETE /transfers/1
    # DELETE /transfers/1.json
    def destroy
      @transfer.destroy
      respond_to do |format|
        format.html { redirect_to my_transfers_url, notice: 'Transfer was successfully destroyed.' }
        format.json { head :no_content }
      end
    end

    def search
      @page = params["page"]
      @start_date = search_params[:start_date]
      @end_date = search_params[:end_date]
      @from_game_center_id = search_params[:from_game_center_id]
      @to_game_center_id = search_params[:to_game_center_id]
      @state = search_params[:state]
      @transfers = Transfer.search(search_params).paginate(:page => @page)
      render :index
    end

    private
      # Use callbacks to share common setup or constraints between actions.
      def set_transfer
        @transfer = Transfer.find(params[:id])
      end

      # Never trust parameters from the scary internet, only allow the white list through.
      def transfer_params
        params.require(:transfer).permit(:user_id, :from_game_center_id, :to_game_center_id, :number, :amount, :state)
      end

      def search_params
        params.permit(:start_date, :end_date, :from_game_center_id, :to_game_center_id, :state)
      end
  end
end
