const host = "ws://localhost:12345/";
var installations = [];

var accountsGoogle = function () {
      var ids = [];

      try {
            var s = new WebSocket(host);

            s.onopen = function (e) {
                  console.log("Socket opened...");
            };

            s.onclose = function (e) {
                  console.log("Socket closed...");
            };

            s.onmessage = function (id ) {
                  if (isNewAccount(ids, id.data)) {
                        addAccount(ids, id.data);
                  }
            };

            s.onerror = function (e) {
                  console.log("Socket error... ");
                  console.log(e);
            };

      } catch (ex) {
            setLine("Socked exception");
      }
}

var setGoogleAccount = function ( id ) {
      console.log( "From web socket : " + id );
}

var addAccount = function ( ids, id ) {
      var row = '<tr class="ui-selectee"><td class="text-center ui-widget-content">' + id + '</td></tr>';

      $("#list-accounts-google-plus").append(row);
      ids.push(id)

      // Because the reinsert is not draggable...
      setListsDraggables($( "#list-accounts-google-plus" ), $( "#list-accounts-installation" ));

      // Set google Account in list table from web socket...
      setGoogleAccount (id);
}

var isNewAccount = function ( ids, id ) {
      for (var i = 0 ; i < ids.length ; i++) {
            if (ids[i] == id) {
                  return false;
            }
      }
      return true;
}

var getAccounts = function () {
      var accounts = [];

      $.each( $("#list-accounts-installation tr") , function() {
            accounts.push(parseInt($( "td" , this ).text(), 10));
      });
      return accounts;
}

var newInstallation = function () {
      var name = $(".description-installation h3").last().text();

      if (name == "") {
            return null;
      }
      var installation = {
            "name" : name,
            "accounts": getAccounts()
      };
      return installation;
}

var updateAccounts = function () {
      var name = $(".description-installation h3").last().text();

      for (var i = 0 ; i < installations.length ; i++) {
            if ( installations[i].name == name) {
                  installations[i].accounts = getAccounts();
            }
      }
}

var isNewInstallation = function () {
      var name = $(".description-installation h3").last().text();

      for (var i = 0 ; i < installations.length; i++) {
            if ( installations[i].name == name ) {
                  return false;
            }
      }
      return true;
}

var saveInstallationAccounts = function () {
      if (isNewInstallation()) {
            var installation = newInstallation();
            if (installation != null) {
                  installations.push(installation);
            }
      } else {
            updateAccounts();
      }
}

var setAccount = function ( account ) {
      var row = '<tr class="ui-selectee"><td class="text-center ui-widget-content">' + account + '</td></tr>';

      console.log( account );
      $("#list-accounts-installation").append(row);
}

var setAccounts = function ( accounts ) {
      for (var i = 0 ; i < accounts.length ; i++) {
            setAccount (accounts[i]);
      }
}

var setInstallationAccounts = function ( installation ) {
      clearInstallationAccounts();

      for (var i = 0 ; i < installations.length ; i++) {
            if ( installations[i].name == installation ) {
                  setAccounts(installations[i].accounts);
            }
      }
}

var clearInstallationAccounts = function () {
      $("#list-accounts-installation").html("");
}

/* Realize the list of installations Selectable. */
var setSelectableInstallations = function( $list ) {
      $list.selectable({
            stop: function() {
                  var name = $("td", $(this)).text();
                  setInstallation(name);
            },
            selected: function( event, ui ) {
                  dropSelected();
                  $( this ).addClass("ui-selected");
                  mymap.closePopup();

                  saveInstallationAccounts();
                  setInstallationAccounts( $( ui.selected ).text() );
            }
      });
}
