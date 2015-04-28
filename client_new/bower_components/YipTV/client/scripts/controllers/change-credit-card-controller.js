(function (app) {
    'use strict';

    app.controller('changeCreditCardCtrl', ['appSvc', 'userSvc', 'loggerSvc', '$scope', '$location', '$filter', function (appSvc, userSvc, loggerSvc, $scope, $location, $filter) {

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
                        $location.path('/change-credit-card-success');
                        $scope.saving = false;
                    }, function (error) {
                        if(error === 'FreeUser') {
                            loggerSvc.logError($filter('translate')('CHANGE_CREDIT_CARD_FREE_USER_ERROR'));
                        } else {
                            loggerSvc.logError($filter('translate')('CHANGE_CREDIT_CARD_FAILED') + ' ' + $scope.appConfig.customerCareNumber);
                        }
                        $scope.saving = false;
                    });
            }
            else {
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
