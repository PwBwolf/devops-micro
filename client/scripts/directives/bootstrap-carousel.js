(function (app) {
    'use strict';

    app.directive('bootstrapCarousel', [function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.carousel({
                    interval: attrs.bootstrapCarousel
                });
            }
        };
    }]);
}(angular.module('app')));
