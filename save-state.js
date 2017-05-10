$( function() {
      var dialog = $( "#form-save-state" ).dialog({
            autoOpen: false,
            height: 300,
            width: 290,
            modal: true,

            open : function() {
                  $(".ui-dialog-titlebar ").remove()
                  $("#form-collection").dialog( "close" );
            },
            close: function() {
                  console.log("Form closed...");
            }
      });

      var form = dialog.find( "#form-save" ).on( "submit", function( event ) {
            event.preventDefault();
      });

      $( ".save-state" ).button().on( "click", function() {
            dialog.dialog( "open" );
      });

      $(".create-form-button").click(function(){
            console.log("Button create collection selected...");
            dialog.dialog( "close" );
      });

      $(".cancel-form-button").click(function(){
            console.log("Button cancel collection selected...");
            dialog.dialog( "close" );
      });
});
