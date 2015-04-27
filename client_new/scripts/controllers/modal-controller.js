(function (app) {
    'use strict';

    app.controller('modalCtrl', ['$scope', '$modalInstance', 'title', 'body', 'showOkButton', 'showYesButton', 'showNoButton', function ($scope, $modalInstance, title, body, showOkButton, showYesButton, showNoButton) {

        $scope.modalTitle = title;
        $scope.modalBody = body;
        $scope.showOkButton = showOkButton;
        $scope.showYesButton = showYesButton;
        $scope.showNoButton = showNoButton;

        $scope.yes = function () {
            $modalInstance.close('yes');
        };

        $scope.ok = function () {
            $modalInstance.dismiss('ok');
        };

        $scope.no = function () {
            $modalInstance.dismiss('no');
        };
    }]);
}(angular.module('app')));
