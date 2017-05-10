$( function () {

      $("#button-main-list").click(function() {
            $("#button-main-list").hide()
            $( ".hide-list" ).show("clip" , {}, 500);
      });

      $("#button-accounts-list").click(function() {
            $("#button-accounts-list").hide()
            $(".hide-list-accounts").show("clip" , {}, 500);
      });

      $(".tab-selected").click(function() {
            $(".form").dialog( "close" );
      });

      hideAll();
});

var hideAll = function () {
      $(".hide-list").hide()
      $(".hide-list-installations").hide()
      $(".hide-list-collection").hide()
      $(".hide-list-accounts").hide()
      $(".description-installation").hide()
      $(".hide-list-installation-people").hide();
}
