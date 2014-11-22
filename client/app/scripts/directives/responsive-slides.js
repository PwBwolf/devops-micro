'use strict';

angular.module('YipTV')
  .directive('responsiveSlides', function () {
    return {
      restrict: 'A',
      link: function (scope, element) {
        element.responsiveSlides({
          timeout: 5000,
          pager: true
        });
      }
    }
  });
