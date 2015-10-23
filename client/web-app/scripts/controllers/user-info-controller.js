(function (app) {
    'use strict';

    app.controller('userInfoCtrl', ['userSvc', 'appSvc', 'loggerSvc', '$rootScope', '$scope', '$location', '$filter', '$', function (userSvc, appSvc, loggerSvc, $rootScope, $scope, $location, $filter, $) {

        $scope.mv = {firstName: $scope.user.firstName, lastName: $scope.user.lastName, telephone: $scope.user.telephone};
        $scope.mobileNumberStatus = 'NOT_CHECKED';

        $scope.updateUserInfo = function () {
            if ($scope.mobileNumberStatus === 'NOT_CHECKED') {
                $scope.checkIfMobileNumber();
                $('#submitButton').focus();
            }
            if ($scope.form.$valid && $scope.mobileNumberStatus === 'MOBILE') {
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
            $scope.form.telephone.$touched = true;
        }

        function setMobileNumberStatus(status) {
            if ($scope.mobileNumberStatus !== 'NOT_CHECKED') {
                $scope.mobileNumberStatus = status;
            }
        }

        $scope.checkIfMobileNumber = function () {
            if ($scope.form.telephone.$valid) {
                $scope.mobileNumberStatus = 'CHECKING';
                appSvc.verifyMobileNumber($scope.mv.telephone, function (result) {
                    if (result) {
                        setMobileNumberStatus('MOBILE');
                    } else {
                        setMobileNumberStatus('NOT_MOBILE');
                    }
                }, function () {
                    setMobileNumberStatus('NOT_MOBILE');
                });
            }
        };

        $scope.resetMobileNumberStatus = function () {
            $scope.mobileNumberStatus = 'NOT_CHECKED';
        };

    }]);
}(angular.module('app')));
