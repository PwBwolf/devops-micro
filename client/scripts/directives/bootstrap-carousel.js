(function (app) {
    'use strict';

    app.directive('bootstrapCarousel', [function () {
        return {
            restrict: 'A',
            link: function (scope, element) {
                element.carousel({
                    interval: 5000
                });
            }
        };
    }]);
}(angular.module('app')));
