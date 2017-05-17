var dataInstallations = [];

$( function () {

      $("#button-main-list").click(function() {
            $("#button-main-list").hide()
            request("202584-0-aparcamientos-residentes.json");
      });

      $("#button-accounts-list").click(function() {
            $("#button-accounts-list").hide()
            accountsGoogle();
            $( ".hide-list-accounts" ).show("clip" , {}, 500);
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
      $("#mapid").hide();
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
      setListsDraggables( $( "#list-installations-mng-collections" ), $( "#list-collection-installations" ) );
      setSelectableInstallations( $( ".list-installations-selected tr" ) );
      setSelectableListCollections( $( "#selectable-collection-main tr" ) );

      $( ".hide-list" ).show("clip" , {}, 1000);
      $( "#mapid" ).show("drop" , {}, 1000);
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

      // Let the primary items be draggable.
      $( "tr", $primary ).draggable({
            revert: "invalid", // when not dropped, the item will revert back to its initial position
            containment: "document",
            helper: "clone",
            cursor: "move",
      });

      // Let the secondary items be draggable.
      $( "tr", $secondary ).draggable({
            revert: "invalid", // when not dropped, the item will revert back to its initial position
            containment: "document",
            helper: "clone",
            cursor: "move",
      });

      // Let the secondary be droppable, accepting the primary items
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

      var reinsert = function ( $item ) {
            var row = '<tr class="ui-selectee">' + $item.html() + '</tr>';

            if ( $( $secondary ).attr('id') == "list-collection-installations" )  {
                  $("#list-installations-mng-collections").prepend(row);

                  // Because the reinsert is not draggable...
                  setListsDraggables( $( "#list-installations-mng-collections" ), $( "#list-collection-installations" ) );
                  console.log("Saving collection : " + $( "#list-collection-management-installations th" ).text());
                  saveCollection( $( "#list-collection-management-installations th" ).text() );
            }

            if ( $( $secondary ).attr('id') == "list-accounts-installation" ) {
                  $("#list-accounts-google-plus").prepend(row);

                  // Because the reinsert is not draggable...
                  setListsDraggables($( "#list-accounts-google-plus" ), $( "#list-accounts-installation" ));
                  saveInstallationAccounts( $ ( "#list-accounts-tab-people th").text() );
            }
      }

      var isAlreadyInsert = function ( $item ) {
            var alreadyIns = false;

            $.each( $( "tr", $secondary ) , function(i , value) {
                  if ( $( this ).text() == $( "td", $item ).html() ) {
                        alreadyIns = true;
                  }
            });
            return alreadyIns;
      }

      // Select item from main list installations in mng collections... or
      // select item from accounts google + and insert in the rigth list...
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
            reinsert( $item ); // Resinsert the item to the list not drop from main list...
            addItemInstCollMainTab( $item );
      };

      // Delete from list mng collection installations or people installation owners...
      var undoSelectItem = function ( $item ) {
            $item.fadeOut(function() {
                  $item
                  .css( "width", "100%")
            });
            $( $item ).remove();
            delItemInstCollMainTab( $item );
      };

      var addItemInstCollMainTab = function ( $item ) {
            if ( $( $secondary ).attr('id') != "list-collection-installations" ) {
                  return;
            }
            var row = '<tr class="ui-selectee"><td class="text-center ui-widget-content">' + $("td", $item).text() + '</td></tr>';

            $("#selectable-collection-main").append(row);
            setSelectableInstallations( $( ".list-installations-selected tr" ) );
      }

      var delItemInstCollMainTab = function ( $item ) {
            if ($($primary).attr('id') != "list-installations-mng-collections") {
                  return;
            }

            $.each( $("#selectable-collection-main tr"), function(i , row) {
                  if ( $( this ).text() == $("td", $item).text() ) {
                        $( this ).remove();
                  }
            });
      }
}

var setInstallation = function ( name ) {
      showInstallation(name);
      showManagementInst();
}

var showInstallation = function ( name ) {
      var installation = getElementByName(name);

      if (installation == null) {
            return;
      }
      resetDescription();
      setTitle(installation.title);
      setAddress(installation.address);
      setOrganization(installation.organization);

      // Carousel images...
      $(".carousel-inner").html("");
      showImages(installation.location);
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
      if (!init) {
            // Show installation in management installations...
            $(".hide-list-installation-people").show();
            $(".description-installation, .well").show();
            setListsDraggables($( "#list-accounts-google-plus" ), $( "#list-accounts-installation" ));
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

var isNameInstallation = function ( installation, name ) {
      return installation.title == name;
}

var imagesWikiCommons = function ( location ) {
        var urlWiki = "https://commons.wikimedia.org/w/api.php?format=json&action=query&generator=geosearch&ggsprimary=all&ggsnamespace=6&ggsradius=500&ggscoord=" +
        location.latitude + "|" + location.longitude + "&ggslimit=10&prop=imageinfo&iilimit=1&iiprop=url&iiurlwidth=200&iiurlheight=200&callback=?";

        $.getJSON(urlWiki, function(json) {
                var urls = [];

                for (page in json.query.pages) {
                        urls.length = urls.push(json.query.pages[page].imageinfo[0].url);
                }
                setImages(urls);
        });
}

var f = function (json) {
        console.log(json);
}


var imagesFlickr = function ( location ) {
    var urlFlickr = 'http://api.flickr.com/services/feeds/photos_public.gne?&lat=' + location.latitude + '&loc=' + location.longitude + '&tagmode=any&format=json&jsoncallback=f';

    console.log(location);
    console.log(urlFlickr);

    $("#media").html("");

    $("head").append('<script type="text/javascript" charset="utf-8" src="' + urlFlickr + '"></script>');

}

var showImages = function ( location ) {
      if (location == undefined) {
            return null;
      }
      imagesWikiCommons(location);
      imagesFlickr( location );
}

var setImages = function ( urls ) {
    var n = 0;
    var idx = 0;
    for (var i = 0; i < urls.length; i++) {
          if (n % 4 == 0) {
                idx = idx + 1;
                createItem(idx);
          }
          $("#id-img-row-" + idx).append('<div class="col-sm-3"><a href="#x" class="thumbnail"><img src="' + urls[i] + '" /></a></div>');
          n = n + 1;
    }
}

var createItem = function (idx) {
      if (idx == 1) {
            $(".carousel-inner").append('<div id="id-item-' + idx + '" class="item active">')
      } else {
            $(".carousel-inner").append('<div id="id-item-' + idx + '" class="item">')
      }
      $("#id-item-"+idx).append('<div id="id-img-row-' + idx + '"class="row hidden-xs-down">')
}
