var dataCollections = [];

var dropSelected = function() {
      $.each ($(".ui-selected"), function() {
            $(this).removeClass("ui-selected");
      });
}

var getInstallations = function() {
      var installations = [];

      $.each ($("#list-collection-installations tr") , function(){
            installations.push($( this ).text());
      });
      return installations;
}

var createCollection = function ( collection)  {
      var installations = getInstallations();

      var coll = {
            "name" : collection,
            "installations" : installations
      }
      dataCollections.push(coll);
}

var existCollection = function ( collection ) {
      for (var i = 0 ; i < dataCollections.length ; i++) {
            if (dataCollections[i].name == collection) {
                  return true;
            }
      }
      return false;
}

var updateInstallations = function ( collection ) {
      var installations = getInstallations();

      for (var i = 0 ; i < dataCollections.length ; i++) {
            if (dataCollections[i].name == collection) {
                  dataCollections[i].installations = installations;
            }
      }
}

/* Save collection added to table list-collection-installations... */
var saveCollection = function( collection ) {
      if (collection.last().text() == "") {
            return;
      }

      if (existCollection( collection.last().text() )) {
            updateInstallations( collection.last().text() );
      } else {
            createCollection( collection.last().text() );
      }
}

var getCollectionSaved = function ( name ) {
      for (var i = 0 ; i < dataCollections.length ; i++) {
            if (dataCollections[i].name == name) {
                  return dataCollections[i];
            }
      }
      return null;
}

/* Put in table list-collection-installations and selectable-collection-main   the collection... */
var putCollection = function ( collection ) {
      clearInstallations();

      $(".hide-list-collection th").text($("td" , collection).text());

      var collSaved = getCollectionSaved($("td" , collection).text());
      if (collSaved == null) {
            // Likely first time selected...
            return;
      }
      setInstallations(collSaved.installations);
}

var setInstallations = function (installations) {
      for (var i = 0 ; i < installations.length ; i++)  {
            var row = '<tr class="ui-selectee"><td class="text-center ui-widget-content">' + installations[i] + '</td></tr>';
            $(".list-installations-collection").append(row);
      }
      setSelectableInstallations( $( ".list-installations-selected tr" ) );
      setListsDraggables( $( "#list-installations-mng-collections" ), $( "#list-collection-installations" ) );
}

var clearInstallations = function () {
      $(".list-installations-collection").html("");
}

/* Realize selectable list of collections... */
var setSelectableListCollections = function () {
      /* Select a collection from tab management collection... */
      $( "#selectable-collection tr" ).selectable({
            stop: function() {
                  $( ".hide-list-collection" ).show();
                  $( ".hide-list-collection th" ).text($( ".ui-selected" ).last().text());
            },
            selected: function( event, ui ) {
                  saveCollection ( $( ".hide-list-collection th" ) );
                  putCollection  ( $( this ) );

                  dropSelected();
                  $( this ).addClass("ui-selected");
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
