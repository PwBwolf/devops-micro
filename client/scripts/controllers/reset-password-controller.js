(function (app) {
    'use strict';

    app.controller('resetPasswordCtrl', ['userSvc', 'loggerSvc', '$scope', '$location', '$filter', function (userSvc, loggerSvc, $scope, $location, $filter) {
        $scope.mv = {code: $location.search().code};
        checkResetCode();

        function checkResetCode() {
            userSvc.checkResetCode(
                $scope.mv.code,
                function () {
                    $scope.codeError = false;
                },
                function (response) {
                    if (response === 'UserNotFound') {
                        $scope.codeError = true;
                    } else {
                        loggerSvc.logError($filter('translate')('RESET_PASSWORD_ERROR') || 'Unable to change your password. Please contact YipTV customer care.');
                    }
                }
            );
        }

        $scope.resetPassword = function () {
            if($scope.mv.code) {
                if ($scope.form.$valid) {
                    $scope.saving = true;
                    userSvc.resetPassword(
                        $scope.mv,
                        function () {
                            $location.path('/reset-password-success');
                            $scope.saving = false;
                        },
                        function (response) {
                            if (response === 'UserNotFound') {
                                loggerSvc.logError($filter('translate')('RESET_PASSWORD_USER_ERROR') || 'The reset password link has expired and is no longer valid');
                            } else {
                                loggerSvc.logError($filter('translate')('RESET_PASSWORD_ERROR') || 'Unable to change your password. Please contact YipTV customer care.');
                            }
                            $scope.saving = false;
                        }
                    );
                } else {
                    setFormDirty();
                }
            } else {
                loggerSvc.logError($filter('translate')('RESET_PASSWORD_ERROR') || 'Unable to change your password. Please contact YipTV customer care.');
            }
        };

        function setFormDirty() {
            $scope.form.newPassword.$dirty = true;
            $scope.form.confirmPassword.$dirty = true;
        }

    }]);
}(angular.module('app')));
