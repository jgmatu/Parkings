$( function() {
      const REPO = "Parkings";

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
            dialog.dialog( "close" );
      });

      var getToken = function ( token ) {
            github = new Github({
                  token: token,
                  auth: "oauth"
            });
      }

      var saveState = function ( user ,  file ) {
            var repo = github.getRepo( user, REPO);

            if (repo == undefined) {
                  alert("Error getting repo... try again!");
                  return;
            }
            writeData( repo, file );
      }

      var writeData = function (repo, file ) {
            var message = "save state parkings...";
            var data = {
                  "collections" : collections,
                  "installations" : installations
            };
            repo.write("master", file, JSON.stringify(data), message, promiseWriteCb);
      }


      var promiseWriteCb = function() {
            console.log("RECEIVED PROMISE!");
      }

});
