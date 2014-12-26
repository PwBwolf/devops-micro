(function (app) {
    'use strict';

    app.controller('resendVerificationCtrl', ['userSvc', 'loggerSvc', '$scope', '$location', '$filter', function (userSvc, loggerSvc, $scope, $location, $filter) {

        $scope.resendVerification = function () {
            if ($scope.form.$valid) {
                $scope.saving = true;
                userSvc.resendVerification(
                    $scope.mv.email,
                    function () {
                        $location.path('/resend-verification-success');
                        $scope.saving = false;
                    },
                    function (response) {
                        if (response === 'UserNotFound' || response === 'AccountActivated') {
                            loggerSvc.logError($filter('translate')('RESEND_VERIFICATION_USER_ERROR'));
                        } else {
                            loggerSvc.logError($filter('translate')('RESEND_VERIFICATION_ERROR'));
                        }
                        $scope.saving = false;
                    });
            } else {
                setFormDirty();
            }
        };

        function setFormDirty() {
            $scope.form.email.$dirty = true;
        }
    }]);
}(angular.module('app')));

