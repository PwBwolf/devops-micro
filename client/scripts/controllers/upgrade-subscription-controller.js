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
                        });
                    },
                    function (error) {
                        if(error === 'NonFreeUser') {
                            loggerSvc.logError($filter('translate')('UPGRADE_SUBSCRIPTION_ALREADY_UPGRADED'));
                        } else {
                            loggerSvc.logError($filter('translate')('UPGRADE_SUBSCRIPTION_FAILED') + ' ' + $scope.appConfig.customerCareNumber);
                        }
                        $scope.saving = false;
                    });
            } else {
                setFormDirty();
            }
        };

        function setFormDirty() {
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
