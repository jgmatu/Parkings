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

      $("#save-state-btn").click(function() {
            var file = $( "#file-name" ).val();
            var user = $( "#user-name" ).val();
            var token = $( "#token-name" ).val();

            if (file == "" || user == "" || token == "") {
                  alert("Invalid... al fields must be filled out");
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
      var dialog = $( "#form-load-state" ).dialog({
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

      var form = dialog.find( "#form-load" ).on( "submit", function( event ) {
            event.preventDefault();
      });

      $( ".save-state" ).button().on( "click", function() {
            dialog.dialog( "open" );
      });

      $("#save-load-btn").click(function() {
            var file = $( "#file" ).val();
            var user = $( "#user" ).val();

            if ( file == "" || user == "" ) {
                  alert("Invalid... al fields must be filled out");
                  return;
            }
            loadState( user , file );

            dialog.dialog( "close" );
      });

      $(".cancel-form-button").click(function() {
            console.log("Button cancel from selected...");
            dialog.dialog( "close" );
      });

      var readData = function ( file ) {
            repo.read('master', 'datafile', function(err, data) {
                  console.log (err, data);
                  $("#readfile").html("<p>Contents:</p><p>" + data + "</p>");
            });
      }
});




function promiseWriteCb() {
      console.log("RECEIVED PROMISE!");
}
