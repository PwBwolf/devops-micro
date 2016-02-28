(function (app) {
    'use strict';

    app.controller('pinVerificationCtrl', ['userSvc', 'loggerSvc', '$scope', '$location', '$filter', '$routeParams', function (userSvc, loggerSvc, $scope, $location, $filter, $routeParams) {

        $scope.verificationEmail = $routeParams.verificationEmail;

        $scope.pinVerification = function () {
            if ($scope.form.$valid) {
                $scope.saving = true;
                $scope.mv.email = $scope.verificationEmail;
                userSvc.verifyPin(
                    $scope.mv,
                    function () {
                        $location.path('/pin-verification-success');
                        $scope.saving = false;
                    },
                    function (response) {
                        if (response === 'IncorrectPin') {
                            loggerSvc.logError($filter('translate')('PIN_VERIFICATION_PIN_MISMATCH'));
                        } else {
                            loggerSvc.logError($filter('translate')('PIN_VERIFICATION_ERROR') + ' ' + $scope.appConfig.customerCareNumber);
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
