$(function() {
      // There's the gallery and the trash
      var $gallery = $( "#gallery" );
      var $trash = $( "#trash" );

      // Let the gallery items be draggable
      $( "tr", $gallery ).draggable({
            revert: "invalid", // when not dropped, the item will revert back to its initial position
            containment: "document",
            helper: "clone",
            cursor: "move"
      });

      // Let the trash be droppable, accepting the gallery items
      $trash.droppable({
            accept: "#gallery tr",
            classes: {
                  "ui-droppable-active": "ui-state-highlight"
            },
            drop: function( event, ui ) {
                  deleteImage( ui.draggable );
            }
      });

      // Let the gallery be droppable as well, accepting items from the trash
      $gallery.droppable({
            accept: "#trash tr",
            classes: {
                  "ui-droppable-active": "custom-state-active"
            },
            drop: function( event, ui ) {
                  recycleImage( ui.draggable );
            }
      });


      function deleteImage( $item ) {
            $item.fadeOut(function() {
                  var $list = $( "tbody", $trash.find("table") ).length > 0 ? $( "tbody", $trash ) : $item.appendTo($trash)

                  $item.appendTo( $list ).fadeIn(function() {
                        $item
                        .animate({ width: "100%" })
                        .end()
                  });
            });
      }

      function recycleImage( $item ) {
            $item.fadeOut(function() {
                  $item
                  .css( "width", "100%")
                  .appendTo( $gallery )
                  .fadeIn()
            });
      }
});
