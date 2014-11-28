(function (app) {
    'use strict';

    app.controller('signUpCtrl', ['userSvc', 'loggerSvc', '$scope', '$location', function (userSvc, loggerSvc, $scope, $location) {

        $scope.signUp = function () {
            if ($scope.form.$valid) {
                $scope.saving = true;
                userSvc.signUp(
                    $scope.user,
                    function () {
                        loggerSvc.logSuccess('User signed up successfully. Check your email inbox for confirmation email.');
                        $location.path('/');
                        $scope.saving = false;
                    },
                    function () {
                        loggerSvc.logError('User sign up failed');
                        $scope.saving = false;
                    });
            } else {
                setFormDirty();
            }
        };

        function setFormDirty() {
            $scope.form.firstName.$dirty = true;
            $scope.form.lastName.$dirty = true;
            $scope.form.email.$dirty = true;
            $scope.form.password.$dirty = true;
            $scope.form.confirmPassword.$dirty = true;
            $scope.form.cardNumber.$dirty = true;
            $scope.form.cvv.$dirty = true;
            $scope.form.expiryYear.$dirty = true;
            $scope.form.expiryMonth.$dirty = true;
            $scope.form.zipCode.$dirty = true;
        }

    }]);
}(angular.module('app')));
