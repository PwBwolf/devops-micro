(function (app) {
    'use strict';

    app.controller('userInfoCtrl', ['userSvc', 'appSvc', 'loggerSvc', '$rootScope', '$scope', '$location', '$filter', function (userSvc, appSvc, loggerSvc, $rootScope, $scope, $location, $filter) {

        $scope.mv = {firstName: $scope.user.firstName, lastName: $scope.user.lastName};

        $scope.updateUserInfo = function () {
            if ($scope.form.$valid) {
                $scope.saving = true;
                userSvc.updateUserInfo(
                    $scope.mv,
                    function () {
                        userSvc.getUserProfile(function () {
                            loggerSvc.logSuccess($filter('translate')('USER_INFO_UPDATE_SUCCESS'));
                            $scope.saving = false;
                            $rootScope.$broadcast('CloseDropDown', ['userInfoDropDown', 'profileDropDown']);
                        }, function () {
                            loggerSvc.logError($filter('translate')('USER_INFO_ACCOUNT_REFRESH_ERROR'));
                            $scope.saving = false;
                        });
                    },
                    function () {
                        loggerSvc.logError($filter('translate')('USER_INFO_UPDATE_FAILURE'));
                        $scope.saving = false;
                    }
                );
            } else {
                setFormTouched();
            }
        };

        function setFormTouched() {
            $scope.form.firstName.$touched = true;
            $scope.form.lastName.$touched = true;
        }

    }]);
}(angular.module('app')));
