(function (app) {
    'use strict';

    app.controller('mobileVerificationCtrl', ['userSvc', 'loggerSvc', '$scope', '$location', '$filter', '$routeParams', function (userSvc, loggerSvc, $scope, $location, $filter, $routeParams) {

        $scope.status = 0; // 0 - checking, 1 - success, 2 - error
        $scope.verificationEmail = $routeParams.verificationEmail;

        verifyUser();

        function verifyUser() {
            userSvc.checkEmailNotVerified(
                $scope.verificationEmail,
                function (result) {
                    if (result) {
                        $scope.status = 1;
                    } else {
                        $scope.status = 2;
                    }
                },
                function () {
                    $scope.status = 2;
                });
        }

        $scope.mobileVerification = function () {
            if ($scope.form.$valid) {
                $scope.saving = true;
                userSvc.resendVerification(
                    $scope.mv.email,
                    function () {
                        $location.path('/resend-verification-success/' + $scope.mv.email);
                        $scope.saving = false;
                    },
                    function (response) {
                        if (response === 'UserNotFound' || response === 'UserActivated') {
                            loggerSvc.logError($filter('translate')('RESEND_VERIFICATION_USER_ERROR'));
                        } else {
                            loggerSvc.logError($filter('translate')('RESEND_VERIFICATION_ERROR') + ' ' + $scope.appConfig.customerCareNumber);
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
