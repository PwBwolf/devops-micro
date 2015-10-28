(function (app) {
    'use strict';

    app.controller('mobileVerificationCtrl', ['userSvc', 'loggerSvc', '$scope', '$location', '$filter', '$routeParams', function (userSvc, loggerSvc, $scope, $location, $filter, $routeParams) {

        $scope.status = 0; // 0 - checking, 1 - success, 2 - error
        $scope.verificationEmail = $routeParams.verificationEmail;

        verifyUser();

        function verifyUser() {
            userSvc.isEmailVerified(
                $scope.verificationEmail,
                function (result) {
                    if (result) {
                        $scope.status = 2;
                    } else {
                        $scope.status = 1;
                    }
                },
                function () {
                    $scope.status = 2;
                });
        }

        $scope.mobileVerification = function () {
            if ($scope.form.$valid) {
                $scope.saving = true;
                $scope.mv.email = $scope.verificationEmail;
                userSvc.verifyMobilePin(
                    $scope.mv,
                    function () {
                        $location.path('/mobile-verification-success');
                        $scope.saving = false;
                    },
                    function (response) {
                        if (response === 'IncorrectPin') {
                            loggerSvc.logError($filter('translate')('MOBILE_VERIFICATION_PIN_MISMATCH'));
                        } else {
                            loggerSvc.logError($filter('translate')('MOBILE_VERIFICATION_ERROR') + ' ' + $scope.appConfig.customerCareNumber);
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
    }]);
}(angular.module('app')));
