$(function() {

      // There's the gallery and the trash
      var $primary     = $( "#list-primary-select" );
      var $secondary   = $( "#list-secondary-select" );

      // Let the primary items be draggable
      $( "tr", $primary ).draggable({
            revert: "invalid", // when not dropped, the item will revert back to its initial position
            containment: "document",
            helper: "clone",
            cursor: "move"
      });

      // Let the secondary items be draggable
      $( "tr", $secondary ).draggable({
            revert: "invalid", // when not dropped, the item will revert back to its initial position
            containment: "document",
            helper: "clone",
            cursor: "move"
      });

      // Let the secondary be droppable, accepting the primary items
      $secondary.droppable({
            accept: "#list-primary-select tr",
            classes: {
                  "ui-droppable-active": "ui-state-highlight",
                  "ui-droppable-active": "custom-state-active"
            },
            drop: function( event, ui ) {
                  selectItem( ui.draggable );
            }
      });

      // Let the primary be droppable as well, accepting items from the secondary
      $primary.droppable({
            accept: "#list-secondary-select tr",
            classes: {
                  "ui-droppable-active": "ui-state-highlight",
                  "ui-droppable-active": "custom-state-active"
            },
            drop: function( event, ui ) {
                  undoSelectItem( ui.draggable );
            }
      });

      function selectItem( $item ) {
            $item.fadeOut(function() {
                  var $list = $( "tbody", $secondary.find("table") ).length > 0 ? $( "tbody", $secondary ) : $item.appendTo($secondary)

                  $item.appendTo( $list ).fadeIn(function() {
                        $item
                        .animate({ width: "100%" })
                        .end()
                  });
            });
            console.log("Item added to collection... : " + $item.text());
      }

      function undoSelectItem( $item ) {
            $item.fadeOut(function() {
                  $item
                  .css( "width", "100%")
                  .appendTo( $primary )
                  .fadeIn()
            });
            console.log("Item deleted of collection... : " + $item.text());
      }
});
