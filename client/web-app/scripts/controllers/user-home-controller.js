(function (app) {
    'use strict';

    app.controller('userHomeCtrl', ['$scope', '$', '$uibModal', '$rootScope', '$location', '$filter', 'userSvc', 'loggerSvc', 'webStorage', function ($scope, $, $uibModal, $rootScope, $location, $filter, userSvc, loggerSvc, webStorage) {

        $scope.showUpgradePremium = false;
        $scope.showDropdowns = false;

        $scope.showDropdown = function (id) {
            $('#' + id).collapse('show');
        };

        $scope.hideDropdown = function (id) {
            $('#' + id).collapse('hide');
        };

        if (webStorage.local.get('accountUpgraded')) {
            webStorage.local.remove('accountUpgraded');
            loggerSvc.logSuccess($filter('translate')('USER_HOME_UPGRADE_SUBSCRIPTION_SUCCESS'));
        }

        if ($scope.user.type === 'free' && $rootScope.redirectTo === '/upgrade-subscription') {
            $scope.showDropdown('accountDropDown');
        }

        $scope.showProfileDropdown = function (name) {
            $scope.profileDropdownContent = 'views/empty.html';
            $scope.profileDropdownContent = 'views/' + name + '.html';
        };

        $scope.showAccountDropdown = function (name) {
            $scope.accountDropdownContent = 'views/empty.html';
            $scope.accountDropdownContent = 'views/' + name + '.html';
        };

        $scope.cancelSubscription = function () {
            $uibModal.open({
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
                        $scope.saving = false;
                        loggerSvc.logSuccess($filter('translate')('USER_HOME_CANCEL_SUBSCRIPTION_SUCCESS'));
                        $rootScope.$broadcast('CloseDropDown', ['changeCreditCardDropDown', 'accountDropDown']);
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

        $rootScope.$on('CloseDropDown', function (event, args) {
            for (var i = 0; i < args.length; i++) {
                $scope.hideDropdown(args[i]);
            }
        });

        $scope.toggleUpgradePremium = function () {
            $scope.showUpgradePremium = !$scope.showUpgradePremium;
        }


    }]);

}(angular.module('app')));
