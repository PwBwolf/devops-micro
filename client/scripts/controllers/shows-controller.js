(function (app) {
    'use strict';

    app.controller('showsCtrl', ['showsSvc', '$scope', function (showsSvc, $scope) {
        init();

        function init() {
            $scope.shows1 = showsSvc.getShows1();
            $scope.shows2 = showsSvc.getShows2();
            $scope.shows3 = showsSvc.getShows3();
            $scope.showClasses = showsSvc.getShowClasses();
        }

        $scope.itemClicked1 = function (index) {
            $scope.selectedIndex1 = index;
        };

        $scope.itemClicked2 = function (index) {
            $scope.selectedIndex2 = index;
        };

        $scope.itemClicked3 = function (index) {
            $scope.selectedIndex3 = index;
        };
    }]);
}(angular.module('app')));
