(function (app) {
    'use strict';

    app.controller('updateProfileCtrl', ['userSvc', 'appSvc', 'loggerSvc', '$rootScope', '$scope', '$location', '$filter', function (userSvc, appSvc, loggerSvc, $rootScope, $scope, $location, $filter) {

        $scope.mv = {disclaimer: true};

        activate();

        function activate() {
            $scope.dUsr = $scope.user;
        }

        $scope.updateUserProfile = function () {
            if ($scope.form.$valid) {
                $scope.mv.type = 'paid';
                $scope.mv.preferences = {defaultLanguage: $scope.language || 'en'};

                $scope.saving = true;
                userSvc.isSignedIn(
                    $scope.mv,
                    function () {
                        $scope.saving = false;
                    },
                    function (error) {
                        if (error === 'User Error') {
                            loggerSvc.logError($filter('translate')('SIGN_UP_USER_EXISTS'));
                        } else {
                            loggerSvc.logError($filter('translate')('SIGN_UP_FAILED') + ' ' + $scope.appConfig.customerCareNumber);
                        }
                        $scope.saving = false;
                    }
                );
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
            $scope.form.cardName.$dirty = true;
            $scope.form.cardNumber.$dirty = true;
            $scope.form.address.$dirty = true;
            $scope.form.city.$dirty = true;
            $scope.form.state.$dirty = true;
            $scope.form.cvv.$dirty = true;
            $scope.form.expiryDate.$dirty = true;
            $scope.form.zipCode.$dirty = true;
            $scope.form.disclaimer.$dirty = true;
        }

    }]);
}(angular.module('app')));
