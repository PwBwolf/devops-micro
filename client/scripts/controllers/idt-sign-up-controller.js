(function (app) {
    'use strict';

    app.controller('idtSignUpCtrl', ['userSvc', 'appSvc', 'loggerSvc', '$rootScope', '$scope', '$location', '$filter', function (userSvc, appSvc, loggerSvc, $rootScope, $scope, $location, $filter) {

        $scope.mv = {disclaimer: true, paymentType: 'card'};

        activate();

        function activate() {
            appSvc.getStates().success(function (data) {
                $scope.states = data;
            }).error(function () {
                loggerSvc.logError($filter('translate')('SIGN_UP_STATE_LOAD_ERROR'));
            });
        }

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
                                loggerSvc.logError($filter('translate')('SIGN_UP_USER_EXISTS'));
                            } else if (error === 'PaymentPending') {
                                $location.path('/sign-up-success-payment-pending');
                            } else if (error === 'PaymentPendingActive') {
                                $location.path('/sign-up-success-payment-pending-active');
                            } else {
                                loggerSvc.logError($filter('translate')('SIGN_UP_FAILED') + ' ' + $scope.appConfig.customerCareNumber);
                            }
                            $scope.saving = false;
                        }
                    );
                } else {
                    setFormDirty();
                }
            } else {
                if ($scope.form.firstName.$valid && $scope.form.lastName.$valid && $scope.form.telephone.$valid && $scope.form.password.$valid && $scope.form.disclaimer.$valid) {
                } else {
                    setFormDirty();
                }
            }
        };

        function setFormDirty() {
            $scope.form.firstName.$dirty = true;
            $scope.form.lastName.$dirty = true;
            $scope.form.email.$dirty = true;
            $scope.form.telephone.$dirty = true;
            $scope.form.password.$dirty = true;
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
