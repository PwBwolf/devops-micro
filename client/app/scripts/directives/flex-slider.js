'use strict';

angular.module('YipTV')
  .directive('flexSlider', function () {
    return {
      restrict: 'A',
      link: function (scope, element) {
        element.flexslider({
          animation: "slide",
          controlNav:false
        });
      }
    }
  });
