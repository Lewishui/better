//= require application


$(function () {
  $('.calendar').datetimepicker({format: "YYYY-MM-DD"});
});

function select_bank(bank_id, user_bank_json){
  var user_bank = $.parseJSON(user_bank_json);
  var disable = true;
  if(bank_id==""){
    disable = false;
    $("#password_div").show();
    $("#submit_div").show();
  }else{
    $("#password_div").hide();
    $("#submit_div").hide();
  }
  $("#user_bank_name").val(user_bank.name).attr("disabled",disable);
  $("#user_bank_card_number").val(user_bank.card_number).attr("disabled",disable);
  $("#user_bank_branch_name").val(user_bank.branch_name).attr("disabled",disable);
  $("#user_bank_address").val(user_bank.address).attr("disabled",disable);
}

function select_bank_for_drawing(bank_id, user_bank_json){
  var user_bank = $.parseJSON(user_bank_json);
  var disable = true;
  if(bank_id==""){
    disable = false;
    if($("#drawing_user_bank_attributes_id").length>0){$("#drawing_user_bank_attributes_id").remove();}
  }else{
    if($("#drawing_user_bank_attributes_id").length>0){
      $("#drawing_user_bank_attributes_id").val(bank_id);
    }else{
      $("#current_money_password").after("<input id='drawing_user_bank_attributes_id' type='hidden' name='drawing[user_bank_attributes][id]'' value='"+bank_id+"'>" );
    }
  }
  $("#drawing_user_bank_attributes_name").val(user_bank.name).attr("disabled",disable);
  $("#drawing_user_bank_attributes_card_number").val(user_bank.card_number).attr("disabled",disable);
  $("#drawing_user_bank_attributes_branch_name").val(user_bank.branch_name).attr("disabled",disable);
  $("#drawing_user_bank_attributes_address").val(user_bank.address).attr("disabled",disable);
}
