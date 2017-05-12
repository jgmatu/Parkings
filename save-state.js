const REPO = "Parkings";

$( function() {
      var github = null;

      var dialog = $( "#form-save-state" ).dialog({
            autoOpen: false,
            height: 300,
            width: 290,
            modal: true,

            open : function() {
                  $(".ui-dialog-titlebar ").remove()
                  $("#form-collection").dialog( "close" );
                  $("#form-load-state").dialog( "close" );
            },
      });

      var form = dialog.find( "#form-save-state" ).on( "submit", function( event ) {
            event.preventDefault();
      });

      $( ".save-state" ).button().on( "click", function() {
            dialog.dialog( "open" );
      });

      $( "#save-state-btn" ).click(function() {
            console.log("*^^^^^^^");

            var file = $( "#file-save" ).val();
            var user = $( "#user-save" ).val();
            var token = $( "#token-save" ).val();

            if (file == "" || user == "" || token == "") {
                  alert("Invalid all fields must be filled out");
                  return;
            }
            getToken( token );
            saveState( user , file );

            dialog.dialog( "close" );
      });

      $(".cancel-form-button").click(function() {
            console.log("Button cancel from selected...");
            dialog.dialog( "close" );
      });

      var getToken = function ( token ) {
            github = new Github({
                  token: token,
                  auth: "oauth"
            });
      }

      var saveState = function ( user ,  file ) {
            repo = github.getRepo( user, REPO);

            if (repo == undefined) {
                  alert("Error getting repo... try again!");
                  return;
            }
            writeData( file );
      }

      var writeData = function ( file ) {
            var message = "save state parkings...";
            var data = {
                  "collections" : collections,
                  "installations" : installations
            };
            repo.write("master", file, JSON.stringify(data), message, promiseWriteCb);
      }
});

$( function() {

      var dialogL = $( "#form-load-state" ).dialog({
            autoOpen: false,
            height: 300,
            width: 290,
            modal: true,

            open : function() {
                  $(".ui-dialog-titlebar ").remove()
                  $("#form-collection").dialog( "close" );
            },
      });

      var form = dialogL.find( "#form-load-state" ).on( "submit", function( event ) {
            event.preventDefault();
      });

      $( ".load-state" ).button().on( "click", function() {
            dialogL.dialog( "open" );
      });

      $("#load-state-btn").click(function() {
            var file =  $( "#file-load"  ).val();
            var user =  $( "#user-load"  ).val();
            var token = $( "#token-load" ).val();

            if ( file == "" || user == "" || token == "") {
                  alert("Invalid... al fields must be filled out");
                  return;
            }
            loadState( user , file );

            dialogL.dialog( "close" );
      });

      $(".cancel-form-button").click(function() {
            console.log("Button cancel from selected...");
            dialogL.dialog( "close" );
      });

      var readData = function ( file ) {
            repo.read('master', 'datafile', function(err, data) {
                  console.log (err, data);
                  $("#readfile").html("<p>Contents:</p><p>" + data + "</p>");
            });
      }
});

var promiseWriteCb = function() {
      console.log("RECEIVED PROMISE!");
}
