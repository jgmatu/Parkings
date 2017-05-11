$( function() {
      /* Select a collection from tab management collection... */
      $( "#selectable-collection tr" ).selectable({
            stop: function() {
                  $(".hide-list-collection").show()
                  $(".hide-list-collection th").text($(".ui-selected").last().text())
            },

            selected: function( event, ui ) {
                  $.each ($(".ui-selected"), function() {
                        $(this).removeClass("ui-selected");
                  });
                  $(this).addClass("ui-selected");
            }
      });
});
