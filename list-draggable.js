var setListsDraggables = function($primary, $secondary) {

      // Let the primary items be draggable...
      $( "tr", $primary ).draggable({
            revert: "invalid", // when not dropped, the item will revert back to its initial position.
            containment: "document",
            helper: "clone",
            cursor: "move",
      });

      // Let the secondary items be draggable...
      $( "tr", $secondary ).draggable({
            revert: "invalid", // when not dropped, the item will revert back to its initial position.
            containment: "document",
            helper: "clone",
            cursor: "move",
      });

      // Let the secondary be droppable, accepting the primary items...
      $secondary.droppable({
            accept: "#list-installations-mng-collections tr, #list-accounts-google-plus tr",
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
            accept: "#list-collection-installations tr, #list-accounts-installation tr",
            classes: {
                  "ui-droppable-active": "ui-state-highlight",
                  "ui-droppable-active": "custom-state-active"
            },
            drop: function( event, ui ) {
                  undoSelectItem( ui.draggable );
            }
      });

      // Resinsert the item to the list not drop the item from main list...
      var reinsert = function ( $item ) {
            var row = '<tr class="ui-selectee">' + $item.html() + '</tr>';

            if ( $( $secondary ).attr('id') == "list-collection-installations" )  {
                  $("#list-installations-mng-collections").prepend(row);
                  saveCollection( $( "#list-collection-management-installations th" ).text() );

                  // Because the reinsert is not draggable...
                  setListsDraggables( $( "#list-installations-mng-collections" ), $( "#list-collection-installations" ) );
            }

            if ( $( $secondary ).attr('id') == "list-accounts-installation" ) {
                  $("#list-accounts-google-plus").prepend(row);
                  saveInstallationAccounts( $( "#list-accounts-tab-people th" ).text() );

                  // Because the reinsert is not draggable...
                  setListsDraggables($( "#list-accounts-google-plus" ), $( "#list-accounts-installation" ));
            }
      }

      var isAlreadyInsertCollection = function ( $item , actual ) {
            return actual.text() == $( "td", $item ).html();
      }

      var isAlreadyInsertAccount = function ( $item, actual) {
            return actual.text() == $("p", $item).text();
      }

      var isAlreadyInsert = function ( $item ) {
            var isAlreadyIns = false;

            $.each( $( "tr", $secondary ) , function(i , value) {
                  isAlreadyIns = isAlreadyInsertCollection( $item, $(this)) || isAlreadyInsertAccount ($item, $(this));
                  if (isAlreadyIns) {
                        return false;
                  }
            });
            return isAlreadyIns;
      }

      // Select item from main list installations in mng-collections...
      // Select item from accounts google+ and insert in the rigth list...
      var selectItem = function ( $item ) {
            if (isAlreadyInsert( $item )) {
                  return;
            }

            var $list = $( "tbody", $secondary.find("table") ).length > 0 ? $( "tbody", $secondary ) : $item.appendTo( $secondary )
            $item.fadeOut(function(){
                  $item.appendTo( $list ).fadeIn(function() {
                        $item
                        .animate({ width: "100%" })
                        .end()
                  });
            });
            reinsert( $item );

            // In real time when dropped...
            addInstallationTabMain( $item );
      };

      // Delete from list mng collection installations or people installation owners...
      var undoSelectItem = function ( $item ) {
            $item.fadeOut(function() {
                  $item
                  .css( "width", "100%")
                  .remove()
            });

            // Delete the installation from list installation collection in main tab...
            delItemInstCollMainTab($item);
      };

      var delItemInstCollMainTab = function ( $item ) {
            var attr = $($primary).attr('id');

            if (attr != "list-installations-mng-collections") {
                  return;
            }
            $.each($("#selectable-collection-main tr"), function(i , row) {
                  if ($(this).text() == $("td", $item).text()) {
                        $(this).remove();
                  }
            });
      }

      var addInstallationTabMain = function ( $item ) {
            if ( $( $secondary ).attr('id') != "list-collection-installations" ) {
                  return;
            }
            var row = '<tr class="ui-selectee"><td class="text-center ui-widget-content">' + $("td", $item).text() + '</td></tr>';

            $( "#selectable-collection-main" ).append(row);
            setSelectableInstallations( $( "#selectable-collection-main tr" ) );
      }
}
