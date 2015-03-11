(function (app) {
    'use strict';

    app.controller('homeCtrl', ['$scope', '$window', '$location', function ($scope, $window, $location) {
        activate();

        function activate() {
            if($scope.session.signOut) {
                $scope.session.signOut = undefined;
                $window.location.reload();
            }
        }

        $scope.imageMapClick = function(url) {
            $location.path(url);
        };
    }]);
}(angular.module('app')));
