(function (app) {
    'use strict';

    app.controller('changePasswordCtrl', ['$scope', 'userSvc', 'loggerSvc', '$location', '$filter', function ($scope, userSvc, loggerSvc, $location, $filter) {

        $scope.changePassword = function () {
            if ($scope.form.$valid) {
                userSvc.changePassword(
                    $scope.mv,
                    function () {
                        $location.path('/change-password-success');
                    },
                    function (response) {
                        if (response === 'Unauthorized') {
                            loggerSvc.logError($filter('translate')('CHANGE_PASSWORD_INCORRECT_PASSWORD'));
                        } else {
                            loggerSvc.logError($filter('translate')('CHANGE_PASSWORD_ERROR'));
                        }
                    });
            } else {
                setFormDirty();
            }
        };

        function setFormDirty() {
            $scope.form.currentPassword.$dirty = true;
            $scope.form.newPassword.$dirty = true;
            $scope.form.confirmPassword.$dirty = true;
        }

    }]);
}(angular.module('app')));
