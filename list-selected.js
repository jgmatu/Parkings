$( function() {

      $( "#selectable-installations-main" ).selectable({
            stop: function() {

                  $( ".ui-selected", this ).each(function() {
                        var index = $( "#selectable-installations-main tr" ).index( this );

                        if (index >= 0) {
                              console.log("Selected installation from main list : " + this.textContent)
                        }
                  });
            }
      });

      $( "#selectable-collection-main" ).selectable({
            stop: function() {

                  $( ".ui-selected", this ).each(function() {
                        var index = $( "#selectable-collection-main tr" ).index( this );

                        if (index >= 0) {
                              console.log("Selected installation from collection-main : " + this.textContent)
                        }
                  });
            }
      });

      $( "#selectable-collection" ).selectable({
            stop: function() {

                  $( ".ui-selected", this ).each(function() {
                        var index = $( "#selectable-collection tr" ).index( this );

                        if (index >= 0) {
                              console.log("Selected collection from management collections : " + this.textContent)
                        }
                  });
            }
      });
});
