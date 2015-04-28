(function (app) {
    'use strict';

    app.controller('homeCtrl', ['appSvc', '$scope', '$window', '$location', function (appSvc, $scope, $window, $location) {
        activate();

        function activate() {
            if ($scope.session.signOut) {
                $scope.session.signOut = undefined;
                $window.location.reload();
            }
        }

        $scope.imageMapClick = function (url) {
            if(url.charAt(0) === '/') {
                $location.path(url);
            } else {
                $window.open(url);
            }
        };

        $scope.onWebSliderChange = function () {
            angular.element($window).triggerHandler('resize');
        };
    }]);
}(angular.module('app')));
