(function (app) {
    'use strict';

    app.controller('homeShowsCtrl', ['$scope', 'homeShowsSvc', function ($scope, homeShowsSvc) {
        init();

        function init() {
            $scope.usrShws = homeShowsSvc.getUsrShws();
            $scope.usrShws1 = homeShowsSvc.getUsrShws1();
            $scope.usrShws2 = homeShowsSvc.getUsrShws2();
            $scope.usrShwClasses = homeShowsSvc.getShwClasses();
        }

        $scope.selectedIndex = -1;

        $scope.itemClicked = function ($index) {
            $scope.selectedIndex = $index;
        };

        $scope.itemClicked2 = function ($index) {
            $scope.selectedIndex2 = $index;
        };

        $scope.itemClicked3 = function ($index) {
            $scope.selectedIndex3 = $index;
        };
    }]);
}(angular.module('app')));
