(function (app) {
    'use strict';

    app.controller('resetPasswordCtrl', ['userSvc', 'loggerSvc', '$scope', '$location', '$filter', function (userSvc, loggerSvc, $scope, $location, $filter) {

        $scope.mv = {code: $location.search().code};
        checkResetCode();

        function checkResetCode() {
            if ($scope.mv.code) {
                userSvc.checkResetCode(
                    $scope.mv.code,
                    function () {
                        $scope.codeError = false;
                        $scope.showPage = true;
                    },
                    function (response) {
                        if (response === 'UserNotFound') {
                            $scope.codeError = true;
                        } else {
                            $scope.userError = true;
                        }
                        $scope.showPage = true;
                    }
                );
            } else {
                $scope.showPage = true;
                $scope.codeError = true;
            }
        }

        $scope.resetPassword = function () {
            if ($scope.form.$valid) {
                $scope.saving = true;
                userSvc.resetPassword(
                    $scope.mv,
                    function () {
                        $location.path('/reset-password-success');
                        $scope.saving = false;
                    },
                    function () {
                        loggerSvc.logError($filter('translate')('RESET_PASSWORD_USER_ERROR') + ' ' + $scope.appConfig.customerCareNumber);
                        $scope.saving = false;
                    }
                );
            } else {
                setFormTouched();
            }
        };

        function setFormTouched() {
            $scope.form.newPassword.$touched = true;
            $scope.form.confirmPassword.$touched = true;
        }

    }]);
}(angular.module('app')));
