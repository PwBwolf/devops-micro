(function (app) {
    'use strict';

    app.directive('goto', function ($location) {
        return function (scope, element, attrs) {
            var path;

            attrs.$observe('goto', function (val) {
                path = val;
            });

            element.bind('click', function () {
                scope.$apply(function () {
                    $location.path(path);
                });
            });
        };
    });
}(angular.module('app')));
