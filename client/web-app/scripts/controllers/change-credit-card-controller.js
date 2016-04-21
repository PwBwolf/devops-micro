(function (app) {
    'use strict';

    app.controller('changeCreditCardCtrl', ['appSvc', 'userSvc', 'loggerSvc', '$scope', '$rootScope', '$filter', function (appSvc, userSvc, loggerSvc, $scope, $rootScope, $filter) {

        activate();

        function activate() {
            appSvc.getStates().success(function (data) {
                $scope.states = data;
            }).error(function () {
                loggerSvc.logError($filter('translate')('CHANGE_CREDIT_CARD_STATE_LOAD_ERROR'));
            });
        }

        $scope.changeCreditCard = function () {
            if ($scope.form.$valid) {
                $scope.saving = true;
                userSvc.changeCreditCard(
                    $scope.mv,
                    function () {
                        userSvc.getUserProfile(function () {
                            loggerSvc.logSuccess($filter('translate')('CHANGE_CREDIT_CARD_SUCCESS'));
                            $scope.saving = false;
                            $rootScope.$broadcast('CloseDropDown', ['changeCreditCardDropDown', 'accountDropDown']);
                            $scope.mv = {};
                            setFormNotTouched();
                        }, function () {
                            loggerSvc.logError($filter('translate')('CHANGE_CREDIT_CARD_ACCOUNT_REFRESH_ERROR'));
                            $scope.saving = false;
                        });
                    }, function (error) {
                        if(error === 'FreeUser') {
                            loggerSvc.logError($filter('translate')('CHANGE_CREDIT_CARD_FREE_USER_ERROR'));
                        } else if (error === 'CompUser'){
                            loggerSvc.logError($filter('translate')('CHANGE_CREDIT_CARD_COMP_USER_ERROR'));
                        } else if(error === 'PaymentFailed') {
                            loggerSvc.logError($filter('translate')('CHANGE_CREDIT_CARD_PAYMENT_ERROR'));
                        } else {
                            loggerSvc.logError($filter('translate')('CHANGE_CREDIT_CARD_FAILED') + ' ' + $scope.appConfig.customerCareNumber);
                        }
                        $scope.saving = false;
                    });
            }
            else {
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
            $scope.form.disclaimer.$touched = true;
        }

        function setFormNotTouched() {
            $scope.form.cardName.$touched = false;
            $scope.form.cardNumber.$touched = false;
            $scope.form.address.$touched = false;
            $scope.form.city.$touched = false;
            $scope.form.state.$touched = false;
            $scope.form.cvv.$touched = false;
            $scope.form.expiryDate.$touched = false;
            $scope.form.zipCode.$touched = false;
            $scope.form.disclaimer.$touched = false;
        }
    }]);
}(angular.module('app')));
