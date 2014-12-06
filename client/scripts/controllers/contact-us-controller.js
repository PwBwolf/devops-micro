(function (app) {
    'use strict';

    app.controller('contactUsCtrl', ['$scope', function ($scope) {
        $scope.contactUs = function () {
            if ($scope.form.$valid) {
                $scope.saving = true;
                userSvc.signIn(
                    $scope.mv,
                    function () {
                        $location.path('/my-account');
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
            $scope.form.name.$dirty = true;
            $scope.form.interest.$dirty = true;
            $scope.form.email.$dirty = true;
            $scope.form.assist.$dirty = true;
        }
    }]);
}(angular.module('app')));
