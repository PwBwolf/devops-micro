(function (app) {
    'use strict';

    app.directive('resize', function ($window) {
        return function (scope) {

            var w = angular.element($window);

            scope.$watch(function () {
                return {
                    'h': w.height(),
                    'w': w.width()
                };
            }, function (newValue) {
                scope.windowHeight = newValue.h;
                scope.windowWidth = newValue.w;
            }, true);

            w.bind('resize', function () {
                scope.$apply();
            });
        };
    });
}(angular.module('app')));
