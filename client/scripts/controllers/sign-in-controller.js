(function (app) {
    'use strict';

    app.controller('signInCtrl', ['userSvc', 'loggerSvc', '$rootScope', '$scope', '$location', '$filter', '$window', function (userSvc, loggerSvc, $rootScope, $scope, $location, $filter, $window) {

        $scope.signIn = function () {
            if ($scope.form.$valid) {
                $scope.saving = true;
                userSvc.signIn(
                    $scope.mv,
                    function () {
                        if($rootScope.redirectTo) {
                            $location.path($rootScope.redirectTo);
                            $rootScope.redirectTo = undefined;
                        } else {
                            $location.path('/user-home');
                        }
                        $scope.saving = false;
                    },
                    function (response) {
                        if (response === 'UnverifiedAccount') {
                            loggerSvc.logError($filter('translate')('SIGN_IN_FAILED_NOT_VERIFIED') || 'Sign In failed as your account has not been verified yet');
                        } else {
                            loggerSvc.logError($filter('translate')('SIGN_IN_FAILED') || 'Sign In failed');
                        }
                        $scope.saving = false;
                    });
            } else {
                setFormDirty();
            }
        };

        function setFormDirty() {
            $scope.form.email.$dirty = true;
            $scope.form.password.$dirty = true;
        }
    }]);
}(angular.module('app')));
