(function (app) {
    'use strict';

    app.controller('complimentarySignUpCtrl', ['appSvc', 'userSvc', 'loggerSvc', '$rootScope', '$scope', '$routeParams', '$location', '$filter', '$', function (appSvc, userSvc, loggerSvc, $rootScope, $scope, $routeParams, $location, $filter, $) {

        $scope.status = 0; // 0 - checking, 1 - success, 2 - error
        $scope.formSubmit = false;
        $scope.mobileNumberStatus = 'NOT_CHECKED';

        activate();

        function activate() {
            appSvc.checkComplimentaryCode($routeParams.compCode).success(function () {
                $scope.status = 1;
            }).error(function () {
                $scope.status = 2;
            });
        }

        $scope.mv = {disclaimer: true, emailSmsSubscription: true, sendSmsVerification: true};

        $scope.signUp = function () {
            if ($scope.mobileNumberStatus === 'NOT_CHECKED') {
                $scope.checkIfMobileNumber();
                $('#password').focus();
            }
            if ($scope.form.$valid && $scope.mobileNumberStatus === 'MOBILE') {
                $scope.mv.type = 'comp';
                $scope.mv.code = $routeParams.compCode;
                $scope.mv.referredBy = $rootScope.referredBy;
                $scope.mv.preferences = {defaultLanguage: $scope.language || 'en', emailSubscription: $scope.mv.emailSmsSubscription, smsSubscription: $scope.mv.emailSmsSubscription};
                $scope.saving = true;
                userSvc.signUp(
                    $scope.mv,
                    function (data) {
                        $rootScope.referredBy = undefined;
                        $scope.saving = false;
                        if (data === 'registered') {
                            $location.path('/sign-up-success/' + $scope.mv.email);
                        } else {
                            $location.path('/sign-up-success-login');
                        }
                    },
                    function (error) {
                        if (error === 'UserExists') {
                            loggerSvc.logError($filter('translate')('COMP_SIGN_UP_USER_EXISTS'));
                        } else {
                            loggerSvc.logError($filter('translate')('COMP_SIGN_UP_FAILED') + ' ' + $scope.appConfig.customerCareNumber);
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
