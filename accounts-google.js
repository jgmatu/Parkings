// Accounts from web socket add to list... Insert in management installation list
// and management change the installation list when select another one...

const host = "ws://localhost:12345/";

var installations = [];
var accounts = [];

var accountsGoogleWS = function () {
      try {
            var s = new WebSocket(host);

            s.onmessage = function (id ) {
                  if (isNewAccount(accounts, id.data)) {
                        getGoogleAccount ( id.data );
                  }
            };

            s.onerror = function (e) {
                  console.log(e);
            };

      } catch (ex) {
            setLine("Socked exception");
      }
}

/* Realize the list of installations Selectable. */
var setSelectableInstallations = function ( $list ) {
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
                  clearInstallationAccounts();
                  setInstallationAccounts( $( ui.selected ).text() );
            }
      });
}

var makeApiCallAccount = function ( id ) {
      gapi.client.load('plus', 'v1', function() {
            var request = gapi.client.plus.people.get({
                  'userId': id,
                  'collection' : 'public'
            });
            request.execute(function(resp) {
                  var account = {
                        "id" : id,
                        "name" : resp.displayName,
                        "image" : resp.image.url
                  };
                  accounts.push(account);
                  showAccount("list-accounts-google-plus" , account)
            });
      });
}

var getGoogleAccount = function ( id ) {
      var apiKey = 'AIzaSyDyeGkrjlClp8rTnCRSYa773yj0V247QyI';

      gapi.client.setApiKey(apiKey);
      makeApiCallAccount( id );
}

var formatAccount = function ( account ) {
      var format = '<div class="row">' +
                        '<div class="text-center col-sm-2">' +
                              '<img class="img-responsive" src="' + account.image + '"></img>' +
                        '</div>' +
                        '<div class="text-center col-sm-10">' +
                              '<p>' + account.name + '</p>' +
                        '</div>' +
                        '<input class="hide-id" value="' + account.id + '"/>' +
                  '</div>';
      $(".hide-id").hide();
      return format;
}

var isNewAccount = function ( accounts, id ) {
      for (var i = 0 ; i < accounts.length ; i++) {
            if (accounts[i].id == id) {
                  return false;
            }
      }
      return true;
}


var showAccount = function (listId,  account ) {
      var row = '<tr class="ui-selectee"><td class="ui-widget-content">' + formatAccount( account ) + '</td></tr>';

      $("#"+ listId).append(row);

      // Because the reinsert or new insert is not draggable...
      setListsDraggables($( "#list-accounts-google-plus" ), $( "#list-accounts-installation" ));
}

var getAccounts = function () {
      var accounts = [];

      $.each( $("#list-accounts-installation tr") , function() {
            var id   = $( ".hide-id", this ).val();
            var name = $( "p" , this ).text();
            var img  = $( "img", this ).attr("src");

            var account = {
                  "id" : id,
                  "name" : name,
                  "image" : img
            };
            accounts.push(account);
      });
      return accounts;
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

var updateAccounts = function () {
      var name = $(".description-installation h3").last().text();

      for (var i = 0 ; i < installations.length ; i++) {
            if ( installations[i].name == name) {
                  installations[i].accounts = getAccounts();
            }
      }
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

var isNewInstallation = function () {
      var name = $(".description-installation h3").last().text();

      for (var i = 0 ; i < installations.length; i++) {
            if ( installations[i].name == name ) {
                  return false;
            }
      }
      return true;
}

var showAccounts = function ( accounts ) {
      for (var i = 0 ; i < accounts.length ; i++) {
            showAccount ("list-accounts-installation", accounts[i]);
      }
}

var clearInstallationAccounts = function () {
      $("#list-accounts-installation").html("");
}

var setInstallationAccounts = function ( installation ) {
      for (var i = 0 ; i < installations.length ; i++) {
            if ( installations[i].name == installation ) {
                  showAccounts(installations[i].accounts);
            }
      }
}
