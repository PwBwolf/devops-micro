(function (app) {
    'use strict';

    app.directive('homeOnly', ['$location', function ($location) {
        return {
            restrict: 'A',
            link: function ($scope, element) {
                $scope.$on('$routeChangeSuccess', function () {
                    if ($location.path() === '/') {
                        element.css('display', 'inline-block');
                    } else {
                        element.css('display', 'none');
                    }
                });
            }
        };
    }]);
}(angular.module('app')));
