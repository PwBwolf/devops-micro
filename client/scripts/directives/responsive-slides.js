(function (app) {
    'use strict';

    app.directive('yipResponsiveSlides', [function () {
        return {
            restrict: 'A',
            link: function (scope, element) {
                element.responsiveSlides({
                    timeout: 5000,
                    pager: true
                });
            }
        };
    }]);
}(angular.module('app')));
