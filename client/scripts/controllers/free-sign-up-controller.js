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
                    function (data) {
                        $rootScope.referredBy = undefined;
                        $scope.saving = false;
                        if(data === 'registered') {
                            $location.path('/sign-up-success');
                        } else {
                            $location.path('/sign-up-success-login');
                        }
                    },
                    function (error) {
                        if (error === 'UserExists') {
                            loggerSvc.logError($filter('translate')('FREE_SIGN_UP_USER_EXISTS'));
                        } else {
                            loggerSvc.logError($filter('translate')('FREE_SIGN_UP_FAILED') + ' ' + $scope.appConfig.customerCareNumber);
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
