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
                var pages = json.query.pages;

                for (page in pages) {
                        urls.length = urls.push(pages[page].imageinfo[0].url);
                }
                setImages(urls);
        });
}

var imagesFlickr = function ( location ) {
      var urlFlickr = "https://api.flickr.com/services/rest/?method=flickr.photos.search&" +
            "api_key=984feb1869de41d9f3b85fce80a1a13d&accuracy=16&lat="+location.latitude+"&lon=" +
            location.longitude+"&format=json&jsoncallback=?";

      $.getJSON(urlFlickr, function (json) {
            var photos = json.photos.photo;

            for (var i = 0 ; i < photos.length ; i++) {
                  getImageFlickr(photos[i].id);
            }
      });
}

var getImageFlickr = function ( id ) {
      var urlInfoImg = "https://api.flickr.com/services/rest/?method="+
      "flickr.photos.getSizes&api_key=984feb1869de41d9f3b85fce80a1a13d"+
      "&photo_id=" + id + "&format=json&jsoncallback=?";

      $.getJSON(urlInfoImg, function (json) {
            var sizes = json.sizes.size;

            for (var i = 0 ; i < sizes.length ; i++) {
                  if (sizes[i].label == "Small 320") {
                        setImage(sizes[i].source);
                  }
            }
      });
}

var showImages = function ( location ) {
      if (location == undefined) {
            return null;
      }

      imagesWikiCommons(location);
      imagesFlickr(location);
}

var setImage = function ( url ) {
      if ($(".carousel-inner .item").last().children().length == 4) {
            $(".carousel-inner")
                  .append('<div class="item">' + insertImage(url) +  '</div>');
      } else {
            $(".carousel-inner .item")
                  .last()
                  .append(insertImage(url));
      }
}

var setImages = function ( urls ) {
      var n = 4;

      for (var i = 0; i < urls.length; i++) {
            var urlsItem = urls.slice(i , i + n);

            if (i % n == 0) {
                  createItem(urlsItem, i);
            }
      }
}


var insertImage = function ( url ) {
      return '<div class="col-sm-3">' +
                  '<a href="#" class="thumbnail"> <img src="' + url + '" class="img-responsive"/></a>' +
             '</div>';
}

var insertImages = function (urls, idx) {
      var html = '';

      for (var i = 0 ; i < urls.length ; i++) {
            html += insertImage(urls[i], idx + i);
      }
      return html;
}

var createItem = function (url, idx) {
      if (idx == 0 && $(".carousel-inner .active").length == 0) {
            $(".carousel-inner").append('<div class="item active">' + insertImages( url ) + '</div>');
      } else {
            $(".carousel-inner").append('<div class="item">' + insertImages( url ) +  '</div>');
      }
}
