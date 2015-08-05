(function (app) {
    'use strict';

    app.controller('idtSignUpCtrl', ['userSvc', 'appSvc', 'loggerSvc', '$rootScope', '$scope', '$location', '$filter', function (userSvc, appSvc, loggerSvc, $rootScope, $scope, $location, $filter) {

        $scope.mv = {disclaimer: true, paymentType: 'cash'};

        activate();

        function activate() {
            appSvc.getStates().success(function (data) {
                $scope.states = data;
            }).error(function () {
                loggerSvc.logError($filter('translate')('SIGN_UP_STATE_LOAD_ERROR'));
            });
        }

        $scope.getSignUpType = function () {
            if ($scope.mv.paymentType === 'card') {
                return 'paid';
            } else {
                return 'free';
            }
        };

        $scope.signUp = function () {
            if ($scope.mv.paymentType === 'card') {
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
                                $location.path('/sign-up-success');
                            } else {
                                $location.path('/sign-up-success-login');
                            }
                        },
                        function (error) {
                            if (error === 'UserExists') {
                                loggerSvc.logError($filter('translate')('IDT_SIGN_UP_USER_EXISTS'));
                            } else if (error === 'PaymentFailed') {
                                $location.path('/sign-up-success-payment-pending');
                            } else if (error === 'PaymentFailedActive') {
                                $location.path('/sign-up-success-payment-pending-active');
                            } else {
                                loggerSvc.logError($filter('translate')('IDT_SIGN_UP_FAILED') + ' ' + $scope.appConfig.customerCareNumber);
                            }
                            $scope.saving = false;
                        }
                    );
                } else {
                    setFormTouched();
                }
            } else {
                if ($scope.form.firstName.$valid && $scope.form.lastName.$valid && $scope.form.telephone.$valid && $scope.form.password.$valid && $scope.form.disclaimer.$valid) {
                    $scope.mv.type = 'free';
                    $scope.mv.merchant = 'IDT';
                    $scope.mv.referredBy = $rootScope.referredBy;
                    $scope.mv.preferences = {defaultLanguage: $scope.language || 'en'};
                    $scope.saving = true;
                    userSvc.signUp(
                        $scope.mv,
                        function () {
                            $rootScope.referredBy = undefined;
                            $scope.saving = false;
                            $location.path('/free-sign-up-success');
                        },
                        function (error) {
                            if (error === 'UserExists') {
                                loggerSvc.logError($filter('translate')('IDT_SIGN_UP_USER_EXISTS'));
                            } else {
                                loggerSvc.logError($filter('translate')('IDT_SIGN_UP_FAILED') + ' ' + $scope.appConfig.customerCareNumber);
                            }
                            $scope.saving = false;
                        }
                    );
                }
                else {
                    setFormTouched();
                }
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
