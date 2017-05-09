$( function() {
      $( "#selectable" ).selectable({
            stop: function() {
                  var result = $( "#select-result" ).html("none");

                  $( ".ui-selected", this ).each(function() {
                        var index = $( "#selectable tr" ).index( this );

                        if (index >= 0) {
                              result.html( " #" + index );
                        }
                  });
            }
      });
});
