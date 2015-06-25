(function (app) {
    'use strict';

    app.controller('signUpCtrl', ['userSvc', 'appSvc', 'loggerSvc', '$rootScope', '$scope', '$location', '$filter', function (userSvc, appSvc, loggerSvc, $rootScope, $scope, $location, $filter) {

        $scope.mv = {disclaimer: true};

        activate();

        function activate() {
            appSvc.getStates().success(function (data) {
                $scope.states = data;
            }).error(function () {
                loggerSvc.logError($filter('translate')('SIGN_UP_STATE_LOAD_ERROR'));
            });
        }

        $scope.signUp = function () {
            if ($scope.form.$valid) {
                $scope.mv.type = 'paid';
                $scope.mv.referredBy = $rootScope.referredBy;
                $scope.mv.preferences = {defaultLanguage: $scope.language || 'en'};
                $scope.saving = true;
                userSvc.signUp(
                    $scope.mv,
                    function (data) {
                        $rootScope.referredBy = undefined;
                        $scope.saving = false;
                        if (data === 'registered') {
                            $rootScope.signUpSuccessUrl = '/sign-up-success';
                            $location.path('/processing-order');
                        } else {
                            $rootScope.signUpSuccessUrl = '/sign-up-success-login';
                            $location.path('/processing-order');
                        }
                    },
                    function (error) {
                        if (error === 'UserExists') {
                            loggerSvc.logError($filter('translate')('SIGN_UP_USER_EXISTS'));
                        } else if (error === 'PaymentPending') {
                            $rootScope.signUpSuccessUrl = '/sign-up-success-payment-pending';
                            $location.path('/processing-order');
                        } else if (error === 'PaymentPendingActive') {
                            $rootScope.signUpSuccessUrl = '/sign-up-success-payment-pending-active';
                            $location.path('/processing-order');
                        } else {
                            loggerSvc.logError($filter('translate')('SIGN_UP_FAILED') + ' ' + $scope.appConfig.customerCareNumber);
                        }
                        $scope.saving = false;
                    }
                );
            } else {
                setFormTouched();
            }
        };

        function setFormTouched() {
            $scope.form.firstName.$touched = true;
            $scope.form.lastName.$touched = true;
            $scope.form.email.$touched = true;
            $scope.form.telephone.$touched = true;
            $scope.form.password.$touched = true;
            $scope.form.cardName.$touched = true;
            $scope.form.cardNumber.$touched = true;
            $scope.form.address.$touched = true;
            $scope.form.city.$touched = true;
            $scope.form.state.$touched = true;
            $scope.form.cvv.$touched = true;
            $scope.form.expiryDate.$touched = true;
            $scope.form.zipCode.$touched = true;
            $scope.form.disclaimer.$touched = true;
        }

    }]);
}(angular.module('app')));
