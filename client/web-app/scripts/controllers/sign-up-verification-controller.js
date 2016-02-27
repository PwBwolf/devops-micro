(function (app) {
    'use strict';

    app.controller('signUpVerificationCtrl', ['userSvc', 'loggerSvc', '$scope', '$location', '$filter', '$routeParams', function (userSvc, loggerSvc, $scope, $location, $filter, $routeParams) {

        $scope.signUpVerification = function () {
            if ($scope.form.$valid) {
                $scope.saving = true;
                $scope.mv.email = $routeParams.verificationEmail;
                userSvc.verifyPin(
                    $scope.mv,
                    function () {
                        $location.path('/' + $routeParams.redirectRoute + '/false');
                        $scope.saving = false;
                    },
                    function (response) {
                        if (response === 'UserAlreadyVerified') {
                            loggerSvc.logError($filter('translate')('SIGN_UP_VERIFICATION_USER_ALREADY_ACTIVE'));
                            $location.path('/' + $routeParams.redirectRoute + '/false');
                        } else if (response === 'IncorrectPin') {
                            loggerSvc.logError($filter('translate')('SIGN_UP_VERIFICATION_PIN_MISMATCH'));
                        } else {
                            loggerSvc.logError($filter('translate')('SIGN_UP_VERIFICATION_ERROR') + ' ' + $scope.appConfig.customerCareNumber);
                        }
                        $scope.saving = false;
                    });
            } else {
                setFormTouched();
            }
        };

        function setFormTouched() {
            $scope.form.pin.$touched = true;
        }

        $scope.resendVerification = function () {
            var data = {email: $routeParams.verificationEmail};
            resendVerification(data);
        };

        function resendVerification(data) {
            $scope.saving = true;
            userSvc.resendVerification(
                data,
                function () {
                    loggerSvc.logSuccess($filter('translate')('SIGN_UP_VERIFICATION_RESEND_SUCCESS'));
                    $scope.saving = false;
                },
                function (response) {
                    if (response === 'UserActivated') {
                        loggerSvc.logError($filter('translate')('SIGN_UP_VERIFICATION_USER_ALREADY_ACTIVE'));
                        $location.path('/' + $routeParams.redirectRoute + '/false');
                    } else {
                        loggerSvc.logError($filter('translate')('SIGN_UP_VERIFICATION_RESEND_ERROR') + ' ' + $scope.appConfig.customerCareNumber);
                    }
                    $scope.saving = false;
                });
        }
    }]);
}(angular.module('app')));

