(function (app) {
    'use strict';

    app.controller('freeSignUpCtrl', ['userSvc', 'loggerSvc', '$rootScope', '$scope', '$location', '$filter', function (userSvc, loggerSvc, $rootScope, $scope, $location, $filter) {

        $scope.mv = {disclaimer: true};

        $scope.signUp = function () {
            if ($scope.form.$valid) {
                $scope.mv.type = 'free';
                $scope.mv.referredBy = $rootScope.referredBy;
                $scope.mv.preferences = {defaultLanguage: $scope.language || 'en'};
                $scope.saving = true;
                userSvc.signUp(
                    $scope.mv,
                    function () {
                        $rootScope.referredBy = undefined;
                        $location.path('/free-sign-up-success');
                        $scope.saving = false;
                    },
                    function (error) {
                        if (error === 'UserExists') {
                            loggerSvc.logError($filter('translate')('FREE_SIGN_UP_USER_EXISTS'));
                        } else {
                            loggerSvc.logError($filter('translate')('FREE_SIGN_UP_FAILED'));
                        }
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
            $scope.form.telephone.$dirty = true;
            $scope.form.password.$dirty = true;
            $scope.form.confirmPassword.$dirty = true;
            $scope.form.disclaimer.$dirty = true;
        }

    }]);
}(angular.module('app')));
