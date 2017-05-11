var dropSelected = function() {
      $.each ($(".ui-selected"), function() {
            $(this).removeClass("ui-selected");
      });
}


/* Realiza selectable list of collections... */
var setSelectableListCollections = function () {
      /* Select a collection from tab management collection... */
      $( "#selectable-collection tr" ).selectable({
            stop: function() {
                  $(".hide-list-collection").show()
                  $(".hide-list-collection th").text($(".ui-selected").last().text())
            },

            selected: function( event, ui ) {
                  dropSelected();
                  $(this).addClass("ui-selected");
            }
      });
}

/* Realize the list of installations Selectable. */
var setSelectableInstallations = function($list) {
      $list.selectable({
            stop: function() {
                  var name = $("td", $(this)).text();
                  setInstallation(name);
            },
            selected: function( event, ui ) {
                  dropSelected();
                  $(this).addClass("ui-selected");
                  mymap.closePopup();
            }
      });
}
