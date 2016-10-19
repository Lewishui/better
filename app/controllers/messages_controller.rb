class MessagesController < ApplicationController

  before_action :authenticate_user!
  before_action :admin_only, :only => []

  def index
    @page = params["page"]
  end

  def read
    if params["id"]
      current_user.read_message params["id"]
    else
      current_user.read_messages
      render "user_messages"
    end
  end

  def destroy
    current_user.delete_message params["id"]
    render "user_messages"
  end

end
