$( function() {
      $( "#selectable" ).selectable({
            stop: function() {

                  $( ".ui-selected", this ).each(function() {
                        var index = $( "#selectable tr" ).index( this );

                        if (index >= 0) {
                              console.log("Selected : " + this.textContent)
                        }
                  });
            }
      });
});
