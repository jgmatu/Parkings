$( function() {

      /* Select an Installation from list installations tab main... */
      $( ".list-installations-selected" ).selectable({
            stop: function() {
                  console.log($(".ui-selected").last().text());
                  $(".description-installation").show();
                  $(".hide-list-installation-people").show();
            }
      });

      /* Select an installation from collection list in main... */
      $( "#selectable-collection-main" ).selectable({
            stop: function() {
                  console.log($(".ui-selected").last().text());
                  $(".description-installation").show();
                  $(".hide-list-installation-people").show();
            }
      });

      /* Select a collection from tab management collection... */
      $( "#selectable-collection" ).selectable({
            stop: function() {
                  console.log($(".ui-selected").last().text());
                  $(".hide-list-collection").show()
                  $(".hide-list-collection th").text($(".ui-selected").last().text())
            }
      });
});
