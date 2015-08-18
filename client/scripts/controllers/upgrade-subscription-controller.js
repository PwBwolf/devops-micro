(function (app) {
    'use strict';

    app.controller('upgradeSubscriptionCtrl', ['appSvc', 'userSvc', 'loggerSvc', '$scope', '$location', '$filter', function (appSvc, userSvc, loggerSvc, $scope, $location, $filter) {

        activate();

        function activate() {
            appSvc.getStates().success(function (data) {
                $scope.states = data;
            }).error(function () {
                loggerSvc.logError($filter('translate')('UPGRADE_SUBSCRIPTION_STATE_LOAD_ERROR'));
            });
        }

        $scope.upgradeSubscription = function () {
            if ($scope.form.$valid) {
                $scope.saving = true;
                userSvc.upgradeSubscription(
                    $scope.mv,
                    function () {
                        userSvc.getUserProfile(function () {
                            $location.path('/upgrade-subscription-success');
                            $scope.saving = false;
                        }, function () {
                            loggerSvc.logError($filter('translate')('UPGRADE_SUBSCRIPTION_ACCOUNT_REFRESH_ERROR'));
                            $scope.saving = false;
                        });
                    },
                    function (error) {
                        if (error === 'PaidUser') {
                            loggerSvc.logError($filter('translate')('UPGRADE_SUBSCRIPTION_ALREADY_UPGRADED'));
                            $scope.saving = false;
                        } else if (error === 'PaymentFailedActive') {
                            userSvc.getUserProfile(function () {
                                loggerSvc.logError($filter('translate')('UPGRADE_SUBSCRIPTION_PAYMENT_FAILED'));
                                $scope.saving = false;
                            }, function () {
                                loggerSvc.logError($filter('translate')('UPGRADE_SUBSCRIPTION_ACCOUNT_REFRESH_ERROR'));
                                $scope.saving = false;
                            });
                        } else {
                            loggerSvc.logError($filter('translate')('UPGRADE_SUBSCRIPTION_FAILED') + ' ' + $scope.appConfig.customerCareNumber);
                            $scope.saving = false;
                        }
                    });
            } else {
                setFormTouched();
            }
        };

        function setFormTouched() {
            $scope.form.cardName.$touched = true;
            $scope.form.cardNumber.$touched = true;
            $scope.form.address.$touched = true;
            $scope.form.city.$touched = true;
            $scope.form.state.$touched = true;
            $scope.form.cvv.$touched = true;
            $scope.form.expiryDate.$touched = true;
            $scope.form.zipCode.$touched = true;
        }

    }]);
}(angular.module('app')));
