$( function() {
      var dialog = $( "#form-collection" ).dialog({
            autoOpen: false,
            height: 300,
            width: 290,
            modal: true,

            open : function() {
                  $(".ui-dialog-titlebar ").remove()
                  $("#form-save-state").dialog( "close" );
            },
      });

      var form = dialog.find( "#form-collection" ).on( "submit", function( event ) {
            event.preventDefault();
      });

      $( "#create-collection" ).button().on( "click", function() {
            dialog.dialog( "open" );
      });


      var isInvalidCollection = function (name) {
            var collections = $("#selectable-collection td");
            var invalid = false;

            $.each (collections, function (i, collection) {
                  if (name == $(collection).text()) {
                        invalid = true;
                  }
            });
            return invalid;
      }

      var addCollection = function (collection) {
            var row = '<tr class="ui-selectable"><td class="text-center ui-widget-content ui-selectee">' + collection + '</td></tr>';

            $("#selectable-collection").append(row);
            saveCollection( collection );
      }


      $("#create-collection-btn").click(function(){
            var collection = $("#name-collection").val();

            if (isInvalidCollection(collection)) {
                  alert("Bad collection name... likely already assigned");
                  return;
            }
            // Create collection...
            addCollection(collection);
            setSelectableListCollections($("#selectable-collection tr"));
            dialog.dialog( "close" );
      });

      $(".cancel-form-button").click(function(){
            dialog.dialog( "close" );
      });
});
