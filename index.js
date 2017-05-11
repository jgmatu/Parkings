$( function () {
      var dataInstallations;

      $("#button-main-list").click(function() {
            $("#button-main-list").hide()
            request("202584-0-aparcamientos-residentes.json");
      });

      $("#button-accounts-list").click(function() {
            $("#button-accounts-list").hide()
            $(".hide-list-accounts").show("clip" , {}, 500);
      });

      $(".tab-selected").click(function() {
            $(".form").dialog( "close" );
      });

      hideAll();
});

var hideAll = function() {
      $(".hide-list").hide()
      $(".hide-list-installations").hide()
      $(".hide-list-collection").hide()
      $(".hide-list-accounts").hide()
      $(".description-installation, .well").hide()
      $(".hide-list-installation-people").hide();
}

var request = function (uri) {
      var req = $.ajax({
            type : "GET",
            url : uri,
            cache : true
      });
      req.done(handData);
//      req.fail(handError);
//      req.always(handAlways);
}

var handData = function (data) {
      dataInstallations = data;
      for (var i = 0 ; i < data.graph.length; i++) {
            addInstallation(data.graph[i]);
      }
      $( ".hide-list" ).show("clip" , {}, 500);

      setListsDraggables($( "#list-primary-select" ), $( "#list-secondary-select" ));
      setSelectable($( ".list-installations-selected tr, #selectable-collection-main tr" ));
}

var handError = function(jqXHR, textFail) {
      $(" #error ").show();

      $(" #error ").append("<p>" + jqXHR.responseText + "</p>");
}

var handAlways = function () {
      $ (" #info ").show();
      $ (" #info ").append("<p> Asyncronous get complete! </p>");
}


var addInstallation = function(installation) {
      filterInstallation(installation);

      var row = '<tr class="ui-selectee"><td class="text-center ui-widget-content">' + installation.title + '</td></tr>';
      $(".list-installations").append(row);
      addMarker(installation);
}

var filterInstallation = function (installation) {
      installation.title = installation.title.replace("Aparcamiento", "")
      installation.title = installation.title.replace("mixto", "")
      installation.title = installation.title.replace("público", "")
      installation.title = installation.title.replace(".", "")
      installation.title = installation.title.replace("para residentes", "")
      installation.title = installation.title.replace("para Residentes", "")
}


var addMarker = function(installation) {
      if (installation.location == undefined) {
            return;
      }
      var ltd = installation.location.latitude;
      var lng = installation.location.longitude;

      L.marker([ltd, lng]).addTo(mymap)
            .bindPopup(installation.title).openPopup().on("click", onClick);
/*
      function onMapClick(e) {
            popup
                  .setLatLng(e.latlng)
                  .setContent("You clicked the map at " + e.latlng.toString())
                  .openOn(mymap);
      }
      mymap.on('click', onMapClick);
*/
}

var onClick = function(e) {
      console.log(e);
      console.log(this.name)
}


var setListsDraggables = function($primary, $secondary) {

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
            accept: "#list-primary-select tr, #list-primary-select2 tr",
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
            accept: "#list-secondary-select tr, #list-secondary-select2 tr",
            classes: {
                  "ui-droppable-active": "ui-state-highlight",
                  "ui-droppable-active": "custom-state-active"
            },
            drop: function( event, ui ) {
                  undoSelectItem( ui.draggable );
            }
      });

      var selectItem = function ( $item ) {
            $item.fadeOut(function() {
                  var $list = $( "tbody", $secondary.find("table") ).length > 0 ? $( "tbody", $secondary ) : $item.appendTo($secondary)

                  $item.appendTo( $list ).fadeIn(function() {
                        $item
                        .animate({ width: "100%" })
                        .end()
                  });
            });
      };

      var undoSelectItem = function ( $item ) {
            $item.fadeOut(function() {
                  $item
                  .css( "width", "100%")
                  .appendTo( $primary )
                  .fadeIn()
            });
      };
}

var setSelectable = function($list) {
      /* Select an Installation from lists installations... */
      $list.selectable({
            stop: function() {
                  showInstallation($(this));
                  showManagementInst($(this));
            },
            selected: function( event, ui ) {
                  $.each ($(".ui-selected"), function() {
                        $(this).removeClass("ui-selected");
                  });
                  $(this).addClass("ui-selected");
            }
      });
}

var showInstallation = function ( item ) {
      var name = $("td", item).text();
      var installation = getElementByName(name);

      if (installation == null) {
            console.log("Error...");
            return;
      }
      resetDescription();

      setTitle(installation.title);
      setAddress(installation.address);
      setOrganization(installation.organization);
      setImages(installation.location);
      $(".description-installation, .well").show();
}

var resetDescription = function () {
      $(".description-installation").html("");
}

var setTitle = function (title) {
      $(".description-installation").append("<h3>" + title + "</h3>")
}

var setAddress = function (address) {
      var addr = "<p> Localidad : " + address["locality"] + " " + " Codigo postal : " + address["postal-code"] + "</p>";

      $(".description-installation").append(addr);
      $(".description-installation").append("<p> Street : " + address["street-address"] + "</p>");
}

var setOrganization = function (organization) {
      $(".description-installation").append("<p>" + organization["organization-name"] + "</p>");
      $(".description-installation").append("<p>" + organization["organization-desc"] + "</p>");
}

var showManagementInst = function (item) {
      // Show installation in management installations...
      $(".hide-list-installation-people").show();
      setListsDraggables($( "#list-primary-select2" ), $( "#list-secondary-select2" ));
}

var getElementByName = function( name ) {
      var installations = dataInstallations.graph;

      for (var i = 0 ; i < installations.length ; i++) {
            if (isNameInstallation(installations[i], name)) {
                  return installations[i];
            }
      }
      return null;
}

var isNameInstallation = function (installation, name) {
      return installation.title == name;
}


var setImages = function (location) {
      $(".carousel-inner").html("");

      var url = "https://commons.wikimedia.org/w/api.php?format=json&action=query&generator=geosearch&ggsprimary=all&ggsnamespace=6&ggsradius=500&ggscoord=" +
                        location.latitude + "|" + location.longitude + "&ggslimit=10&prop=imageinfo&iilimit=1&iiprop=url&iiurlwidth=200&iiurlheight=200&callback=?";


      $.getJSON(url, function(json) {
            var n = 0;

            for (var page in json.query.pages) {
                  var urlImg = json.query.pages[page].imageinfo[0].url;

                  if (n % 4 == 0) {
                        createSplit(n);
                        var idx = n;
                  }
                  $("#img-row-" + idx).append('<div class="col-sm-3"><a href="#x" class="thumbnail"><img src="' + urlImg + '" /></a></div>')
                  n = n + 1;
            }
      });
}

var createSplit = function (n) {
      if (n == 0) {
            $(".carousel-inner").append('<div id="item-' + n + '" class="item active">')
      } else {
            $(".carousel-inner").append('<div id="item-' + n + '" class="item">')
      }
      $("#item-"+n).append('<div id="img-row-' + n + '"class="row hidden-xs-down">')
}
