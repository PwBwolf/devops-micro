(function (app) {
    'use strict';

    app.controller('userHomeCtrl', ['$scope', '$', '$modal', '$rootScope', '$location', '$filter', 'userSvc', 'loggerSvc', function ($scope, $, $modal, $rootScope, $location, $filter, userSvc, loggerSvc) {

        $scope.hideDropdown = function (id) {
            $('#' + id).collapse('hide');
        };

        $scope.showProfileDropdown = function (name) {
            $scope.profileDropdownContent = 'views/empty.html';
            $scope.profileDropdownContent = 'views/' + name + '.html';
        };

        $scope.showBillingDropdown = function (name) {
            $scope.billingDropdownContent = 'views/empty.html';
            $scope.billingDropdownContent = 'views/' + name + '.html';
        };


        $scope.cancelSubscription = function () {
            $modal.open({
                templateUrl: 'modalWindow',
                controller: 'modalCtrl',
                size: 'sm',
                backdrop: 'static',
                resolve: {
                    title: function () {
                        return $scope.appConfig.appName;
                    },
                    body: function () {
                        return $filter('translate')('USER_HOME_CANCEL_SUBSCRIPTION_CONFIRMATION');
                    },
                    showOkButton: function () {
                        return false;
                    },
                    showYesButton: function () {
                        return true;
                    },
                    showNoButton: function () {
                        return true;
                    }
                }
            }).result.then(function () {
                    $scope.saving = true;
                    userSvc.cancelSubscription(function () {
                        userSvc.getUserProfile(function () {
                            $rootScope.$broadcast('CloseAioWindow');
                            $location.path('/cancel-subscription-success');
                            $scope.saving = false;
                        }, function () {
                            loggerSvc.logError($filter('translate')('USER_HOME_CANCEL_SUBSCRIPTION_ACCOUNT_REFRESH_ERROR'));
                            $scope.saving = false;
                        });
                    }, function () {
                        $scope.saving = false;
                        loggerSvc.logError($filter('translate')('USER_HOME_CANCEL_SUBSCRIPTION_FAILURE') + ' ' + $scope.appConfig.customerCareNumber);
                    });
                });
        };

    }]);
}(angular.module('app')));
