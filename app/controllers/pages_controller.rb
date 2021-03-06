class PagesController < ApplicationController
  include HighVoltage::StaticPage
  layout :layout_for_page
  before_action :set_cros_header, :set_symbol_by_params, :set_page_width
  helper_method :current_seller

  def current_seller
    @current_seller ||= CurrentSeller.new( current_user )
  end

  private

  def layout_for_page
    case params[:id]
    when /^my/
      'user'
    else
      'application'
    end
  end

  def set_symbol_by_params
    @list = params[:list] || session[:instrument_list] ||"popular"
    @category = params[:category] || session[:instrument_category] ||"currency"

    @game_instruments = case @list
    when "all"
      GameInstrument.where(category_id: @category).all.paginate( page: params[:page] )
    when "popular"
      GameInstrument.where(category_id: @category).all.hot.paginate( page: params[:page] )
    when "collection"
      current_user ? current_user.game_instruments.where(category_id: @category) : []
    end

    symbols = @game_instruments.pluck(:code)
    if symbols.include? params[:symbol]
      @symbol = params[:symbol]
    end
    @symbol ||= symbols.first

    @game_instrument = GameInstrument.where(code: @symbol).first
    session[:instrument_list] = @list
    session[:instrument_category] = @category

  end

  def set_cros_header
    if params[:id] =~ /forex/
      response.headers['Access-Control-Allow-Origin'] = '*'
    end
  end

  def set_page_width
    if params[:id] =~ /forex_adv/
      @fullwith_content = true
    end
  end
end
