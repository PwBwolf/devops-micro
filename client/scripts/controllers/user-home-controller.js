(function (app) {
    'use strict';

    app.controller('userHomeCtrl', ['$scope', function ($scope) {

        $scope.menuButtonClicked = function (menu) {
            $scope.selectedMenuButton = menu;
            console.log($scope.selectedMenuButton);
        };


        $scope.profileButtonClicked = function (profile) {
            $scope.selectedProfileButton = profile;
            console.log($scope.selectedProfileButton);
        };

    }]);
}(angular.module('app')));
