(function (app) {
    'use strict';

    app.controller('changePasswordCtrl', ['$scope', '$rootScope', 'userSvc', 'loggerSvc', '$location', '$filter', function ($scope, $rootScope, userSvc, loggerSvc, $location, $filter) {

        $scope.changePassword = function () {
            if ($scope.form.$valid) {
                $scope.saving = true;
                userSvc.changePassword(
                    $scope.mv,
                    function () {
                        loggerSvc.logSuccess($filter('translate')('CHANGE_PASSWORD_SUCCESS'));
                        $scope.saving = false;
                        $location.path('/user-home');
                    },
                    function (response) {
                        if (response === 'Unauthorized') {
                            loggerSvc.logError($filter('translate')('CHANGE_PASSWORD_INCORRECT_PASSWORD'));
                        } else {
                            loggerSvc.logError($filter('translate')('CHANGE_PASSWORD_ERROR'));
                        }
                        $scope.saving = false;
                    });
            } else {
                setFormTouched();
            }
        };

        function setFormTouched() {
            $scope.form.currentPassword.$touched = true;
            $scope.form.newPassword.$touched = true;
            $scope.form.confirmPassword.$touched = true;
        }
    }]);
}(angular.module('app')));
