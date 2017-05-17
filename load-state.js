$( function() {
      const REPO = "Parkings";

      var github = null;

      var dialogL = $( "#form-load-state" ).dialog({
            autoOpen: false,
            height: 300,
            width: 290,
            modal: true,

            open : function() {
                  $(".ui-dialog-titlebar ").remove()
                  $("#form-collection").dialog( "close" );
                  $("form-save-state").dialog( "close" );
            },
      });

      var form = dialogL.find( "#form-load-state" ).on( "submit", function( event ) {
            event.preventDefault();
      });

      $( ".load-state" ).button().on( "click", function() {
            dialogL.dialog( "open" );
      });

      var getToken = function ( token ) {
            github = new Github({
                  token: token,
                  auth: "oauth"
            });
      }

      var loadState = function (user ,file) {
            var repo = github.getRepo( user, REPO);

            if (repo == undefined) {
                  alert("Error getting repo... try again!");
                  return;
            }
            readData( repo, file );
      }

      var restoreSession = function () {
            restoreCollections();
            restoreInstallations();
      }

      var restoreInstallations = function () {
            for (var i = 0 ; i < installations.length ; i++) {
                  console.log(installations[i]);
            }
      }

      var restoreCollection = function ( collection ) {
            var row = '<tr class="ui-selectee"><td class="text-center ui-widget-content">' + collection.name + '</td></tr>';

            $("#selectable-collection").append(row);
      }

      var restoreCollections = function () {
            for (var i = 0 ; i < collections.length ; i++)  {
                  restoreCollection(collections[i]);
            }
            setSelectableListCollections();
      }

      var readData = function ( repo, file ) {
            repo.read('master', file, function (err, data) {
                  if (err != null) {
                        alert("Error reading respository : " + err);
                        return;
                  }
                  data = JSON.parse(data);
                  collections = data.collections;
                  installations = data.installations;
                  restoreSession();
            });
      }

      $("#load-state-btn").click(function() {
            var file =  $( "#file-load"  ).val();
            var user =  $( "#user-load"  ).val();
            var token = $( "#token-load" ).val();

            if ( file == "" || user == "" || token == "") {
                  alert("Invalid... al fields must be filled out");
                  return;
            }
            getToken( token )
            loadState( user , file );
            dialogL.dialog( "close" );
      });

      $(".cancel-form-button").click(function() {
            dialogL.dialog( "close" );
      });
});
