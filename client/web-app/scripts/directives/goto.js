(function (app) {
    'use strict';

    app.directive('goto', function ($location) {
        return function (scope, element, attrs) {
            var value, path, params;

            attrs.$observe('goto', function (val) {
                value = val;
                if (value.indexOf('?') >= 0) {
                    path = value.split('?')[0];
                    params = value.split('?')[1];
                } else {
                    path = value;
                    params = '';
                }
            });

            element.bind('click', function () {
                scope.$apply(function () {
                    $location.path(path).search(params);
                });
            });
        };
    });
}(angular.module('app')));
