(function (app) {
    'use strict';

    app.directive('bootstrapCarousel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.carousel({
                    interval: attrs.interval
                });

                element.on('slid.bs.carousel', function () {
                    var method = $parse(attrs.onSlide);
                    method(scope);
                });

                scope.$watch('webSliders', function () {
                    console.log('webSliders changed');
                    element.carousel({
                        interval: attrs.interval
                    });
                }, true);
            }
        };
    }]);
}(angular.module('app')));
