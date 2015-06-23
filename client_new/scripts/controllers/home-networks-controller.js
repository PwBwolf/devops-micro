(function (app) {
    'use strict';

    app.controller('homeNetworksCtrl', ['$scope', 'homeNetworksSvc', function ($scope, homeNetworksSvc) {
        init();

        function init() {
            $scope.usrNtwrks = homeNetworksSvc.getUsrNtwrks();
            $scope.usrNtwrkClasses = homeNetworksSvc.getNtwrkClasses();
        }

        $scope.selectedIndex = 0;

        $scope.itemClicked = function ($index) {
            $scope.selectedIndex = $index;
        };
    }]);
}(angular.module('app')));
