(function (app) {
    'use strict';

    app.controller('resetPasswordCtrl', ['userSvc', 'loggerSvc', '$scope', '$location', '$filter', '$routeParams', function (userSvc, loggerSvc, $scope, $location, $filter, $routeParams) {

        $scope.resetPassword = function () {
            if ($scope.form.$valid) {
                $scope.saving = true;
                $scope.mv.email = $routeParams.resetEmail;
                userSvc.resetPassword(
                    $scope.mv,
                    function () {
                        $location.path('/reset-password-success');
                        $scope.saving = false;
                    },
                    function (error) {
                        if (error === 'IncorrectPin') {
                            loggerSvc.logError($filter('translate')('RESET_PASSWORD_PIN_ERROR'));
                        } else {
                            loggerSvc.logError($filter('translate')('RESET_PASSWORD_RESET_ERROR') + ' ' + $scope.appConfig.customerCareNumber);
                        }
                        $scope.saving = false;
                    }
                );
            } else {
                setFormTouched();
            }
        };

        function setFormTouched() {
            $scope.form.newPassword.$touched = true;
            $scope.form.resetPasswordPin.$touched = true;
        }

    }]);
}(angular.module('app')));
