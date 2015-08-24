(function (app) {
    'use strict';

    app.controller('signInCtrl', ['userSvc', 'loggerSvc', '$rootScope', '$scope', '$location', '$filter', '$modal', function (userSvc, loggerSvc, $rootScope, $scope, $location, $filter) {

        activate();

        function activate() {
            var email = $location.search().email;
            if (email) {
                $scope.mv = {email: email};
            }
        }

        $scope.signIn = function () {
            if ($scope.form.$valid) {
                $scope.saving = true;
                userSvc.signIn(
                    $scope.mv,
                    function () {
                        $location.path('/user-home');
                        $scope.saving = false;
                    },
                    function (response) {
                        if (response === 'UnverifiedAccount') {
                            loggerSvc.logError($filter('translate')('SIGN_IN_FAILED_NOT_VERIFIED'));
                        } else {
                            loggerSvc.logError($filter('translate')('SIGN_IN_FAILED'));
                        }
                        $scope.saving = false;
                    });
            } else {
                setFormTouched();
            }
        };

        function setFormTouched() {
            $scope.form.email.$touched = true;
            $scope.form.password.$touched = true;
        }
    }]);
}(angular.module('app')));
