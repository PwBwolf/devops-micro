(function (app) {
    'use strict';

    app.controller('reactivateSubscriptionCtrl', ['appSvc', 'userSvc', 'loggerSvc', '$scope', '$location', '$filter', function (appSvc, userSvc, loggerSvc, $scope, $location, $filter) {

        activate();

        function activate() {
            appSvc.getStates().success(function (data) {
                $scope.states = data;
            }).error(function () {
                loggerSvc.logError($filter('translate')('REACTIVATE_SUBSCRIPTION_STATE_LOAD_ERROR'));
            });
        }

        $scope.reactivateSubscription = function () {
            if ($scope.form.$valid) {
                $scope.saving = true;
                userSvc.reactivateSubscription(
                    $scope.mv,
                    function () {
                        userSvc.getUserProfile(function () {
                            $location.path('/reactivate-subscription-success');
                            $scope.saving = false;
                        }, function () {
                            loggerSvc.logError($filter('translate')('REACTIVATE_SUBSCRIPTION_ACCOUNT_REFRESH_ERROR'));
                            $scope.saving = false;
                        });
                    },
                    function (error) {
                        if(error === 'PaidActiveUser') {
                            loggerSvc.logError($filter('translate')('REACTIVATE_SUBSCRIPTION_ALREADY_ACTIVE'));
                        } else {
                            loggerSvc.logError($filter('translate')('REACTIVATE_SUBSCRIPTION_FAILED') + ' ' + $scope.appConfig.customerCareNumber);
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
