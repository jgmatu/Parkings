var dataCollections = {};

var dropSelected = function() {
      $.each ($(".ui-selected"), function() {
            $(this).removeClass("ui-selected");
      });
}


/* Save collection added to table list-collection-installations... */
var saveCollection = function() {

}

/* Put in table list-collection-installations and selectable-collection-main   the collection... */
var putCollection = function () {

}

/* Realize selectable list of collections... */
var setSelectableListCollections = function () {
      /* Select a collection from tab management collection... */
      $( "#selectable-collection tr" ).selectable({
            stop: function() {
                  $(".hide-list-collection").show();
                  $(".hide-list-collection th").text($(".ui-selected").last().text());
            },

            selected: function( event, ui ) {
                  dropSelected();
                  $(this).addClass("ui-selected");
                  saveCollection();
                  putCollection($(this));
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
