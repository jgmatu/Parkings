var dataInstallations = [];

$( function () {

      // Button initialize the installations and almost application...
      $("#button-main-list").click(function() {
            $("#button-main-list").hide()
            request("202584-0-aparcamientos-residentes.json");
      });

      // Button initialize WebSocket accounts Google+.
      $("#button-accounts-list").click(function() {
            $("#button-accounts-list").hide()
            accountsGoogleWS();
            $( ".hide-list-accounts" ).show("clip" , {}, 500);
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
      req.fail(handError);
}

var handData = function (data) {
      dataInstallations = data;
      for (var i = 0 ; i < data.graph.length; i++) {
            filterInstallation(data.graph[i]);
            addInstallation(data.graph[i]);
      }

      // Show almost performaces app...
      setListsDraggables( $( "#list-installations-mng-collections" ), $( "#list-collection-installations" ) );
      setListsDraggables( $( "#list-accounts-google-plus" ), $( "#list-accounts-installation" ) );

      setSelectableInstallations( $( ".list-installations-selected tr" ) );
      setSelectableListCollections( $( "#selectable-collection-main tr" ) );

      $( ".hide-list" ).show("clip" , {}, 1000);
      $( "#mapid" ).show("drop" , {}, 1000);
}

var handError = function(jqXHR, textFail) {
      alert(jqXHR.responseText);
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
      var marker = L.marker([ltd, lng], {title : installation.title})
            .addTo(mymap)
            .bindPopup("<h5>" + installation.title + "<h5>" + "<p>" + installation.organization["organization-name"] + "</p>")
            .on("click", function ( e ) {
                  dropSelected();
                  setInstallation( e.target._icon.title );
            });
}

var setInstallation = function ( name ) {
      showInstallation( name );
      showMngInstallation();
}

var showInstallation = function ( name ) {
      var installation = getInstallationByName(name);

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
var showMngInstallation = function () {
      if (!init) {
            // Show installation in management installations and
            // init management installations...
            $(".hide-list-installation-people").show();
            $(".description-installation, .well").show();
      }
      init = true;
}

var getInstallationByName = function( name ) {
      var installations = dataInstallations.graph;

      for (var i = 0 ; i < installations.length ; i++) {
            if (installations[i].title == name) {
                  return installations[i];
            }
      }
      return null;
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

var showImages = function ( location ) {
      if (location == undefined) {
            return null;
      }
      imagesWikiCommons(location);
}

var setImages = function ( urls ) {
    var n = 0, idx = 0;

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
