(function (app) {
    'use strict';

    app.controller('forgotPasswordCtrl', ['userSvc', 'loggerSvc', '$scope', '$location', '$filter', function (userSvc, loggerSvc, $scope, $location, $filter) {

        $scope.forgotPassword = function () {
            if ($scope.form.$valid) {
                $scope.saving = true;
                userSvc.forgotPassword(
                    $scope.mv.email,
                    function () {
                        $location.path('/reset-password/' + $scope.mv.email);
                        $scope.saving = false;
                    },
                    function () {
                        loggerSvc.logError($filter('translate')('FORGOT_PASSWORD_ERROR') + ' ' + $scope.appConfig.customerCareNumber);
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
