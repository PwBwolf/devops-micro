(function (app) {
    'use strict';

    app.controller('userHomeCtrl', ['$scope', '$', '$modal', '$rootScope', '$location', '$filter', 'userSvc', 'loggerSvc', 'webStorage', function ($scope, $, $modal, $rootScope, $location, $filter, userSvc, loggerSvc, webStorage) {

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

    }]);
    
    app.controller('upgradePremiumSlideCtrl',['$scope',function($scope){

        $scope.checked = false; // This will be binded using the ps-open attribute

        $scope.toggleUpgradePremium = function(){
            
            $scope.checked = !$scope.checked;
            if($scope.checked) {
                //$scope.program = $rootScope.program; 
            }

        }

    }]);
}(angular.module('app')));
