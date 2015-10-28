(function (app) {
    'use strict';

    app.controller('resendVerificationCtrl', ['userSvc', 'loggerSvc', '$scope', '$location', '$filter', function (userSvc, loggerSvc, $scope, $location, $filter) {

        $scope.resendVerification = function () {
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
            $scope.form.email.$touched = true;
        }
    }]);
}(angular.module('app')));

