(function (app) {
    'use strict';

    app.directive('bannerResize', function ($window) {
        return function (scope) {

            var window = angular.element($window);

            scope.$watch(function () {
                return {
                    height: window.height(),
                    width: window.width()
                };
            }, function (newValue) {
                scope.windowHeight = newValue.height;
                scope.windowWidth = newValue.width;
            }, true);

            window.bind('resize', function () {
                scope.$apply();
            });
        };
    });
}(angular.module('app')));
