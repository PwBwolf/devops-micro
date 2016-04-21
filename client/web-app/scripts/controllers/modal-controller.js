(function (app) {
    'use strict';

    app.controller('modalCtrl', ['$scope', '$uibModalInstance', 'title', 'body', 'showOkButton', 'showYesButton', 'showNoButton', function ($scope, $uibModalInstance, title, body, showOkButton, showYesButton, showNoButton) {

        $scope.modalTitle = title;
        $scope.modalBody = body;
        $scope.showOkButton = showOkButton;
        $scope.showYesButton = showYesButton;
        $scope.showNoButton = showNoButton;

        $scope.yes = function () {
            $uibModalInstance.close('yes');
        };

        $scope.ok = function () {
            $uibModalInstance.dismiss('ok');
        };

        $scope.no = function () {
            $uibModalInstance.dismiss('no');
        };
    }]);
}(angular.module('app')));
