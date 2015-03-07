(function (app) {
    'use strict';

    app.controller('homeCtrl', ['$scope', '$window', function ($scope, $window) {
        activate();

        function activate() {
            if($scope.session.signOut) {
                $scope.session.signOut = undefined;
                $window.location.reload();
            }
        }
    }]);
}(angular.module('app')));
