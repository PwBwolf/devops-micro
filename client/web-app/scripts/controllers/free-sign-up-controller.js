(function (app) {
    'use strict';

    app.controller('freeSignUpCtrl', ['userSvc', 'appSvc', 'loggerSvc', '$rootScope', '$scope', '$location', '$filter', '$', function (userSvc, appSvc, loggerSvc, $rootScope, $scope, $location, $filter, $) {

        $scope.mv = {disclaimer: true, emailSmsSubscription: true, sendSmsVerification: true};
        $scope.formSubmit = false;
        $scope.mobileNumberStatus = 'NOT_CHECKED';

        $scope.signUp = function () {
            if ($scope.mobileNumberStatus === 'NOT_CHECKED') {
                $scope.checkIfMobileNumber();
                $('#password').focus();
            }
            if ($scope.form.$valid && $scope.mobileNumberStatus === 'MOBILE') {
                $scope.mv.type = 'free';
                $scope.mv.referredBy = $rootScope.referredBy;
                $scope.mv.preferences = {defaultLanguage: $scope.language || 'en', emailSubscription: $scope.mv.emailSmsSubscription, smsSubscription: $scope.mv.emailSmsSubscription};
                $scope.saving = true;
                userSvc.signUp(
                    $scope.mv,
                    function () {
                        $rootScope.referredBy = undefined;
                        $scope.saving = false;
                        if ($scope.mv.sendSmsVerification) {
                            $location.path('/sign-up-verification/' + $scope.mv.email + '/' + $scope.mv.telephone + '/free-sign-up-success');
                        } else {
                            $location.path('/free-sign-up-success/true');
                        }
                    },
                    function (error) {
                        if (error === 'UserExists') {
                            loggerSvc.logError($filter('translate')('FREE_SIGN_UP_USER_EXISTS'));
                        } else {
                            loggerSvc.logError($filter('translate')('FREE_SIGN_UP_FAILED') + ' ' + $scope.appConfig.customerCareNumber);
                        }
                        $scope.saving = false;
                    });
            } else {
                setFormTouched();
            }
        };

        function setFormTouched() {
            $scope.form.firstName.$touched = true;
            $scope.form.lastName.$touched = true;
            $scope.form.email.$touched = true;
            $scope.form.telephone.$touched = true;
            $scope.form.password.$touched = true;
            $scope.form.confirmPassword.$touched = true;
            $scope.form.disclaimer.$dirty = true;
            $scope.formSubmit = true;
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
