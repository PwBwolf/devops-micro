(function (app) {
    'use strict';

    app.controller('signUpCtrl', ['$scope', function ($scope) {

        $scope.signUp = function () {
            if ($scope.form.$valid) {
                $scope.saving = true;
                userSvc.signIn(
                    $scope.user,
                    function () {
                        $location.path('/my-account');
                        $scope.saving = false;
                    },
                    function (response) {
                        if (response === 'UnverifiedAccount') {
                            loggerSvc.logError('Sign In failed as your account has not been verified yet');
                        } else {
                            loggerSvc.logError('Sign In failed');
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
