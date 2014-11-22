'use strict';

// This service holds web page related code. It is used to modify parts of the page such as the title.
// A controller can inject this service and change its properties directly. MainController will then
// update the changed properties on the page.
angular.module('YipTV')
  .service('Page', function () {
    this.title = ""; // Page title shown in the address bar of the browser
  });
