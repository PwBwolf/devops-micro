(function (app) {
    'use strict';

    app.directive('currentTime', function ($filter) {
        return function (scope, element, attrs) {
            var format;

            scope.$watch(attrs.myCurrentTime, function (value) {
                format = value;
                updateTime();
            });

            function updateTime() {
                var date = $filter('date')(new Date(), 'h:mm:ss a');
                element.text(date);
            }

            function updateLater() {
                setTimeout(function () {
                    updateTime();
                    updateLater();
                }, 1000);
            }

            updateLater();
        };
    });

}(angular.module('app')));
