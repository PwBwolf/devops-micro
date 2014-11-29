(function (app) {
    'use strict';

    app.controller('signUpCtrl', ['userSvc', 'loggerSvc', '$scope', '$location', '$filter', function (userSvc, loggerSvc, $scope, $location, $filter) {

        $scope.signUp = function () {
            if ($scope.form.$valid) {
                $scope.user.preferences = { defaultLanguage: $scope.language || 'en' };
                $scope.saving = true;
                userSvc.signUp(
                    $scope.user,
                    function () {
                        $location.path('/sign-up-success');
                        $scope.saving = false;
                    },
                    function (error) {
                        console.log(error);
                        if(error === 'UserExists') {
                            loggerSvc.logError($filter('translate')('SIGN_UP_USER_EXISTS') || 'This email is already registered with YipTV. Please use another email address.');
                        } else {
                            loggerSvc.logError($filter('translate')('SIGN_UP_FAILED') || 'User sign up failed');
                            $scope.saving = false;
                        }
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
