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
            filterInstallation(data.graph[i]);
            addInstallation(data.graph[i]);
      }
      $( ".hide-list" ).show("clip" , {}, 500);

      setListsDraggables($( "#list-primary-select" ), $( "#list-secondary-select" ));
      setSelectableInstallations( $( ".list-installations-selected tr" ) );
      setSelectableListCollections( $( "#selectable-collection-main tr" ) );
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
      installation.title = installation.title.replace("del Centro", "")
}

var addMarker = function(installation) {
      if (installation.location == undefined) {
            return;
      }
      var ltd = installation.location.latitude;
      var lng = installation.location.longitude;
      var marker = L.marker([ltd, lng], {title : installation.title}).addTo(mymap)
            .bindPopup("<h5>" + installation.title + "<h5>" + "<p>" + installation.organization["organization-name"] + "</p>").on("click", onClick);
}

var onClick = function(e) {
      dropSelected();
      setInstallation(e.target._icon.title);
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


var setInstallation = function ( name ) {
      showInstallation(name);
      showManagementInst();
}

var showInstallation = function ( name ) {
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

var init = false;
var showManagementInst = function () {
      // Show installation in management installations...
      if (!init) {
            $(".hide-list-installation-people").show();
            $(".description-installation, .well").show();
            setListsDraggables($( "#list-primary-select2" ), $( "#list-secondary-select2" ));
      }
      init = true;
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
      if (location == undefined) {
            return;
      }

      var url = "https://commons.wikimedia.org/w/api.php?format=json&action=query&generator=geosearch&ggsprimary=all&ggsnamespace=6&ggsradius=500&ggscoord=" +
                        location.latitude + "|" + location.longitude + "&ggslimit=10&prop=imageinfo&iilimit=1&iiprop=url&iiurlwidth=200&iiurlheight=200&callback=?";

      $.getJSON(url, function(json) {
            var n = 0;
            var idx = 0;
            for (var page in json.query.pages) {
                  var urlImg = json.query.pages[page].imageinfo[0].url;

                  if (n % 4 == 0) {
                        idx = idx + 1;
                        createSplit(idx);
                  }
                  $("#id-img-row-" + idx).append('<div class="col-sm-3"><a href="#x" class="thumbnail"><img src="' + urlImg + '" /></a></div>');
                  n = n + 1;
            }
      });
}

var createSplit = function (idx) {
      if (idx == 1) {
            $(".carousel-inner").append('<div id="id-item-' + idx + '" class="item active">')
      } else {
            $(".carousel-inner").append('<div id="id-item-' + idx + '" class="item">')
      }
      $("#id-item-"+idx).append('<div id="id-img-row-' + idx + '"class="row hidden-xs-down">')
}
