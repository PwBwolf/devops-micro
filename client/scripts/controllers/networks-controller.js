(function (app) {
    'use strict';

    app.controller('networksCtrl', ['networksSvc', '$scope', function (networksSvc, $scope) {
        init();

        $scope.selectedIndex = 0;

        function init() {
            $scope.networks = networksSvc.getNetworks();
            $scope.networkClasses = networksSvc.getNetworkClasses();
        }

        $scope.itemClicked = function (index) {
            $scope.selectedIndex = index;
        };
    }]);
}(angular.module('app')));
